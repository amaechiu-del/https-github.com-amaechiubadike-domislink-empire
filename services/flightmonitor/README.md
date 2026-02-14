# Flightmonitor Service

Flight tracking and aviation forums

## Overview

- **Port**: 3003
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Flight tracking and aviation forums

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
docker build -t domislink-flightmonitor:latest .

# Run container
docker run -p 3003:3003 --env-file .env domislink-flightmonitor:latest
```
