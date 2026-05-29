# Step 4.4 — Dashboard: Basic "My Earnings" View for Creators

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Allow creators to see how much they have earned from their paid skills.

---

## Summary of Changes

This step completes the creator monetization loop in the MVP:

- Added a third tab **"My Earnings"** in the Dashboard
- Shows a clear **total earnings** summary card
- Lists all skills that generated sales, with:
  - Skill name (linked to Marketplace)
  - Number of sales
  - Total amount earned from that skill
- Clean, consistent UI with the rest of the Dashboard

This gives creators visibility into which of their skills are performing well.

---

## Files Modified

### `app/dashboard/page.tsx`

Key additions:
- New state: `earnings` (raw successful purchases on the user's skills) and `totalEarnings`
- Extended `loadData()` to fetch earnings data using a join on `purchases` → `skills.owner_id`
- Added third tab "My Earnings" using the existing `Tabs` system
- Summary card at the top of the earnings tab showing total earnings
- Grouped list of skills that have been sold
- Updated the final footer text to clarify that earnings are from test payments

Also fixed a small leftover function call (`loadSkills` → `loadData`).

---

## Key Design Decisions

- Kept it **simple** for MVP (no per-sale breakdown list, no charts, no withdrawal UI)
- Focused on "which skills made money" + overall total
- Reuses the same data fetching pattern as the rest of the dashboard (client Supabase)

---

## Verification Checklist

- Upload a paid skill
- Have another test user purchase it
- Go to your Dashboard → "My Earnings" tab
- You should see the total earnings increase and your skill listed with correct sale count and amount

---

## Next Steps (After Approval)

We are now very close to completing the core MVP loop.

**Recommended next (and likely final major) step:**
- **Step 5.x** — Polish + Final Documentation (home page cleanup, README with full setup instructions, end-to-end testing checklist)

---

**Please reply with:**

- `Approved — proceed to final polish steps`
- Or any feedback on the current earnings view

The complete diff for this step is documented in `steps/STEP-4.4.md`.
