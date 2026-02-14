# notification-service

Email, SMS, and push notifications

## Overview

- **Port**: 4003
- **Tech Stack**: Express.js, TypeScript
- **Purpose**: Email, SMS, and push notifications

## Development

\`\`\`bash
npm install
npm run dev
npm run build
npm start
\`\`\`

## Environment Variables

See \`.env.example\`

## API Endpoints

- \`GET /api/health\` - Health check
- \`GET /api/health/ready\` - Readiness check

## Docker

\`\`\`bash
docker build -t domislink-notification-service:latest .
docker run -p 4003:4003 --env-file .env domislink-notification-service:latest
\`\`\`
