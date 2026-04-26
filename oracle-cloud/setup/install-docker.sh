#!/bin/bash

#############################################
# Install Docker and Docker Compose on VMs
# Run this on each Oracle Cloud VM
#############################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Docker Installation Script            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if running as ubuntu user
if [ "$USER" != "ubuntu" ] && [ "$USER" != "root" ]; then
    echo -e "${RED}❌ This script should be run as ubuntu or root user${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating system packages...${NC}"
sudo apt-get update -qq

echo -e "${YELLOW}Installing prerequisites...${NC}"
sudo apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    apt-transport-https \
    software-properties-common

echo -e "${YELLOW}Adding Docker GPG key...${NC}"
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo -e "${YELLOW}Adding Docker repository...${NC}"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

echo -e "${YELLOW}Installing Docker...${NC}"
sudo apt-get update -qq
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo -e "${YELLOW}Adding user to docker group...${NC}"
sudo usermod -aG docker $USER

echo -e "${YELLOW}Installing Docker Compose standalone...${NC}"
COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep 'tag_name' | cut -d\" -f4)
sudo curl -L "https://github.com/docker/compose/releases/download/${COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo -e "${YELLOW}Starting Docker service...${NC}"
sudo systemctl start docker
sudo systemctl enable docker

echo -e "${YELLOW}Installing additional utilities...${NC}"
sudo apt-get install -y \
    git \
    htop \
    vim \
    wget \
    unzip \
    jq \
    fail2ban \
    ufw

echo -e "${YELLOW}Configuring firewall...${NC}"
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000:3100/tcp  # API Services
sudo ufw status

echo -e "${YELLOW}Configuring fail2ban...${NC}"
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ INSTALLATION COMPLETE!             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

# Verify installations
echo -e "${YELLOW}Verifying installations:${NC}"
docker --version
docker-compose --version
echo ""

echo -e "${GREEN}✅ Docker Engine installed${NC}"
echo -e "${GREEN}✅ Docker Compose installed${NC}"
echo -e "${GREEN}✅ Firewall configured${NC}"
echo -e "${GREEN}✅ Fail2ban enabled${NC}"
echo ""

echo -e "${YELLOW}⚠️  IMPORTANT: Please logout and login again for group changes to take effect${NC}"
echo -e "${YELLOW}Or run: newgrp docker${NC}"
echo ""

# Test docker without sudo
if docker ps > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is working without sudo${NC}"
else
    echo -e "${YELLOW}⚠️  Run 'newgrp docker' or logout/login to use docker without sudo${NC}"
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Logout and login: exit, then ssh back in"
echo "2. Verify: docker run hello-world"
echo "3. Deploy services: cd /opt/domislink && ./deploy.sh"
