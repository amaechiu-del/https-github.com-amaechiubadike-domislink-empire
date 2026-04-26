#!/bin/bash

# Deployment script for Notifications Service

echo "🚀 Deploying Notifications Service..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env from .env.example and configure it."
    exit 1
fi

# Load environment variables
source .env

# Build Docker image
echo "📦 Building Docker image..."
docker build -t notifications-service:latest .

if [ $? -ne 0 ]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo "✅ Docker image built successfully"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start services
echo "🚀 Starting services..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start services!"
    exit 1
fi

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check health
HEALTH_STATUS=$(curl -s http://localhost:3003/health | grep -o '"status":"healthy"')

if [ -z "$HEALTH_STATUS" ]; then
    echo "❌ Service health check failed!"
    docker-compose logs notifications-service
    exit 1
fi

echo "✅ Notifications Service deployed successfully!"
echo "📊 Service is running on http://localhost:3003"
echo "📝 View logs: docker-compose logs -f notifications-service"
echo "📈 Check queue stats: curl http://localhost:3003/api/notify/queue/stats"
