# Auth Service

Authentication microservice for DomisLink Empire.

## Features

- User registration and login
- JWT token management
- Session refresh
- User profile retrieval
- Rate limiting
- CORS protection
- Health check endpoint

## Endpoints

- `GET /health` - Health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user
- `POST /api/auth/refresh` - Refresh access token

## Deployment

### Railway (Recommended)

1. Connect repository to Railway
2. Select `services/auth-service` as root directory
3. Add environment variables from `.env.example`
4. Deploy automatically

### Local Development

```bash
npm install
npm run dev
```

## Environment Variables

See `.env.example` for required variables.
