# Teachmaster Service

Educational platform with AI tutors

## Overview

- **Port**: 3004
- **Tech Stack**: Next.js 16, React 19
- **Purpose**: Educational platform with AI tutors

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure.

## Health Checks

- `GET /api/health` - Service health check
- `GET /api/ready` - Service readiness check

## Docker

```bash
# Build image
docker build -t domislink-teachmaster:latest .

# Run container
docker run -p 3004:3004 --env-file .env domislink-teachmaster:latest
```
