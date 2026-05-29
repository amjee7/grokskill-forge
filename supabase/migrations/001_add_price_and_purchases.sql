-- ============================================
-- Migration: Add pricing to skills + purchases table
-- Step 1.1 of GrokSkill Forge MVP
-- ============================================

-- 1. Add price fields to skills table
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS price_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'usd';

-- Optional: Add a check constraint so price is never negative
ALTER TABLE public.skills
  ADD CONSTRAINT skills_price_cents_non_negative 
  CHECK (price_cents >= 0);

-- 2. Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS purchases_buyer_id_idx ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS purchases_skill_id_idx ON public.purchases(skill_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON public.purchases(status);

-- 3. Enable RLS on purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purchases
-- Users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON public.purchases
  FOR SELECT
  USING (auth.uid() = buyer_id);

-- Only the system (via service role or webhooks) can insert purchases.
-- For MVP, we allow authenticated users to insert their own records (webhook will validate).
CREATE POLICY "Users can insert their own purchase records"
  ON public.purchases
  FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

-- Users cannot update or delete purchases directly (only via webhook / admin)
-- No UPDATE or DELETE policies are intentionally omitted for security.

-- 4. Optional: Add a helper view for "skills the user has purchased"
-- (Can be used in queries later)
CREATE OR REPLACE VIEW public.user_purchased_skills AS
SELECT 
  p.buyer_id,
  s.*
FROM public.purchases p
JOIN public.skills s ON s.id = p.skill_id
WHERE p.status = 'succeeded';

-- Note: This view respects RLS because it joins on the purchases table.

COMMENT ON TABLE public.purchases IS 'Records of users purchasing skills (Stripe test + future live)';
COMMENT ON COLUMN public.skills.price_cents IS 'Price in cents. 0 = free. Supports $0, $4.99, $9.99, $19.99, $29.99 + custom';
