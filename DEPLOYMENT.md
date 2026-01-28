# 🚀 DOMISLINK EMPIRE - DEPLOYMENT GUIDE

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Options](#deployment-options)
3. [Cloudflare Pages Deployment (Recommended)](#cloudflare-pages-deployment-recommended)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Setup](#database-setup)
7. [Domain Configuration](#domain-configuration)
8. [Post-Deployment](#post-deployment)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🔍 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All apps build successfully (`npm run build`)
- [ ] All tests pass (if implemented)
- [ ] No console errors in production builds
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] API keys and secrets secured

### ✅ Infrastructure
- [ ] Domain purchased and DNS configured
- [ ] SSL certificates ready (auto with Cloudflare)
- [ ] CDN configured (auto with Cloudflare)
- [ ] Database hosted (Supabase)
- [ ] Payment gateway configured (Paystack)

### ✅ Security
- [ ] All API keys in environment variables
- [ ] No sensitive data in code
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Authentication tested

---

## 🎯 Deployment Options

### Option 1: Cloudflare Pages (Recommended) ⭐
**Best for:** Fast global deployment, edge computing, zero config
- ✅ Free tier with generous limits
- ✅ Automatic HTTPS
- ✅ Global CDN with 300+ locations
- ✅ Automatic deployments from Git
- ✅ Edge functions support
- ✅ Built-in analytics

### Option 2: Docker + VPS
**Best for:** Full control, custom infrastructure
- ✅ Complete control
- ✅ Cost-effective at scale
- ✅ Custom configurations
- ❌ Requires DevOps knowledge

### Option 3: AWS/GCP/Azure
**Best for:** Enterprise scale, complex requirements
- ✅ Maximum scalability
- ✅ Advanced features
- ❌ More expensive
- ❌ Complex setup

---

## 🌟 Cloudflare Pages Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

### Step 3: Build All Apps
```bash
npm run build
```

### Step 4: Deploy Each App

#### Deploy Hub (Landing Page)
```bash
cd apps/hub
wrangler pages deploy .next --project-name=domislink-hub
```

#### Deploy Real Estate
```bash
cd apps/realestate
wrangler pages deploy .next --project-name=domislink-realestate
```

#### Deploy Tickets
```bash
cd apps/tickets
wrangler pages deploy .next --project-name=domislink-tickets
```

#### Deploy Flight Monitor
```bash
cd apps/flightmonitor
wrangler pages deploy .next --project-name=domislink-flightmonitor
```

#### Deploy TeachMaster
```bash
cd apps/teachmaster
wrangler pages deploy .next --project-name=domislink-teachmaster
```

#### Deploy Admin
```bash
cd apps/admin
wrangler pages deploy .next --project-name=domislink-admin
```

### Step 5: Configure Domains in Cloudflare

For each deployment:
1. Go to Cloudflare Dashboard → Pages → Project → Custom domains
2. Add custom domain:
   - Hub: `domislink.com`
   - Real Estate: `realestate.domislink.com`
   - Tickets: `tickets.domislink.com`
   - Flight Monitor: `fm.domislink.com`
   - TeachMaster: `teachmaster.domislink.com`
   - Admin: `admin.domislink.com`

### Step 6: Configure Environment Variables

For each project in Cloudflare Pages:
1. Go to Settings → Environment variables
2. Add all variables from `.env.example`
3. Set for Production and Preview environments

**Critical Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
```

---

## 🐳 Docker Deployment

### Dockerfile for Each App

Create `Dockerfile` in each app directory:

```dockerfile
# Example: apps/realestate/Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/realestate/package.json ./apps/realestate/
COPY packages/ ./packages/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the app
RUN npm run build --filter=realestate

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/realestate/.next/standalone ./
COPY --from=builder /app/apps/realestate/.next/static ./apps/realestate/.next/static
COPY --from=builder /app/apps/realestate/public ./apps/realestate/public

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/realestate/server.js"]
```

### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  hub:
    build:
      context: .
      dockerfile: apps/hub/Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  realestate:
    build:
      context: .
      dockerfile: apps/realestate/Dockerfile
    ports:
      - "3001:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  tickets:
    build:
      context: .
      dockerfile: apps/tickets/Dockerfile
    ports:
      - "3002:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  flightmonitor:
    build:
      context: .
      dockerfile: apps/flightmonitor/Dockerfile
    ports:
      - "3003:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  teachmaster:
    build:
      context: .
      dockerfile: apps/teachmaster/Dockerfile
    ports:
      - "3004:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  admin:
    build:
      context: .
      dockerfile: apps/admin/Dockerfile
    ports:
      - "3005:3000"
    env_file:
      - .env.production
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - hub
      - realestate
      - tickets
      - flightmonitor
      - teachmaster
      - admin
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 🔐 Environment Variables

### Production Environment Setup

Create `.env.production`:

```env
# =============================================
# PRODUCTION ENVIRONMENT
# =============================================

# SUPABASE (Production)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxx

# PAYSTACK (Live Keys)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx

# AI SERVICES
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx

# FLIGHT APIS
KIWI_API_KEY=xxxxx
AMADEUS_API_KEY=xxxxx
AMADEUS_API_SECRET=xxxxx

# GEOLOCATION
IPINFO_TOKEN=xxxxx
GOOGLE_MAPS_API_KEY=xxxxx

# NOTIFICATIONS
TWILIO_ACCOUNT_SID=xxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE=+xxxxx
TELEGRAM_BOT_TOKEN=xxxxx
SENDGRID_API_KEY=xxxxx

# APP URLS (Production)
NEXT_PUBLIC_HUB_URL=https://domislink.com
NEXT_PUBLIC_REALESTATE_URL=https://realestate.domislink.com
NEXT_PUBLIC_TICKETS_URL=https://tickets.domislink.com
NEXT_PUBLIC_FLIGHTMONITOR_URL=https://fm.domislink.com
NEXT_PUBLIC_TEACHMASTER_URL=https://teachmaster.domislink.com
NEXT_PUBLIC_ADMIN_URL=https://admin.domislink.com

# ADMIN
ADMIN_EMAIL=amaechi@domislink.com
ADMIN_SECRET=your-super-secret-production-key

# NODE
NODE_ENV=production
```

---

## 🗄️ Database Setup

### Supabase Production Setup

1. **Create Production Project**
   ```
   - Go to supabase.com
   - Create new project
   - Choose region closest to users (e.g., Frankfurt for Europe/Africa)
   - Note down URL and keys
   ```

2. **Run Database Migrations**
   ```bash
   # In Supabase SQL Editor, run:
   # 1. Copy contents of database.sql
   # 2. Paste and execute
   # 3. Verify all tables created
   ```

3. **Configure Row Level Security (RLS)**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
   -- Add policies as needed
   ```

4. **Setup Database Backups**
   - Enable automatic backups in Supabase dashboard
   - Schedule: Daily at 2 AM UTC
   - Retention: 7 days minimum

---

## 🌐 Domain Configuration

### DNS Settings

Configure your DNS provider (e.g., Namecheap, GoDaddy, Cloudflare):

```
# A Records (if using VPS)
@               A       YOUR_SERVER_IP
realestate      A       YOUR_SERVER_IP
tickets         A       YOUR_SERVER_IP
fm              A       YOUR_SERVER_IP
teachmaster     A       YOUR_SERVER_IP
admin           A       YOUR_SERVER_IP

# CNAME Records (if using Cloudflare Pages)
@               CNAME   domislink-hub.pages.dev
realestate      CNAME   domislink-realestate.pages.dev
tickets         CNAME   domislink-tickets.pages.dev
fm              CNAME   domislink-flightmonitor.pages.dev
teachmaster     CNAME   domislink-teachmaster.pages.dev
admin           CNAME   domislink-admin.pages.dev
```

### SSL Certificates

**With Cloudflare Pages:** Automatic, no action needed

**With VPS/Docker:** Use Let's Encrypt
```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d domislink.com -d realestate.domislink.com -d tickets.domislink.com -d fm.domislink.com -d teachmaster.domislink.com -d admin.domislink.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## ✅ Post-Deployment

### 1. Verify All Apps
- [ ] Hub loads at domislink.com
- [ ] Real Estate loads at realestate.domislink.com
- [ ] Tickets loads at tickets.domislink.com
- [ ] Flight Monitor loads at fm.domislink.com
- [ ] TeachMaster loads at teachmaster.domislink.com
- [ ] Admin loads at admin.domislink.com

### 2. Test Core Features
- [ ] User registration works
- [ ] User login works
- [ ] Database connections work
- [ ] Payment integration works
- [ ] AI features work
- [ ] Geolocation works
- [ ] Multi-language works

### 3. Performance Testing
```bash
# Test with Lighthouse
npm install -g lighthouse
lighthouse https://domislink.com --view

# Test with GTmetrix
# Visit gtmetrix.com and test each domain
```

### 4. Security Scan
```bash
# Check SSL
https://www.ssllabs.com/ssltest/

# Check headers
https://securityheaders.com/

# Check OWASP
npm install -g owasp-dependency-check
```

---

## 📊 Monitoring & Maintenance

### Monitoring Tools

1. **Cloudflare Analytics** (if using Cloudflare Pages)
   - Automatic performance monitoring
   - Real-time error tracking
   - Usage analytics
   - Core Web Vitals

2. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/nextjs
   ```

3. **Uptime Monitoring**
   - UptimeRobot (free)
   - Pingdom
   - StatusCake

### Regular Maintenance

**Daily:**
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Check payment transactions

**Weekly:**
- [ ] Review performance metrics
- [ ] Check database size
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Security audit
- [ ] Backup verification
- [ ] Cost analysis

### Backup Strategy

1. **Database Backups**
   - Automatic daily backups (Supabase)
   - Manual weekly exports
   - Store in separate location

2. **Code Backups**
   - Git repository (GitHub/GitLab)
   - Multiple branches
   - Tagged releases

3. **Environment Backups**
   - Encrypted .env files
   - Secure password manager
   - Documentation

---

## 🚨 Rollback Plan

### Quick Rollback (Cloudflare Pages)
```bash
# List deployments
wrangler pages deployment list --project-name=domislink-hub

# Rollback to previous
wrangler pages deployment rollback [deployment-id] --project-name=domislink-hub
```

### Docker Rollback
```bash
# Stop current
docker-compose down

# Checkout previous version
git checkout [previous-tag]

# Rebuild and deploy
docker-compose up -d --build
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: Build fails**
```bash
# Clear cache and rebuild
rm -rf node_modules .next
npm install
npm run build
```

**Issue: Environment variables not loading**
- Check variable names (NEXT_PUBLIC_ prefix for client-side)
- Restart deployment
- Verify in Cloudflare Pages dashboard

**Issue: Database connection fails**
- Check Supabase URL and keys
- Verify IP whitelist (if applicable)
- Check RLS policies

### Getting Help

- **Documentation:** Check README.md and this file
- **Email:** amaechi@domislink.com
- **Emergency:** Keep backup contact methods

---

## 🎉 Deployment Complete!

Your DomisLink Empire is now live! 🚀

**Next Steps:**
1. Monitor first 24 hours closely
2. Gather user feedback
3. Plan iterative improvements
4. Scale as needed

---

© 2025 DomisLink International Business Lagos Nig Ltd. All rights reserved.
