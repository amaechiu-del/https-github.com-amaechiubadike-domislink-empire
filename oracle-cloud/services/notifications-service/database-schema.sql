-- Notifications Service Database Schema
-- Run this in your Supabase SQL editor

-- Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'sent', 'failed', 'delivered', 'bounced')),
  message_id TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notification_logs_notification_id ON notification_logs(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification_logs(recipient);

-- Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  subject TEXT,
  body TEXT NOT NULL,
  html_body TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Create index on template name
CREATE INDEX IF NOT EXISTS idx_notification_templates_name ON notification_templates(name);
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(type);
CREATE INDEX IF NOT EXISTS idx_notification_templates_is_active ON notification_templates(is_active);

-- Create notification_preferences table (user notification settings)
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  email_address TEXT,
  phone_number TEXT,
  fcm_token TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_email_enabled ON notification_preferences(email_enabled);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_sms_enabled ON notification_preferences(sms_enabled);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_push_enabled ON notification_preferences(push_enabled);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_notification_logs_updated_at
    BEFORE UPDATE ON notification_logs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
    BEFORE UPDATE ON notification_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default email templates
INSERT INTO notification_templates (name, type, subject, html_body, variables) VALUES
('welcome', 'email', 'Welcome to {{appName}}', 
'<h1>Welcome {{userName}}!</h1><p>Thank you for joining {{appName}}.</p>',
'{"userName": "string", "appName": "string"}'::jsonb),

('verify-email', 'email', 'Verify your email address', 
'<h1>Verify Your Email</h1><p>Your verification code is: <strong>{{verificationCode}}</strong></p>',
'{"userName": "string", "verificationCode": "string", "verificationUrl": "string"}'::jsonb),

('reset-password', 'email', 'Reset your password', 
'<h1>Password Reset</h1><p>Click the link below to reset your password:</p><p><a href="{{resetUrl}}">Reset Password</a></p>',
'{"userName": "string", "resetCode": "string", "resetUrl": "string"}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Create RLS policies (optional - adjust based on your security requirements)
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything
CREATE POLICY "Service role can do everything on notification_logs"
  ON notification_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on notification_templates"
  ON notification_templates
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on notification_preferences"
  ON notification_preferences
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to view their own notification preferences
CREATE POLICY "Users can view their own notification preferences"
  ON notification_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to update their own notification preferences
CREATE POLICY "Users can update their own notification preferences"
  ON notification_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create view for notification statistics
CREATE OR REPLACE VIEW notification_stats AS
SELECT 
  type,
  status,
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as count
FROM notification_logs
GROUP BY type, status, DATE_TRUNC('day', created_at)
ORDER BY date DESC, type, status;

-- Grant access to the view
GRANT SELECT ON notification_stats TO service_role;
GRANT SELECT ON notification_stats TO authenticated;

COMMENT ON TABLE notification_logs IS 'Stores logs of all notifications sent through the service';
COMMENT ON TABLE notification_templates IS 'Stores reusable notification templates';
COMMENT ON TABLE notification_preferences IS 'Stores user notification preferences and contact information';
COMMENT ON VIEW notification_stats IS 'Provides aggregated statistics for notifications';
