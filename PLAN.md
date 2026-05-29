# GrokSkill Forge — Initial MVP Implementation Plan

**Project Name**: GrokSkill Forge  
**Stack**: Next.js 15/16 (App Router) + Supabase + Tailwind CSS + shadcn/ui  
**Language**: English only  
**Date**: 2026

---

## 1. Executive Summary

This document defines the **Initial MVP** for GrokSkill Forge — a marketplace where creators can upload Grok skills and sell them to other users, with test payments powered by Stripe.

The MVP is intentionally **scoped and focused**. It prioritizes the core marketplace loop:

> Browse → Upload (simple form) → Purchase with Stripe (test) → Access purchased content

A previous exploration build created a more advanced version (visual Forge builder, rich skill pages, etc.). For this official Initial MVP, we will deliberately **hide the advanced Forge** and focus only on the simple marketplace experience requested.

---

## 2. MVP Goals & Success Criteria

### Primary User Flows
1. **Visitor** lands on a clean home page → understands what the product is.
2. **Visitor** browses the public Marketplace (`/marketplace`) with search + filters.
3. **Creator** (logged in) uploads a new skill using a **simple form**, including a price.
4. **Buyer** (logged in) purchases a paid skill using Stripe test checkout.
5. After purchase, the buyer can view and download the skill from their dashboard ("My Purchases").

### Success Criteria
- A creator can upload a free or paid skill via simple form.
- A buyer can complete a test purchase with Stripe (`4242 4242 4242 4242`).
- Purchased skills appear in the buyer’s dashboard.
- Everything is clearly marked as **test mode**.
- Clean, professional, dark-themed UI consistent with Grok aesthetic.

**Out of Scope for Initial MVP**:
- Advanced visual "Forge" builder (deferred to v0.2)
- Rich markdown skill detail pages (keep minimal)
- Stars, forks, ratings
- Real money payouts to creators
- Private skills or complex permissions

---

## 3. Final Scope (User-Confirmed)

| Feature                    | Included in MVP? | Notes |
|---------------------------|------------------|-------|
| Clean home page           | Yes              | Simple explanation + clear CTAs |
| Marketplace (`/marketplace`) | Yes           | Search + filters + price display |
| Simple upload form (`/upload`) | Yes         | Title, description, content, category, tags, price |
| User Dashboard            | Yes              | My Skills + My Purchases tabs |
| Stripe Test Payments      | Yes              | Creator sets price → Buyer pays via Checkout |
| Advanced visual Forge     | **No** (hidden)  | Power feature for later |
| Rich skill detail pages   | Minimal          | Enough to show description + buy button |
| Remix / Fork              | No               | Future |

**Stripe Model**: Marketplace for buying/selling skills (creators set price, buyers pay).

---

## 4. Proposed Folder Structure (Target State)

```
grokskill-forge/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                    # Clean home page
│   ├── marketplace/
│   │   ├── page.tsx                    # Public skill listing + search/filters
│   │   └── [slug]/
│   │       └── page.tsx                # Simple skill detail + Buy button
│   ├── upload/
│   │   └── page.tsx                    # Protected simple upload form
│   ├── dashboard/
│   │   └── page.tsx                    # My Skills + My Purchases (protected)
│   ├── login/
│   ├── signup/
│   ├── auth/
│   │   └── callback/
│   ├── api/
│   │   ├── checkout/
│   │   │   └── route.ts                # Create Stripe Checkout Session
│   │   └── webhooks/
│   │       └── stripe/
│   │           └── route.ts            # Handle payment fulfillment
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui components (existing)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SkillCard.tsx                   # Updated to show price
│   └── AuthForm.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── stripe.ts                       # Stripe client helpers (new)
│   └── utils.ts
├── types/
│   └── skill.ts                        # Extended with price_cents
├── supabase/
│   └── schema.sql                      # Full schema + migrations
├── public/
├── PLAN.md                             # This document
├── README.md
├── middleware.ts
└── package.json
```

---

## 5. Technology & Architecture Decisions

- **Framework**: Next.js 16 App Router (already in use)
- **Database + Auth**: Supabase (excellent existing setup)
- **Payments**: Stripe Checkout (hosted) + Webhooks — lowest risk for MVP
- **Styling**: Tailwind + shadcn/ui (keep existing dark Grok aesthetic)
- **State**: React hooks + Server Actions where possible
- **Deployment target**: Vercel (easy Stripe webhooks + env vars)

