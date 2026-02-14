import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { logger } from './utils/logger';
import authRoutes from './routes/auth';
import healthRoutes from './routes/health';

config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

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
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DomisLink Auth Service API',
      version: '1.0.0',
      description: 'Centralized authentication and authorization service',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

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
  logger.info(`Auth Service running on port ${PORT}`);
  logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

export default app;
