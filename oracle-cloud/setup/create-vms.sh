#!/bin/bash

#############################################
# Oracle Cloud - Automated VM Creation
# Creates 4 ARM VMs for DomisLink Infrastructure
#############################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VCN_NAME="domislink-vcn"
SUBNET_NAME="domislink-public-subnet"
VM_SHAPE="VM.Standard.A1.Flex"
VM_OCPUS=1
VM_MEMORY_GB=6
IMAGE_OS="Canonical Ubuntu"
IMAGE_VERSION="22.04"
SSH_KEY_PATH="${HOME}/.ssh/oci_api_key.pub"

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Oracle Cloud VM Creation Script      ║${NC}"
echo -e "${GREEN}║  DomisLink Infrastructure Setup        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v oci &> /dev/null; then
    echo -e "${RED}❌ OCI CLI not found. Please install it first.${NC}"
    echo "Visit: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm"
    exit 1
fi

if [ ! -f "$SSH_KEY_PATH" ]; then
    echo -e "${RED}❌ SSH public key not found at: $SSH_KEY_PATH${NC}"
    echo "Generate one with: ssh-keygen -t rsa -b 4096 -f ~/.ssh/oci_api_key"
    exit 1
fi

if [ ! -f "${HOME}/.oci/config" ]; then
    echo -e "${RED}❌ OCI CLI not configured. Run: oci setup config${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Get region and compartment from config
REGION=$(grep "^region" ~/.oci/config | cut -d'=' -f2 | tr -d ' ')
COMPARTMENT_ID=$(grep "^tenancy" ~/.oci/config | cut -d'=' -f2 | tr -d ' ')

echo -e "${YELLOW}Using Configuration:${NC}"
echo "Region: $REGION"
echo "Compartment: $COMPARTMENT_ID"
echo "VM Shape: $VM_SHAPE ($VM_OCPUS OCPU, ${VM_MEMORY_GB}GB RAM)"
echo ""

