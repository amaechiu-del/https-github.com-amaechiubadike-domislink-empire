import { Router, Request, Response } from 'express';
import Joi from 'joi';
import { supabase, logger } from '../index';
import { paystackAPI, PaystackTransaction } from '../utils/paystack';

const router = Router();

// Validation schemas
const initializePaymentSchema = Joi.object({
  email: Joi.string().email().required(),
  amount: Joi.number().positive().required(),
  reference: Joi.string().optional(),
  metadata: Joi.object().optional(),
  currency: Joi.string().valid('NGN', 'USD', 'GHS', 'ZAR', 'KES').default('NGN'),
  callback_url: Joi.string().uri().optional(),
});

const refundSchema = Joi.object({
  reference: Joi.string().required(),
  amount: Joi.number().positive().optional(),
  currency: Joi.string().valid('NGN', 'USD', 'GHS', 'ZAR', 'KES').default('NGN'),
  reason: Joi.string().max(500).optional(),
});

/**
 * POST /api/payments/initialize
 * Initialize a new payment transaction
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = initializePaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }

    // Get user from auth header (if available)
    const authHeader = req.headers.authorization;
    let userId: string | null = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        userId = user.id;
      }
    }

    // Initialize payment with Paystack
    const paystackResponse = await paystackAPI.initializeTransaction({
      email: value.email,
      amount: value.amount,
      reference: value.reference,
      callback_url: value.callback_url,
      metadata: {
        ...value.metadata,
        user_id: userId,
      },
      currency: value.currency,
    });

    if (!paystackResponse.status) {
      logger.error('Failed to initialize payment:', paystackResponse.message);
      return res.status(400).json({
        success: false,
        message: paystackResponse.message || 'Failed to initialize payment',
      });
    }

    // Store transaction in database
    const { error: dbError } = await supabase
      .from('transactions')
      .insert({
        reference: paystackResponse.data.reference,
        user_id: userId,
        email: value.email,
        amount: value.amount,
        currency: value.currency,
        status: 'pending',
        metadata: value.metadata,
        paystack_access_code: paystackResponse.data.access_code,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      logger.error('Failed to store transaction:', dbError);
    }

    logger.info(`Payment initialized: ${paystackResponse.data.reference}`);

    return res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
      },
    });
  } catch (err: any) {
    logger.error('Initialize payment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/payments/verify/:reference
 * Verify a payment transaction
 */
router.get('/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Transaction reference is required',
      });
    }

    // Verify with Paystack
    const paystackResponse = await paystackAPI.verifyTransaction(reference);

    if (!paystackResponse.status) {
      return res.status(400).json({
        success: false,
        message: paystackResponse.message || 'Failed to verify payment',
      });
    }

    const transaction = paystackResponse.data as PaystackTransaction;

    // Update transaction in database
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: transaction.status,
        paid_at: transaction.paid_at,
        channel: transaction.channel,
        ip_address: transaction.ip_address,
        fees: transaction.fees / 100, // Convert from kobo
        gateway_response: transaction.gateway_response,
        updated_at: new Date().toISOString(),
      })
      .eq('reference', reference);

    if (updateError) {
      logger.error('Failed to update transaction:', updateError);
    }

    logger.info(`Payment verified: ${reference} - Status: ${transaction.status}`);

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        reference: transaction.reference,
        amount: transaction.amount / 100, // Convert from kobo
        currency: transaction.currency,
        status: transaction.status,
        paid_at: transaction.paid_at,
        channel: transaction.channel,
        customer: transaction.customer,
      },
    });
  } catch (err: any) {
    logger.error('Verify payment error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * POST /api/payments/webhook
 * Handle Paystack webhook events
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-paystack-signature'] as string;

    if (!signature) {
      logger.warn('Webhook received without signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    // Get raw body from middleware
    const rawBody = (req as any).rawBody;
    
    if (!rawBody) {
      logger.error('Raw body not available for webhook verification');
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }
    
    // Verify webhook signature using raw body
    const isValid = paystackAPI.verifyWebhookSignature(rawBody, signature);

    if (!isValid) {
      logger.warn('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    const event = req.body;
    logger.info(`Webhook received: ${event.event}`);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'charge.failed':
        await handleChargeFailed(event.data);
        break;

      case 'transfer.success':
      case 'transfer.failed':
        await handleTransferEvent(event.event, event.data);
        break;

      default:
        logger.info(`Unhandled webhook event: ${event.event}`);
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    logger.error('Webhook error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * GET /api/payments/transactions
 * Get user transactions with pagination
 */
router.get('/transactions', async (req: Request, res: Response) => {
  try {
    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Query transactions
    const { data: transactions, error: queryError, count } = await supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (queryError) {
      logger.error('Failed to fetch transactions:', queryError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch transactions',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    });
  } catch (err: any) {
    logger.error('Get transactions error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

/**
 * POST /api/payments/refund
 * Process a refund
 */
router.post('/refund', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const { error, value } = refundSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(d => d.message),
      });
    }

    // Get user from auth header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Check if transaction exists and belongs to user
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('reference', value.reference)
      .eq('user_id', user.id)
      .single();

    if (txError || !transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    if (transaction.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Only successful transactions can be refunded',
      });
    }

    // Process refund with Paystack
    const paystackResponse = await paystackAPI.refundTransaction(
      value.reference,
      value.amount,
      value.currency
    );

    if (!paystackResponse.status) {
      logger.error('Failed to process refund:', paystackResponse.message);
      return res.status(400).json({
        success: false,
        message: paystackResponse.message || 'Failed to process refund',
      });
    }

    // Update transaction status
    const { error: updateError } = await supabase
      .from('transactions')
      .update({
        status: 'refunded',
        refund_reason: value.reason,
        refunded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('reference', value.reference);

    if (updateError) {
      logger.error('Failed to update refund status:', updateError);
    }

    logger.info(`Refund processed: ${value.reference}`);

    return res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: paystackResponse.data,
    });
  } catch (err: any) {
    logger.error('Refund error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Webhook event handlers
async function handleChargeSuccess(data: PaystackTransaction) {
  try {
    logger.info(`Charge success: ${data.reference}`);

    await supabase
      .from('transactions')
      .update({
        status: 'success',
        paid_at: data.paid_at,
        channel: data.channel,
        ip_address: data.ip_address,
        fees: data.fees / 100,
        gateway_response: data.gateway_response,
        updated_at: new Date().toISOString(),
      })
      .eq('reference', data.reference);
  } catch (err) {
    logger.error('Error handling charge success:', err);
  }
}

async function handleChargeFailed(data: PaystackTransaction) {
  try {
    logger.info(`Charge failed: ${data.reference}`);

    await supabase
      .from('transactions')
      .update({
        status: 'failed',
        gateway_response: data.gateway_response,
        updated_at: new Date().toISOString(),
      })
      .eq('reference', data.reference);
  } catch (err) {
    logger.error('Error handling charge failed:', err);
  }
}

async function handleTransferEvent(event: string, data: any) {
  try {
    logger.info(`Transfer event: ${event}`, data);
    // Handle transfer events if needed
  } catch (err) {
    logger.error('Error handling transfer event:', err);
  }
}

export default router;
