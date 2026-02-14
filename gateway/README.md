# API Gateway

Single entry point for all DomisLink microservices with routing, authentication, and rate limiting.

## Overview

- **Port**: 8080
- **Tech Stack**: Express.js, TypeScript, http-proxy-middleware
- **Purpose**: Route requests to appropriate microservices, handle authentication, rate limiting

## Features

- Request routing to all services
- Authentication middleware for protected routes
- Rate limiting (100 requests per 15 minutes)
- Health check aggregation across all services
- CORS configuration
- Logging and error handling
- Service discovery and proxy

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

See `.env.example` for configuration.

## Routes

### API Routes (Backend Services)
- `/api/auth/*` → Auth Service (4000)
- `/api/payments/*` → Payments Service (4001) [Protected]
- `/api/geo/*` → Geolocation Service (4002)
- `/api/notifications/*` → Notification Service (4003) [Protected]

### Frontend Routes
- `/` → Hub Service (3000)
- `/realestate/*` → Real Estate Service (3001)
- `/tickets/*` → Tickets Service (3002)
- `/fm/*` → Flight Monitor Service (3003)
- `/teachmaster/*` → TeachMaster Service (3004)
- `/admin/*` → Admin Service (3005) [Protected]

### Health Check
- `GET /health` - Aggregated health check for all services

## Docker

```bash
# Build image
docker build -t domislink-gateway:latest .

# Run container
docker run -p 8080:8080 --env-file .env domislink-gateway:latest
```

## Architecture

The API Gateway acts as a reverse proxy, routing incoming requests to the appropriate microservice based on the request path. It provides:

1. **Single Entry Point**: All client requests go through the gateway
2. **Authentication**: Protected routes require valid JWT tokens
3. **Rate Limiting**: Prevents abuse with configurable limits
4. **Service Health Monitoring**: Aggregates health status from all services
5. **Load Balancing**: Can be configured for multiple instances of services

## Adding New Routes

To add a new service route:

1. Add service URL to `.env.example` and `.env`
2. Add service to `SERVICES` object in `src/index.ts`
3. Add proxy configuration with `createProxyMiddleware`
4. Apply `authMiddleware` if the route should be protected

Example:
```typescript
app.use('/new-service', authMiddleware, createProxyMiddleware({
  target: SERVICES.newService,
  ...proxyOptions,
  pathRewrite: { '^/new-service': '' }
}));
```
