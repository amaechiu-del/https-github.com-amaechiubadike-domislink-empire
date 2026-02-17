# 🚀 DomisLink Empire - Microservices Deployment Guide

## 💰 100% FREE Hosting Architecture

This guide covers deploying DomisLink Empire as microservices using completely FREE hosting platforms.

---

## 📊 Architecture Overview

```
Frontend (Vercel - FREE):
├── hub.domislink.com          → Hub App
├── tickets.domislink.com      → Tickets App
├── fm.domislink.com           → Flight Monitor
├── teachmaster.domislink.com  → TeachMaster
├── admin.domislink.com        → Admin Panel
└── realestate.domislink.com   → Real Estate

API Gateway (Cloudflare Workers - FREE):
└── api.domislink.com          → Routes to backend services

Backend Services:
├── auth-api.domislink.com     → Railway ($5 credit/month)
├── payments-api.domislink.com → Render (free tier)
├── geo-api.domislink.com      → Fly.io (free tier)
└── notify-api.domislink.com   → Deta Space (free)

Database:
└── Supabase (FREE - 500MB)

Storage:
└── Cloudflare R2 (FREE - 10GB)

Monitoring:
├── Better Stack (FREE - 1GB logs)
├── Sentry (FREE - 5K errors)
└── UptimeRobot (FREE - 50 monitors)
```

---

## 🎯 Phase 1: Frontend Deployment to Vercel

### Prerequisites
- GitHub repository with code
- Vercel account (free)
- Custom domains configured

### Steps

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy Each App

**Hub App:**
```bash
cd apps/hub
vercel --prod
# Follow prompts to link project
# Custom domain: hub.domislink.com or domislink.com
```

**Tickets App:**
```bash
cd apps/tickets
vercel --prod
# Custom domain: tickets.domislink.com
```

**Flight Monitor:**
```bash
cd apps/flightmonitor
vercel --prod
# Custom domain: fm.domislink.com
```

**TeachMaster:**
```bash
cd apps/teachmaster
vercel --prod
# Custom domain: teachmaster.domislink.com
```

**Admin:**
```bash
cd apps/admin
vercel --prod
# Custom domain: admin.domislink.com
```

**Real Estate:**
```bash
cd apps/realestate
vercel --prod
# Custom domain: realestate.domislink.com
```

#### 4. Configure Environment Variables

