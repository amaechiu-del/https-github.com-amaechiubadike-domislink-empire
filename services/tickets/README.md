# Tickets Service

Flight booking and ticketing service

## Overview

- **Port**: 3002
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Flight booking and ticketing service

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
docker build -t domislink-tickets:latest .

# Run container
docker run -p 3002:3002 --env-file .env domislink-tickets:latest
```
