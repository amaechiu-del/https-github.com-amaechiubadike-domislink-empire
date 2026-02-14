# DomisLink Empire - Microservices Architecture

## Overview

This document describes the microservices architecture for DomisLink Empire, transformed from a monorepo structure.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Port 8080)                     │
│                  ┌──────────────────────────────┐                │
│                  │   - Routing                  │                │
│                  │   - Authentication           │                │
│                  │   - Rate Limiting            │                │
│                  │   - Health Aggregation       │                │
│                  └──────────────────────────────┘                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
┌──────────────────┬──────────────────┬──────────────────┐
│  Frontend Apps   │  Backend APIs    │   Shared DBs     │
├──────────────────┼──────────────────┼──────────────────┤
│ Hub         3000 │ Auth         4000│ PostgreSQL  5432 │
│ RealEstate  3001 │ Payments     4001│ Redis       6379 │
│ Tickets     3002 │ Geolocation  4002│                  │
│ FlightMon   3003 │ Notification 4003│                  │
│ TeachMaster 3004 │                  │                  │
│ Admin       3005 │                  │                  │
└──────────────────┴──────────────────┴──────────────────┘
```

## Service Breakdown

### Frontend Services (Next.js)

#### 1. Hub Service (Port 3000)
- **Purpose**: Main landing page and user portal
- **Path**: `/` (domislink.com)
- **Features**: Landing page, user dashboard, navigation
- **Tech**: Next.js 16, React 19

#### 2. Real Estate Service (Port 3001)
- **Purpose**: Property listings and management
- **Path**: `/realestate` or subdomain
- **Features**: Property search, listings, communities
- **Tech**: Next.js 16, React 19

#### 3. Tickets Service (Port 3002)
- **Purpose**: Flight booking and ticketing
- **Path**: `/tickets` or subdomain
- **Features**: Flight search, booking, Kiwi.com integration
- **Tech**: Next.js 16, React 19

#### 4. Flight Monitor Service (Port 3003)
- **Purpose**: Flight tracking and forums
- **Path**: `/fm` or subdomain
- **Features**: Flight tracking, forums, discussions
- **Tech**: Next.js 16, React 19

#### 5. TeachMaster Service (Port 3004)
- **Purpose**: Educational platform with AI tutors
- **Path**: `/teachmaster` or subdomain
- **Features**: AI tutors, progress tracking, gamification
- **Tech**: Next.js 16, React 19

#### 6. Admin Service (Port 3005)
- **Purpose**: Admin dashboard and AI builder
- **Path**: `/admin` or subdomain
- **Features**: Admin panel, analytics, AI builder
- **Tech**: Next.js 16, React 19

### Backend Services (Express.js)

#### 7. Authentication Service (Port 4000)
- **Purpose**: Centralized user authentication
- **Features**: 
  - JWT token generation and validation
  - User registration and login
  - Refresh token mechanism
  - OAuth providers (future)
- **Endpoints**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/verify` - Token verification
  - `POST /api/auth/refresh` - Refresh token

#### 8. Payments Service (Port 4001)
- **Purpose**: Handle all payment operations
- **Features**: 
  - Payment processing
  - Wallet management
  - Transaction history
  - Paystack integration
- **Endpoints**:
  - `POST /api/payment/initialize` - Initialize payment
  - `POST /api/payment/verify` - Verify payment
  - `GET /api/wallet/balance` - Get wallet balance

#### 9. Geolocation Service (Port 4002)
- **Purpose**: Location detection and currency conversion
- **Features**:
  - IP geolocation
  - Currency rates
  - Location-based content
- **Endpoints**:
  - `GET /api/location` - Get user location
  - `GET /api/currency/rates` - Get currency rates
  - `POST /api/currency/convert` - Convert currency

#### 10. Notification Service (Port 4003)
- **Purpose**: Email, SMS, push notifications
- **Features**:
  - Email sending
  - SMS notifications
  - Push notifications
  - Queue management
- **Endpoints**:
  - `POST /api/email/send` - Send email
  - `POST /api/sms/send` - Send SMS
  - `POST /api/push/send` - Send push notification

### API Gateway (Port 8080)

The API Gateway is the single entry point for all client requests.

**Features**:
- Request routing to appropriate services
- Authentication middleware for protected routes
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Health check aggregation
- Logging and error handling