In Vercel Dashboard for each app, add:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_GATEWAY_URL=https://api.domislink.com
```

#### 5. Enable Automatic Deployments
- Link GitHub repository in Vercel dashboard
- Enable automatic deployments from `main` branch
- Each push triggers automatic deployment

---

## 🔐 Phase 2: Backend Services

### 2.1 Authentication Service → Railway

#### Prerequisites
- Railway account (free $5 credit/month)
- GitHub repository

#### Steps

1. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Set root directory: `services/auth-service`

2. **Configure Environment Variables**
   ```
   PORT=3100
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_service_key
   ALLOWED_ORIGINS=https://domislink.com,https://*.domislink.com
   JWT_SECRET=your_jwt_secret
   ```

3. **Add Custom Domain**
   - In Railway dashboard, go to Settings
   - Add custom domain: `auth-api.domislink.com`
   - Update DNS records as instructed

4. **Deploy**
   - Railway auto-deploys from GitHub
   - Monitor logs in Railway dashboard

### 2.2 Payments Service → Render

#### Prerequisites
- Render account (free tier)

#### Steps

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect GitHub repository
   - Select `services/payments-service`

2. **Configure Service**
   - Name: `domislink-payments`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**

3. **Environment Variables**
   ```
   PORT=3101
   NODE_ENV=production
   SUPABASE_URL=your_supabase_url
   PAYSTACK_SECRET_KEY=your_paystack_key
   ```

4. **Custom Domain**
   - Add custom domain: `payments-api.domislink.com`

### 2.3 Geolocation Service → Fly.io

#### Prerequisites
- Fly.io account (free tier: 3 VMs)
- Flyctl CLI installed

#### Steps

1. **Install Flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Deploy**
   ```bash
   cd services/geolocation-service
   flyctl launch
   # Answer prompts
   # Name: domislink-geo
   # Region: Choose closest
   ```

4. **Configure Secrets**
   ```bash
   flyctl secrets set SUPABASE_URL=your_url
   flyctl secrets set NODE_ENV=production
   ```

5. **Custom Domain**
   ```bash
   flyctl certs create geo-api.domislink.com
   ```

### 2.4 Notifications Service → Deta Space

#### Prerequisites
- Deta Space account (completely free)

#### Steps

1. **Install Deta CLI**
   ```bash
   curl -fsSL https://get.deta.dev/space-cli.sh | sh
   ```

2. **Login**
   ```bash
   space login
   ```

3. **Deploy**
   ```bash
   cd services/notifications-service
   space new
   space push
   ```

4. **Get Public URL**
   ```bash
   space release
   # Note the public URL
   ```

---

## 🌉 Phase 3: API Gateway (Cloudflare Workers)

### Prerequisites
- Cloudflare account (free)
- Domain managed by Cloudflare

### Steps

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Create KV Namespace for Rate Limiting**
   ```bash
   cd api-gateway
   wrangler kv:namespace create "RATE_LIMIT_KV"
   ```

4. **Update wrangler.toml**
   - Copy the KV namespace ID from output
   - Update `wrangler.toml` with the ID

5. **Update Service URLs**
   - Edit `api-gateway/worker.js`
   - Update SERVICES object with actual backend URLs:
   ```javascript
   const SERVICES = {
     auth: 'https://auth-api.domislink.com',
     payments: 'https://payments-api.domislink.com',
     geo: 'https://geo-api.domislink.com',
     notify: 'https://notify-api.domislink.com'
   };
   ```

6. **Deploy**
   ```bash
   npm run deploy
   ```

7. **Configure Custom Domain**
   - Cloudflare Dashboard → Workers
   - Select worker: `domislink-api-gateway`
   - Add custom domain: `api.domislink.com`

---

## 🗄️ Phase 4: Database (Supabase)

### Current Setup
- Already using Supabase
- FREE tier: 500MB database
- Keep existing configuration

### Optimization Tips
1. **Create Service-Specific Schemas**
   ```sql
   CREATE SCHEMA auth;
   CREATE SCHEMA payments;
   CREATE SCHEMA geo;
   ```

2. **Set Up RLS Policies**
   ```sql
   ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Users can view own data" ON auth.users
     FOR SELECT USING (auth.uid() = id);
   ```

3. **Optimize Indexes**
   ```sql
   CREATE INDEX idx_users_email ON auth.users(email);
   CREATE INDEX idx_payments_user ON payments.transactions(user_id);
   ```

---

## 📦 Phase 5: File Storage (Cloudflare R2)

### Prerequisites
- Cloudflare account

### Steps

1. **Create R2 Bucket**
   - Cloudflare Dashboard → R2
   - Create bucket: `domislink-storage`

2. **Generate Access Keys**
   - R2 → Manage R2 API Tokens
   - Create API token
   - Note Access Key ID and Secret Access Key

3. **Configure CORS**
   ```json
   [
     {
       "AllowedOrigins": ["https://*.domislink.com"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

4. **Update Backend Services**
   - Add R2 credentials to environment variables
   - Use S3-compatible API to interact

---

## 📊 Phase 6: Monitoring Setup

### 6.1 Better Stack (Logging)

1. **Create Account** at [betterstack.com](https://betterstack.com)
2. **Create Source**
   - Sources → New Source
   - Platform: Node.js
3. **Add to Services**
   ```bash
   npm install @logtail/node
   ```
   ```javascript
   const { Logtail } = require('@logtail/node');
   const logger = new Logtail(process.env.LOGTAIL_TOKEN);
   ```

### 6.2 Sentry (Error Tracking)

1. **Create Account** at [sentry.io](https://sentry.io)
2. **Create Project** for each service
3. **Install SDK**
   ```bash
   npm install @sentry/node
   ```
4. **Initialize**
   ```javascript
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

### 6.3 UptimeRobot (Uptime Monitoring)

1. **Create Account** at [uptimerobot.com](https://uptimerobot.com)
2. **Add Monitors**
   - Hub: https://domislink.com/health
   - Tickets: https://tickets.domislink.com/health
   - Auth API: https://auth-api.domislink.com/health
   - Payments API: https://payments-api.domislink.com/health
   - API Gateway: https://api.domislink.com/health

---

## 🔄 Phase 7: CI/CD with GitHub Actions

### Already Configured!

The repository includes workflows for:
- ✅ Vercel deployments (`.github/workflows/deploy-vercel.yml`)
- ✅ Cloudflare Pages/Workers (existing)

### Additional Workflows Needed

Create `.github/workflows/deploy-backend.yml` for backend services:

```yaml
name: Deploy Backend Services

on:
  push:
    branches: [main]
    paths:
      - 'services/**'

jobs:
  deploy-auth-railway:
    # Railway auto-deploys from GitHub
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Railway Deploy
        run: echo "Railway auto-deploys on push"

  deploy-gateway:
    name: Deploy API Gateway
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Cloudflare
        run: |
          cd api-gateway
          npm install
          npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 🎯 Phase 8: Testing Deployment

### 1. Test Health Endpoints

```bash
# Frontend
curl https://domislink.com
curl https://tickets.domislink.com

# Backend Services
curl https://auth-api.domislink.com/health
curl https://payments-api.domislink.com/health
curl https://geo-api.domislink.com/health

# API Gateway
curl https://api.domislink.com/health
```

### 2. Test API Gateway Routing

```bash
# Test auth routing
curl -X POST https://api.domislink.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test CORS
curl -X OPTIONS https://api.domislink.com/api/auth/login \
  -H "Origin: https://domislink.com"
```

### 3. Monitor Logs

- Railway: railway.app dashboard
- Render: render.com dashboard
- Fly.io: `flyctl logs`
- Cloudflare: Wrangler tail: `wrangler tail`

---

## 💵 Cost Tracking

### Current Monthly Costs

```
Vercel (6 apps)             : $0 ✅
Railway                     : $0 ($5 credit) ✅
Render                      : $0 (free tier) ✅
Fly.io                      : $0 (free tier) ✅
Deta Space                  : $0 ✅
Supabase                    : $0 (500MB) ✅
Cloudflare Workers          : $0 (100K req/day) ✅
Cloudflare R2               : $0 (10GB) ✅
Better Stack                : $0 (1GB logs) ✅
Sentry                      : $0 (5K errors) ✅
UptimeRobot                 : $0 (50 monitors) ✅
────────────────────────────────────────────
TOTAL:                      $0/month 🎉
```

### Monitoring Usage

1. **Vercel:** Dashboard → Usage
2. **Railway:** Check credit usage
3. **Supabase:** Dashboard → Usage
4. **Cloudflare:** Dashboard → Analytics

---

## 🚨 Troubleshooting

### Frontend Issues

**Problem:** Build fails on Vercel
**Solution:** Check build logs, ensure all dependencies in package.json

**Problem:** API calls fail
**Solution:** Verify NEXT_PUBLIC_API_GATEWAY_URL is set correctly

### Backend Issues

**Problem:** Service not responding
**Solution:** Check health endpoint, review service logs

**Problem:** CORS errors
**Solution:** Verify ALLOWED_ORIGINS environment variable

### API Gateway Issues

**Problem:** 503 Service Unavailable
**Solution:** Check backend service URLs in worker.js

**Problem:** Rate limit too restrictive
**Solution:** Adjust rate limit in worker.js

---

## 📈 Scaling Guide

### When to Upgrade

**Vercel:**
- Exceeding 100GB bandwidth/month → Upgrade to Pro ($20/month)

**Railway:**
- Using more than $5 credit → Add payment method

**Supabase:**
- Approaching 500MB → Upgrade to Pro ($25/month) for 8GB

**Render:**
- Need 24/7 uptime → Upgrade to Starter ($7/month)

---

## ✅ Success Checklist

- [ ] All 6 frontend apps deployed to Vercel
- [ ] Custom domains configured and working
- [ ] Auth service deployed to Railway
- [ ] Payments service deployed to Render
- [ ] Geolocation service deployed to Fly.io
- [ ] Notifications service deployed to Deta
- [ ] API Gateway deployed to Cloudflare Workers
- [ ] All health endpoints responding
- [ ] Monitoring configured (Better Stack, Sentry, UptimeRobot)
- [ ] GitHub Actions workflows running
- [ ] API routing working correctly
- [ ] CORS configured properly
- [ ] SSL/TLS certificates active
- [ ] Rate limiting tested
- [ ] Documentation updated

---

## 🎉 You're Live!

Your DomisLink Empire is now running as microservices with **$0/month** cost!

**Next Steps:**
1. Monitor usage to stay within free tiers
2. Set up alerts for any issues
3. Scale individual services as needed
4. Optimize performance based on metrics

---

## 📞 Support

For issues or questions:
1. Check service-specific documentation
2. Review logs in respective dashboards
3. Test health endpoints
4. Check GitHub Actions workflow logs

---

**Last Updated:** 2024-02-17
**Architecture:** Microservices
**Cost:** $0/month
**Deployment:** Multi-cloud FREE tier
