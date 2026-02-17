import admin from 'firebase-admin';
import logger from './logger';

interface PushNotificationOptions {
  token: string | string[];
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
  icon?: string;
  clickAction?: string;
}

class PushNotificationService {
  private initialized = false;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

      if (!projectId || !privateKey || !clientEmail) {
        logger.warn('Firebase credentials not configured');
        return;
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey,
          clientEmail,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      this.initialized = true;
      logger.info('Firebase initialized successfully');
    } catch (error) {
      logger.error('Firebase initialization failed', { error });
    }
  }

  async sendPushNotification(options: PushNotificationOptions): Promise<{ success: boolean; messageId?: string }> {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      const message: admin.messaging.Message = {
        notification: {
          title: options.title,
          body: options.body,
          imageUrl: options.imageUrl,
        },
        data: options.data,
        token: Array.isArray(options.token) ? options.token[0] : options.token,
        webpush: options.clickAction ? {
          fcmOptions: {
            link: options.clickAction,
          },
        } : undefined,
      };

      const messageId = await admin.messaging().send(message);

      logger.info('Push notification sent successfully', {
        messageId,
        title: options.title,
      });

      return {
        success: true,
        messageId,
      };
    } catch (error) {
      logger.error('Push notification failed', { error, options });
      throw error;
    }
  }

  async sendMulticastPushNotification(
    tokens: string[],
    options: Omit<PushNotificationOptions, 'token'>
  ): Promise<{ successCount: number; failureCount: number; responses: any[] }> {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: options.title,
          body: options.body,
          imageUrl: options.imageUrl,
        },
        data: options.data,
        tokens,
        webpush: options.clickAction ? {
          fcmOptions: {
            link: options.clickAction,
          },
        } : undefined,
      };

      const response = await admin.messaging().sendMulticast(message);

      logger.info('Multicast push notification sent', {
        successCount: response.successCount,
        failureCount: response.failureCount,
      });

      return response;
    } catch (error) {
      logger.error('Multicast push notification failed', { error, options });
      throw error;
    }
  }

  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      await admin.messaging().subscribeToTopic(tokens, topic);
      logger.info('Subscribed to topic', { topic, tokenCount: tokens.length });
    } catch (error) {
      logger.error('Failed to subscribe to topic', { error, topic });
      throw error;
    }
  }

  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    if (!this.initialized) {
      throw new Error('Firebase not initialized');
    }

    try {
      await admin.messaging().unsubscribeFromTopic(tokens, topic);
      logger.info('Unsubscribed from topic', { topic, tokenCount: tokens.length });
    } catch (error) {
      logger.error('Failed to unsubscribe from topic', { error, topic });
      throw error;
    }
  }
}

export default new PushNotificationService();
