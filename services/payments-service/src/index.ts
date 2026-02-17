import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3101;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// Paystack configuration
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'payments-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Initialize payment
app.post('/api/payments/initialize', async (req: Request, res: Response) => {
  try {
    const { email, amount, metadata } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: 'Email and amount are required' });
    }

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert to kobo
        metadata
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Save transaction to database
    await supabase.from('transactions').insert({
      reference: response.data.data.reference,
      email,
      amount,
      status: 'pending',
      metadata
    });

    res.json({
      message: 'Payment initialized',
      data: response.data.data
    });
  } catch (error: any) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      error: 'Failed to initialize payment',
      details: error.response?.data || error.message
    });
  }
});

// Verify payment
app.get('/api/payments/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { data } = response.data;

    // Update transaction in database
    await supabase
      .from('transactions')
      .update({
        status: data.status,
        paid_at: data.paid_at,
        channel: data.channel
      })
      .eq('reference', reference);

    res.json({
      message: 'Payment verified',
      data
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error.response?.data || error.message
    });
  }
});

// Webhook handler
app.post('/api/payments/webhook', async (req: Request, res: Response) => {
  try {
    const hash = req.headers['x-paystack-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ error: 'Paystack secret key not configured' });
    }

    const expectedHash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== expectedHash) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const { event, data } = req.body;

    // Handle different events
    if (event === 'charge.success') {
      await supabase
        .from('transactions')
        .update({
          status: 'success',
          paid_at: data.paid_at
        })
        .eq('reference', data.reference);
    }

    res.json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get user transactions
app.get('/api/payments/transactions', async (req: Request, res: Response) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ transactions: data });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Payments Service running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

export default app;
