# DomisLink Microservices - Quick Reference

## 🚀 Quick Commands

### Start Everything
```bash
docker-compose -f docker-compose.microservices.yml up -d
```

### Check Health
```bash
curl http://localhost:8080/health | jq
```

### View Logs
```bash
# All services
docker-compose -f docker-compose.microservices.yml logs -f

# Specific service
docker-compose -f docker-compose.microservices.yml logs -f auth-service
```

### Stop Everything
```bash
docker-compose -f docker-compose.microservices.yml down
```

---

## 🔌 Service Ports

| Service | Port | Type | URL |
|---------|------|------|-----|
| **API Gateway** | 8080 | Gateway | http://localhost:8080 |
| **Hub** | 3000 | Frontend | http://localhost:3000 |
| **Real Estate** | 3001 | Frontend | http://localhost:3001 |
| **Tickets** | 3002 | Frontend | http://localhost:3002 |
| **Flight Monitor** | 3003 | Frontend | http://localhost:3003 |
| **TeachMaster** | 3004 | Frontend | http://localhost:3004 |
| **Admin** | 3005 | Frontend | http://localhost:3005 |
| **Auth Service** | 4000 | Backend | http://localhost:4000 |
| **Payments Service** | 4001 | Backend | http://localhost:4001 |
| **Geolocation Service** | 4002 | Backend | http://localhost:4002 |
| **Notification Service** | 4003 | Backend | http://localhost:4003 |

---

## 🔐 API Endpoints

### Authentication Service (4000)

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"User"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Verify Token
curl -X POST http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN"

# Refresh Token
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'

# API Docs
open http://localhost:4000/api-docs
```

### Through API Gateway (8080)

```bash
# All auth endpoints work through gateway too
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Protected route (requires auth)
curl http://localhost:8080/api/payments/wallet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐳 Docker Commands

### Build Services
```bash
# Build all
docker-compose -f docker-compose.microservices.yml build

# Build specific service
docker-compose -f docker-compose.microservices.yml build auth-service
```

### Service Management
```bash
# Start services
docker-compose -f docker-compose.microservices.yml up -d

# Stop services
docker-compose -f docker-compose.microservices.yml stop

# Restart service
docker-compose -f docker-compose.microservices.yml restart auth-service

# Remove containers
docker-compose -f docker-compose.microservices.yml down

# Remove with volumes
docker-compose -f docker-compose.microservices.yml down -v
```

### Monitoring
```bash
# View running containers
docker-compose -f docker-compose.microservices.yml ps

# View resource usage
docker stats

# Execute command in container
docker-compose -f docker-compose.microservices.yml exec auth-service sh
```

---

## ☸️ Kubernetes Commands

### Deployment
```bash
# Apply all manifests
kubectl apply -f infrastructure/kubernetes/

# Apply specific service
kubectl apply -f infrastructure/kubernetes/auth-service-deployment.yaml
```

### Monitoring
```bash
# Get pods
kubectl get pods

# Get services
kubectl get services

# Get ingress
kubectl get ingress

# Describe pod
kubectl describe pod auth-service-xxxxx

# View logs
kubectl logs auth-service-xxxxx

# Follow logs
kubectl logs -f auth-service-xxxxx

# View logs for all pods of a service
kubectl logs -l app=auth-service
```

### Scaling
```bash
# Scale deployment
kubectl scale deployment auth-service --replicas=5

# Check HPA
kubectl get hpa
```

### Troubleshooting
```bash
# Check pod events
kubectl get events --sort-by=.metadata.creationTimestamp

# Port forward to local
kubectl port-forward svc/auth-service 4000:4000

# Execute command in pod
kubectl exec -it auth-service-xxxxx -- sh

# Check resource usage
kubectl top pods
kubectl top nodes
```

---

## 📝 Common Tasks

### Add New Environment Variable

1. Update `.env.example`
```bash
vim services/auth-service/.env.example
```

2. Update `.env`
```bash
vim services/auth-service/.env
```

3. Restart service
```bash
docker-compose -f docker-compose.microservices.yml restart auth-service
```

### Update Service Code

1. Edit files
```bash
vim services/auth-service/src/index.ts
```

2. Rebuild and restart
```bash
docker-compose -f docker-compose.microservices.yml build auth-service
docker-compose -f docker-compose.microservices.yml up -d auth-service
```