read -p "Continue with VM creation? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Function to create VCN if it doesn't exist
create_vcn() {
    echo -e "${YELLOW}Checking for existing VCN...${NC}"
    
    VCN_ID=$(oci network vcn list \
        --compartment-id "$COMPARTMENT_ID" \
        --query "data[?\"display-name\"=='$VCN_NAME'] | [0].id" \
        --raw-output 2>/dev/null || echo "")
    
    if [ -z "$VCN_ID" ] || [ "$VCN_ID" == "null" ]; then
        echo -e "${YELLOW}Creating VCN: $VCN_NAME...${NC}"
        VCN_ID=$(oci network vcn create \
            --compartment-id "$COMPARTMENT_ID" \
            --display-name "$VCN_NAME" \
            --cidr-block "10.0.0.0/16" \
            --dns-label "domislink" \
            --query 'data.id' \
            --raw-output)
        
        echo -e "${GREEN}✅ VCN created: $VCN_ID${NC}"
        sleep 5
    else
        echo -e "${GREEN}✅ VCN already exists: $VCN_ID${NC}"
    fi
    
    # Create Internet Gateway
    echo -e "${YELLOW}Checking for Internet Gateway...${NC}"
    IG_ID=$(oci network internet-gateway list \
        --compartment-id "$COMPARTMENT_ID" \
        --vcn-id "$VCN_ID" \
        --query "data[0].id" \
        --raw-output 2>/dev/null || echo "")
    
    if [ -z "$IG_ID" ] || [ "$IG_ID" == "null" ]; then
        echo -e "${YELLOW}Creating Internet Gateway...${NC}"
        IG_ID=$(oci network internet-gateway create \
            --compartment-id "$COMPARTMENT_ID" \
            --vcn-id "$VCN_ID" \
            --is-enabled true \
            --display-name "domislink-ig" \
            --query 'data.id' \
            --raw-output)
        echo -e "${GREEN}✅ Internet Gateway created${NC}"
        sleep 3
    else
        echo -e "${GREEN}✅ Internet Gateway exists${NC}"
    fi
    
    # Get default route table and add route
    RT_ID=$(oci network route-table list \
        --compartment-id "$COMPARTMENT_ID" \
        --vcn-id "$VCN_ID" \
        --query "data[0].id" \
        --raw-output)
    
    echo -e "${YELLOW}Updating route table...${NC}"
    oci network route-table update \
        --rt-id "$RT_ID" \
        --route-rules "[{\"destination\":\"0.0.0.0/0\",\"networkEntityId\":\"$IG_ID\"}]" \
        --force > /dev/null
    echo -e "${GREEN}✅ Route table updated${NC}"
    
    # Create Security List rules
    echo -e "${YELLOW}Configuring security list...${NC}"
    SL_ID=$(oci network security-list list \
        --compartment-id "$COMPARTMENT_ID" \
        --vcn-id "$VCN_ID" \
        --query "data[0].id" \
        --raw-output)
    
    oci network security-list update \
        --security-list-id "$SL_ID" \
        --ingress-security-rules '[
            {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":22,"max":22}},"description":"SSH"},
            {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":80,"max":80}},"description":"HTTP"},
            {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":443,"max":443}},"description":"HTTPS"},
            {"protocol":"6","source":"0.0.0.0/0","tcpOptions":{"destinationPortRange":{"min":3000,"max":3100}},"description":"API Services"}
        ]' \
        --force > /dev/null
    echo -e "${GREEN}✅ Security list configured${NC}"
    
    # Create Subnet
    echo -e "${YELLOW}Checking for subnet...${NC}"
    SUBNET_ID=$(oci network subnet list \
        --compartment-id "$COMPARTMENT_ID" \
        --vcn-id "$VCN_ID" \
        --query "data[?\"display-name\"=='$SUBNET_NAME'] | [0].id" \
        --raw-output 2>/dev/null || echo "")
    
    if [ -z "$SUBNET_ID" ] || [ "$SUBNET_ID" == "null" ]; then
        echo -e "${YELLOW}Creating subnet...${NC}"
        SUBNET_ID=$(oci network subnet create \
            --compartment-id "$COMPARTMENT_ID" \
            --vcn-id "$VCN_ID" \
            --display-name "$SUBNET_NAME" \
            --cidr-block "10.0.0.0/24" \
            --dns-label "public" \
            --route-table-id "$RT_ID" \
            --security-list-ids "[\"$SL_ID\"]" \
            --query 'data.id' \
            --raw-output)
        echo -e "${GREEN}✅ Subnet created${NC}"
        sleep 5
    else
        echo -e "${GREEN}✅ Subnet already exists${NC}"
    fi
}

# Function to get availability domains
get_availability_domain() {
    AD=$(oci iam availability-domain list \
        --compartment-id "$COMPARTMENT_ID" \
        --query 'data[0].name' \
        --raw-output)
    echo "$AD"
}

# Function to get ARM image ID
get_image_id() {
    IMAGE_ID=$(oci compute image list \
        --compartment-id "$COMPARTMENT_ID" \
        --shape "$VM_SHAPE" \
        --operating-system "$IMAGE_OS" \
        --operating-system-version "$IMAGE_VERSION" \
        --sort-by TIMECREATED \
        --sort-order DESC \
        --query 'data[0].id' \
        --raw-output)
    echo "$IMAGE_ID"
}

# Function to create VM
create_vm() {
    local VM_NAME=$1
    local VM_NUMBER=$2
    
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    echo -e "${YELLOW}Creating $VM_NAME...${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════${NC}"
    
    # Check if VM already exists
    EXISTING_VM=$(oci compute instance list \
        --compartment-id "$COMPARTMENT_ID" \
        --display-name "$VM_NAME" \
        --query 'data[0].id' \
        --raw-output 2>/dev/null || echo "")
    
    if [ -n "$EXISTING_VM" ] && [ "$EXISTING_VM" != "null" ]; then
        echo -e "${YELLOW}⚠️  VM already exists: $VM_NAME${NC}"
        VM_IP=$(oci compute instance list-vnics \
            --instance-id "$EXISTING_VM" \
            --query 'data[0]."public-ip"' \
            --raw-output)
        echo -e "${GREEN}Public IP: $VM_IP${NC}"
        return
    fi
    
    # Get availability domain and image
    AD=$(get_availability_domain)
    IMAGE_ID=$(get_image_id)
    SSH_KEY=$(cat "$SSH_KEY_PATH")
    
    echo "Availability Domain: $AD"
    echo "Image ID: $IMAGE_ID"
    
    # Create cloud-init script
    CLOUD_INIT=$(cat <<'EOF'
#!/bin/bash
apt-get update
apt-get install -y curl wget git htop
echo "VM setup complete" > /tmp/cloud-init-done
EOF
)
    
    # Create the instance
    echo -e "${YELLOW}Creating instance (this may take 2-3 minutes)...${NC}"
    
    INSTANCE_ID=$(oci compute instance launch \
        --compartment-id "$COMPARTMENT_ID" \
        --availability-domain "$AD" \
        --display-name "$VM_NAME" \
        --image-id "$IMAGE_ID" \
        --shape "$VM_SHAPE" \
        --shape-config "{\"ocpus\":$VM_OCPUS,\"memoryInGBs\":$VM_MEMORY_GB}" \
        --subnet-id "$SUBNET_ID" \
        --assign-public-ip true \
        --ssh-authorized-keys-file "$SSH_KEY_PATH" \
        --user-data-file <(echo "$CLOUD_INIT") \
        --wait-for-state RUNNING \
        --query 'data.id' \
        --raw-output)
    
    if [ -z "$INSTANCE_ID" ]; then
        echo -e "${RED}❌ Failed to create $VM_NAME${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Instance created: $INSTANCE_ID${NC}"
    
    # Get public IP
    echo -e "${YELLOW}Getting public IP...${NC}"
    sleep 5
    
    VM_IP=$(oci compute instance list-vnics \
        --instance-id "$INSTANCE_ID" \
        --query 'data[0]."public-ip"' \
        --raw-output)
    
    echo -e "${GREEN}✅ $VM_NAME created successfully!${NC}"
    echo -e "${GREEN}Public IP: $VM_IP${NC}"
    echo -e "${GREEN}SSH: ssh -i ~/.ssh/oci_api_key ubuntu@$VM_IP${NC}"
    
    # Save to file
    echo "$VM_NAME: $VM_IP" >> ~/domislink-vm-ips.txt
}

# Main execution
echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 1: Network Setup${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
create_vcn

echo ""
echo -e "${YELLOW}═══════════════════════════════════════${NC}"
echo -e "${YELLOW}STEP 2: Creating Virtual Machines${NC}"
echo -e "${YELLOW}═══════════════════════════════════════${NC}"

# Clear previous IPs file
> ~/domislink-vm-ips.txt

# Create all 4 VMs
create_vm "domislink-vm1-auth-payments" 1
create_vm "domislink-vm2-geo-notify" 2
create_vm "domislink-vm3-redis-backup" 3
create_vm "domislink-vm4-monitoring" 4

# Final summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ ALL VMS CREATED SUCCESSFULLY!      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}VM IP Addresses saved to: ~/domislink-vm-ips.txt${NC}"
echo ""
cat ~/domislink-vm-ips.txt
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Wait 2-3 minutes for VMs to fully initialize"
echo "2. Test SSH: ssh -i ~/.ssh/oci_api_key ubuntu@<VM-IP>"
echo "3. Run: ./install-docker.sh to install Docker on all VMs"
echo "4. Run: ../scripts/deploy-all.sh to deploy services"
echo ""
echo -e "${GREEN}Free Tier Usage:${NC}"
echo "✅ OCPUs: 4 / 4 (100%)"
echo "✅ Memory: 24GB / 24GB (100%)"
echo "✅ Block Storage: 50GB / 200GB (25%)"
echo ""
echo -e "${GREEN}Cost: \$0/month (Free Forever!)${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember to set up billing alerts in Oracle Cloud Console!${NC}"
