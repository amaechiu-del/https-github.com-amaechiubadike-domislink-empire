# Authentication Service

Centralized authentication and authorization service for DomisLink Empire.

## Overview

- **Port**: 4000
- **Tech Stack**: Express.js, TypeScript, JWT
- **Purpose**: Handle user authentication, token generation, and authorization

## Features

- User registration and login
- JWT token generation and validation
- Refresh token mechanism
- Password hashing with bcrypt
- Rate limiting
- Input validation
- Swagger API documentation

## Development

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Service port (default: 4000)
- `JWT_SECRET` - Secret key for JWT signing
- `DATABASE_URL` - PostgreSQL connection string
- `ALLOWED_ORIGINS` - CORS allowed origins

## API Documentation

Once the service is running, visit:
- Swagger UI: `http://localhost:4000/api-docs`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify` - Verify JWT token
- `POST /api/auth/refresh` - Refresh access token

### Health Checks
- `GET /api/health` - Service health check
- `GET /api/health/ready` - Service readiness check

## Docker

```bash
# Build image
docker build -t domislink-auth-service:latest .

# Run container
docker run -p 4000:4000 --env-file .env domislink-auth-service:latest
```

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation and sanitization
- Password hashing
- JWT token expiration

## TODO

- [ ] Implement database connection
- [ ] Add OAuth providers (Google, Facebook)
- [ ] Implement password reset flow
- [ ] Add email verification
- [ ] Implement role-based access control (RBAC)
- [ ] Add audit logging
- [ ] Implement account lockout after failed attempts