### View Service Health

```bash
# Gateway aggregated health
curl http://localhost:8080/health | jq

# Individual service health
curl http://localhost:4000/api/health | jq
```

### Debug Service Issues

```bash
# View logs
docker-compose -f docker-compose.microservices.yml logs auth-service

# Check if running
docker-compose -f docker-compose.microservices.yml ps auth-service

# Execute shell in container
docker-compose -f docker-compose.microservices.yml exec auth-service sh

# Test network connectivity
docker-compose -f docker-compose.microservices.yml exec gateway ping auth-service
```

---

## 🔧 Development

### Local Development (Without Docker)

```bash
# Terminal 1: Auth Service
cd services/auth-service
npm install
npm run dev

# Terminal 2: Gateway
cd gateway
npm install
npm run dev

# Terminal 3: Frontend Service
cd services/hub
npm install
npm run dev
```

### Testing

```bash
# Test authentication flow
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' | jq -r '.token')

# Use token for authenticated request
curl http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [MICROSERVICES_ARCHITECTURE.md](MICROSERVICES_ARCHITECTURE.md) | Architecture overview |
| [MICROSERVICES_SETUP.md](MICROSERVICES_SETUP.md) | Setup and deployment guide |
| [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) | Migration from monorepo |
| [MICROSERVICES_COMPARISON.md](MICROSERVICES_COMPARISON.md) | Architecture comparison |
| [MICROSERVICES_SUMMARY.md](MICROSERVICES_SUMMARY.md) | Project summary |
| Service READMEs | Individual service docs |

---

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.microservices.yml logs service-name

# Check if port is in use
lsof -i :4000

# Rebuild
docker-compose -f docker-compose.microservices.yml build service-name
docker-compose -f docker-compose.microservices.yml up -d service-name
```

### Connection Refused

```bash
# Check if service is running
docker-compose -f docker-compose.microservices.yml ps

# Check network
docker network ls
docker network inspect domislink_domislink-network

# Test connectivity
docker-compose -f docker-compose.microservices.yml exec gateway ping auth-service
```

### Health Check Failing

```bash
# Check service health directly
curl http://localhost:4000/api/health

# Check through gateway
curl http://localhost:8080/health

# View service logs
docker-compose -f docker-compose.microservices.yml logs -f service-name
```

---

## 🎯 Environment Files

Each service has `.env.example` - copy to `.env` and configure:

```bash
# Quick setup for all services
for service in hub realestate tickets flightmonitor teachmaster admin auth-service payments-service geolocation-service notification-service; do
  cp services/$service/.env.example services/$service/.env 2>/dev/null || true
done
cp gateway/.env.example gateway/.env
```

---

## 🔒 Security

### JWT Secrets

**IMPORTANT**: Change JWT secret in production!

```bash
# Generate secure secret
openssl rand -base64 32

# Update in .env
vim services/auth-service/.env
# JWT_SECRET=your-generated-secret
```

### Rate Limiting

Default: 100 requests per 15 minutes

Update in `.env`:
```
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📊 Monitoring

### Health Checks

```bash
# All services
curl http://localhost:8080/health | jq

# Specific service
curl http://localhost:4000/api/health | jq
```

### Logs

```bash
# Real-time logs
docker-compose -f docker-compose.microservices.yml logs -f

# Filter by service
docker-compose -f docker-compose.microservices.yml logs -f auth-service

# Last 100 lines
docker-compose -f docker-compose.microservices.yml logs --tail=100
```

### Metrics

```bash
# Container stats
docker stats

# Kubernetes metrics
kubectl top pods
kubectl top nodes
```

---

## 🚀 Quick Links

- **API Gateway**: http://localhost:8080
- **Gateway Health**: http://localhost:8080/health
- **Auth API Docs**: http://localhost:4000/api-docs
- **Hub App**: http://localhost:3000

---

## 💡 Pro Tips

1. **Use health endpoint** before testing: `curl http://localhost:8080/health`
2. **Check logs first** when debugging: `docker-compose logs -f`
3. **Use jq** for JSON formatting: `curl http://localhost:8080/health | jq`
4. **Scale gradually** in production: Start with 2 replicas, then scale up
5. **Monitor closely** after deployments: Watch logs and health checks

---

© 2025 DomisLink International Business Lagos Nig Ltd.
