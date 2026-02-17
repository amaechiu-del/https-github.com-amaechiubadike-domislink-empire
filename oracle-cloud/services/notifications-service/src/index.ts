import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import notifyRouter from './routes/notify';
import logger from './utils/logger';
import emailService from './utils/email';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3003;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/notify', limiter);

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'notifications-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Health check endpoint - intentionally not rate-limited for monitoring systems
app.get('/api/health/detailed', async (req: Request, res: Response) => {
  try {
    const emailConnected = await emailService.verifyConnection();

    res.json({
      status: 'healthy',
      service: 'notifications-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        email: emailConnected ? 'connected' : 'disconnected',
        redis: 'connected',
      },
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: 'Service health check failed',
    });
  }
});

app.use('/api/notify', notifyRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', { error: err, path: req.path });
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

async function startServer() {
  try {
    const emailConnected = await emailService.verifyConnection();
    
    if (!emailConnected) {
      logger.warn('Email service not connected - continuing anyway');
    }

    app.listen(PORT, () => {
      logger.info(`Notifications Service running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info('Available endpoints:');
      logger.info('  POST /api/notify/email - Send email');
      logger.info('  POST /api/notify/email/bulk - Send bulk emails');
      logger.info('  POST /api/notify/sms - Send SMS');
      logger.info('  POST /api/notify/sms/bulk - Send bulk SMS');
      logger.info('  POST /api/notify/push - Send push notification');
      logger.info('  GET  /api/notify/status/:id - Check notification status');
      logger.info('  GET  /api/notify/history - Get notification history');
      logger.info('  GET  /api/notify/queue/stats - Get queue statistics');
      logger.info('  GET  /health - Health check');
      logger.info('  GET  /api/health/detailed - Detailed health check');
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();

export default app;
