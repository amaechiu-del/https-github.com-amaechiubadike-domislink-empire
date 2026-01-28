# 🔧 PRODUCTION ENVIRONMENT SETUP GUIDE

## Complete step-by-step guide for setting up DomisLink Empire in production

---

## 📋 Prerequisites

### Required Accounts
- [ ] GitHub account (for code repository)
- [ ] Vercel account (for hosting) - **Recommended**
- [ ] Supabase account (for database)
- [ ] Paystack account (for payments)
- [ ] Domain registrar account (Namecheap, GoDaddy, etc.)
- [ ] Anthropic/OpenAI account (for AI features)

### Required Tools
- [ ] Git installed
- [ ] Node.js 20+ installed
- [ ] npm or yarn installed
- [ ] Code editor (VS Code recommended)

---

## 🗄️ STEP 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - **Name:** domislink-empire-prod
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to your users (e.g., Frankfurt for Africa/Europe)
   - **Pricing Plan:** Start with Free, upgrade as needed

4. Wait for project to be created (2-3 minutes)

### 1.2 Run Database Migrations

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy entire contents of [`database.sql`](database.sql:1)
4. Paste and click "Run"
5. Verify all tables created successfully

### 1.3 Configure Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Example policy for users table
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 1.4 Get API Keys

1. Go to **Settings** → **API**
2. Copy and save:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...`
   - **service_role key:** `eyJhbGc...` (Keep secret!)

### 1.5 Configure Storage Buckets

```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('listings', 'listings', true),
  ('avatars', 'avatars', true),
  ('documents', 'documents', false);

-- Set storage policies
CREATE POLICY "Public can view listing images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listings');

CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listings' AND auth.role() = 'authenticated');
```

---

## 💳 STEP 2: Payment Setup (Paystack)

### 2.1 Create Paystack Account

1. Go to [paystack.com](https://paystack.com)
2. Sign up with business email
3. Complete KYC verification
4. Wait for approval (1-3 business days)

### 2.2 Get API Keys

1. Go to **Settings** → **API Keys & Webhooks**
2. Copy:
   - **Test Public Key:** `pk_test_xxxxx` (for testing)
   - **Test Secret Key:** `sk_test_xxxxx` (for testing)
   - **Live Public Key:** `pk_live_xxxxx` (for production)
   - **Live Secret Key:** `sk_live_xxxxx` (for production)

### 2.3 Configure Webhooks

1. In Paystack Dashboard, go to **Settings** → **API Keys & Webhooks**
2. Add webhook URL: `https://domislink.com/api/webhooks/paystack`
3. Select events:
   - `charge.success`
   - `transfer.success`
   - `transfer.failed`
   - `subscription.create`
   - `subscription.disable`

---

## 🤖 STEP 3: AI Services Setup

### 3.1 Anthropic (Claude)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up and verify email
3. Go to **API Keys**
4. Create new key: "DomisLink Production"
5. Copy key: `sk-ant-xxxxx`
6. Set usage limits if needed

### 3.2 OpenAI (GPT)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up and add payment method
3. Go to **API Keys**
4. Create new key: "DomisLink Production"
5. Copy key: `sk-xxxxx`
6. Set usage limits in **Settings** → **Limits**

---

## 🌍 STEP 4: External APIs Setup

### 4.1 Kiwi.com (Flight Data)

