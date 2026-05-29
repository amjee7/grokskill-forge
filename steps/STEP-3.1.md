# Step 3.1 — Upload Skill Form (`/upload`)

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Create a clean, user-friendly upload form with the approved pricing options (tiered select + custom amount).

---

## Summary of Changes

This step delivers the first content creation flow of the MVP:

- Replaced the placeholder with a fully functional upload form at `/upload`
- Includes all required fields: Name, Description, Content, Category, Tags
- **Pricing section** exactly as specified:
  - Dropdown with fixed tiers: Free, $4.99, $9.99, $19.99, $29.99
  - "Custom amount" option that reveals a number input
- Form is protected (middleware already enforces login)
- Uses Sonner for nice success/error toasts
- On success, redirects user to their Dashboard

---

## Files Modified

### `app/upload/page.tsx`

**Completely replaced** the previous stub with a production-ready form featuring:

- Responsive layout
- Proper labels and help text
- Controlled pricing selector with conditional custom price input
- Client-side price calculation (converted to cents before submission)
- Direct Supabase insert from the browser client (acceptable for MVP owner-created content)
- Loading state on submit
- Clear "Test mode" messaging

---

## Key Implementation Details

**Price Handling:**
- Fixed tiers map directly to cents (`499`, `999`, etc.)
- Custom input is parsed as dollars and converted to cents on submit
- Final `price_cents` is sent to the database

**User Experience:**
- Form feels native and polished
- Users are guided on what each field means
- Success leads directly to the Dashboard (where they can see their new skill)

---

## Verification Checklist

- Visit `/upload` while logged out → should be redirected to login
- Visit `/upload` while logged in → see the full form
- Select different price tiers → custom field appears/disappears correctly
- Submit a free skill → it should appear in your Dashboard
- Submit a paid skill → price is correctly stored in `price_cents`

---

## Next Steps (After Approval)

- **Step 3.2**: Wire the form through our server `createSkill()` helper + add better validation / slug uniqueness handling.
- Then we move into the payment flow (Step 4).

---

**Please reply with:**

- `Approved — proceed to Step 3.2`
- Or any requested changes to the upload form

The complete diff for this step is documented in `steps/STEP-3.1.md`.
