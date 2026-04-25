# API Gateway

Cloudflare Workers-based API Gateway for DomisLink Empire microservices.

## Features

- Routes requests to backend services
- Rate limiting (100 requests per 15 minutes per IP)
- CORS handling
- Health check endpoint
- Error handling and retry logic
- Zero cost (100,000 requests/day free)

## Routing

- `/api/auth/*` → Auth Service (Railway)
- `/api/payments/*` → Payments Service (Render)
- `/api/geo/*` → Geolocation Service (Fly.io)
- `/api/notify/*` → Notifications Service (Deta)

## Deployment

### Prerequisites

1. Cloudflare account
2. Wrangler CLI installed (`npm install -g wrangler`)
3. Create KV namespace for rate limiting

### Steps

```bash
# Login to Cloudflare
wrangler login

# Create KV namespace
wrangler kv:namespace create "RATE_LIMIT_KV"

# Update wrangler.toml with KV namespace ID

# Deploy
npm run deploy
```

### Custom Domain

1. Go to Cloudflare Dashboard → Workers
2. Select your worker
3. Add custom domain: `api.domislink.com`

## Local Development

```bash
npm run dev
```

Access at: `http://localhost:8787`

## Monitoring

View logs in real-time:

```bash
npm run tail
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Uses Cloudflare KV for storage
- Returns 429 status when exceeded
