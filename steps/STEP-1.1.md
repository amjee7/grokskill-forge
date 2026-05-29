# Step 1.1 — Database Migration: Pricing + Purchases Table

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Extend the database schema to support paid skills and purchase tracking for the Stripe marketplace MVP.

---

## Summary of Changes

This step adds the core data model required for buying and selling skills:

- Added `price_cents` and `currency` columns to the `skills` table.
- Created a new `purchases` table to track all transactions.
- Added appropriate indexes, constraints, and Row Level Security policies.
- Updated TypeScript types to reflect the new fields.
- Provided a clean, standalone migration file.

This enables the price tier system ($0 / $4.99 / $9.99 / $19.99 / $29.99 + custom) and future purchase flows.

---

## Files Modified

### `types/skill.ts`

Added pricing fields to the `Skill` interface:

```diff
 export interface Skill {
   ...
   visibility: "public" | "private";
+  price_cents: number;           // 0 = free, e.g. 999 = $9.99
+  currency: string;              // default 'usd'
   stars_count: number;
   ...
 }
```

---

## Files Created

### 1. `supabase/migrations/001_add_price_and_purchases.sql`

This is the main deliverable for Step 1.1. Run this SQL in the Supabase SQL Editor (or via migration tool).

**Full content** (key sections):

```sql
-- 1. Add price fields to skills table
ALTER TABLE public.skills
  ADD COLUMN IF NOT EXISTS price_cents integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'usd';

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

-- Indexes
CREATE INDEX IF NOT EXISTS purchases_buyer_id_idx ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS purchases_skill_id_idx ON public.purchases(skill_id);
CREATE INDEX IF NOT EXISTS purchases_status_idx ON public.purchases(status);

-- RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can insert their own purchase records"
  ON public.purchases FOR INSERT WITH CHECK (auth.uid() = buyer_id);
```

**Important**: After running this migration, existing skills will have `price_cents = 0` (free) by default.

---

## How to Apply This Migration

1. Go to your Supabase project → **SQL Editor**
2. Copy the entire contents of `supabase/migrations/001_add_price_and_purchases.sql`
3. Paste and run the SQL
4. Verify the new columns and table exist in the Table Editor

---

## Verification Checklist (After Running SQL)

- [ ] `skills` table has `price_cents` and `currency` columns
- [ ] `purchases` table exists with correct foreign keys
- [ ] Indexes are created
- [ ] RLS is enabled on `purchases`
- [ ] TypeScript compiles (`npm run build` or `tsc --noEmit`)
- [ ] Existing skills default to `price_cents = 0`

---

## Next Steps (After Your Approval)

- **Step 1.2**: Create `lib/supabase/skills.ts` – reusable data access functions (list public skills with price, get my skills, get my purchases, etc.)
- Then we move into building the actual Marketplace UI and Upload form with the new price fields.

---

**Please reply with one of the following:**

- `Approved — proceed to Step 1.2`
- Any requested changes to this database migration

The complete diff for this step is documented in `steps/STEP-1.1.md`.
