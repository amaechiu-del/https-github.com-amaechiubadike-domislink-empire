# DomisLink Payments Service

Microservice for handling payment transactions using Paystack integration.

## Features

- 💳 **Payment Initialization** - Initialize new payment transactions
- ✅ **Payment Verification** - Verify completed payments
- 🔔 **Webhook Handling** - Process Paystack webhook events
- 💰 **Transaction Management** - List and track user transactions
- 🔄 **Refund Processing** - Handle payment refunds
- 🔒 **Security** - Rate limiting, CORS, Helmet protection
- 📊 **Monitoring** - Health checks and Prometheus metrics
- 🗄️ **Database** - Supabase integration for transaction storage

## Tech Stack

- **Runtime**: Node.js 20 (Alpine)
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Payment Gateway**: Paystack
- **Logging**: Winston
- **Validation**: Joi
- **Container**: Docker

## API Endpoints

### Payment Operations

#### Initialize Payment
```http
POST /api/payments/initialize
Authorization: Bearer <token> (optional)
Content-Type: application/json

{
  "email": "user@example.com",
  "amount": 5000,
  "currency": "NGN",
  "metadata": {
    "product_id": "123",
    "product_name": "Premium Subscription"
  }
}
```

#### Verify Payment
```http
GET /api/payments/verify/:reference
```

#### Webhook Endpoint
```http
POST /api/payments/webhook
X-Paystack-Signature: <signature>
```

#### Get Transactions
```http
GET /api/payments/transactions?page=1&limit=10
Authorization: Bearer <token>
```

#### Process Refund
```http
POST /api/payments/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "reference": "DML-1234567890-ABC",
  "amount": 5000,
  "reason": "Customer request"
}
```

### System Endpoints

- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Paystack
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

# Service
NODE_ENV=production
PORT=3001

# Security
CORS_ORIGIN=https://domislink.com

# URLs
FRONTEND_URL=https://domislink.com
PAYMENT_CALLBACK_URL=https://domislink.com/payment/callback
```

## Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'NGN',
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP,
  channel VARCHAR(50),
  ip_address VARCHAR(50),
  fees DECIMAL(10, 2),
  gateway_response TEXT,
  paystack_access_code VARCHAR(255),
  metadata JSONB,
  refund_reason TEXT,
  refunded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_reference ON transactions(reference);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

## Development

### Local Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Run production build
npm start
```

### Docker Setup

```bash
# Build image
docker build -t domislink-payments-service .

# Run container
docker run -p 3001:3001 --env-file .env domislink-payments-service

# Using Docker Compose
docker-compose up -d
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 30 requests per minute per IP
- **Webhook Verification**: HMAC signature validation
- **Authentication**: JWT token validation via Supabase
- **Non-root User**: Container runs as non-privileged user

## Payment Flow

1. **Initialize**: Client calls `/initialize` with payment details
2. **Redirect**: User is redirected to Paystack payment page
3. **Payment**: User completes payment on Paystack
4. **Callback**: Paystack redirects back to callback URL
5. **Verify**: Client calls `/verify/:reference` to confirm payment
6. **Webhook**: Paystack sends webhook event (backup verification)
7. **Complete**: Transaction status updated in database

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

## Monitoring

### Health Check
```bash
curl http://localhost:3001/health
```

### Metrics (Prometheus)
```bash
curl http://localhost:3001/metrics
```

## Supported Currencies

- NGN (Nigerian Naira)
- USD (US Dollar)
- GHS (Ghanaian Cedi)
- ZAR (South African Rand)
- KES (Kenyan Shilling)

## Logging

All operations are logged using Winston:
- Info: Successful operations
- Error: Failed operations with details
- Warn: Security warnings (invalid signatures, etc.)

## Testing Paystack

**⚠️ WARNING: These test credentials ONLY work in Paystack test mode (test API keys). Never use test cards with production keys.**

Use Paystack test cards in test environment:

**Successful Payment:**
- Card: 4084084084084081
- CVV: 408
- Expiry: Any future date
- PIN: 0000
- OTP: 123456

**Failed Payment:**
- Card: 5060666666666666666
- CVV: Any 3 digits
- Expiry: Any future date

## Production Deployment

1. Set production environment variables
2. Use production Paystack keys
3. Configure webhook URL in Paystack dashboard
4. Enable HTTPS for all endpoints
5. Set up monitoring and alerting
6. Configure backup and disaster recovery

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Email: support@domislink.com
- Documentation: https://docs.domislink.com