1. Go to [partners.kiwi.com](https://partners.kiwi.com)
2. Apply for API access
3. Wait for approval
4. Get API key from dashboard

### 4.2 Amadeus (Flight Booking)

1. Go to [developers.amadeus.com](https://developers.amadeus.com)
2. Create account
3. Create new app: "DomisLink Tickets"
4. Get:
   - API Key
   - API Secret

### 4.3 IPInfo (Geolocation)

1. Go to [ipinfo.io](https://ipinfo.io)
2. Sign up for free account
3. Get token from dashboard
4. Upgrade if needed (50k requests/month free)

### 4.4 Google Maps API

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project: "DomisLink Empire"
3. Enable APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
4. Create credentials → API Key
5. Restrict key to your domains

---

## 📧 STEP 5: Notification Services

### 5.1 Twilio (SMS)

1. Go to [twilio.com](https://twilio.com)
2. Sign up and verify phone
3. Get:
   - Account SID
   - Auth Token
   - Phone Number

### 5.2 SendGrid (Email)

1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up (100 emails/day free)
3. Create API Key
4. Verify sender email
5. Configure DNS records for domain

### 5.3 Telegram Bot (Optional)

1. Open Telegram
2. Search for @BotFather
3. Send `/newbot`
4. Follow instructions
5. Get bot token
6. Get your chat ID from @userinfobot

---

## 🌐 STEP 6: Domain Configuration

### 6.1 Purchase Domain

1. Go to domain registrar (Namecheap, GoDaddy, etc.)
2. Search for `domislink.com`
3. Purchase domain (1-10 years)
4. Complete registration

### 6.2 Configure DNS (For Vercel)

In your domain registrar's DNS settings:

```
Type    Name            Value                       TTL
A       @               76.76.21.21                 Auto
CNAME   www             cname.vercel-dns.com        Auto
CNAME   realestate      cname.vercel-dns.com        Auto
CNAME   tickets         cname.vercel-dns.com        Auto
CNAME   fm              cname.vercel-dns.com        Auto
CNAME   teachmaster     cname.vercel-dns.com        Auto
CNAME   admin           cname.vercel-dns.com        Auto
```

### 6.3 Wait for DNS Propagation

- Usually takes 1-24 hours
- Check status: [whatsmydns.net](https://whatsmydns.net)

---

## 🚀 STEP 7: Vercel Deployment

### 7.1 Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Select "domislink-empire"

### 7.2 Deploy Each App

#### Deploy Hub (Landing Page)

1. Click "Add New" → "Project"
2. Select repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/hub`
   - **Build Command:** `cd ../.. && npm run build --filter=hub`
   - **Output Directory:** `.next`
4. Add environment variables (see Step 8)
5. Click "Deploy"
6. Add domain: `domislink.com`

#### Deploy Real Estate

1. Repeat above steps
2. **Root Directory:** `apps/realestate`
3. **Build Command:** `cd ../.. && npm run build --filter=realestate`
4. Add domain: `realestate.domislink.com`

#### Deploy Tickets

1. **Root Directory:** `apps/tickets`
2. **Build Command:** `cd ../.. && npm run build --filter=tickets`
3. Add domain: `tickets.domislink.com`

#### Deploy Flight Monitor

1. **Root Directory:** `apps/flightmonitor`
2. **Build Command:** `cd ../.. && npm run build --filter=flightmonitor`
3. Add domain: `fm.domislink.com`

#### Deploy TeachMaster

1. **Root Directory:** `apps/teachmaster`
2. **Build Command:** `cd ../.. && npm run build --filter=teachmaster`
3. Add domain: `teachmaster.domislink.com`

#### Deploy Admin

1. **Root Directory:** `apps/admin`
2. **Build Command:** `cd ../.. && npm run build --filter=admin`
3. Add domain: `admin.domislink.com`

---

## 🔐 STEP 8: Environment Variables

### 8.1 Configure in Vercel

For **EACH** deployed app, go to:
1. Project Settings → Environment Variables
2. Add all variables below
3. Select: Production, Preview, Development

### 8.2 Required Variables

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# PAYSTACK (Use LIVE keys for production)
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

# APP URLS
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

### 8.3 Redeploy After Adding Variables

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## ✅ STEP 9: Post-Deployment Verification

### 9.1 Test All Apps

Visit each URL and verify:
- [ ] `https://domislink.com` - Hub loads
- [ ] `https://realestate.domislink.com` - Real Estate loads
- [ ] `https://tickets.domislink.com` - Tickets loads
- [ ] `https://fm.domislink.com` - Flight Monitor loads
- [ ] `https://teachmaster.domislink.com` - TeachMaster loads
- [ ] `https://admin.domislink.com` - Admin loads

### 9.2 Test Core Features

- [ ] User registration works
- [ ] User login works
- [ ] Database reads/writes work
- [ ] File uploads work
- [ ] Payment processing works (test mode first!)
- [ ] AI features respond
- [ ] Geolocation detects correctly
- [ ] Multi-language switching works

### 9.3 Performance Testing

```bash
# Install Lighthouse
npm install -g lighthouse

# Test each domain
lighthouse https://domislink.com --view
lighthouse https://realestate.domislink.com --view
lighthouse https://tickets.domislink.com --view
lighthouse https://fm.domislink.com --view
lighthouse https://teachmaster.domislink.com --view
lighthouse https://admin.domislink.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

### 9.4 Security Testing

1. **SSL Certificate**
   - Visit: https://www.ssllabs.com/ssltest/
   - Test each domain
   - Target: A+ rating

2. **Security Headers**
   - Visit: https://securityheaders.com/
   - Test each domain
   - Target: A rating

3. **OWASP Check**
   ```bash
   npm install -g owasp-dependency-check
   owasp-dependency-check --scan .
   ```

---

## 📊 STEP 10: Monitoring Setup

### 10.1 Vercel Analytics

1. In each project, go to Analytics tab
2. Enable Web Analytics
3. Enable Speed Insights
4. Review metrics daily

### 10.2 Uptime Monitoring

**Option 1: UptimeRobot (Free)**
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitors for each domain
3. Set check interval: 5 minutes
4. Add alert contacts (email, SMS)

**Option 2: Pingdom**
1. Go to [pingdom.com](https://pingdom.com)
2. Add checks for each domain
3. Configure alerts

### 10.3 Error Tracking (Sentry)

1. Go to [sentry.io](https://sentry.io)
2. Create new project for each app
3. Install Sentry:
   ```bash
   npm install @sentry/nextjs
   ```
4. Configure in each app
5. Test error reporting

### 10.4 Log Management

**Vercel Logs:**
- Go to each project → Logs
- Filter by severity
- Set up log drains if needed

**Custom Logging:**
```typescript
// Add to your apps
import { createLogger } from '@/lib/logger';

const logger = createLogger('app-name');
logger.info('User logged in', { userId: user.id });
logger.error('Payment failed', { error, orderId });
```

---

## 🔄 STEP 11: Backup Strategy

### 11.1 Database Backups

**Automatic (Supabase):**
- Free plan: Daily backups, 7-day retention
- Pro plan: Daily backups, 30-day retention
- Enable in: Settings → Database → Backups

**Manual Backups:**
```bash
# Weekly manual backup
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup-$(date +%Y%m%d).sql
```

### 11.2 Code Backups

- Primary: GitHub repository
- Secondary: GitLab mirror (optional)
- Local: Clone to external drive monthly

### 11.3 Environment Variables Backup

1. Export from Vercel:
   ```bash
   vercel env pull .env.production.backup
   ```
2. Encrypt and store securely
3. Use password manager (1Password, LastPass)

---

## 🚨 STEP 12: Disaster Recovery Plan

### 12.1 Database Recovery

```bash
# Restore from backup
psql -h db.xxxxx.supabase.co -U postgres -d postgres < backup-20250128.sql
```

### 12.2 Application Rollback

**Vercel:**
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

**Docker:**
```bash
git checkout [previous-tag]
docker-compose up -d --build
```

### 12.3 Emergency Contacts

- **Technical Lead:** amaechi@domislink.com
- **Supabase Support:** support@supabase.io
- **Vercel Support:** support@vercel.com
- **Paystack Support:** support@paystack.com

---

## 📈 STEP 13: Scaling Considerations

### When to Scale

**Database (Supabase):**
- Upgrade when: >500 concurrent connections
- Current plan: Free (500MB)
- Next plan: Pro ($25/month, 8GB)

**Hosting (Vercel):**
- Upgrade when: >100GB bandwidth/month
- Current plan: Hobby (Free)
- Next plan: Pro ($20/month)

**CDN:**
- Vercel includes global CDN
- Consider Cloudflare for additional DDoS protection

### Performance Optimization

1. **Enable caching:**
   ```typescript
   export const revalidate = 3600; // 1 hour
   ```

2. **Optimize images:**
   ```typescript
   import Image from 'next/image';
   <Image src="/logo.png" width={200} height={100} />
   ```

3. **Database indexing:**
   ```sql
   CREATE INDEX idx_listings_location ON listings(country, state, city);
   CREATE INDEX idx_users_email ON users(email);
   ```

---

## ✅ Production Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database migrations completed
- [ ] SSL certificates active
- [ ] Payment gateway in live mode
- [ ] All apps deployed and accessible
- [ ] DNS propagated
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Error tracking active

### Launch Day
- [ ] Final smoke tests
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify email delivery
- [ ] Test user registration
- [ ] Monitor performance metrics

### Post-Launch (First Week)
- [ ] Daily error log review
- [ ] Performance monitoring
- [ ] User feedback collection
- [ ] Database size monitoring
- [ ] API usage tracking
- [ ] Cost analysis

---

## 🎉 Congratulations!

Your DomisLink Empire is now live in production! 🚀

**Next Steps:**
1. Monitor closely for first 48 hours
2. Gather user feedback
3. Plan iterative improvements
4. Scale as needed

---

## 📞 Support

**Need Help?**
- Email: amaechi@domislink.com
- Documentation: See [DEPLOYMENT.md](DEPLOYMENT.md:1)
- Emergency: Keep this guide handy

---

© 2025 DomisLink International Business Lagos Nig Ltd. All rights reserved.
