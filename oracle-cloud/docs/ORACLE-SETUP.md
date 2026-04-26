# 🌩️ Oracle Cloud Free Tier Setup Guide

## Why Oracle Cloud?

### Free Forever Benefits
- **4 ARM VMs** (Ampere A1) - 24GB RAM total
- **200GB** block storage
- **10TB/month** bandwidth
- **Load balancer** included
- **NOT A TRIAL** - Free Forever!
- **No credit card** required after initial verification

### Perfect for Backup Infrastructure
- Primary: Cloudflare Workers (edge computing)
- Backup: Oracle Cloud (traditional VMs)
- Best of both worlds!

## Step 1: Create Oracle Cloud Account

### 1.1 Go to Oracle Cloud
Visit: https://cloud.oracle.com/free

### 1.2 Sign Up
1. Click **"Start for free"**
2. Choose your **Home Region** (recommended: **UK South - London** for Lagos)
   - Why London? ~100ms latency to Lagos
   - Frankfurt is alternative (~120ms)
3. Fill in details:
   - Email address
   - Country: Nigeria (or your country)
   - First/Last name

### 1.3 Verify Email
Check your email and verify the account.

### 1.4 Add Payment Method
⚠️ **Important**: Card verification required but won't be charged
- Add credit/debit card
- $1 temporary authorization (refunded)
- Only charged if you upgrade to paid tier
- Set up billing alerts!

### 1.5 Complete Setup
1. Choose account type: **Individual** (unless business)
2. Set password (strong!)
3. Complete CAPTCHA
4. Accept terms

## Step 2: Configure Free Tier

### 2.1 Access Console
Login to: https://cloud.oracle.com/

### 2.2 Verify Free Tier Status
1. Click your profile (top right)
2. Go to **Tenancy**
3. Verify "Always Free" resources available

