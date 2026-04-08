CREATE TABLE IF NOT EXISTS email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  coupon_used TEXT,
  source TEXT DEFAULT 'popup',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts so visitors can submit emails
CREATE POLICY "Allow anonymous inserts to email_leads" ON email_leads FOR INSERT WITH CHECK (true);

-- Allow authenticated users (admin) to view leads
CREATE POLICY "Allow admin select on email_leads" ON email_leads FOR SELECT USING (auth.role() = 'authenticated');
