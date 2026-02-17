import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import logger from './logger';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, any>;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer | string;
  }>;
}

class EmailService {
  private transporter: Transporter;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    const useSendGrid = process.env.USE_SENDGRID === 'true';

    if (useSendGrid) {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY,
        },
      });
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ messageId: string; success: boolean }> {
    try {
      let html = options.html;

      if (options.template && options.context) {
        html = await this.renderTemplate(options.template, options.context);
      }

      const from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`;

      const mailOptions = {
        from,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
      });

      return {
        messageId: info.messageId,
        success: true,
      };
    } catch (error) {
      logger.error('Email sending failed', { error, options });
      throw error;
    }
  }

  async sendBulkEmails(emails: EmailOptions[]): Promise<Array<{ messageId?: string; success: boolean; error?: string }>> {
    const results = await Promise.allSettled(
      emails.map(email => this.sendEmail(email))
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

  private async renderTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    try {
      let template = this.templateCache.get(templateName);

      if (!template) {
        const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
        const templateSource = await fs.readFile(templatePath, 'utf-8');
        template = handlebars.compile(templateSource);
        this.templateCache.set(templateName, template);
      }

      return template(context);
    } catch (error) {
      logger.error('Template rendering failed', { error, templateName });
      throw new Error(`Failed to render template: ${templateName}`);
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified');
      return true;
    } catch (error) {
      logger.error('Email service connection failed', { error });
      return false;
    }
  }
}

export default new EmailService();
