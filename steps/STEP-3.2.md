# Step 3.2 — Wire Upload Form to Server Action + Data Layer

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Move the skill creation logic from the client directly into a secure Server Action that uses our existing `createSkill` helper.

---

## Summary of Changes

This step improves the upload flow by:

- Creating a proper **Server Action** (`app/upload/actions.ts`)
- Wiring the upload form to use the Server Action instead of direct client-side Supabase insert
- Leveraging the existing `createSkill()` function from `lib/supabase/skills.ts`
- Moving price calculation logic to the server for better security and consistency
- Keeping the rich client-side UX (price tier selector + custom input) while making submission server-driven

This is the recommended Next.js App Router pattern for form submissions.

---

## Files Created

### `app/upload/actions.ts`

A new Server Action that:
- Authenticates the user server-side
- Parses form data (including price tier + custom price)
- Calculates final `price_cents`
- Calls our reusable `createSkill()` data layer function
- Revalidates relevant paths (`/dashboard`, `/marketplace`)
- Redirects to the dashboard on success

---

## Files Modified

### `app/upload/page.tsx`

**Refactored** to:
- Use the new Server Action via the `action` prop on the `<form>`
- Remove all direct Supabase client insert logic
- Keep all the nice client-side state for the price selector
- Use `useFormStatus` for pending state on the submit button
- Cleaner separation of concerns (UI vs business logic)

---

## Benefits of This Change

- Better security (auth + logic runs on server)
- Consistent with our data access layer
- Easier to add validation, slug uniqueness checks, or rate limiting later
- Form is progressively enhanced

---

## Verification Checklist

- Submit the upload form → skill should be created via the Server Action
- After submission, user should be redirected to `/dashboard`
- New skill should appear in "My Skills"
- Price (including custom) should be correctly saved in the database

---

## Next Steps (After Approval)

- **Step 4.1**: Start implementing the Stripe Checkout flow (the most important payment feature).
- We will create the API route that generates a Checkout Session when someone clicks "Buy".

---

**Please reply with:**

- `Approved — proceed to Step 4.1`
- Or any requested changes

The complete diff for this step is documented in `steps/STEP-3.2.md`.
