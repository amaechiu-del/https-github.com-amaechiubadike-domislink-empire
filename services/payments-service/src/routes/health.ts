import { Router, Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'payments-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /api/ready:
 *   get:
 *     summary: Readiness check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 */
router.get('/ready', (req: Request, res: Response) => {
  // Add database connection check here
  res.json({
    status: 'ready',
    service: 'payments-service',
    timestamp: new Date().toISOString()
  });
});

export default router;
