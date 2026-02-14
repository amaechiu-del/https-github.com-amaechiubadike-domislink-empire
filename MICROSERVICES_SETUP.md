# DomisLink Empire - Microservices Setup Guide

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ and npm installed (for local development)
- Git

## Quick Start (Docker)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd https-github.com-amaechiubadike-domislink-empire
```

### 2. Configure Environment Variables

```bash
# Copy example environment files
cp gateway/.env.example gateway/.env
cp services/auth-service/.env.example services/auth-service/.env
cp services/payments-service/.env.example services/payments-service/.env
cp services/geolocation-service/.env.example services/geolocation-service/.env
cp services/notification-service/.env.example services/notification-service/.env

# Copy for frontend services
for service in hub realestate tickets flightmonitor teachmaster admin; do
  cp services/$service/.env.example services/$service/.env
done
```

### 3. Update Critical Environment Variables

Edit the following files and update:

**gateway/.env**:
```env
NODE_ENV=development
PORT=8080
LOG_LEVEL=debug
```

**services/auth-service/.env**:
```env
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=4000
```

### 4. Start All Services

```bash
# Build and start all services
docker-compose -f docker-compose.microservices.yml up --build -d

# View logs
docker-compose -f docker-compose.microservices.yml logs -f

# Check service health
curl http://localhost:8080/health | jq
```

### 5. Access Services

- **API Gateway**: http://localhost:8080
- **Hub**: http://localhost:3000
- **Real Estate**: http://localhost:3001
- **Tickets**: http://localhost:3002
- **Flight Monitor**: http://localhost:3003
- **TeachMaster**: http://localhost:3004
- **Admin**: http://localhost:3005
- **Auth API Docs**: http://localhost:4000/api-docs

### 6. Stop Services

```bash
docker-compose -f docker-compose.microservices.yml down

# Stop and remove volumes
docker-compose -f docker-compose.microservices.yml down -v
```

## Local Development (Without Docker)

### 1. Install Dependencies

```bash
# Install gateway dependencies
cd gateway && npm install && cd ..

# Install backend service dependencies
for service in auth-service payments-service geolocation-service notification-service; do
  cd services/$service && npm install && cd ../..
done

# Install frontend service dependencies
for service in hub realestate tickets flightmonitor teachmaster admin; do
  cd services/$service && npm install && cd ../..
done
```

### 2. Start Services Individually

**Terminal 1 - Auth Service**:
```bash
cd services/auth-service
npm run dev
```

**Terminal 2 - Payments Service**:
```bash
cd services/payments-service
npm run dev
```

**Terminal 3 - Geolocation Service**:
```bash
cd services/geolocation-service
npm run dev
```

**Terminal 4 - Notification Service**:
```bash
cd services/notification-service
npm run dev
```

**Terminal 5 - Hub Service**:
```bash
cd services/hub
npm run dev
```

**Terminal 6 - API Gateway**:
```bash
cd gateway
npm run dev
```

### 3. Update Service URLs

When running locally without Docker, update the service URLs in `.env` files to use `localhost`:

**gateway/.env**:
```env
AUTH_SERVICE_URL=http://localhost:4000
PAYMENTS_SERVICE_URL=http://localhost:4001
GEOLOCATION_SERVICE_URL=http://localhost:4002
NOTIFICATION_SERVICE_URL=http://localhost:4003
HUB_SERVICE_URL=http://localhost:3000
# ... etc
```

## Testing

### Test Authentication Service

```bash
# Health check
curl http://localhost:4000/api/health

# Register a user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Verify token (replace TOKEN with actual token from login)
curl -X POST http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"
```

### Test API Gateway

```bash
# Health check aggregation
curl http://localhost:8080/health

# Test auth through gateway
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Frontend Services

```bash
# Check Hub service
curl http://localhost:3000

# Check through Gateway
curl http://localhost:8080
```

## Building for Production

### Build Individual Service

