# Realestate Service

Property listings and real estate management

## Overview

- **Port**: 3001
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Property listings and real estate management

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure.

## Health Checks

- `GET /api/health` - Service health check
- `GET /api/ready` - Service readiness check

## Docker

```bash
# Build image
docker build -t domislink-realestate:latest .

# Run container
docker run -p 3001:3001 --env-file .env domislink-realestate:latest
```
