# ✅ DEPLOYMENT CHECKLIST

## Complete checklist for deploying DomisLink Empire to production

---

## 📋 PRE-DEPLOYMENT

### Code Quality
- [ ] All apps build successfully locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] All console.logs removed from production code
- [ ] No hardcoded API keys or secrets
- [ ] All TODO comments addressed or documented
- [ ] Code reviewed and approved
- [ ] Git repository up to date

### Testing
- [ ] Manual testing completed for all features
- [ ] User registration/login tested
- [ ] Payment flow tested (test mode)
- [ ] File uploads tested
- [ ] AI features tested
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing done (Chrome, Firefox, Safari, Edge)
- [ ] Performance testing completed

### Documentation
- [ ] README.md updated
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment guide reviewed
- [ ] User guide created (if needed)

---

## 🗄️ DATABASE SETUP

### Supabase Configuration
- [ ] Production Supabase project created
- [ ] Database region selected (closest to users)
- [ ] Strong database password set and saved
- [ ] Database migrations run successfully
- [ ] All tables created and verified
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] RLS policies configured correctly
- [ ] Storage buckets created
- [ ] Storage policies configured
- [ ] Database indexes created for performance
- [ ] Automatic backups enabled
- [ ] API keys copied and saved securely

### Database Verification
- [ ] Test data inserted successfully
- [ ] Queries execute correctly
- [ ] Foreign keys working
- [ ] Triggers functioning
- [ ] Functions/procedures tested

---

## 💳 PAYMENT SETUP

### Paystack Configuration
- [ ] Paystack account created
- [ ] Business verification completed
- [ ] Account approved
- [ ] Live API keys obtained
- [ ] Test API keys obtained
- [ ] Webhook URL configured
- [ ] Webhook events selected
- [ ] Test payment processed successfully
- [ ] Refund process tested
- [ ] Payment notifications working

---

## 🤖 EXTERNAL SERVICES

### AI Services
- [ ] Anthropic API key obtained
- [ ] OpenAI API key obtained
- [ ] Usage limits configured
- [ ] Billing alerts set up
- [ ] API calls tested

### Flight APIs
- [ ] Kiwi.com API access approved
- [ ] Amadeus account created
- [ ] API credentials obtained
- [ ] API calls tested
- [ ] Rate limits understood

### Geolocation
- [ ] IPInfo account created
- [ ] Token obtained
- [ ] Location detection tested
- [ ] Google Maps API enabled
- [ ] Maps API key obtained
- [ ] API restrictions configured

### Notifications
- [ ] Twilio account created
- [ ] Phone number purchased
- [ ] SMS sending tested
- [ ] SendGrid account created
- [ ] Sender email verified
- [ ] DNS records configured for email
- [ ] Email sending tested
- [ ] Telegram bot created (optional)
- [ ] Bot token obtained

---

## 🌐 DOMAIN & DNS

### Domain Setup
- [ ] Domain purchased (domislink.com)
- [ ] Domain ownership verified
- [ ] DNS management access confirmed
- [ ] Nameservers configured (if needed)

### DNS Records
- [ ] A record for @ (root domain)
- [ ] CNAME for www
- [ ] CNAME for realestate subdomain
- [ ] CNAME for tickets subdomain
- [ ] CNAME for fm subdomain
- [ ] CNAME for teachmaster subdomain
- [ ] CNAME for admin subdomain
- [ ] MX records for email (if using custom email)
- [ ] TXT records for email verification
- [ ] DNS propagation verified (24-48 hours)

---

## 🚀 VERCEL DEPLOYMENT

### Account Setup
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] Repository imported
- [ ] Billing configured (if needed)

### Hub Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/hub`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

### Real Estate Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/realestate`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: realestate.domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

### Tickets Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/tickets`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: tickets.domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

### Flight Monitor Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/flightmonitor`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: fm.domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

### TeachMaster Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/teachmaster`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: teachmaster.domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

### Admin Deployment
- [ ] Project created in Vercel
- [ ] Root directory set to `apps/admin`
- [ ] Build command configured
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Custom domain added: admin.domislink.com
- [ ] SSL certificate active
- [ ] Site accessible

---

## 🔐 ENVIRONMENT VARIABLES

### All Apps Must Have
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY (LIVE)
- [ ] PAYSTACK_SECRET_KEY (LIVE)
- [ ] NODE_ENV=production

### AI-Enabled Apps
- [ ] ANTHROPIC_API_KEY
- [ ] OPENAI_API_KEY

### Tickets & Flight Monitor
- [ ] KIWI_API_KEY
- [ ] AMADEUS_API_KEY
- [ ] AMADEUS_API_SECRET

