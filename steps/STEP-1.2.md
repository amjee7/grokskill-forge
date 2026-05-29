# Step 1.2 — Data Access Layer: `lib/supabase/skills.ts`

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Create a clean, reusable data access layer for skills and purchases that will power the Marketplace, Upload form, and Dashboard.

---

## Summary of Changes

This step introduces a centralized data layer for all skill-related database operations.

**New file created:**
- `lib/supabase/skills.ts`

This module provides server-side functions for:
- Fetching public skills for the Marketplace (with search + filters)
- Creating new skills (used by the Upload form)
- Retrieving a creator’s own skills
- Retrieving a user’s purchased skills
- Helper methods for access control

---

## File Created

### `lib/supabase/skills.ts`

**Full implementation** (key functions):

```ts
// lib/supabase/skills.ts

import { createClient } from './server';
import type { Skill, CreateSkillInput } from '@/types/skill';

export interface GetPublicSkillsOptions {
  search?: string;
  category?: string;
  priceFilter?: 'all' | 'free' | 'paid';
  limit?: number;
}

/** Get publicly visible skills (for the Marketplace) */
export async function getPublicSkills(options: GetPublicSkillsOptions = {}): Promise<Skill[]>

/** Get a single skill by slug */
export async function getSkillBySlug(slug: string): Promise<Skill | null>

/** Create a new skill (used by /upload) */
export async function createSkill(
  input: CreateSkillInput & { owner_id: string }
): Promise<Skill | null>

/** Get all skills owned by the current user */
export async function getMySkills(ownerId: string): Promise<Skill[]>

/** Get all successful purchases made by the user */
export async function getMyPurchases(buyerId: string)

/** Check if a user has purchased a specific skill */
export async function hasUserPurchasedSkill(userId: string, skillId: string): Promise<boolean>
```

**Design decisions:**
- All functions use the **server Supabase client** (safe for Server Components / Route Handlers).
- Functions are async and handle errors gracefully (return empty arrays / null on failure).
- `createSkill` automatically generates a clean slug.
- Purchase-related functions filter on `status = 'succeeded'`.

---

## How This Will Be Used (Future Steps)

- **Marketplace** (`/marketplace`): `getPublicSkills({ search, category, priceFilter })`
- **Upload form** (`/upload`): `createSkill(...)`
- **Dashboard**: `getMySkills()` + `getMyPurchases()`
- **Skill detail pages**: `getSkillBySlug()` + `hasUserPurchasedSkill()` for gated content

---

## Verification Checklist

- [ ] File exists at `lib/supabase/skills.ts`
- [ ] TypeScript compiles without errors (`npm run build` or `tsc --noEmit`)
- [ ] No breaking changes to existing code (this is a pure addition)

---

## Next Steps (After Approval)

- **Step 2.1**: Build the full `/marketplace` page using the new `getPublicSkills` function + price filters.
- Then we will wire the Upload form and Dashboard in subsequent steps.

---

**Please reply with:**

- `Approved — proceed to Step 2.1`
- Or any requested changes / improvements to this data layer

The complete diff for this step is documented in `steps/STEP-1.2.md`.