**Routes**:
- `/` → Hub Service
- `/realestate/*` → Real Estate Service
- `/tickets/*` → Tickets Service
- `/fm/*` → Flight Monitor Service
- `/teachmaster/*` → TeachMaster Service
- `/admin/*` → Admin Service (Protected)
- `/api/auth/*` → Auth Service
- `/api/payments/*` → Payments Service (Protected)
- `/api/geo/*` → Geolocation Service
- `/api/notifications/*` → Notification Service (Protected)
- `/health` → Health check aggregation

## Communication Patterns

### 1. Synchronous Communication (REST)
- Frontend services communicate with backend services via REST APIs
- All requests go through the API Gateway
- Services use HTTP/HTTPS for inter-service communication

### 2. Authentication Flow
1. User logs in via `/api/auth/login`
2. Auth Service validates credentials and returns JWT token
3. Client includes token in subsequent requests
4. Gateway validates token with Auth Service
5. Request is forwarded to target service

### 3. Request Flow Example
```
Client → Gateway (8080) → Auth Middleware → Target Service → Response
```

## Deployment

### Local Development with Docker Compose

```bash
# Start all services
docker-compose -f docker-compose.microservices.yml up -d

# Check service health
curl http://localhost:8080/health

# Access services
# Hub: http://localhost:3000
# Gateway: http://localhost:8080
# Auth API: http://localhost:4000/api-docs
```

### Production Deployment

#### Option 1: Kubernetes
See `infrastructure/kubernetes/` for K8s manifests.

```bash
kubectl apply -f infrastructure/kubernetes/
```

#### Option 2: Docker Swarm
```bash
docker stack deploy -c docker-compose.microservices.yml domislink
```

#### Option 3: Individual VPS
Deploy each service to separate VPS instances with Nginx as reverse proxy.

## Monitoring & Observability

### Health Checks
All services expose health endpoints:
- `GET /api/health` - Service health
- `GET /api/health/ready` - Service readiness

The Gateway aggregates health from all services at `/health`.

### Logging
All services use Winston for structured logging:
- JSON format for production
- Colored console output for development
- Log levels: error, warn, info, debug

### Metrics (Future)
- Prometheus for metrics collection
- Grafana for visualization
- Custom business metrics

## Security

### Authentication
- JWT-based authentication
- Token expiration (24h for access, 7d for refresh)
- Secure token storage

### API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation and sanitization

### Service-to-Service Communication
- Internal network isolation
- Service authentication (future)
- Request signing (future)

## Environment Variables

Each service has its own `.env.example` file. Copy to `.env` and configure:

### Common Variables
```env
NODE_ENV=production
LOG_LEVEL=info
```

### Service-Specific Variables
See individual service directories for specific environment variables.

## Database Architecture

### Current State
Single shared database (database.sql)

### Future State (Per-Service Databases)
- `domislink_auth` - Auth Service
- `domislink_payments` - Payments Service
- `domislink_hub` - Hub Service
- `domislink_realestate` - Real Estate Service
- `domislink_tickets` - Tickets Service
- `domislink_flightmonitor` - Flight Monitor Service
- `domislink_teachmaster` - TeachMaster Service
- `domislink_admin` - Admin Service

## Development Workflow

### Adding a New Service

1. Create service directory in `services/`
2. Add package.json, Dockerfile, and source code
3. Add service to docker-compose.microservices.yml
4. Configure routing in API Gateway
5. Update documentation

### Local Development

```bash
# Start single service
cd services/auth-service
npm install
npm run dev

# Start all services
docker-compose -f docker-compose.microservices.yml up
```

## Migration from Monorepo

### Status
✅ Infrastructure setup complete
✅ Service structure created
✅ Docker configurations ready
✅ API Gateway implemented
⏳ Service extraction (copy from apps/)
⏳ Database splitting
⏳ Testing and validation
⏳ CI/CD pipeline setup

### Next Steps
1. Copy existing app code from `apps/` to `services/`
2. Configure environment variables
3. Test local deployment
4. Set up CI/CD pipelines
5. Deploy to staging
6. Gradual production migration

## Support

For issues or questions, please refer to:
- Individual service README files
- Architecture documentation
- GitHub issues

## License

[Add License Information]