```bash
# Backend service
cd services/auth-service
npm run build
npm start

# Frontend service
cd services/hub
npm run build
npm start
```

### Build Docker Images

```bash
# Build all images
docker-compose -f docker-compose.microservices.yml build

# Build specific service
docker build -t domislink-auth-service:latest services/auth-service/
docker build -t domislink-hub:latest services/hub/
```

## Troubleshooting

### Service Won't Start

1. Check logs:
```bash
docker-compose -f docker-compose.microservices.yml logs service-name
```

2. Check if port is already in use:
```bash
lsof -i :3000  # Check port 3000
lsof -i :4000  # Check port 4000
```

3. Verify environment variables are set correctly

### Connection Refused Errors

1. Verify services are running:
```bash
docker-compose -f docker-compose.microservices.yml ps
```

2. Check network connectivity:
```bash
docker-compose -f docker-compose.microservices.yml exec gateway ping auth-service
```

3. Verify service URLs in environment variables

### Database Connection Issues

1. Ensure database service is running (if using Docker)
2. Check DATABASE_URL environment variable
3. Verify database credentials

## Monitoring

### View Service Logs

```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100
```

### Check Service Health

```bash
# Gateway health (aggregates all services)
curl http://localhost:8080/health | jq

# Individual service health
curl http://localhost:4000/api/health | jq
```

### Monitor Resource Usage

```bash
# Container stats
docker stats

# Specific service stats
docker stats domislink-auth-service
```

## Development Tips

### Hot Reload

Frontend services (Next.js) have built-in hot reload. Backend services use `ts-node-dev` for automatic restart on file changes.

### Debugging

Add `debugger` statements in TypeScript code and run with:
```bash
node --inspect dist/index.js
```

Connect with Chrome DevTools or VS Code debugger.

### Adding New Endpoints

1. Create route file in `src/routes/`
2. Import and use in `src/index.ts`
3. Add Swagger documentation
4. Test with curl or Postman
5. Update service README

## CI/CD (Future)

### GitHub Actions Workflow

Each service will have its own workflow:
- Build
- Test
- Security scan
- Docker build and push
- Deploy

### Deployment Strategy

- **Development**: Auto-deploy on push to `develop` branch
- **Staging**: Auto-deploy on push to `staging` branch
- **Production**: Manual approval for `main` branch

## Database Migration (Future)

### Steps to Split Monolithic Database

1. Identify service-specific tables
2. Create separate database instances
3. Export data for each service
4. Import into service-specific databases
5. Update DATABASE_URL for each service
6. Test service functionality
7. Implement data synchronization if needed

### Shared Data Considerations

For data needed by multiple services:
- Create dedicated shared service
- Use API calls to fetch shared data
- Implement data replication strategy
- Consider event-driven updates

## Scaling

### Horizontal Scaling

```bash
# Scale specific service to 3 instances
docker-compose -f docker-compose.microservices.yml up --scale hub=3 -d
```

### Load Balancing

Add Nginx or HAProxy in front of services for load balancing.

### Auto-scaling (Kubernetes)

See `infrastructure/kubernetes/` for HPA configurations.

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Rotate JWT secrets** regularly
3. **Use HTTPS** in production
4. **Implement rate limiting** - Already configured
5. **Validate all inputs** - Use express-validator
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Use security headers** - Helmet.js configured
8. **Implement proper CORS** - Configure allowed origins

## Next Steps

1. ✅ Services are set up and running
2. ⏳ Copy existing code from `apps/` to `services/`
3. ⏳ Configure production environment variables
4. ⏳ Set up CI/CD pipelines
5. ⏳ Split database into service-specific databases
6. ⏳ Implement monitoring and logging
7. ⏳ Deploy to staging environment
8. ⏳ Gradual migration to production

## Support

For questions or issues:
- Check service-specific README files
- Review MICROSERVICES_ARCHITECTURE.md
- Open GitHub issue
- Contact development team

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Microservices Patterns](https://microservices.io/patterns/)
