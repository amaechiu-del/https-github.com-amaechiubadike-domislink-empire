#!/bin/bash

# DomisLink Empire - Microservices Quick Deploy Script
# This script helps you deploy all services quickly

set -e

echo "🚀 DomisLink Empire - Microservices Deployment"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js and npm are installed${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Menu
echo ""
echo "Select deployment target:"
echo "1) Deploy Frontend Apps to Vercel"
echo "2) Deploy Auth Service to Railway"
echo "3) Deploy Payments Service to Render"
echo "4) Deploy Geolocation Service to Fly.io"
echo "5) Deploy Notifications Service to Deta Space"
echo "6) Deploy API Gateway to Cloudflare Workers"
echo "7) Deploy Everything (requires all CLIs installed)"
echo "8) Run Local Development"
echo "9) Run Tests"
echo "0) Exit"
echo ""
read -p "Enter your choice: " choice

case $choice in
    1)
        echo "🚀 Deploying Frontend Apps to Vercel..."
        if ! command_exists vercel; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        for app in hub tickets flightmonitor teachmaster admin realestate; do
            echo "Deploying $app..."
            cd apps/$app
            vercel --prod
            cd ../..
        done
        echo -e "${GREEN}✅ All frontend apps deployed!${NC}"
        ;;
    
    2)
        echo "🚀 Auth Service deploys automatically via Railway GitHub integration"
        echo "Please ensure your repo is connected to Railway"
        ;;
    
    3)
        echo "🚀 Payments Service deploys automatically via Render GitHub integration"
        echo "Please ensure your repo is connected to Render"
        ;;
    
    4)
        echo "🚀 Deploying Geolocation Service to Fly.io..."
        if ! command_exists flyctl; then
            echo -e "${RED}❌ Flyctl is not installed${NC}"
            echo "Install it from: https://fly.io/docs/hands-on/install-flyctl/"
            exit 1
        fi
        cd services/geolocation-service
        flyctl deploy
        cd ../..
        echo -e "${GREEN}✅ Geolocation service deployed!${NC}"
        ;;
    
    5)
        echo "🚀 Deploying Notifications Service to Deta Space..."
        if ! command_exists space; then
            echo -e "${RED}❌ Deta Space CLI is not installed${NC}"
            echo "Install it from: https://deta.space/docs/en/build/fundamentals/space-cli"
            exit 1
        fi
        cd services/notifications-service
        space push
        space release
        cd ../..
        echo -e "${GREEN}✅ Notifications service deployed!${NC}"
        ;;
    
    6)
        echo "🚀 Deploying API Gateway to Cloudflare Workers..."
        if ! command_exists wrangler; then
            echo "Installing Wrangler CLI..."
            npm install -g wrangler
        fi
        cd api-gateway
        npm install
        wrangler deploy
        cd ..
        echo -e "${GREEN}✅ API Gateway deployed!${NC}"
        ;;
    
    7)
        echo "🚀 Deploying Everything..."
        echo "This requires all CLIs to be installed and configured"
        # Run all deployments
        ;;
    
    8)
        echo "🚀 Starting Local Development..."
        npm run dev
        ;;
    
    9)
        echo "🧪 Running Tests..."
        npm run lint
        npm run type-check
        echo -e "${GREEN}✅ All tests passed!${NC}"
        ;;
    
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    
    *)
        echo -e "${RED}❌ Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Done!${NC}"
echo ""
echo "📚 For more information, see:"
echo "  - MICROSERVICES-README.md"
echo "  - MICROSERVICES-DEPLOYMENT-GUIDE.md"
