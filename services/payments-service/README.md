# Payments Service

Payments microservice for DomisLink Empire with Paystack integration.

## Features

- Payment initialization
- Payment verification
- Webhook handling
- Transaction history
- Refunds
- Rate limiting
- Health check endpoint

## Endpoints

- `GET /health` - Health check
- `POST /api/payments/initialize` - Initialize payment
- `GET /api/payments/verify/:reference` - Verify payment
- `POST /api/payments/webhook` - Paystack webhook
- `GET /api/payments/transactions` - Get user transactions
- `POST /api/payments/refund` - Process refund

## Deployment

### Render (Recommended)

1. Connect repository to Render
2. Select `services/payments-service` as root directory
3. Add environment variables from `.env.example`
4. Deploy automatically

### Local Development

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.example` for required variables.
