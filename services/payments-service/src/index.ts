import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger';
import healthRoutes from './routes/health';

config();

const app: Express = express();
const PORT = process.env.PORT || 4001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Routes
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`payments-service running on port ${PORT}`);
});

export default app;
