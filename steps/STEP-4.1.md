# Step 4.1 — Stripe Checkout Integration (First Payment Flow)

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Implement the core "Buy" experience by connecting the skill detail page to Stripe Checkout (test mode).

---

## Summary of Changes

This is the first real monetization step of the MVP:

- Created a secure API route (`/api/checkout`) that generates a Stripe Checkout Session
- Built a reusable `BuyButton` client component
- Wired the Buy button on the skill detail page to trigger real Stripe Checkout
- The flow now redirects users to Stripe's hosted checkout page in test mode

---

## Files Created

### 1. `app/api/checkout/route.ts`

A POST API route that:
- Validates the user is logged in
- Fetches the skill using our data layer
- Creates a Stripe Checkout Session with proper `price_data`
- Includes metadata (`skill_id`, `buyer_id`) for the webhook in Step 4.2
- Returns the Stripe Checkout URL

### 2. `components/BuyButton.tsx`

A small, reusable client component that:
- Calls `/api/checkout` with the skill slug
- Handles loading state
- Redirects the user to Stripe Checkout on success
- Shows friendly error messages via Sonner

---

## Files Modified

### `app/marketplace/[slug]/page.tsx`

- Imported and integrated the new `BuyButton` component
- Replaced the static "Buy" button with the functional version
- The button now triggers a real payment flow

---

## How the Flow Works Now

1. User visits a paid skill they don't own
2. They see the locked state + "Buy for $X.XX" button
3. Clicking the button calls our checkout API
4. User is redirected to Stripe Checkout (test mode)
5. After successful test payment → they return to the skill page with `?success=true`

(Note: Full access + purchase recording will be handled in Step 4.2 via the webhook.)

---

## Verification Checklist

- Click "Buy" on a paid skill → should redirect to Stripe Checkout
- Use test card `4242 4242 4242 4242`
- Complete checkout → should be redirected back to the skill page
- No real money is charged (test mode)

---

## Next Steps (After Approval)

- **Step 4.2**: Implement the Stripe webhook handler to actually record the purchase in the database when payment succeeds.
- This will unlock the content for buyers.

---

**Please reply with:**

- `Approved — proceed to Step 4.2`
- Or any feedback on the current checkout flow

The complete diff for this step is documented in `steps/STEP-4.1.md`.
