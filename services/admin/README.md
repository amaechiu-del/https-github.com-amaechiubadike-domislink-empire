# Admin Service

Admin dashboard and AI builder

## Overview

- **Port**: 3005
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Admin dashboard and AI builder

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
docker build -t domislink-admin:latest .

# Run container
docker run -p 3005:3005 --env-file .env domislink-admin:latest
```
