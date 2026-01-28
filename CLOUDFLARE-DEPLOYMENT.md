# 🌐 Cloudflare Pages Deployment Guide

## Overview

This guide covers deploying DomisLink Empire to Cloudflare Pages - a fast, secure, and free platform for hosting static sites and serverless functions.

## Prerequisites

- Cloudflare account (free)
- GitHub repository with your code
- Domain name (optional, can use .pages.dev subdomain)

## 🚀 Quick Deployment

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Build All Apps

```bash
npm run build
```

### 4. Deploy Each App

```bash
# Hub (domislink.com)
cd apps/hub
wrangler pages deploy .next --project-name=domislink-hub

# Real Estate
cd ../realestate
wrangler pages deploy .next --project-name=domislink-realestate

# Tickets
cd ../tickets
wrangler pages deploy .next --project-name=domislink-tickets

# Flight Monitor
cd ../flightmonitor
wrangler pages deploy .next --project-name=domislink-flightmonitor

# TeachMaster
cd ../teachmaster
wrangler pages deploy .next --project-name=domislink-teachmaster

# Admin
cd ../admin
wrangler pages deploy .next --project-name=domislink-admin
```

## 🔧 Automated Deployment via GitHub

### 1. Connect Repository

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Pages**
3. Click **Create a project**
4. Connect your GitHub repository
5. Select **DomisLink Empire** repository

### 2. Configure Build Settings

For each app, create separate Pages projects:

#### Hub App
- **Project name:** `domislink-hub`
- **Production branch:** `main`
- **Build command:** `npm run build:hub`
- **Build output directory:** `apps/hub/.next`

#### Real Estate App
- **Project name:** `domislink-realestate`
- **Production branch:** `main`
- **Build command:** `npm run build:realestate`
- **Build output directory:** `apps/realestate/.next`

#### Tickets App
- **Project name:** `domislink-tickets`
- **Production branch:** `main`
- **Build command:** `npm run build:tickets`
- **Build output directory:** `apps/tickets/.next`

#### Flight Monitor App
- **Project name:** `domislink-flightmonitor`
- **Production branch:** `main`
- **Build command:** `npm run build:flightmonitor`
- **Build output directory:** `apps/flightmonitor/.next`

#### TeachMaster App
- **Project name:** `domislink-teachmaster`
- **Production branch:** `main`
- **Build command:** `npm run build:teachmaster`
- **Build output directory:** `apps/teachmaster/.next`

#### Admin App
- **Project name:** `domislink-admin`
- **Production branch:** `main`
- **Build command:** `npm run build:admin`
- **Build output directory:** `apps/admin/.next`

### 3. Environment Variables

Add these environment variables to each Pages project:

#### Required for All Apps
```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

#### AI Services
```
ANTHROPIC_API_KEY=sk-ant-xxxxx
OPENAI_API_KEY=sk-xxxxx
```

#### External APIs
```
KIWI_API_KEY=xxxxx
AMADEUS_API_KEY=xxxxx
AMADEUS_API_SECRET=xxxxx
IPINFO_TOKEN=xxxxx
GOOGLE_MAPS_API_KEY=xxxxx
```

#### App-Specific URLs
```
# Hub
NEXT_PUBLIC_APP_URL=https://domislink.com

# Real Estate
NEXT_PUBLIC_APP_URL=https://realestate.domislink.com

# Tickets
NEXT_PUBLIC_APP_URL=https://tickets.domislink.com

# Flight Monitor
NEXT_PUBLIC_APP_URL=https://fm.domislink.com

# TeachMaster
NEXT_PUBLIC_APP_URL=https://teachmaster.domislink.com

# Admin
NEXT_PUBLIC_APP_URL=https://admin.domislink.com
```

## 🌐 Custom Domain Setup

### 1. Add Domain to Cloudflare

1. Go to **Cloudflare Dashboard**
2. Click **Add site**
3. Enter your domain: `domislink.com`
4. Choose **Free** plan
5. Update nameservers at your domain registrar

### 2. Configure DNS Records

```
Type    Name            Target                              TTL
A       @               192.0.2.1                          Auto
CNAME   www             domislink-hub.pages.dev            Auto
CNAME   realestate      domislink-realestate.pages.dev     Auto
CNAME   tickets         domislink-tickets.pages.dev        Auto
CNAME   fm              domislink-flightmonitor.pages.dev  Auto
CNAME   teachmaster     domislink-teachmaster.pages.dev    Auto
CNAME   admin           domislink-admin.pages.dev          Auto
```

### 3. Configure Custom Domains in Pages

For each Pages project:

1. Go to **Pages** → **Your Project**
2. Click **Custom domains**
3. Add your domain (e.g., `realestate.domislink.com`)
4. Cloudflare will automatically provision SSL certificate

## 🔒 Security Configuration

### 1. Security Headers

Cloudflare automatically adds security headers, but you can customize them:

1. Go to **Security** → **Page Rules**
2. Add rules for each subdomain
3. Configure headers:
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`

