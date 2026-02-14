# Migration Guide: Monorepo to Microservices

This guide provides step-by-step instructions for migrating from the Turborepo monorepo to the microservices architecture.

## Overview

The migration involves:
1. ✅ **Infrastructure setup** (COMPLETED)
2. **Code migration** (Copy apps to services)
3. **Configuration updates**
4. **Testing and validation**
5. **Gradual deployment**
6. **Decommission monorepo**

## Phase 1: Infrastructure Setup ✅ COMPLETED

The following infrastructure has been set up:
- Service directory structure
- Dockerfiles for all services
- docker-compose.microservices.yml
- API Gateway
- Backend services (Auth, Payments, Geolocation, Notification)
- Kubernetes manifests
- CI/CD pipeline
- Documentation

## Phase 2: Code Migration (IN PROGRESS)

### Step 1: Copy Existing App Code

Each app in `apps/` needs to be migrated to its corresponding service in `services/`.

#### Hub Service

```bash
# Copy source code
cp -r apps/hub/src services/hub/

# Copy Next.js specific files if they exist
cp apps/hub/next.config.js services/hub/ 2>/dev/null || true
cp apps/hub/tsconfig.json services/hub/ 2>/dev/null || true
cp apps/hub/.eslintrc.json services/hub/ 2>/dev/null || true

# Copy public directory if it exists
cp -r apps/hub/public services/hub/ 2>/dev/null || true
```

#### Real Estate Service

```bash
cp -r apps/realestate/src services/realestate/
cp apps/realestate/next.config.js services/realestate/ 2>/dev/null || true
cp apps/realestate/tsconfig.json services/realestate/ 2>/dev/null || true
cp -r apps/realestate/public services/realestate/ 2>/dev/null || true
```

#### Tickets Service

```bash
cp -r apps/tickets/src services/tickets/
cp apps/tickets/next.config.js services/tickets/ 2>/dev/null || true
cp apps/tickets/tsconfig.json services/tickets/ 2>/dev/null || true
cp -r apps/tickets/public services/tickets/ 2>/dev/null || true
```

#### Flight Monitor Service

```bash
cp -r apps/flightmonitor/src services/flightmonitor/
cp apps/flightmonitor/next.config.js services/flightmonitor/ 2>/dev/null || true
cp apps/flightmonitor/tsconfig.json services/flightmonitor/ 2>/dev/null || true
cp -r apps/flightmonitor/public services/flightmonitor/ 2>/dev/null || true
```

#### TeachMaster Service

```bash
cp -r apps/teachmaster/src services/teachmaster/
cp apps/teachmaster/next.config.js services/teachmaster/ 2>/dev/null || true
cp apps/teachmaster/tsconfig.json services/teachmaster/ 2>/dev/null || true
cp -r apps/teachmaster/public services/teachmaster/ 2>/dev/null || true
```

#### Admin Service

```bash
cp -r apps/admin/src services/admin/
cp apps/admin/next.config.js services/admin/ 2>/dev/null || true
cp apps/admin/tsconfig.json services/admin/ 2>/dev/null || true
cp -r apps/admin/public services/admin/ 2>/dev/null || true
```

### Step 2: Update Package Dependencies

Each service's `package.json` already has basic dependencies. You need to add any additional dependencies from the original apps:

```bash
# For each service, check the original app's package.json
cd services/hub
# Compare with apps/hub/package.json
# Add any missing dependencies

npm install
```

### Step 3: Update Import Paths

The services no longer use workspace packages (e.g., `@domislink/ui`, `@domislink/auth`). You need to:

1. **Copy shared package code into each service** that needs it, OR
2. **Convert shared packages to npm packages** (recommended for production)

#### Option 1: Copy Shared Code (Quick Migration)

```bash
# Example: Copy UI components to a service
mkdir -p services/hub/src/components/shared
cp -r packages/ui/src/* services/hub/src/components/shared/

# Update imports in service code
# Change: import { Button } from '@domislink/ui'
# To: import { Button } from '@/components/shared'
```

#### Option 2: Publish Shared Packages (Recommended)

```bash
# In packages/ui directory
npm publish --access private

# Then in services, install the package
cd services/hub
npm install @domislink/ui@latest
```

### Step 4: Update Configuration

