-- Alert system database schema

-- Alert configurations table
CREATE TABLE alert_configs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('REAL_ESTATE', 'FLIGHT_PRICE', 'FLIGHT_STATUS', 'TEACHMASTER', 'SYSTEM')),
  channels TEXT[] NOT NULL,
  criteria JSONB NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('INSTANT', 'HOURLY', 'DAILY', 'WEEKLY')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert usage tracking for billing
CREATE TABLE alert_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM format
  sms INTEGER DEFAULT 0,
  email INTEGER DEFAULT 0,
  telegram INTEGER DEFAULT 0,
  whatsapp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Alert logs for debugging and analytics
CREATE TABLE alert_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_config_id UUID REFERENCES alert_configs(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING')),
  reference TEXT, -- External service reference ID
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert subscriptions for billing
CREATE TABLE alert_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('FREE', 'BASIC', 'PRO', 'PREMIUM')),
  status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED', 'EXPIRED')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price tracking for real estate alerts
CREATE TABLE price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight price tracking
CREATE TABLE flight_price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL, -- "LAG-LHR"
  departure_date DATE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  airline_code TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_alert_configs_user_id ON alert_configs(user_id);
CREATE INDEX idx_alert_configs_type ON alert_configs(type);
CREATE INDEX idx_alert_configs_active ON alert_configs(active);
CREATE INDEX idx_alert_usage_user_month ON alert_usage(user_id, month);
CREATE INDEX idx_alert_logs_user_id ON alert_logs(user_id);
CREATE INDEX idx_alert_logs_created_at ON alert_logs(created_at);
CREATE INDEX idx_price_history_listing_id ON price_history(listing_id);
CREATE INDEX idx_flight_price_history_route_date ON flight_price_history(route, departure_date);

-- Add alert plan to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS alert_plan TEXT DEFAULT 'FREE' CHECK (alert_plan IN ('FREE', 'BASIC', 'PRO', 'PREMIUM'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Functions for automatic triggers
CREATE OR REPLACE FUNCTION notify_price_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into price history
  INSERT INTO price_history (listing_id, price, currency)
  VALUES (NEW.id, NEW.price, NEW.currency);
  
  -- Trigger alert check (would be handled by application)
  PERFORM pg_notify('price_change', json_build_object(
    'listing_id', NEW.id,
    'old_price', OLD.price,
    'new_price', NEW.price,
    'location', NEW.location
  )::text);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for listing price changes
CREATE TRIGGER listing_price_change_trigger
  AFTER UPDATE OF price ON listings
  FOR EACH ROW
  WHEN (OLD.price IS DISTINCT FROM NEW.price)
  EXECUTE FUNCTION notify_price_change();

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  INSERT INTO alert_usage (user_id, month, sms, email, telegram, whatsapp)
  SELECT DISTINCT user_id, to_char(NOW(), 'YYYY-MM'), 0, 0, 0, 0
  FROM users
  WHERE id NOT IN (
    SELECT user_id FROM alert_usage 
    WHERE month = to_char(NOW(), 'YYYY-MM')
  );
END;
$$ LANGUAGE plpgsql;

-- Scheduled job to reset usage monthly (would be handled by cron or application scheduler)
-- SELECT cron.schedule('reset-alert-usage', '0 0 1 * *', 'SELECT reset_monthly_usage();');