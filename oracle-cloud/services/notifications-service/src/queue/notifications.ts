import Bull from 'bull';
import Redis from 'ioredis';
import emailService from '../utils/email';
import smsService from '../utils/sms';
import pushService from '../utils/push';
import logger from '../utils/logger';
import { supabase } from '../utils/supabase';

const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

export const emailQueue = new Bull('email-notifications', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: parseInt(process.env.QUEUE_RETRY_ATTEMPTS || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.QUEUE_RETRY_DELAY || '5000'),
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const smsQueue = new Bull('sms-notifications', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: parseInt(process.env.QUEUE_RETRY_ATTEMPTS || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.QUEUE_RETRY_DELAY || '5000'),
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

export const pushQueue = new Bull('push-notifications', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: parseInt(process.env.QUEUE_RETRY_ATTEMPTS || '3'),
    backoff: {
      type: 'exponential',
      delay: parseInt(process.env.QUEUE_RETRY_DELAY || '5000'),
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

emailQueue.process(async (job) => {
  logger.info('Processing email job', { jobId: job.id, data: job.data });

  try {
    const result = await emailService.sendEmail(job.data);

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'email',
      recipient: Array.isArray(job.data.to) ? job.data.to.join(',') : job.data.to,
      status: 'sent',
      message_id: result.messageId,
      sent_at: new Date().toISOString(),
    });

    return result;
  } catch (error: any) {
    logger.error('Email job failed', { jobId: job.id, error });

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'email',
      recipient: Array.isArray(job.data.to) ? job.data.to.join(',') : job.data.to,
      status: 'failed',
      error_message: error.message,
      sent_at: new Date().toISOString(),
    });

    throw error;
  }
});

smsQueue.process(async (job) => {
  logger.info('Processing SMS job', { jobId: job.id, data: job.data });

  try {
    const result = await smsService.sendSMS(job.data);

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'sms',
      recipient: job.data.to,
      status: 'sent',
      message_id: result.sid,
      sent_at: new Date().toISOString(),
    });

    return result;
  } catch (error: any) {
    logger.error('SMS job failed', { jobId: job.id, error });

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'sms',
      recipient: job.data.to,
      status: 'failed',
      error_message: error.message,
      sent_at: new Date().toISOString(),
    });

    throw error;
  }
});

pushQueue.process(async (job) => {
  logger.info('Processing push notification job', { jobId: job.id, data: job.data });

  try {
    const result = await pushService.sendPushNotification(job.data);

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'push',
      recipient: Array.isArray(job.data.token) ? job.data.token.join(',') : job.data.token,
      status: 'sent',
      message_id: result.messageId,
      sent_at: new Date().toISOString(),
    });

    return result;
  } catch (error: any) {
    logger.error('Push notification job failed', { jobId: job.id, error });

    await supabase.from('notification_logs').insert({
      notification_id: job.data.notificationId,
      type: 'push',
      recipient: Array.isArray(job.data.token) ? job.data.token.join(',') : job.data.token,
      status: 'failed',
      error_message: error.message,
      sent_at: new Date().toISOString(),
    });

    throw error;
  }
});

emailQueue.on('completed', (job, result) => {
  logger.info('Email job completed', { jobId: job.id, result });
});

emailQueue.on('failed', (job, err) => {
  logger.error('Email job failed', { jobId: job?.id, error: err });
});

smsQueue.on('completed', (job, result) => {
  logger.info('SMS job completed', { jobId: job.id, result });
});

smsQueue.on('failed', (job, err) => {
  logger.error('SMS job failed', { jobId: job?.id, error: err });
});

pushQueue.on('completed', (job, result) => {
  logger.info('Push notification job completed', { jobId: job.id, result });
});

pushQueue.on('failed', (job, err) => {
  logger.error('Push notification job failed', { jobId: job?.id, error: err });
});
