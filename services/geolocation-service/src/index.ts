import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3102;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'geolocation-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/geo/ip/:ip', async (req: Request, res: Response) => {
  try {
    const { ip } = req.params;
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Geolocation lookup failed' });
  }
});

app.get('/api/geo/currency/:from/:to', async (req: Request, res: Response) => {
  try {
    const { from, to } = req.params;
    // Use free currency API
    const response = await axios.get(
      `https://api.exchangerate-api.com/v4/latest/${from}`
    );
    const rate = response.data.rates[to];
    res.json({ from, to, rate });
  } catch (error) {
    res.status(500).json({ error: 'Currency conversion failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Geolocation Service running on port ${PORT}`);
});

export default app;
