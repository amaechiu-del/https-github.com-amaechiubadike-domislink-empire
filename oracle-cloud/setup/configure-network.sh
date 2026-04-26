#!/bin/bash

#############################################
# Configure Network and Security for Oracle Cloud VMs
#############################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Network & Security Configuration      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if OCI CLI is available
if ! command -v oci &> /dev/null; then
    echo -e "${RED}❌ OCI CLI not found${NC}"
    exit 1
fi

# Get configuration
COMPARTMENT_ID=$(grep "^tenancy" ~/.oci/config | cut -d'=' -f2 | tr -d ' ')
VCN_NAME="domislink-vcn"

echo -e "${YELLOW}Getting VCN details...${NC}"
VCN_ID=$(oci network vcn list \
    --compartment-id "$COMPARTMENT_ID" \
    --query "data[?\"display-name\"=='$VCN_NAME'] | [0].id" \
    --raw-output)

if [ -z "$VCN_ID" ] || [ "$VCN_ID" == "null" ]; then
    echo -e "${RED}❌ VCN not found. Run create-vms.sh first${NC}"
    exit 1
fi

echo -e "${GREEN}✅ VCN found: $VCN_ID${NC}"

# Update Security List with comprehensive rules
echo -e "${YELLOW}Updating security list rules...${NC}"

SL_ID=$(oci network security-list list \
    --compartment-id "$COMPARTMENT_ID" \
    --vcn-id "$VCN_ID" \
    --query "data[0].id" \
    --raw-output)

# Define security rules
INGRESS_RULES='[
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 22, "max": 22}},
        "description": "SSH Access"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 80, "max": 80}},
        "description": "HTTP"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 443, "max": 443}},
        "description": "HTTPS"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 3000, "max": 3000}},
        "description": "Auth Service"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 3001, "max": 3001}},
        "description": "Payments Service"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 3002, "max": 3002}},
        "description": "Geolocation Service"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 3003, "max": 3003}},
        "description": "Notifications Service"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 9090, "max": 9090}},
        "description": "Prometheus"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 3300, "max": 3300}},
        "description": "Grafana"
    },
    {
        "protocol": "6",
        "source": "0.0.0.0/0",
        "tcpOptions": {"destinationPortRange": {"min": 6379, "max": 6379}},
        "description": "Redis"
    },
    {
        "protocol": "1",
        "source": "0.0.0.0/0",
        "icmpOptions": {"type": 8},
        "description": "ICMP Ping"
    }
]'

EGRESS_RULES='[
    {
        "protocol": "all",
        "destination": "0.0.0.0/0",
        "description": "Allow all outbound"
    }
]'

oci network security-list update \
    --security-list-id "$SL_ID" \
    --ingress-security-rules "$INGRESS_RULES" \
    --egress-security-rules "$EGRESS_RULES" \
    --force > /dev/null

echo -e "${GREEN}✅ Security list updated${NC}"

# Display configured rules
echo ""
echo -e "${YELLOW}Configured Ingress Rules:${NC}"
echo "  ✅ Port 22   - SSH"
echo "  ✅ Port 80   - HTTP"
echo "  ✅ Port 443  - HTTPS"
echo "  ✅ Port 3000 - Auth Service"
echo "  ✅ Port 3001 - Payments Service"
echo "  ✅ Port 3002 - Geolocation Service"
echo "  ✅ Port 3003 - Notifications Service"
echo "  ✅ Port 9090 - Prometheus"
echo "  ✅ Port 3300 - Grafana"
echo "  ✅ Port 6379 - Redis"
echo "  ✅ ICMP      - Ping"
echo ""

# Configure Network Security on VMs (if IPs file exists)
if [ -f ~/domislink-vm-ips.txt ]; then
    echo -e "${YELLOW}Configuring firewall on VMs...${NC}"
    
    while IFS=: read -r VM_NAME VM_IP; do
        VM_IP=$(echo $VM_IP | tr -d ' ')
        echo -e "${YELLOW}Configuring $VM_NAME ($VM_IP)...${NC}"
        
        ssh -i ~/.ssh/oci_api_key -o StrictHostKeyChecking=no ubuntu@$VM_IP << 'ENDSSH'
            # Update UFW rules
            sudo ufw --force enable
            sudo ufw allow 22/tcp
            sudo ufw allow 80/tcp
            sudo ufw allow 443/tcp
            sudo ufw allow 3000:3100/tcp
            sudo ufw allow 6379/tcp
            sudo ufw allow 9090/tcp
            sudo ufw allow 3300/tcp
            
            # Configure fail2ban
            sudo systemctl enable fail2ban
            sudo systemctl start fail2ban
            
            # Disable password authentication
            sudo sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
            sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
            sudo systemctl reload sshd
            
            echo "✅ Firewall configured"
ENDSSH
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $VM_NAME configured${NC}"
        else
            echo -e "${RED}❌ Failed to configure $VM_NAME${NC}"
        fi
    done < ~/domislink-vm-ips.txt
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ NETWORK CONFIGURATION COMPLETE!    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Security Features Enabled:${NC}"
echo "  ✅ Firewall (UFW) active"
echo "  ✅ Fail2ban for SSH protection"
echo "  ✅ Password authentication disabled"
echo "  ✅ Only SSH key authentication allowed"
echo "  ✅ All necessary ports open"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Deploy services: cd ../scripts && ./deploy-all.sh"
echo "2. Monitor: Access Grafana at http://<VM4-IP>:3300"
echo "3. Check security: sudo ufw status"
