# Notifications Service API Examples

Collection of example API requests for the Notifications Service.

## Setup

```bash
export API_URL="http://localhost:3003"
export NOTIFICATION_ID="your-notification-id"
```

## Email Examples

### 1. Send Simple Text Email

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Test Email",
    "text": "This is a test email from DomisLink Notifications Service."
  }'
```

### 2. Send HTML Email

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome to DomisLink",
    "html": "<h1>Welcome!</h1><p>Thank you for joining us.</p><p>Get started by exploring our platform.</p>"
  }'
```

### 3. Send Email with Welcome Template

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Welcome to DomisLink",
    "template": "welcome",
    "context": {
      "userName": "John Doe",
      "appName": "DomisLink",
      "message": "We are excited to have you on board!",
      "actionUrl": "https://domislink.com/dashboard",
      "year": 2024
    }
  }'
```

### 4. Send Email Verification

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Verify Your Email",
    "template": "verify-email",
    "context": {
      "userName": "John Doe",
      "appName": "DomisLink",
      "verificationCode": "ABC123",
      "verificationUrl": "https://domislink.com/verify?code=ABC123",
      "expiryMinutes": 30,
      "year": 2024
    }
  }'
```

### 5. Send Password Reset Email

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Reset Your Password",
    "template": "reset-password",
    "context": {
      "userName": "John Doe",
      "appName": "DomisLink",
      "resetCode": "123456",
      "resetUrl": "https://domislink.com/reset-password?token=abc123xyz",
      "expiryMinutes": 15,
      "year": 2024
    }
  }'
```

### 6. Send Email to Multiple Recipients

```bash
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": ["user1@example.com", "user2@example.com", "user3@example.com"],
    "subject": "Team Update",
    "text": "Hello team, this is an important update for all members."
  }'
```

### 7. Send Bulk Emails

```bash
curl -X POST $API_URL/api/notify/email/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "emails": [
      {
        "to": "user1@example.com",
        "subject": "Personalized Message",
        "template": "welcome",
        "context": {
          "userName": "Alice",
          "appName": "DomisLink",
          "message": "Welcome Alice!",
          "year": 2024
        }
      },
      {
        "to": "user2@example.com",
        "subject": "Personalized Message",
        "template": "welcome",
        "context": {
          "userName": "Bob",
          "appName": "DomisLink",
          "message": "Welcome Bob!",
          "year": 2024
        }
      }
    ]
  }'
```

## SMS Examples

### 1. Send Simple SMS

```bash
curl -X POST $API_URL/api/notify/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "Hello from DomisLink! Your verification code is: 123456"
  }'
```

### 2. Send SMS with Media (MMS)

```bash
curl -X POST $API_URL/api/notify/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+1234567890",
    "body": "Check out this image!",
    "mediaUrl": ["https://example.com/image.jpg"]
  }'
```

### 3. Send Bulk SMS

```bash
curl -X POST $API_URL/api/notify/sms/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "to": "+1234567890",
        "body": "Hello User 1, your appointment is confirmed."
      },
      {
        "to": "+0987654321",
        "body": "Hello User 2, your appointment is confirmed."
      }
    ]
  }'
```

## Push Notification Examples

### 1. Send Simple Push Notification

```bash
curl -X POST $API_URL/api/notify/push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fcm-device-token-here",
    "title": "New Message",
    "body": "You have received a new message from John Doe"
  }'
```

### 2. Send Push with Custom Data

```bash
curl -X POST $API_URL/api/notify/push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fcm-device-token-here",
    "title": "Property Update",
    "body": "Your property listing has been approved!",
    "data": {
      "type": "property_approved",
      "propertyId": "12345",
      "action": "view_property"
    },
    "imageUrl": "https://example.com/property-image.jpg"
  }'
```

### 3. Send Push with Click Action

```bash
curl -X POST $API_URL/api/notify/push \
  -H "Content-Type: application/json" \
  -d '{
    "token": "fcm-device-token-here",
    "title": "New Booking Request",
    "body": "You have a new booking request for your property",
    "data": {
      "bookingId": "67890",
      "propertyId": "12345"
    },
    "clickAction": "https://domislink.com/bookings/67890"
  }'