#### Update Next.js Config

Each service's `next.config.js` is already configured with:
- Standalone output
- Security headers
- API rewrites for backend services

Merge any additional configuration from the original app:

```javascript
// services/hub/next.config.js
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  
  // Add any custom config from apps/hub/next.config.js here
  
  // Keep the existing proxy configuration
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: `${process.env.AUTH_SERVICE_URL}/api/:path*`,
      },
      // ... other rewrites
    ];
  },
};
```

#### Update Environment Variables

1. Copy existing environment variables:
```bash
# Review existing .env.example
cat .env.example

# Update service-specific .env files
vim services/hub/.env
```

2. Add service-specific variables that were previously global

### Step 5: Update Database Connections

If services directly connect to databases:

```typescript
// Before (monorepo with shared database package)
import { db } from '@domislink/database';

// After (microservices with direct connection)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
```

### Step 6: Update API Calls

Replace direct function calls with HTTP requests to services:

```typescript
// Before (monorepo)
import { getUserWallet } from '@domislink/payments';
const wallet = await getUserWallet(userId);

// After (microservices)
import axios from 'axios';
const response = await axios.get(
  `${process.env.PAYMENTS_SERVICE_URL}/api/wallet/${userId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);
const wallet = response.data;
```

## Phase 3: Testing

### Step 1: Test Individual Services Locally

```bash
# Terminal 1: Start backend services
docker-compose -f docker-compose.microservices.yml up \
  auth-service payments-service geolocation-service notification-service

# Terminal 2: Start a frontend service
cd services/hub
npm install
npm run dev

# Test the service
curl http://localhost:3000
```

### Step 2: Test with Docker Compose

```bash
# Build all services
docker-compose -f docker-compose.microservices.yml build

# Start all services
docker-compose -f docker-compose.microservices.yml up

# Check health
curl http://localhost:8080/health | jq

# Test individual services
curl http://localhost:3000  # Hub
curl http://localhost:3001  # Real Estate
curl http://localhost:4000/api/health  # Auth Service
```

### Step 3: Test Inter-Service Communication

```bash
# Test authentication flow
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Get token
TOKEN=$(curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}' | jq -r '.token')

# Test protected route through gateway
curl http://localhost:8080/api/payments/wallet \
  -H "Authorization: Bearer $TOKEN"
```

## Phase 4: Database Migration

### Current State
Single database (`database.sql`) used by all apps.

### Target State
Service-specific databases for better isolation.

### Migration Steps

1. **Analyze database schema**
```sql
-- Identify tables per service
-- Hub: users, sessions
-- Real Estate: properties, listings, communities
-- Tickets: bookings, flights
-- etc.
```

2. **Create service databases**
```sql
CREATE DATABASE domislink_auth;
CREATE DATABASE domislink_hub;
CREATE DATABASE domislink_realestate;
CREATE DATABASE domislink_tickets;
-- etc.
```

3. **Export data per service**
```bash
pg_dump -t users -t sessions domislink > auth_data.sql
pg_dump -t properties -t listings domislink > realestate_data.sql
```

4. **Import into service databases**
```bash
psql domislink_auth < auth_data.sql
psql domislink_realestate < realestate_data.sql
```

5. **Update service DATABASE_URL**
```env
# services/auth-service/.env
DATABASE_URL=postgresql://user:pass@localhost:5432/domislink_auth
```

## Phase 5: Deployment

### Option 1: Docker Compose (Simple)

```bash
# Copy environment file
cp docker-compose.microservices.yml docker-compose.prod.yml

# Update for production
vim docker-compose.prod.yml

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes (Recommended for Production)

```bash
# Create namespace
kubectl create namespace domislink

# Create secrets
kubectl create secret generic auth-secrets \
  --from-literal=JWT_SECRET=your-secret \
  -n domislink

# Apply manifests
kubectl apply -f infrastructure/kubernetes/ -n domislink

# Check status
kubectl get pods -n domislink
kubectl get services -n domislink
kubectl get ingress -n domislink
```

### Option 3: Individual VPS

1. Set up VPS for each service
2. Install Docker on each VPS
3. Deploy service Docker image
4. Configure Nginx as reverse proxy
5. Set up SSL certificates