### 2.3 Note Your Details
Save these (you'll need them):
```
Tenancy OCID: ocid1.tenancy.oc1..xxxx
User OCID: ocid1.user.oc1..xxxx
Home Region: uk-london-1 (or your choice)
Compartment OCID: ocid1.compartment.oc1..xxxx
```

## Step 3: Create API Keys

### 3.1 Generate SSH Keys (if not already done)
```bash
# On your local machine
cd ~/.ssh
ssh-keygen -t rsa -b 4096 -f oci_api_key
# Press enter for no passphrase (or add one for security)
```

### 3.2 Add API Key to Oracle Cloud
1. Click your profile icon (top right)
2. Click your **username**
3. Scroll to **API Keys**
4. Click **Add API Key**
5. Choose **Paste Public Key**
6. Paste contents of `~/.ssh/oci_api_key.pub`
7. Click **Add**
8. **Save the configuration file preview!**

## Step 4: Install and Configure OCI CLI

### 4.1 Install OCI CLI

**On macOS:**
```bash
brew install oci-cli
```

**On Linux:**
```bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
```

**On Windows:**
Download from: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm

### 4.2 Configure OCI CLI
```bash
oci setup config
```

Enter when prompted:
1. **Config location**: Press Enter (default: ~/.oci/config)
2. **User OCID**: Paste from Step 2.3
3. **Tenancy OCID**: Paste from Step 2.3
4. **Region**: uk-london-1 (or your region)
5. **Generate new RSA key pair?**: n (we already have keys)
6. **Private key location**: ~/.ssh/oci_api_key
7. **Passphrase**: Enter if you set one, otherwise blank

### 4.3 Verify Configuration
```bash
oci iam region list
```

Should show list of regions. If it works, you're good! ✅

## Step 5: Set Up Networking

### 5.1 Create VCN (Virtual Cloud Network)
```bash
# Will be automated in create-vms.sh, but manual steps:

# 1. Go to: Networking → Virtual Cloud Networks
# 2. Click "Start VCN Wizard"
# 3. Choose "Create VCN with Internet Connectivity"
# 4. Name: domislink-vcn
# 5. CIDR: 10.0.0.0/16
# 6. Public subnet CIDR: 10.0.0.0/24
# 7. Private subnet CIDR: 10.0.1.0/24
# 8. Click "Next" then "Create"
```

### 5.2 Configure Security Lists
Add ingress rules:
```
Protocol: TCP
Source: 0.0.0.0/0
Port: 22 (SSH)

Protocol: TCP
Source: 0.0.0.0/0
Port: 80 (HTTP)

Protocol: TCP
Source: 0.0.0.0/0
Port: 443 (HTTPS)

Protocol: TCP
Source: 0.0.0.0/0
Port: 3000-3100 (API Services)
```

## Step 6: Create Compute Instances (VMs)

### 6.1 Use Automated Script (Recommended)
```bash
cd oracle-cloud/setup
./create-vms.sh
```

### 6.2 Manual Creation (Alternative)

**For each of 4 VMs:**

1. Go to: **Compute → Instances**
2. Click **"Create Instance"**
3. Configure:
   - **Name**: domislink-vm1 (then vm2, vm3, vm4)
   - **Placement**: 
     - Availability Domain: Choose one
     - Capacity Type: On-demand
   - **Image**: 
     - Change Image → Ubuntu → 22.04 Minimal (Arm)
   - **Shape**: 
     - Change Shape → Ampere → VM.Standard.A1.Flex
     - **OCPU**: 1
     - **Memory**: 6 GB
   - **Networking**:
     - VCN: domislink-vcn
     - Subnet: Public subnet
     - Assign public IP: Yes
   - **SSH Keys**:
     - Paste public key (~/.ssh/oci_api_key.pub)
4. Click **Create**
5. Wait 1-2 minutes
6. Note the **Public IP**

**Repeat for all 4 VMs!**

### 6.3 Save IP Addresses
```bash
# Save to a file
cat > ~/domislink-ips.txt << EOF
VM1 (Auth + Payments): xxx.xxx.xxx.xxx
VM2 (Geo + Notify): xxx.xxx.xxx.xxx
VM3 (Redis + Backup): xxx.xxx.xxx.xxx
VM4 (Monitoring): xxx.xxx.xxx.xxx
EOF
```

## Step 7: Initial VM Configuration

### 7.1 SSH into Each VM
```bash
ssh -i ~/.ssh/oci_api_key ubuntu@<VM-IP>
```

### 7.2 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 7.3 Install Docker (on each VM)
```bash
# Or use automated script: setup/install-docker.sh
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
```

### 7.4 Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 7.5 Logout and Login Again
```bash
exit
ssh -i ~/.ssh/oci_api_key ubuntu@<VM-IP>
docker --version  # Verify
docker-compose --version  # Verify
```

## Step 8: Set Up Monitoring

### 8.1 Set Up Billing Alerts
1. Go to: **Billing & Cost Management**
2. Click **Budgets**
3. Create budget:
   - Name: free-tier-monitor
   - Amount: $0.50 (alert if any charges)
   - Alert at: 50%, 80%, 100%

### 8.2 Monitor Always Free Resources
Dashboard → Cost Analysis → Always Free Resources

## Step 9: Security Best Practices

### 9.1 Enable MFA (Multi-Factor Authentication)
1. Profile → User Settings
2. Enable MFA
3. Scan QR code with authenticator app

### 9.2 Create IAM User (Don't use root)
1. Identity → Users
2. Create user for daily operations
3. Assign minimum required permissions

### 9.3 Regular Security Scans
```bash
# Check security vulnerabilities
oci vulnerability-scanning container-scan-result list
```

## Step 10: DNS Configuration

### 10.1 Point Domain to Load Balancer
Once load balancer is created:
```
Type: A Record
Name: api
Value: <load-balancer-ip>
TTL: 300

Type: A Record
Name: monitoring
Value: <vm4-ip>
TTL: 300
```

## Common Issues & Solutions

### Issue: "Out of Capacity" when creating ARM VMs
**Solution**: Try different Availability Domains or try at different times (ARM instances are popular!)

### Issue: Cannot SSH to VM
**Solutions**:
- Check security list allows port 22
- Verify you're using correct SSH key
- Check VM is in "Running" state
- Try: `ssh -v` for verbose output

### Issue: Billing concerns
**Solution**: 
- Always use "Always Free" eligible shapes
- Monitor usage regularly
- Set up billing alerts
- Check: Cost Analysis → Always Free Resources

### Issue: API Authentication Errors
**Solution**:
- Verify API key is added correctly
- Check OCI CLI config file
- Regenerate API key if needed

## Free Tier Limits (Always Free)

### Compute
- ✅ 4 ARM OCPUs (Ampere A1)
- ✅ 24 GB RAM total
- ⚠️ Only 2 AMD VMs (1 OCPU, 1GB each) OR 4 ARM VMs - choose ARM!

### Storage
- ✅ 200 GB block volume storage
- ✅ 10 GB object storage

### Networking
- ✅ 10 TB outbound data transfer/month
- ✅ Load Balancer (10 Mbps)

### Database (if needed later)
- ✅ 2 Oracle Autonomous Databases (20GB each)

## Cost Optimization Tips

1. **Use ARM VMs**: More powerful in free tier
2. **Stop VMs when not needed**: But we want 24/7 uptime
3. **Monitor bandwidth**: 10TB/month is generous
4. **Clean up unused resources**: Block volumes, snapshots
5. **Use object storage wisely**: 10GB free

## Next Steps

✅ Account created  
✅ VMs running  
✅ OCI CLI configured  
✅ Networking set up  

**Now proceed to**: `DEPLOYMENT.md` to deploy services!

## Useful Links

- **OCI Console**: https://cloud.oracle.com/
- **Documentation**: https://docs.oracle.com/
- **CLI Reference**: https://docs.oracle.com/en-us/iaas/tools/oci-cli/
- **Always Free**: https://www.oracle.com/cloud/free/
- **Support**: https://support.oracle.com/

## Region Recommendations for Africa

| Location | Recommended Region | Latency (Lagos) |
|----------|-------------------|-----------------|
| West Africa | UK South (London) | ~100ms |
| East Africa | Germany (Frankfurt) | ~120ms |
| South Africa | South Africa (Johannesburg) | ~80ms |
| North Africa | Germany (Frankfurt) | ~80ms |

**For DomisLink (Lagos-based)**: **UK South (London)** ✅

---

**Need help?** Email: amaechi@domislink.com

**"Oracle Cloud Free Tier na your friend!"** 🚀
