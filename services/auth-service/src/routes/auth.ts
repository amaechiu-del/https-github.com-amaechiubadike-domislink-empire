import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // TODO: Implement actual user lookup from database
      // For now, returning a mock response
      
      const token = jwt.sign(
        { userId: 'user-123', email },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const refreshToken = jwt.sign(
        { userId: 'user-123', email, type: 'refresh' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in: ${email}`);

      res.json({
        success: true,
        token,
        refreshToken,
        user: {
          id: 'user-123',
          email,
          name: 'User Name'
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 2 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    try {
      // TODO: Implement actual user creation in database
      const hashedPassword = await bcrypt.hash(password, 10);
      
      logger.info(`New user registered: ${email}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: 'user-new-123',
          email,
          name
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid token
 */
router.post('/verify', (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }

    const newToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
