import { Request } from 'express';

// Extend Express Request to include rawBody for webhook signature verification
export interface RequestWithRawBody extends Request {
  rawBody?: string;
}
