import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import geoRoutes from './routes/geo';

const app = express();

let requestCount = 0;
let errorCount = 0;

app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

app.use((req: Request, res: Response, next: NextFunction) => {
  requestCount++;
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
      errorCount++;
    }
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });
  
  next();
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: config.server.serviceName,
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/metrics', (_req: Request, res: Response) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.json({
    service: config.server.serviceName,
    uptime: {
      seconds: uptime,
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
    },
    requests: {
      total: requestCount,
      errors: errorCount,
      errorRate: requestCount > 0 ? ((errorCount / requestCount) * 100).toFixed(2) + '%' : '0%',
    },
    memory: {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    },
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: config.server.serviceName,
    version: '1.0.0',
    description: 'Geolocation service for DomisLink Empire',
    endpoints: {
      health: '/health',
      metrics: '/metrics',
      api: '/api/geo',
    },
  });
});

app.use('/api/geo', geoRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.path,
    },
  });
});

app.use(errorHandler);

const server = app.listen(config.server.port, config.server.host, () => {
  logger.info(`${config.server.serviceName} is running`, {
    host: config.server.host,
    port: config.server.port,
    env: config.server.env,
  });
});

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

export default app;
