# Hub Service

Main landing page and user portal for DomisLink Empire.

## Overview

- **Port**: 3000
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Landing page, user authentication portal, and main entry point

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

Copy `.env.example` to `.env.local` and configure:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Service port (default: 3000)
- `API_GATEWAY_URL` - URL to API Gateway
- `AUTH_SERVICE_URL` - URL to Authentication Service
- `PAYMENTS_SERVICE_URL` - URL to Payments Service
- `GEOLOCATION_SERVICE_URL` - URL to Geolocation Service

## Health Checks

- `GET /api/health` - Service health check
- `GET /api/ready` - Service readiness check

## Docker

```bash
# Build image
docker build -t domislink-hub:latest .

# Run container
docker run -p 3000:3000 --env-file .env domislink-hub:latest
```

## API Endpoints

- `GET /` - Landing page
- `GET /dashboard` - User dashboard
- `GET /api/health` - Health check
- `GET /api/ready` - Readiness check
