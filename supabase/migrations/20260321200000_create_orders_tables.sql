-- Create status enum
DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'paid', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_email TEXT NOT NULL,
    customer_name TEXT,
    total_amount NUMERIC NOT NULL,
    status order_status DEFAULT 'pending',
    payment_method TEXT,
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow insert for anyone, select for admin or authenticated)
CREATE POLICY "Allow anonymous inserts to orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts to order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow select for authenticated users" ON orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow select for authenticated users on order_items" ON order_items FOR SELECT USING (auth.role() = 'authenticated');
