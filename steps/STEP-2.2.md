# Step 2.2 — Skill Detail Page (`/marketplace/[slug]`)

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Build a clean, functional skill detail page with proper access control (free vs paid) and a Buy button.

---

## Summary of Changes

This step delivers the skill detail experience:

- Replaced the basic placeholder with a proper, polished detail page
- Integrated `getSkillBySlug()` and `hasUserPurchasedSkill()` from the data layer
- Smart content visibility:
  - Free skills → Full content visible to everyone
  - Paid skills → Full content shown only to owners or buyers
  - Non-buyers see a clean "locked" state with Buy button
- Added **Download .md** button for users who have access
- Good metadata, responsive layout, and clear UX

---

## Files Modified

### `app/marketplace/[slug]/page.tsx`

**Completely rewritten** with the following features:

- Server Component using real data from Supabase
- Access control logic:
  ```ts
  const canAccessFullContent = 
    skill.price_cents === 0 || 
    isOwner || 
    hasPurchased;
  ```
- Beautiful locked state with icon and clear call-to-action
- Full markdown content display when user has access
- One-click download of the skill as `.md` file
- Consistent styling with the rest of the MVP

---

## Key UX Decisions

1. **Free skills** are immediately usable.
2. **Paid skills** show only the description + price until purchased.
3. Owners always see their own paid skills in full.
4. Download is only available after access is granted.
5. Buy button is prominent but clearly marked as "Test mode" for the MVP.

---

## Verification Checklist

- Visit a free skill → should see full content + Download button
- Visit a paid skill while logged out → should see locked state
- Visit a paid skill you own → should see full content
- Download button works and produces a valid `.md` file
- Page looks good on mobile

---

## Next Steps (After Approval)

- **Step 3.1**: Create the actual **Upload Skill** form (`/upload`) with the approved price tier selector.
- This will be the first real user-generated content flow.

---

**Please reply with:**

- `Approved — proceed to Step 3.1`
- Or any feedback on the current detail page experience

The complete diff for this step is documented in `steps/STEP-2.2.md`.
