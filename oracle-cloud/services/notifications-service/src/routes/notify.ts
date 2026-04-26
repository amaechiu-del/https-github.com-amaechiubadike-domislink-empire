import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { emailQueue, smsQueue, pushQueue } from '../queue/notifications';
import { emailSchema, smsSchema, pushSchema, bulkEmailSchema, bulkSmsSchema } from '../middleware/validation';
import { supabase } from '../utils/supabase';
import logger from '../utils/logger';

const router = Router();

router.post('/email', async (req: Request, res: Response) => {
  try {
    const { error, value } = emailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const notificationId = uuidv4();

    const job = await emailQueue.add({
      ...value,
      notificationId,
    });

    const { error: dbError } = await supabase.from('notification_logs').insert({
      notification_id: notificationId,
      type: 'email',
      recipient: Array.isArray(value.to) ? value.to.join(',') : value.to,
      status: 'queued',
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      logger.error('Failed to log notification', { error: dbError });
    }

    res.json({
      success: true,
      notificationId,
      jobId: job.id,
      message: 'Email queued for delivery',
    });
  } catch (error: any) {
    logger.error('Email endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to queue email',
    });
  }
});

router.post('/email/bulk', async (req: Request, res: Response) => {
  try {
    const { error, value } = bulkEmailSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const jobs = await Promise.all(
      value.emails.map(async (email: any) => {
        const notificationId = uuidv4();
        const job = await emailQueue.add({
          ...email,
          notificationId,
        });

        await supabase.from('notification_logs').insert({
          notification_id: notificationId,
          type: 'email',
          recipient: Array.isArray(email.to) ? email.to.join(',') : email.to,
          status: 'queued',
          created_at: new Date().toISOString(),
        });

        return { notificationId, jobId: job.id };
      })
    );

    res.json({
      success: true,
      count: jobs.length,
      jobs,
      message: 'Bulk emails queued for delivery',
    });
  } catch (error: any) {
    logger.error('Bulk email endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to queue bulk emails',
    });
  }
});

router.post('/sms', async (req: Request, res: Response) => {
  try {
    const { error, value } = smsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const notificationId = uuidv4();

    const job = await smsQueue.add({
      ...value,
      notificationId,
    });

    const { error: dbError } = await supabase.from('notification_logs').insert({
      notification_id: notificationId,
      type: 'sms',
      recipient: value.to,
      status: 'queued',
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      logger.error('Failed to log notification', { error: dbError });
    }

    res.json({
      success: true,
      notificationId,
      jobId: job.id,
      message: 'SMS queued for delivery',
    });
  } catch (error: any) {
    logger.error('SMS endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to queue SMS',
    });
  }
});

router.post('/sms/bulk', async (req: Request, res: Response) => {
  try {
    const { error, value } = bulkSmsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const jobs = await Promise.all(
      value.messages.map(async (sms: any) => {
        const notificationId = uuidv4();
        const job = await smsQueue.add({
          ...sms,
          notificationId,
        });

        await supabase.from('notification_logs').insert({
          notification_id: notificationId,
          type: 'sms',
          recipient: sms.to,
          status: 'queued',
          created_at: new Date().toISOString(),
        });

        return { notificationId, jobId: job.id };
      })
    );

    res.json({
      success: true,
      count: jobs.length,
      jobs,
      message: 'Bulk SMS queued for delivery',
    });
  } catch (error: any) {
    logger.error('Bulk SMS endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to queue bulk SMS',
    });
  }
});

router.post('/push', async (req: Request, res: Response) => {
  try {
    const { error, value } = pushSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const notificationId = uuidv4();

    const job = await pushQueue.add({
      ...value,
      notificationId,
    });

    const { error: dbError } = await supabase.from('notification_logs').insert({
      notification_id: notificationId,
      type: 'push',
      recipient: Array.isArray(value.token) ? value.token.join(',') : value.token,
      status: 'queued',
      created_at: new Date().toISOString(),
    });

    if (dbError) {
      logger.error('Failed to log notification', { error: dbError });
    }

    res.json({
      success: true,
      notificationId,
      jobId: job.id,
      message: 'Push notification queued for delivery',
    });
  } catch (error: any) {
    logger.error('Push notification endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to queue push notification',
    });
  }
});

router.get('/status/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('notification_logs')
      .select('*')
      .eq('notification_id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    res.json({
      success: true,
      notification: data,
    });
  } catch (error: any) {
    logger.error('Status endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch notification status',
    });
  }
});

router.get('/history', async (req: Request, res: Response) => {
  try {
    const { type, status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('notification_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      notifications: data,
      total: count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error: any) {
    logger.error('History endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch notification history',
    });
  }
});

router.get('/queue/stats', async (req: Request, res: Response) => {
  try {
    const [emailStats, smsStats, pushStats] = await Promise.all([
      Promise.all([
        emailQueue.getJobCounts(),
        emailQueue.getWaiting(),
        emailQueue.getActive(),
        emailQueue.getCompleted(),
        emailQueue.getFailed(),
      ]),
      Promise.all([
        smsQueue.getJobCounts(),
        smsQueue.getWaiting(),
        smsQueue.getActive(),
        smsQueue.getCompleted(),
        smsQueue.getFailed(),
      ]),
      Promise.all([
        pushQueue.getJobCounts(),
        pushQueue.getWaiting(),
        pushQueue.getActive(),
        pushQueue.getCompleted(),
        pushQueue.getFailed(),
      ]),
    ]);

    res.json({
      success: true,
      queues: {
        email: {
          counts: emailStats[0],
          waiting: emailStats[1].length,
          active: emailStats[2].length,
          completed: emailStats[3].length,
          failed: emailStats[4].length,
        },
        sms: {
          counts: smsStats[0],
          waiting: smsStats[1].length,
          active: smsStats[2].length,
          completed: smsStats[3].length,
          failed: smsStats[4].length,
        },
        push: {
          counts: pushStats[0],
          waiting: pushStats[1].length,
          active: pushStats[2].length,
          completed: pushStats[3].length,
          failed: pushStats[4].length,
        },
      },
    });
  } catch (error: any) {
    logger.error('Queue stats endpoint error', { error });
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch queue stats',
    });
  }
});

export default router;