### All Apps (Shared)
- [ ] IPINFO_TOKEN
- [ ] GOOGLE_MAPS_API_KEY
- [ ] TWILIO_ACCOUNT_SID
- [ ] TWILIO_AUTH_TOKEN
- [ ] TWILIO_PHONE
- [ ] SENDGRID_API_KEY
- [ ] TELEGRAM_BOT_TOKEN (optional)

### App URLs
- [ ] NEXT_PUBLIC_HUB_URL
- [ ] NEXT_PUBLIC_REALESTATE_URL
- [ ] NEXT_PUBLIC_TICKETS_URL
- [ ] NEXT_PUBLIC_FLIGHTMONITOR_URL
- [ ] NEXT_PUBLIC_TEACHMASTER_URL
- [ ] NEXT_PUBLIC_ADMIN_URL

### Admin
- [ ] ADMIN_EMAIL
- [ ] ADMIN_SECRET

---

## 🧪 POST-DEPLOYMENT TESTING

### Accessibility Testing
- [ ] Hub loads at https://domislink.com
- [ ] Real Estate loads at https://realestate.domislink.com
- [ ] Tickets loads at https://tickets.domislink.com
- [ ] Flight Monitor loads at https://fm.domislink.com
- [ ] TeachMaster loads at https://teachmaster.domislink.com
- [ ] Admin loads at https://admin.domislink.com
- [ ] All sites have valid SSL (green padlock)
- [ ] No mixed content warnings

### Functionality Testing
- [ ] User registration works
- [ ] Email verification works
- [ ] User login works
- [ ] Password reset works
- [ ] Profile updates work
- [ ] File uploads work
- [ ] Image optimization works
- [ ] Database reads work
- [ ] Database writes work
- [ ] Real-time updates work (if applicable)

### Payment Testing
- [ ] Test payment with test card
- [ ] Payment success flow works
- [ ] Payment failure handled correctly
- [ ] Webhooks received
- [ ] Transaction recorded in database
- [ ] User notified of payment status
- [ ] Live payment tested (small amount)

### AI Features Testing
- [ ] AI responses working
- [ ] Response time acceptable (<5 seconds)
- [ ] Error handling works
- [ ] Rate limiting works
- [ ] Cost tracking enabled

### Geolocation Testing
- [ ] Location detected correctly
- [ ] Currency set correctly
- [ ] Language set correctly
- [ ] Timezone handled correctly

### Performance Testing
- [ ] Lighthouse score: Performance 90+
- [ ] Lighthouse score: Accessibility 95+
- [ ] Lighthouse score: Best Practices 95+
- [ ] Lighthouse score: SEO 95+
- [ ] Page load time <3 seconds
- [ ] Time to Interactive <5 seconds
- [ ] First Contentful Paint <2 seconds

### Security Testing
- [ ] SSL Labs test: A+ rating
- [ ] Security Headers test: A rating
- [ ] No exposed API keys in client code
- [ ] CORS configured correctly
- [ ] Rate limiting working
- [ ] SQL injection protection verified
- [ ] XSS protection verified
- [ ] CSRF protection verified

### Mobile Testing
- [ ] Responsive on iPhone (Safari)
- [ ] Responsive on Android (Chrome)
- [ ] Touch interactions work
- [ ] Forms usable on mobile
- [ ] Images load correctly
- [ ] Navigation works on mobile

### Cross-Browser Testing
- [ ] Works on Chrome (latest)
- [ ] Works on Firefox (latest)
- [ ] Works on Safari (latest)
- [ ] Works on Edge (latest)
- [ ] No console errors in any browser

---

## 📊 MONITORING SETUP

### Vercel Analytics
- [ ] Web Analytics enabled for all apps
- [ ] Speed Insights enabled for all apps
- [ ] Real User Monitoring active
- [ ] Dashboard reviewed

### Uptime Monitoring
- [ ] UptimeRobot account created
- [ ] Monitor added for domislink.com
- [ ] Monitor added for realestate.domislink.com
- [ ] Monitor added for tickets.domislink.com
- [ ] Monitor added for fm.domislink.com
- [ ] Monitor added for teachmaster.domislink.com
- [ ] Monitor added for admin.domislink.com
- [ ] Check interval: 5 minutes
- [ ] Alert contacts configured
- [ ] Test alert sent and received

### Error Tracking
- [ ] Sentry account created (optional)
- [ ] Sentry projects created for each app
- [ ] Sentry SDK installed
- [ ] Error reporting tested
- [ ] Alert rules configured
- [ ] Team members invited

### Log Management
- [ ] Vercel logs accessible
- [ ] Log retention understood
- [ ] Log drains configured (if needed)
- [ ] Critical errors alerting

---

## 💾 BACKUP CONFIGURATION

### Database Backups
- [ ] Automatic backups enabled in Supabase
- [ ] Backup frequency: Daily
- [ ] Backup retention: 7+ days
- [ ] Manual backup tested
- [ ] Restore procedure documented
- [ ] Backup storage location secured