### 2. Rate Limiting

1. Go to **Security** → **Rate Limiting**
2. Create rules to protect against abuse
3. Set limits per IP address

### 3. Bot Protection

1. Enable **Bot Fight Mode** in Security settings
2. Configure **Super Bot Fight Mode** for enhanced protection

## 📊 Performance Optimization

### 1. Caching Rules

1. Go to **Caching** → **Page Rules**
2. Set cache rules for static assets
3. Configure cache TTL for different file types

### 2. Minification

1. Go to **Speed** → **Optimization**
2. Enable **Auto Minify** for HTML, CSS, JS
3. Enable **Brotli** compression

### 3. Image Optimization

1. Enable **Polish** for automatic image optimization
2. Configure **WebP** conversion
3. Set up **Mirage** for mobile optimization

## 🔄 CI/CD with GitHub Actions

The included GitHub Actions workflow automatically:

1. Builds all apps on push to `main`
2. Runs quality checks (lint, type-check)
3. Deploys to Cloudflare Pages
4. Sends notifications on completion

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
TELEGRAM_BOT_TOKEN=optional_for_notifications
TELEGRAM_CHAT_ID=optional_for_notifications
SENDGRID_API_KEY=optional_for_email_notifications
ADMIN_EMAIL=amaechi@domislink.com
```

### Getting Cloudflare API Token

1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use **Custom token** template
4. Set permissions:
   - **Zone:Zone:Read**
   - **Zone:Page Rules:Edit**
   - **Account:Cloudflare Pages:Edit**
5. Set zone resources to include your domain
6. Copy the token

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild locally
rm -rf node_modules .next .turbo
npm install
npm run build
```

### Environment Variables Not Loading

1. Check variable names in Pages dashboard
2. Ensure `NEXT_PUBLIC_` prefix for client-side variables
3. Redeploy after adding variables

### Custom Domain Not Working

1. Verify DNS records are correct
2. Wait for DNS propagation (up to 24 hours)
3. Check SSL certificate status in Pages dashboard

### Functions Not Working

1. Ensure API routes are in `pages/api/` or `app/api/`
2. Check function logs in Pages dashboard
3. Verify environment variables are set

## 📈 Monitoring

### 1. Analytics

1. Go to **Analytics & Logs** → **Web Analytics**
2. Enable analytics for your domain
3. Add analytics script to your apps

### 2. Real User Monitoring

1. Enable **Speed** → **Real User Monitoring**
2. Monitor Core Web Vitals
3. Track performance metrics

### 3. Logs

1. Go to **Analytics & Logs** → **Logs**
2. Enable **Logpush** for detailed logs
3. Configure log retention

## 💰 Cost Optimization

### Free Tier Limits

Cloudflare Pages Free tier includes:
- ✅ Unlimited static requests
- ✅ 100,000 function invocations/month
- ✅ 500 builds/month
- ✅ 1 concurrent build
- ✅ Custom domains
- ✅ SSL certificates

### Upgrading

Consider **Pages Pro** ($20/month) for:
- 5,000,000 function invocations/month
- 5,000 builds/month
- 5 concurrent builds
- Advanced analytics

## 🎯 Best Practices

1. **Use Edge Functions** for API routes when possible
2. **Optimize images** before deployment
3. **Enable caching** for static assets
4. **Monitor performance** regularly
5. **Set up alerts** for downtime
6. **Use preview deployments** for testing
7. **Keep dependencies updated**

## 📞 Support

- **Cloudflare Community:** [community.cloudflare.com](https://community.cloudflare.com)
- **Documentation:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **Status Page:** [cloudflarestatus.com](https://cloudflarestatus.com)

---

🚀 **Ready to deploy?** Follow the Quick Deployment section above!