import axios, { AxiosInstance, AxiosError } from 'axios';
import crypto from 'crypto';
import { logger } from '../index';

export interface PaystackInitializeData {
  email: string;
  amount: number;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: string[];
}

export interface PaystackResponse<T = any> {
  status: boolean;
  message: string;
  data?: T;
}

export interface PaystackTransaction {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string | null;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: Record<string, any>;
  fees: number;
  customer: {
    id: number;
    email: string;
    customer_code: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    account_name: string | null;
  };
}

class PaystackAPI {
  private client: AxiosInstance;
  private secretKey: string;
  private webhookSecret: string;

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
    this.webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET || '';

    if (!this.secretKey) {
      logger.error('PAYSTACK_SECRET_KEY is not set');
    }

    this.client = axios.create({
      baseURL: 'https://api.paystack.co',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Initialize a payment transaction
   */
  async initializeTransaction(data: PaystackInitializeData): Promise<PaystackResponse> {
    try {
      // Convert amount to kobo (Paystack uses kobo)
      const amountInKobo = Math.round(data.amount * 100);

      const payload = {
        email: data.email,
        amount: amountInKobo,
        reference: data.reference || this.generateReference(),
        callback_url: data.callback_url || process.env.PAYMENT_CALLBACK_URL,
        metadata: data.metadata || {},
        currency: data.currency || 'NGN',
        channels: data.channels || ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      };

      logger.info(`Initializing payment: ${payload.reference}`);
      const response = await this.client.post('/transaction/initialize', payload);

      return response.data;
    } catch (error) {
      return this.handleError(error, 'initializeTransaction');
    }
  }

  /**
   * Verify a transaction
   */
  async verifyTransaction(reference: string): Promise<PaystackResponse<PaystackTransaction>> {
    try {
      logger.info(`Verifying transaction: ${reference}`);
      const response = await this.client.get(`/transaction/verify/${reference}`);

      return response.data;
    } catch (error) {
      return this.handleError(error, 'verifyTransaction');
    }
  }

  /**
   * List transactions with pagination
   */
  async listTransactions(params?: {
    perPage?: number;
    page?: number;
    customer?: string;
    status?: string;
    from?: string;
    to?: string;
    amount?: number;
  }): Promise<PaystackResponse> {
    try {
      const response = await this.client.get('/transaction', { params });
      return response.data;
    } catch (error) {
      return this.handleError(error, 'listTransactions');
    }
  }

  /**
   * Fetch a single transaction
   */
  async fetchTransaction(id: number): Promise<PaystackResponse<PaystackTransaction>> {
    try {
      const response = await this.client.get(`/transaction/${id}`);
      return response.data;
    } catch (error) {
      return this.handleError(error, 'fetchTransaction');
    }
  }

  /**
   * Initiate a refund
   */
  async refundTransaction(reference: string, amount?: number, currency: string = 'NGN'): Promise<PaystackResponse> {
    try {
      const payload: any = { transaction: reference, currency };
      
      if (amount) {
        // Convert amount to kobo
        payload.amount = Math.round(amount * 100);
      }

      logger.info(`Initiating refund for transaction: ${reference}`);
      const response = await this.client.post('/refund', payload);

      return response.data;
    } catch (error) {
      return this.handleError(error, 'refundTransaction');
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.webhookSecret)
      .update(payload)
      .digest('hex');

    return hash === signature;
  }

  /**
   * Generate a unique transaction reference
   */
  generateReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `DML-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Handle API errors
   */
  private handleError(error: unknown, method: string): PaystackResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;
      logger.error(`Paystack API error in ${method}:`, {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });

      return {
        status: false,
        message: axiosError.response?.data?.message || axiosError.message,
        data: axiosError.response?.data,
      };
    }

    logger.error(`Unknown error in ${method}:`, error);
    return {
      status: false,
      message: 'An unexpected error occurred',
    };
  }
}

// Export singleton instance
export const paystackAPI = new PaystackAPI();