---

## 6. Database Schema Changes

### Modified Table: `skills`

Add these columns:

```sql
price_cents integer NOT NULL DEFAULT 0,     -- 0 = free, 1299 = $12.99
currency text NOT NULL DEFAULT 'usd',
```

### New Table: `purchases`

```sql
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  stripe_session_id text unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'pending',   -- pending | succeeded | failed
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies (buyer can see their own purchases)
```

We will also need a simple way for a user to see "skills I have purchased" (join on `purchases` where status = 'succeeded').

---

## 7. Step-by-Step Build Plan (Diffs for Approval)

Each step below will be executed **only after you explicitly approve** the diff from the previous step.

### Phase 0: Preparation & Cleanup

**Step 0.1** — Scope Alignment + Route Protection
- Update `middleware.ts` to protect `/upload` and `/dashboard`
- Update `Navbar.tsx` to show "Marketplace" instead of "Explore" and remove/hide Forge link
- Create placeholder pages for `/marketplace` and `/upload`

**Step 0.2** — Add Stripe Dependencies
- Install `stripe` and `@stripe/stripe-js`
- Add Stripe test keys to `.env.local.example`

### Phase 1: Database & Types

**Step 1.1** — Database Migration (price + purchases)
- Provide exact SQL to run in Supabase
- Update `types/skill.ts`

**Step 1.2** — Create data access layer
- `lib/supabase/skills.ts` with functions for public listing, user’s skills, user’s purchases

### Phase 2: Marketplace Browsing Experience

**Step 2.1** — Build `/marketplace` page
- Skill grid with search, category filters, price filter (Free / Paid / All)
- Updated `SkillCard` showing price

**Step 2.2** — Build simple `/marketplace/[slug]` detail page
- Basic information + prominent Buy / Get Free button

### Phase 3: Simple Upload Form

**Step 3.1** — Create `/upload` page with clean form
- All required fields + price input
- Form validation (Zod)

**Step 3.2** — Wire form submission to Supabase
- Create skill record
- Show success state and link to dashboard

### Phase 4: Stripe Test Payments (Core Feature)

**Step 4.1** — Create Checkout API route
- `/api/checkout/route.ts` that creates a Stripe Checkout Session for a skill

**Step 4.2** — Build webhook handler
- `/api/webhooks/stripe/route.ts`
- Verifies signature
- On success → creates `purchases` row with status `succeeded`

**Step 4.3** — Update Dashboard with "My Purchases" section
- Show skills the current user has bought

**Step 4.4** — Add basic "Earnings" view for creators (skills they created that were purchased)

### Phase 5: Polish & Documentation

**Step 5.1** — Rewrite home page (`/`) with simple, clear messaging
**Step 5.2** — Final UI/UX polish + loading states + error handling
**Step 5.3** — Update README.md with complete setup instructions (Supabase + Stripe test keys + how to run webhooks locally)
**Step 5.4** — Final build verification + test checklist

---

## 8. Stripe Test Mode Setup Instructions (Will Be in Final README)

1. Create a Stripe account → use **Test mode**
2. Copy Publishable key (`pk_test_...`) and Secret key (`sk_test_...`)
3. Add to `.env.local`
4. Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` during development
5. Test card: `4242 4242 4242 4242`

---

## 9. Open Questions for You

Please answer these before we begin Step 0.1:

1. **Digital Delivery** — After someone buys a skill, should they:
   - See the full content directly on the site + download button? (Recommended for MVP)
   - Or receive an email with the file?

2. **Price Input** — On the upload form, should price be:
   - Free text field in USD (e.g. 9.99)?
   - Or a select with suggested tiers ($0, $4.99, $9.99, $19.99)?

3. **Do you want me to keep the existing advanced code** (Forge, rich skill pages, etc.) in the repo but just not link to it during MVP, or would you prefer a more aggressive cleanup?

4. Any specific price you want to use for testing examples during development?

---

## 10. Next Step

Reply with **"Approved — start with Step 0.1"** (and answers to the questions above), and I will begin delivering the first focused diff for your review.

---

**This plan is designed for maximum clarity and control.** Every meaningful change will be presented as a reviewable diff before it is committed to the final state.

Let’s build this carefully and correctly.