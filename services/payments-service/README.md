# payments-service

Payment processing and wallet management

## Overview

- **Port**: 4001
- **Tech Stack**: Express.js, TypeScript
- **Purpose**: Payment processing and wallet management

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
docker build -t domislink-payments-service:latest .
docker run -p 4001:4001 --env-file .env domislink-payments-service:latest
\`\`\`
