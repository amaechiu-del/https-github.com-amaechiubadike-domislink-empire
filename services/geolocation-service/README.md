# geolocation-service

Location detection and currency conversion

## Overview

- **Port**: 4002
- **Tech Stack**: Express.js, TypeScript
- **Purpose**: Location detection and currency conversion

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
docker build -t domislink-geolocation-service:latest .
docker run -p 4002:4002 --env-file .env domislink-geolocation-service:latest
\`\`\`
