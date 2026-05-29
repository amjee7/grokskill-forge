# Step 4.2 — Stripe Webhook Handler + Purchase Fulfillment

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Handle successful Stripe payments and record them in the database so buyers gain access to paid skills.

---

## Summary of Changes

This is the most important payment-related step:

- Created a secure Stripe webhook endpoint
- Implemented signature verification
- On `checkout.session.completed`, records the purchase in the `purchases` table with `status = 'succeeded'`
- Added support for using Supabase Service Role key (required for webhooks)

Once this step is working, buyers will automatically get access to paid skills after successful payment.

---

## Files Created

### `app/api/webhooks/stripe/route.ts`

A robust webhook handler that:
- Reads the raw request body
- Verifies the Stripe signature using `STRIPE_WEBHOOK_SECRET`
- Listens for `checkout.session.completed`
- Inserts a record into `purchases` using the Supabase admin client (service role)
- Gracefully handles errors (still returns 200 to prevent Stripe retries)

---

## Files Modified

### `.env.local.example`
- Added `SUPABASE_SERVICE_ROLE_KEY` placeholder (required for webhook inserts)

### `.env.local`
- Added placeholder for the service role key

### `app/marketplace/[slug]/page.tsx`
- Added success and canceled banners when users return from Stripe Checkout (`?success=true` / `?canceled=true`)

---

## Important Setup Note

For the webhook to work properly during local development, you must:

1. Add your Supabase **Service Role Key** to `.env.local`
2. Use the Stripe CLI to forward events:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Then copy the `whsec_...` signing secret it gives you into `STRIPE_WEBHOOK_SECRET`.

---

## Verification Checklist

- Complete a test purchase using the Buy button
- After redirecting back with `?success=true`, the skill content should be unlocked
- Check the `purchases` table in Supabase — there should be a new row with `status = 'succeeded'`

---

## Next Steps (After Approval)

- **Step 4.3**: Update the Dashboard to show "My Purchases" with full access to bought skills.
- **Step 4.4**: Add a basic "My Earnings" view for creators.

---

**Please reply with:**

- `Approved — proceed to Step 4.3`
- Or any feedback / changes needed

The complete diff for this step is documented in `steps/STEP-4.2.md`.
