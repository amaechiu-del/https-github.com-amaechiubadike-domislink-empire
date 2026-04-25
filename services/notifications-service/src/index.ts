import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3103;
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'notifications-service',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/notify/email', async (req: Request, res: Response) => {
  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await resend.emails.send({
      from: 'DomisLink <noreply@domislink.com>',
      to,
      subject,
      html
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Email sent', id: data?.id });
  } catch (error: any) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/notify/sms', async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    // Implement SMS sending (e.g., Twilio)
    res.json({ message: 'SMS sent (not implemented)' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Notifications Service running on port ${PORT}`);
});

export default app;
