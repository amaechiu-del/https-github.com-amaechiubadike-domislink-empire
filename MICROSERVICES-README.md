# 🚀 DomisLink Empire - Microservices Architecture

<div align="center">

![DomisLink Empire](https://img.shields.io/badge/DomisLink-Empire-blue)
![Architecture](https://img.shields.io/badge/Architecture-Microservices-green)
![Cost](https://img.shields.io/badge/Cost-$0%2Fmonth-success)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

**Transform your monorepo into a scalable microservices architecture using 100% FREE hosting platforms**

[Quick Start](#-quick-start) • [Architecture](#-architecture) • [Deployment](#-deployment-guide) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Services](#-services)
- [Deployment Guide](#-deployment-guide)
- [Cost Breakdown](#-cost-breakdown)
- [Monitoring](#-monitoring)
- [Contributing](#contributing)

---

## Overview

DomisLink Empire is a **microservices-based platform** built with modern technologies and deployed on **100% FREE hosting solutions**. This architecture provides:

- ✅ **Scalability** - Each service scales independently
- ✅ **Reliability** - Service isolation prevents cascading failures
- ✅ **Cost Efficiency** - $0/month using free tiers
- ✅ **Developer Experience** - Easy to develop and deploy
- ✅ **Performance** - Global CDN and edge computing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                          │
│                       (Vercel - FREE)                          │
├─────────────────────────────────────────────────────────────────┤
│  hub.domislink.com     │  Hub & Landing Page                   │
│  tickets.domislink.com │  Flight & Event Tickets              │
│  fm.domislink.com      │  Flight Tracker                       │
│  teachmaster           │  Education Platform                   │
│  admin.domislink.com   │  Admin Dashboard                      │
│  realestate           │  Real Estate Marketplace              │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                             │
│              (Cloudflare Workers - FREE)                       │
│                   api.domislink.com                            │
├─────────────────────────────────────────────────────────────────┤
│  • Request Routing          • Rate Limiting                    │
│  • CORS Handling            • Request/Response Logging         │
│  • Load Balancing          • Security Headers                  │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICES                           │
├─────────────────────────────────────────────────────────────────┤
│  Auth Service         │  Railway ($5 credit)                   │
│  Payments Service     │  Render (FREE)                         │
│  Geolocation Service  │  Fly.io (FREE)                         │
│  Notifications       │  Deta Space (FREE)                      │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DATA & STORAGE LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Database            │  Supabase (FREE - 500MB)               │
│  File Storage        │  Cloudflare R2 (FREE - 10GB)           │
│  Cache/Queue         │  Upstash Redis (FREE)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### Frontend Services (Next.js 16)
- 🎨 **Modern UI** - React 19 with TypeScript
- ⚡ **Server Components** - Optimal performance
- 🌍 **i18n Support** - Multi-language
- 📱 **Responsive** - Mobile-first design
- 🔐 **Authentication** - Supabase Auth integration
- 💳 **Payments** - Paystack integration

### Backend Services
- 🔐 **Authentication** - JWT, session management
- 💰 **Payments** - Paystack integration, webhooks
- 🌐 **Geolocation** - IP lookup, currency conversion
- 📧 **Notifications** - Email (Resend), SMS

### Infrastructure
- 🚀 **API Gateway** - Cloudflare Workers
- 📊 **Database** - PostgreSQL (Supabase)
- 💾 **Storage** - Cloudflare R2
- 📈 **Monitoring** - Better Stack, Sentry, UptimeRobot
- 🔄 **CI/CD** - GitHub Actions

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Git
- Accounts on: Vercel, Railway, Render, Fly.io, Cloudflare

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/domislink-empire.git
cd domislink-empire

# Install dependencies
npm install

# Start all services
npm run dev

# Or start individual apps
npm run dev:hub
npm run dev:tickets
npm run dev:flightmonitor
```

### Deploy to Production

See [MICROSERVICES-DEPLOYMENT-GUIDE.md](./MICROSERVICES-DEPLOYMENT-GUIDE.md) for detailed instructions.

---

## 🔧 Services

### Frontend Applications

| Service | Description | Port | URL |
|---------|-------------|------|-----|
| **Hub** | Landing page & main hub | 3000 | domislink.com |
| **Tickets** | Flight & event tickets | 3002 | tickets.domislink.com |
| **Flight Monitor** | Real-time flight tracking | 3003 | fm.domislink.com |
| **TeachMaster** | Education platform | 3004 | teachmaster.domislink.com |
| **Admin** | Administration panel | 3005 | admin.domislink.com |
| **Real Estate** | Property marketplace | 3001 | realestate.domislink.com |

### Backend Services

| Service | Description | Port | URL |
|---------|-------------|------|-----|
| **Auth Service** | Authentication & authorization | 3100 | auth-api.domislink.com |
| **Payments Service** | Payment processing | 3101 | payments-api.domislink.com |
| **Geolocation Service** | IP lookup & currency | 3102 | geo-api.domislink.com |
| **Notifications Service** | Email & SMS | 3103 | notify-api.domislink.com |

### Infrastructure Services

| Service | Description | URL |
|---------|-------------|-----|
| **API Gateway** | Request routing & rate limiting | api.domislink.com |
| **Database** | PostgreSQL with Supabase | Supabase Dashboard |
| **Storage** | File storage with R2 | Cloudflare R2 |

---

## 📚 Deployment Guide

### Phase 1: Frontend to Vercel

```bash
# Deploy each frontend app
cd apps/hub && vercel --prod
cd apps/tickets && vercel --prod
cd apps/flightmonitor && vercel --prod
cd apps/teachmaster && vercel --prod
cd apps/admin && vercel --prod
cd apps/realestate && vercel --prod
```

### Phase 2: Backend Services

**Auth Service (Railway):**
```bash
# Connect GitHub repo to Railway
# Set root directory: services/auth-service
# Add environment variables
# Deploy automatically
```

**Payments Service (Render):**
```bash
# Create web service on Render
# Connect GitHub repo
# Root: services/payments-service
# Free plan
```

**Geolocation (Fly.io):**
```bash
cd services/geolocation-service
flyctl launch
flyctl deploy
```

**Notifications (Deta Space):**
```bash
cd services/notifications-service
space new
space push
space release
```

### Phase 3: API Gateway

```bash
cd api-gateway
wrangler login
wrangler kv:namespace create "RATE_LIMIT_KV"
# Update wrangler.toml with KV ID
npm run deploy
```

For complete step-by-step instructions, see [MICROSERVICES-DEPLOYMENT-GUIDE.md](./MICROSERVICES-DEPLOYMENT-GUIDE.md).

---

## 💰 Cost Breakdown

### Monthly Costs (FREE Tier)

| Service | Provider | Free Tier | Cost |
|---------|----------|-----------|------|
| **Frontend (6 apps)** | Vercel | 100GB bandwidth | $0 |
| **Auth Service** | Railway | $5 credit/month | $0 |
| **Payments Service** | Render | 750 hours | $0 |
| **Geolocation** | Fly.io | 3 VMs, 160GB | $0 |
| **Notifications** | Deta Space | Unlimited | $0 |
| **API Gateway** | Cloudflare Workers | 100K req/day | $0 |
| **Database** | Supabase | 500MB | $0 |
| **File Storage** | Cloudflare R2 | 10GB | $0 |
| **Cache/Queue** | Upstash Redis | 10K commands/day | $0 |
| **Monitoring** | Better Stack | 1GB logs | $0 |
| **Error Tracking** | Sentry | 5K errors/month | $0 |
| **Uptime Monitoring** | UptimeRobot | 50 monitors | $0 |
| **Email** | Resend | 3K emails/month | $0 |
| **CDN** | Cloudflare | Unlimited bandwidth | $0 |

### **Total: $0/month** 🎉

### When to Upgrade

- **Vercel Pro** ($20/month) - If exceeding 100GB bandwidth
- **Railway** ($10/month) - For more compute credits
- **Supabase Pro** ($25/month) - For 8GB database
- **Render Starter** ($7/month) - For 24/7 uptime

---

## 📊 Monitoring

### Health Checks

All services expose a `/health` endpoint:

```bash
# Check service health
curl https://auth-api.domislink.com/health
curl https://payments-api.domislink.com/health
curl https://geo-api.domislink.com/health
curl https://api.domislink.com/health
```

### Monitoring Stack

- **Logging**: Better Stack (Logtail)
- **Error Tracking**: Sentry
- **Uptime Monitoring**: UptimeRobot
- **Performance**: Built-in service metrics

### Dashboard Access

- **Vercel**: vercel.com/dashboard
- **Railway**: railway.app
- **Render**: render.com/dashboard
- **Fly.io**: fly.io/dashboard
- **Supabase**: supabase.com/dashboard
- **Cloudflare**: dash.cloudflare.com

---

## 🔒 Security

- ✅ HTTPS everywhere
- ✅ Rate limiting (API Gateway)
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ JWT authentication
- ✅ Environment variable encryption
- ✅ Webhook signature verification
- ✅ SQL injection protection (Supabase RLS)

---

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type check
npm run type-check

# Build all services
npm run build
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📖 Documentation

- [Microservices Deployment Guide](./MICROSERVICES-DEPLOYMENT-GUIDE.md)
- [API Gateway Documentation](./api-gateway/README.md)
- [Auth Service Documentation](./services/auth-service/README.md)
- [Payments Service Documentation](./services/payments-service/README.md)
- [Geolocation Service Documentation](./services/geolocation-service/README.md)
- [Notifications Service Documentation](./services/notifications-service/README.md)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Vercel** for FREE Next.js hosting
- **Railway** for backend hosting
- **Cloudflare** for Workers and R2
- **Supabase** for database and auth
- **Render**, **Fly.io**, **Deta** for service hosting

---

<div align="center">

Made with ❤️ by the DomisLink Team

[Website](https://domislink.com) • [Documentation](./MICROSERVICES-DEPLOYMENT-GUIDE.md) • [Support](https://github.com/yourusername/domislink-empire/issues)

</div>