## Phase 6: Gradual Cutover

### Strategy: Blue-Green Deployment

1. **Deploy new microservices** (Green) alongside monorepo (Blue)
2. **Route subset of traffic** to microservices
3. **Monitor** for errors and performance
4. **Gradually increase** traffic to microservices
5. **Decommission** monorepo when 100% migrated

### Using Feature Flags

```typescript
// Example feature flag
if (process.env.USE_MICROSERVICES === 'true') {
  // Call microservice
  await axios.post(`${PAYMENTS_SERVICE_URL}/api/payment`);
} else {
  // Use old monorepo function
  await processPayment();
}
```

### DNS and Routing

1. Keep old domain pointing to monorepo
2. Set up new subdomain for microservices (e.g., beta.domislink.com)
3. Test thoroughly on new subdomain
4. Switch DNS to point to API Gateway
5. Monitor and be ready to rollback

## Phase 7: Monitoring and Optimization

### Set Up Monitoring

```bash
# Deploy Prometheus
kubectl apply -f infrastructure/kubernetes/monitoring/prometheus.yaml

# Deploy Grafana
kubectl apply -f infrastructure/kubernetes/monitoring/grafana.yaml

# Access dashboards
kubectl port-forward svc/grafana 3000:3000
```

### Key Metrics to Monitor

- Request latency per service
- Error rates
- Database connection pool usage
- Memory and CPU usage
- Inter-service communication latency

## Rollback Plan

If issues occur during migration:

### Quick Rollback (DNS)
```bash
# Point DNS back to monorepo
# Update A/CNAME records
```

### Service-Level Rollback
```bash
# Roll back specific service in Kubernetes
kubectl rollout undo deployment/auth-service -n domislink

# Or in Docker Compose
docker-compose -f docker-compose.microservices.yml stop auth-service
# Fix issues and restart
```

## Cleanup

Once migration is complete and stable:

1. **Archive monorepo code**
```bash
git tag monorepo-archive
git push --tags
```

2. **Remove unused code**
```bash
# Keep for reference but mark as deprecated
mv apps apps-deprecated
mv packages packages-deprecated
```

3. **Update documentation**
- Update README.md
- Archive old deployment docs
- Update team onboarding docs

## Checklist

### Pre-Migration
- [ ] Backup all databases
- [ ] Document current architecture
- [ ] Set up monitoring for monorepo
- [ ] Create rollback plan

### Migration
- [ ] Infrastructure setup ✅
- [ ] Copy app code to services
- [ ] Update dependencies
- [ ] Fix import paths
- [ ] Update API calls
- [ ] Configure environment variables
- [ ] Test locally
- [ ] Test with Docker Compose

### Post-Migration
- [ ] Deploy to staging
- [ ] Run integration tests
- [ ] Performance testing
- [ ] Security scanning
- [ ] Deploy to production (gradual)
- [ ] Monitor for issues
- [ ] Optimize performance

### Cleanup
- [ ] Archive monorepo code
- [ ] Update documentation
- [ ] Train team on new architecture
- [ ] Decommission old infrastructure

## Common Issues and Solutions

### Issue: Service can't connect to another service
**Solution**: Check service URLs in environment variables, ensure services are on same Docker network

### Issue: CORS errors
**Solution**: Update ALLOWED_ORIGINS in gateway/.env to include all necessary origins

### Issue: Authentication fails
**Solution**: Verify JWT_SECRET is same across all services, check token format

### Issue: Database connection errors
**Solution**: Verify DATABASE_URL format, check database is accessible from service

### Issue: Out of memory
**Solution**: Increase Docker memory limits, optimize service code, add horizontal scaling

## Support

For migration assistance:
- Review MICROSERVICES_ARCHITECTURE.md
- Check MICROSERVICES_SETUP.md
- Review service-specific README files
- Open GitHub issues for bugs
- Contact DevOps team for infrastructure issues

## Timeline

Estimated migration timeline:
- **Week 1-2**: Code migration and local testing
- **Week 3**: Docker Compose testing and fixes
- **Week 4**: Staging deployment and testing
- **Week 5-6**: Gradual production rollout
- **Week 7-8**: Monitoring, optimization, cleanup

Total: **6-8 weeks** for complete migration with minimal risk.