### Code Backups
- [ ] GitHub repository up to date
- [ ] All branches pushed
- [ ] Tags created for releases
- [ ] Mirror repository created (optional)
- [ ] Local backup on external drive

### Environment Variables Backup
- [ ] All env vars exported from Vercel
- [ ] Encrypted backup created
- [ ] Stored in password manager
- [ ] Backup location documented
- [ ] Access restricted to authorized personnel

---

## 🔄 CI/CD SETUP

### GitHub Actions
- [ ] Workflow file created (`.github/workflows/deploy.yml`)
- [ ] GitHub secrets configured
- [ ] VERCEL_TOKEN added
- [ ] DOCKER_USERNAME added (if using Docker)
- [ ] DOCKER_PASSWORD added (if using Docker)
- [ ] Workflow tested
- [ ] Deployment notifications working

### Deployment Process
- [ ] Automatic deployment on push to main
- [ ] Preview deployments for PRs
- [ ] Build checks passing
- [ ] Lint checks passing
- [ ] Type checks passing

---

## 📱 NOTIFICATIONS

### Deployment Notifications
- [ ] Telegram notifications configured
- [ ] Email notifications configured
- [ ] Slack notifications configured (optional)
- [ ] Test notification sent

### Error Notifications
- [ ] Critical errors trigger alerts
- [ ] Payment failures trigger alerts
- [ ] Database errors trigger alerts
- [ ] API failures trigger alerts

### User Notifications
- [ ] Welcome emails working
- [ ] Password reset emails working
- [ ] Payment confirmation emails working
- [ ] SMS notifications working (if applicable)

---

## 📈 ANALYTICS & SEO

### Google Analytics
- [ ] GA4 property created
- [ ] Tracking code added to all apps
- [ ] Goals configured
- [ ] E-commerce tracking enabled (if applicable)
- [ ] Data flowing correctly

### Search Console
- [ ] Property added for each domain
- [ ] Ownership verified
- [ ] Sitemap submitted
- [ ] Robots.txt configured
- [ ] No crawl errors

### SEO Optimization
- [ ] Meta titles set for all pages
- [ ] Meta descriptions set for all pages
- [ ] Open Graph tags added
- [ ] Twitter Card tags added
- [ ] Canonical URLs set
- [ ] Structured data added (JSON-LD)
- [ ] Alt text on all images

---

## 🚨 DISASTER RECOVERY

### Recovery Plan
- [ ] Disaster recovery plan documented
- [ ] Database restore procedure tested
- [ ] Application rollback procedure tested
- [ ] Emergency contacts list created
- [ ] Escalation process defined

### Emergency Procedures
- [ ] Know how to rollback deployment
- [ ] Know how to restore database
- [ ] Know how to switch to maintenance mode
- [ ] Know how to contact support
- [ ] Know how to access backups

---

## 📞 COMMUNICATION

### Stakeholder Communication
- [ ] Deployment schedule communicated
- [ ] Maintenance window announced (if needed)
- [ ] Status page created (optional)
- [ ] Support channels established

### Team Communication
- [ ] Team briefed on deployment
- [ ] Roles and responsibilities clear
- [ ] Communication channels established
- [ ] On-call schedule defined (if applicable)

---

## 🎯 LAUNCH DAY

### Final Checks (1 hour before)
- [ ] All systems green
- [ ] No pending deployments
- [ ] Monitoring active
- [ ] Team on standby
- [ ] Backup plan ready

### Go Live
- [ ] DNS switched to production
- [ ] All apps accessible
- [ ] SSL certificates active
- [ ] Monitoring shows healthy status
- [ ] No critical errors

### First Hour Monitoring
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor user registrations
- [ ] Monitor payment processing
- [ ] Check logs for issues
- [ ] Verify all features working

---

## 📅 POST-LAUNCH (First Week)

### Daily Tasks
- [ ] Review error logs
- [ ] Check uptime status
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Check payment processing
- [ ] Monitor API usage
- [ ] Review costs

### Weekly Tasks
- [ ] Performance analysis
- [ ] User analytics review
- [ ] Cost analysis
- [ ] Security audit
- [ ] Backup verification
- [ ] Team retrospective

---

## 🎉 LAUNCH COMPLETE!

### Celebration
- [ ] Announce successful launch
- [ ] Thank the team
- [ ] Document lessons learned
- [ ] Plan next iteration

### Continuous Improvement
- [ ] Gather user feedback
- [ ] Prioritize improvements
- [ ] Plan next release
- [ ] Update documentation

---

## 📝 NOTES

**Deployment Date:** _________________

**Deployed By:** _________________

**Issues Encountered:**
- 
- 
- 

**Resolutions:**
- 
- 
- 

**Next Steps:**
- 
- 
- 

---

© 2025 DomisLink International Business Lagos Nig Ltd. All rights reserved.
