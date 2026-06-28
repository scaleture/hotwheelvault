-- ========================================
-- HotWheelVault — Complete DB Migration
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile creation handled in code (AuthProvider) instead of trigger
-- to avoid "Database error saving new user" on sign-up

-- 2. ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- 3. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES addresses(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cod','online')),
  subtotal NUMERIC(10,2) NOT NULL,
  shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- PROFILES: users can read/update their own
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- ADDRESSES: users CRUD their own
CREATE POLICY "addresses_select_own" ON addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "addresses_insert_own" ON addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "addresses_update_own" ON addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "addresses_delete_own" ON addresses FOR DELETE USING (auth.uid() = user_id);

-- ORDERS: users see own, admins see all (via service_role)
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER ITEMS: users see their own via order relationship
CREATE POLICY "order_items_select_own" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );
CREATE POLICY "order_items_insert_own" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ========================================
-- SERVICE ROLE ACCESS (for admin panel)
-- These policies let the service_role key bypass RLS
-- ========================================
CREATE POLICY "profiles_service" ON profiles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "addresses_service" ON addresses FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "orders_service" ON orders FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "order_items_service" ON order_items FOR ALL USING (auth.role() = 'service_role');

-- ========================================
-- PRODUCTS table alterations (if needed)
-- Run if products table already exists without these columns
-- ========================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 99;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
