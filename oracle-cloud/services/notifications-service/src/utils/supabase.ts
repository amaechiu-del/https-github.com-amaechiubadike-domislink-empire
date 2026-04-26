import { createClient } from '@supabase/supabase-js';
import logger from './logger';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
