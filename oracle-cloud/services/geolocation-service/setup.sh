#!/bin/bash
# Setup script for Geolocation Service

set -e

echo "🚀 Setting up DomisLink Geolocation Service..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your configuration before starting the service"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your configuration"
echo "2. Run 'npm run dev' for development"
echo "3. Run 'npm start' for production"
echo "4. Or use 'docker-compose up -d' for Docker deployment"
echo ""
