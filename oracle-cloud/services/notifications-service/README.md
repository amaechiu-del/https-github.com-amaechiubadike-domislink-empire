# Notifications Service

A comprehensive notification service for DomisLink supporting email, SMS, and push notifications with queue-based processing, delivery tracking, and template support.

## Features

- ✉️ **Email Notifications** - SMTP/SendGrid support with HTML templates
- 📱 **SMS Notifications** - Twilio integration for global SMS delivery
- 🔔 **Push Notifications** - Firebase Cloud Messaging (FCM) for mobile push
- 🚀 **Queue System** - Bull queue with Redis for reliable delivery
- 📊 **Delivery Tracking** - Track notification status and history
- 🎨 **Template Support** - Handlebars templates for beautiful emails
- 📈 **Bulk Sending** - Send notifications in bulk with queue management
- 🔒 **Rate Limiting** - Protect against abuse
- 📝 **Comprehensive Logging** - Winston-based logging system
- 💾 **Supabase Integration** - Store notification logs and history

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Queue**: Bull (Redis-based)
- **Email**: Nodemailer with SMTP/SendGrid
- **SMS**: Twilio
- **Push**: Firebase Admin SDK
- **Database**: Supabase (PostgreSQL)
- **Validation**: Joi
- **Templates**: Handlebars
- **Logging**: Winston

## Prerequisites

- Node.js 18+
- Redis 7+
- Supabase account
- SMTP server or SendGrid account
- Twilio account (for SMS)
- Firebase project (for push notifications)

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env
```

## Environment Configuration

```env
# Server
PORT=3003
NODE_ENV=development

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# Redis (required for queues)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@domislink.com
EMAIL_FROM_NAME=DomisLink

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (Push)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

## Database Setup

Create the following table in Supabase:

```sql
CREATE TABLE notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'delivered')),
  message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_notification_logs_notification_id ON notification_logs(notification_id);
CREATE INDEX idx_notification_logs_type ON notification_logs(type);
CREATE INDEX idx_notification_logs_status ON notification_logs(status);
CREATE INDEX idx_notification_logs_created_at ON notification_logs(created_at DESC);
```

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f notifications-service

# Stop services
docker-compose down
```

## API Endpoints

### Email Notifications

#### Send Single Email
```bash
POST /api/notify/email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to DomisLink",
  "html": "<h1>Welcome!</h1><p>Thank you for joining us.</p>"
}
```

#### Send Email with Template
```bash
POST /api/notify/email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to DomisLink",
  "template": "welcome",
  "context": {
    "userName": "John Doe",
    "appName": "DomisLink",
    "message": "We're excited to have you!",
    "actionUrl": "https://domislink.com/dashboard",
    "year": 2024
  }
}
```

#### Send Bulk Emails
```bash
POST /api/notify/email/bulk
Content-Type: application/json

{
  "emails": [
    {
      "to": "user1@example.com",
      "subject": "Newsletter",
      "template": "welcome",
      "context": { "userName": "User 1" }
    },
    {
      "to": "user2@example.com",
      "subject": "Newsletter",
      "template": "welcome",
      "context": { "userName": "User 2" }
    }
  ]
}
```

### SMS Notifications

#### Send Single SMS
```bash
POST /api/notify/sms
Content-Type: application/json

{
  "to": "+1234567890",
  "body": "Your verification code is: 123456"
}
```

#### Send Bulk SMS
```bash
POST /api/notify/sms/bulk
Content-Type: application/json

{
  "messages": [
    {
      "to": "+1234567890",
      "body": "Hello User 1"
    },
    {
      "to": "+0987654321",
      "body": "Hello User 2"
    }
  ]
}
```

### Push Notifications

#### Send Push Notification
```bash
POST /api/notify/push
Content-Type: application/json

{
  "token": "fcm-device-token",
  "title": "New Message",
  "body": "You have a new message from John",
  "data": {
    "messageId": "123",
    "senderId": "456"
  },
  "clickAction": "https://domislink.com/messages/123"
}
```

### Notification Status

#### Check Notification Status
```bash
GET /api/notify/status/:notificationId
```

#### Get Notification History
```bash
GET /api/notify/history?type=email&status=sent&limit=50&offset=0
```

#### Get Queue Statistics
```bash
GET /api/notify/queue/stats
```

### Health Checks

```bash
GET /health
GET /api/health/detailed
```

## Templates

Available email templates:
- `welcome.hbs` - Welcome email for new users
- `verify-email.hbs` - Email verification
- `reset-password.hbs` - Password reset

### Creating Custom Templates

1. Create a new `.hbs` file in `src/templates/`
2. Use Handlebars syntax for variables: `{{variableName}}`
3. Reference the template by filename (without extension)

Example template (`custom.hbs`):
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Hello {{userName}}!</h1>
  <p>{{customMessage}}</p>
</body>
</html>
```

Use it:
```json
{
  "template": "custom",
  "context": {
    "userName": "John",
    "customMessage": "This is a custom message"
  }
}
```

## Queue Management

The service uses Bull queues for reliable message delivery:

- **Email Queue**: Processes email notifications
- **SMS Queue**: Processes SMS notifications
- **Push Queue**: Processes push notifications

Features:
- Automatic retry on failure (3 attempts by default)
- Exponential backoff between retries
- Job status tracking
- Failed job logging

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Success responses:
```json
{
  "success": true,
  "notificationId": "uuid",
  "jobId": "queue-job-id",
  "message": "Notification queued for delivery"
}
```

## Rate Limiting

Default rate limits:
- 100 requests per 15 minutes per IP
- Configurable via environment variables

## Monitoring

The service provides:
- Health check endpoints
- Queue statistics
- Comprehensive logging (Winston)
- Notification delivery tracking

## Production Considerations

1. **Redis**: Use Redis Cluster or managed Redis service for high availability
2. **Email**: Consider using dedicated email service (SendGrid, AWS SES, Mailgun)
3. **SMS**: Monitor Twilio usage and costs
4. **Push**: Implement token management and cleanup for invalid tokens
5. **Scaling**: Run multiple instances with shared Redis for horizontal scaling
6. **Monitoring**: Set up alerts for failed notifications
7. **Logging**: Use external logging service (CloudWatch, DataDog, etc.)

## Security

- Rate limiting on all endpoints
- Helmet.js for security headers
- Environment-based configuration
- No credentials in code
- Input validation with Joi
- CORS configuration

## License

MIT

## Support

For issues and questions, please contact support@domislink.com
