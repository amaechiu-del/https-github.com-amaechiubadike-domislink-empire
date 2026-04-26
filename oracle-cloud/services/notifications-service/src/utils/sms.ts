import twilio from 'twilio';
import logger from './logger';

interface SMSOptions {
  to: string;
  body: string;
  mediaUrl?: string[];
}

class SMSService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

    if (!accountSid || !authToken || !this.fromNumber) {
      logger.warn('Twilio credentials not configured');
    }

    this.client = twilio(accountSid, authToken);
  }

  async sendSMS(options: SMSOptions): Promise<{ sid: string; success: boolean }> {
    try {
      const message = await this.client.messages.create({
        body: options.body,
        from: this.fromNumber,
        to: options.to,
        mediaUrl: options.mediaUrl,
      });

      logger.info('SMS sent successfully', {
        sid: message.sid,
        to: options.to,
        status: message.status,
      });

      return {
        sid: message.sid,
        success: true,
      };
    } catch (error) {
      logger.error('SMS sending failed', { error, options });
      throw error;
    }
  }

  async sendBulkSMS(messages: SMSOptions[]): Promise<Array<{ sid?: string; success: boolean; error?: string }>> {
    const results = await Promise.allSettled(
      messages.map(msg => this.sendSMS(msg))
    );

    return results.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          success: false,
          error: result.reason?.message || 'Unknown error',
        };
      }
    });
  }

  async getSMSStatus(sid: string): Promise<any> {
    try {
      const message = await this.client.messages(sid).fetch();
      return {
        sid: message.sid,
        status: message.status,
        errorCode: message.errorCode,
        errorMessage: message.errorMessage,
        to: message.to,
        from: message.from,
        dateCreated: message.dateCreated,
        dateSent: message.dateSent,
      };
    } catch (error) {
      logger.error('Failed to fetch SMS status', { error, sid });
      throw error;
    }
  }

  formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('1') && cleaned.length === 11) {
      return `+${cleaned}`;
    } else if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }
}

export default new SMSService();
