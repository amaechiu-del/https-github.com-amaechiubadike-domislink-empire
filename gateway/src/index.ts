import express, { Express, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import { authMiddleware } from './middleware/auth';

config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Service URLs
const SERVICES = {
  hub: process.env.HUB_SERVICE_URL || 'http://hub:3000',
  realestate: process.env.REALESTATE_SERVICE_URL || 'http://realestate:3001',
  tickets: process.env.TICKETS_SERVICE_URL || 'http://tickets:3002',
  flightmonitor: process.env.FLIGHTMONITOR_SERVICE_URL || 'http://flightmonitor:3003',
  teachmaster: process.env.TEACHMASTER_SERVICE_URL || 'http://teachmaster:3004',
  admin: process.env.ADMIN_SERVICE_URL || 'http://admin:3005',
  auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:4000',
  payments: process.env.PAYMENTS_SERVICE_URL || 'http://payments-service:4001',
  geolocation: process.env.GEOLOCATION_SERVICE_URL || 'http://geolocation-service:4002',
  notification: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:4003',
};

// Health check aggregator
app.get('/health', async (req: Request, res: Response) => {
  const healthChecks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, url]) => {
      try {
        const axios = require('axios');
        const response = await axios.get(`${url}/api/health`, { timeout: 5000 });
        return { service: name, status: 'healthy', data: response.data };
      } catch (error) {
        return { service: name, status: 'unhealthy', error: (error as Error).message };
      }
    })
  );

  const results = healthChecks.map(result => 
    result.status === 'fulfilled' ? result.value : { status: 'error' }
  );

  const allHealthy = results.every(r => r.status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    gateway: 'healthy',
    services: results,
    timestamp: new Date().toISOString()
  });
});

// Proxy configurations
const proxyOptions = {
  changeOrigin: true,
  onError: (err: Error, req: Request, res: Response) => {
    logger.error('Proxy error:', err);
    res.status(502).json({ error: 'Bad Gateway', message: 'Service unavailable' });
  },
  onProxyReq: (proxyReq: any, req: Request, res: Response) => {
    logger.info(`Proxying ${req.method} ${req.path} to ${proxyReq.path}`);
  }
};

// API Routes - Backend Services
app.use('/api/auth', createProxyMiddleware({
  target: SERVICES.auth,
  ...proxyOptions,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

app.use('/api/payments', authMiddleware, createProxyMiddleware({
  target: SERVICES.payments,
  ...proxyOptions,
  pathRewrite: { '^/api/payments': '/api' }
}));

app.use('/api/geo', createProxyMiddleware({
  target: SERVICES.geolocation,
  ...proxyOptions,
  pathRewrite: { '^/api/geo': '/api' }
}));

app.use('/api/notifications', authMiddleware, createProxyMiddleware({
  target: SERVICES.notification,
  ...proxyOptions,
  pathRewrite: { '^/api/notifications': '/api' }
}));

// Frontend Services Proxies
app.use('/realestate', createProxyMiddleware({
  target: SERVICES.realestate,
  ...proxyOptions,
  pathRewrite: { '^/realestate': '' }
}));

app.use('/tickets', createProxyMiddleware({
  target: SERVICES.tickets,
  ...proxyOptions,
  pathRewrite: { '^/tickets': '' }
}));

app.use('/fm', createProxyMiddleware({
  target: SERVICES.flightmonitor,
  ...proxyOptions,
  pathRewrite: { '^/fm': '' }
}));

app.use('/teachmaster', createProxyMiddleware({
  target: SERVICES.teachmaster,
  ...proxyOptions,
  pathRewrite: { '^/teachmaster': '' }
}));

app.use('/admin', authMiddleware, createProxyMiddleware({
  target: SERVICES.admin,
  ...proxyOptions,
  pathRewrite: { '^/admin': '' }
}));

// Root - Hub Service
app.use('/', createProxyMiddleware({
  target: SERVICES.hub,
  ...proxyOptions
}));

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Gateway error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
  logger.info('Service routes configured:');
  Object.entries(SERVICES).forEach(([name, url]) => {
    logger.info(`  - ${name}: ${url}`);
  });
});

export default app;
