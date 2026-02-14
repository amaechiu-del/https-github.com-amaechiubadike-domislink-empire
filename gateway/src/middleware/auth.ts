import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-service:4000';
    const response = await axios.post(`${authServiceUrl}/api/auth/verify`, {}, {
      headers: {
        Authorization: token
      }
    });

    if (response.data.valid) {
      // Attach user info to request
      (req as any).user = response.data.user;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};
