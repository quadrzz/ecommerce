CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read user_roles" ON user_roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to update own role" ON user_roles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Allow service role to manage user_roles" ON user_roles FOR ALL USING (auth.role() = 'service_role');

INSERT INTO user_roles (user_id, role) 
SELECT id, 'admin' 
FROM auth.users 
WHERE email = 'quadrzzbusiness@gmail.com';