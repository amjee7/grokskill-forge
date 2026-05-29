# Step 0.2 — Add Stripe Dependencies + Environment Setup

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Introduce Stripe SDK and prepare environment configuration for test payments in the MVP.

---

## Summary of Changes

This step prepares the project for Stripe integration (test mode):

- Added Stripe packages to dependencies
- Created/updated environment variable examples with Stripe keys
- Created a clean server-side Stripe client helper (`lib/stripe.ts`)
- Added price formatting utilities (supporting our approved tiers + custom amounts)

**Note on Installation**: The `npm install` command experienced network issues in the current environment. You may need to run `npm install stripe @stripe/stripe-js` manually after reviewing this diff.

---

## Files Modified

### 1. `.env.local.example`

Added Stripe configuration section:

```env
# Stripe (Test Mode Only for MVP)
# Get these from https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Stripe Webhook Secret (for production webhooks - use stripe listen in dev)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 2. `.env.local`

Added placeholder Stripe keys for local development:

```env
# Stripe Test Keys (replace with your own test keys from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_replace_with_your_stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_replace_with_your_stripe_publishable
```

---

## Files Created

### `lib/stripe.ts`

A clean, server-only Stripe client with helpers:

```ts
import Stripe from 'stripe';

// Server-side only Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

/**
 * Helper to format price for display
 */
export function formatPrice(priceCents: number): string {
  if (priceCents === 0) return 'Free';
  return `$${(priceCents / 100).toFixed(2)}`;
}

/**
 * Convert USD dollars to cents
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}
```

This file will be used in future steps for creating Checkout Sessions and handling webhooks.

---

## Dependencies Added

In `package.json` (after successful install):

```json
"dependencies": {
  ...
  "stripe": "^latest",
  "@stripe/stripe-js": "^latest"
}
```

**Manual install command** (run if not already installed):

```bash
npm install stripe @stripe/stripe-js
```

---

## How to Review This Step

1. Run `npm install stripe @stripe/stripe-js` (if the automatic install failed due to network).
2. Verify the new files exist:
   - `lib/stripe.ts`
3. Check that `.env.local.example` and `.env.local` contain the Stripe sections.
4. Confirm no Stripe keys with real secrets are committed (they are placeholders only).

---

## Next Steps (After Approval)

- **Step 1.1**: Database migration — add `price_cents` to skills table + create `purchases` table.
- Then we will wire price selection in the upload form using the approved tiers ($0, $4.99, $9.99, $19.99, $29.99 + custom).

---

**Please reply with:**

- `Approved — proceed to Step 1.1`
- Or any requested changes to this diff

This file (`steps/STEP-0.2.md`) documents the complete diff for Step 0.2.
