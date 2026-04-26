# Notifications Service - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Install Dependencies
```bash
cd oracle-cloud/services/notifications-service
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Minimal required config
PORT=3003
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-key
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@domislink.com
```

### 3. Setup Database
Run `database-schema.sql` in your Supabase SQL editor.

### 4. Start Redis
```bash
# Using Docker
docker run -d -p 6379:6379 redis:7-alpine

# Or with Docker Compose (includes service)
docker-compose up -d
```

### 5. Run Service
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📬 Send Your First Notification

### Email
```bash
curl -X POST http://localhost:3003/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello from DomisLink",
    "text": "Your first notification!"
  }'
```

### SMS (requires Twilio)
```bash
curl -X POST http://localhost:3003/api/notify/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "Your verification code is: 123456"
  }'
```

### Push (requires Firebase)
```bash
curl -X POST http://localhost:3003/api/notify/push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fcm-device-token",
    "title": "New Message",
    "body": "You have a new message!"
  }'
```

## 🎨 Using Templates

```bash
curl -X POST http://localhost:3003/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome!",
    "template": "welcome",
    "context": {
      "userName": "John Doe",
      "appName": "DomisLink",
      "message": "Welcome to our platform!",
      "actionUrl": "https://domislink.com/dashboard",
      "year": 2024
    }
  }'
```

Available templates:
- `welcome` - Welcome new users
- `verify-email` - Email verification
- `reset-password` - Password reset

## 📊 Check Status

### Health Check
```bash
curl http://localhost:3003/health
```

### Queue Stats
```bash
curl http://localhost:3003/api/notify/queue/stats
```

### Notification Status
```bash
curl http://localhost:3003/api/notify/status/NOTIFICATION_ID
```

### Notification History
```bash
curl http://localhost:3003/api/notify/history?limit=10
```

## 🐳 Docker Quick Start

```bash
# Copy and configure environment
cp .env.example .env
nano .env

# Deploy everything
./deploy.sh

# Or manually
docker-compose up -d

# View logs
docker-compose logs -f notifications-service

# Stop
docker-compose down
```

## 🔧 Common Issues

### Issue: "Cannot connect to Redis"
**Solution:** Make sure Redis is running
```bash
docker run -d -p 6379:6379 redis:7-alpine
```

### Issue: "Email not sending"
**Solution:** Check SMTP credentials in `.env`
```bash
# Test email connection
curl http://localhost:3003/api/health/detailed
```

### Issue: "Supabase connection failed"
**Solution:** Verify Supabase URL and service key
```bash
# Check in .env file
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

### Issue: "Job queue not processing"
**Solution:** Ensure Redis is accessible and check logs
```bash
docker-compose logs notifications-service
docker-compose logs redis
```

## 📝 Quick Reference

### Ports
- Service: `3003`
- Redis: `6379`

### Logs Location
- Error logs: `logs/error.log`
- All logs: `logs/combined.log`
- Console: stdout (development)

### Environment Files
- Template: `.env.example`
- Active config: `.env` (not in git)

### Database Tables
- `notification_logs` - All notification records
- `notification_templates` - Template definitions
- `notification_preferences` - User settings

### Key Endpoints
- `POST /api/notify/email` - Send email
- `POST /api/notify/sms` - Send SMS
- `POST /api/notify/push` - Send push
- `GET /api/notify/status/:id` - Check status
- `GET /api/notify/history` - View history
- `GET /api/notify/queue/stats` - Queue metrics
- `GET /health` - Health check

## 🔐 Security Checklist

- [ ] Change default `.env` values
- [ ] Use strong SMTP password / API key
- [ ] Secure Supabase service key
- [ ] Configure rate limits appropriately
- [ ] Enable HTTPS in production
- [ ] Review RLS policies in Supabase
- [ ] Rotate credentials regularly
- [ ] Monitor failed attempts

## 📚 More Information

- **Full Documentation:** [README.md](README.md)
- **API Examples:** [API-EXAMPLES.md](API-EXAMPLES.md)
- **Database Schema:** [database-schema.sql](database-schema.sql)
- **Implementation Details:** [IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f`
2. Verify health: `curl http://localhost:3003/health`
3. Check queue: `curl http://localhost:3003/api/notify/queue/stats`
4. Review environment: `cat .env`
5. Check Redis: `redis-cli ping`

## ⚡ Quick Commands

```bash
# Install
npm install

# Run dev
npm run dev

# Build
npm run build

# Start prod
npm start

# Docker up
docker-compose up -d

# Docker down
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart notifications-service

# Check health
curl http://localhost:3003/health

# Test email
curl -X POST http://localhost:3003/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","text":"Hi"}'

# Queue stats
curl http://localhost:3003/api/notify/queue/stats | jq
```

## 🎯 Next Steps

1. ✅ Service is running
2. Configure all notification channels (email, SMS, push)
3. Test each notification type
4. Create custom templates if needed
5. Set up monitoring and alerts
6. Configure production environment
7. Load test with expected volume
8. Document your team's workflows
9. Set up backup and recovery
10. Plan for scaling

---

**You're all set! 🎉**

Start sending notifications:
```bash
curl -X POST http://localhost:3003/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "your-email@example.com",
    "subject": "DomisLink Notifications Active!",
    "template": "welcome",
    "context": {
      "userName": "Team",
      "appName": "DomisLink",
      "message": "Your notification service is now live!",
      "year": 2024
    }
  }'
```