```

## Status & History Examples

### 1. Check Notification Status

```bash
curl -X GET $API_URL/api/notify/status/$NOTIFICATION_ID
```

### 2. Get All Notification History

```bash
curl -X GET "$API_URL/api/notify/history?limit=50&offset=0"
```

### 3. Get Email Notification History

```bash
curl -X GET "$API_URL/api/notify/history?type=email&limit=20"
```

### 4. Get Failed Notifications

```bash
curl -X GET "$API_URL/api/notify/history?status=failed&limit=50"
```

### 5. Get SMS History with Pagination

```bash
curl -X GET "$API_URL/api/notify/history?type=sms&limit=10&offset=20"
```

### 6. Get Queue Statistics

```bash
curl -X GET $API_URL/api/notify/queue/stats
```

## Health Check Examples

### 1. Simple Health Check

```bash
curl -X GET $API_URL/health
```

### 2. Detailed Health Check

```bash
curl -X GET $API_URL/api/health/detailed
```

## Advanced Examples

### 1. Send Email with Attachments

```bash
# Note: Attachments require base64 encoding or file paths
curl -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Invoice Attached",
    "html": "<p>Please find your invoice attached.</p>",
    "attachments": [
      {
        "filename": "invoice.pdf",
        "content": "base64-encoded-content-here"
      }
    ]
  }'
```

### 2. Scheduled Notifications (Using Delay)

Note: This requires implementing job scheduling in the queue. Example pattern:

```javascript
// In your application code
await emailQueue.add(emailData, {
  delay: 3600000 // Send after 1 hour (in milliseconds)
});
```

### 3. Priority Notifications

```javascript
// In your application code
await emailQueue.add(emailData, {
  priority: 1 // Higher priority (1-10, lower number = higher priority)
});
```

## Testing Script

Save this as `test-notifications.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3003"

echo "Testing Notifications Service..."

# Test email
echo "1. Testing email notification..."
RESPONSE=$(curl -s -X POST $API_URL/api/notify/email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "This is a test."
  }')

NOTIFICATION_ID=$(echo $RESPONSE | grep -o '"notificationId":"[^"]*"' | cut -d'"' -f4)
echo "Email queued with ID: $NOTIFICATION_ID"

# Wait a bit
sleep 2

# Check status
echo "2. Checking notification status..."
curl -s -X GET $API_URL/api/notify/status/$NOTIFICATION_ID | jq

# Check queue stats
echo "3. Checking queue statistics..."
curl -s -X GET $API_URL/api/notify/queue/stats | jq

echo "✅ Tests completed!"
```

Make it executable:
```bash
chmod +x test-notifications.sh
./test-notifications.sh
```

## Response Examples

### Success Response

```json
{
  "success": true,
  "notificationId": "550e8400-e29b-41d4-a716-446655440000",
  "jobId": 1,
  "message": "Email queued for delivery"
}
```

### Error Response

```json
{
  "success": false,
  "error": "\"to\" is required"
}
```

### Status Response

```json
{
  "success": true,
  "notification": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "notification_id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "email",
    "recipient": "user@example.com",
    "status": "sent",
    "message_id": "<abc123@mail.example.com>",
    "created_at": "2024-01-15T10:30:00Z",
    "sent_at": "2024-01-15T10:30:05Z"
  }
}
```

### Queue Stats Response

```json
{
  "success": true,
  "queues": {
    "email": {
      "counts": {
        "waiting": 5,
        "active": 2,
        "completed": 1250,
        "failed": 12
      },
      "waiting": 5,
      "active": 2,
      "completed": 1250,
      "failed": 12
    },
    "sms": {
      "counts": {
        "waiting": 0,
        "active": 0,
        "completed": 450,
        "failed": 3
      },
      "waiting": 0,
      "active": 0,
      "completed": 450,
      "failed": 3
    },
    "push": {
      "counts": {
        "waiting": 1,
        "active": 0,
        "completed": 890,
        "failed": 8
      },
      "waiting": 1,
      "active": 0,
      "completed": 890,
      "failed": 8
    }
  }
}
```
