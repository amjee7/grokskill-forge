# Step 0.1 — Aggressive Cleanup + MVP Scope Lock

**Date**: 2026  
**Status**: Ready for Review  
**Goal**: Lock the project into the scoped Initial MVP by removing all advanced Forge / rich page code and establishing the new Marketplace structure.

---

## Summary of Changes

This step performs **aggressive cleanup** as approved in the plan:

- Completely removed the advanced visual Forge builder
- Removed the rich markdown skill detail pages
- Renamed/restructured from `/explore` → `/marketplace`
- Updated navigation and protection rules
- Created initial Marketplace and Upload route skeletons
- Simplified the home page CTAs

**This is a foundational "scope lock" step.** After approval, the codebase will only reflect the simple marketplace MVP (browse → upload simple form → purchase with Stripe).

---

## Files Deleted

| Path                        | Reason |
|----------------------------|--------|
| `app/forge/` (entire dir)  | Advanced visual builder removed for MVP (deferred to v0.2) |
| `app/skills/[slug]/` (entire dir) | Rich markdown detail page removed (we use a much simpler version under `/marketplace/[slug]`) |

---

## Files Created

### 1. `app/marketplace/page.tsx`

**Purpose**: New public Marketplace listing page with search + filters.

```tsx
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { demoSkills } from "@/lib/seeds";
import type { Category } from "@/types/skill";
import { CATEGORIES } from "@/types/skill";

// Temporary price tiers for MVP demo (will come from DB later)
const PRICE_TIERS = [0, 499, 999, 1999, 2999];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "paid">("all");

  const filteredSkills = useMemo(() => {
    let result = [...demoSkills];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (priceFilter === "free") {
      result = result.filter((s) => (s as any).price_cents === 0 || !(s as any).price_cents);
    } else if (priceFilter === "paid") {
      result = result.filter((s) => (s as any).price_cents > 0);
    }

    return result;
  }, [search, selectedCategory, priceFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setPriceFilter("all");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="uppercase tracking-[3px] text-xs text-violet-400 mb-2">THE MARKETPLACE</div>
        <h1 className="text-6xl font-semibold tracking-tighter">Discover Skills</h1>
        <p className="mt-3 text-xl text-zinc-400 max-w-2xl">
          Buy and sell high-quality, reusable Grok skills. Free and paid options available.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills by name, description or tag..."
            className="pl-11 h-12 bg-zinc-950 border-zinc-800 text-base"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            className={selectedCategory === "all" ? "btn-forge text-white" : "border-zinc-700"}
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={selectedCategory === cat ? "btn-forge text-white" : "border-zinc-700 capitalize"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <Button
            variant={priceFilter === "all" ? "default" : "outline"}
            className={priceFilter === "all" ? "btn-forge text-white" : "border-zinc-700"}
            onClick={() => setPriceFilter("all")}
          >
            All Prices
          </Button>
          <Button
            variant={priceFilter === "free" ? "default" : "outline"}
            className={priceFilter === "free" ? "btn-forge text-white" : "border-zinc-700"}
            onClick={() => setPriceFilter("free")}
          >
            Free
          </Button>
          <Button
            variant={priceFilter === "paid" ? "default" : "outline"}
            className={priceFilter === "paid" ? "btn-forge text-white" : "border-zinc-700"}
            onClick={() => setPriceFilter("paid")}
          >
            Paid
          </Button>

          {(search || selectedCategory !== "all" || priceFilter !== "all") && (
            <Button variant="ghost" onClick={clearFilters} className="gap-1.5">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {filteredSkills.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="relative">
              <SkillCard skill={skill} showAuthor />
              {/* Temporary price badge for MVP demo */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="bg-black/70 text-white border-zinc-700">
                  {(skill as any).price_cents ? `$${((skill as any).price_cents / 100).toFixed(2)}` : "Free"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state border border-zinc-800 rounded-3xl py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold tracking-tight mb-2">No skills found</div>
          <p className="text-zinc-400 mb-6">Try broadening your search or clearing filters.</p>
          <Button onClick={clearFilters} variant="outline">Clear all filters</Button>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
        Skills are plain text files that work with the Grok CLI and TUI. Paid skills unlock full content after purchase.
      </div>
    </div>
  );
}
```

### 2. `app/marketplace/[slug]/page.tsx`

Simple gated detail view (full content + download will be added after purchase flow is built).

### 3. `app/upload/page.tsx`

Protected placeholder page (real form implemented in Step 3).

---

## Files Modified

### 1. `components/Navbar.tsx`

**Changes**:
- Removed "Explore" and "Forge" from main navigation
- Added only "Marketplace"
- Removed "Open the Forge" from user dropdown
- Added "Upload Skill" link in user dropdown

**Key diff**:

```diff
-  const navLinks = [
-    { href: "/explore", label: "Explore", icon: Compass },
-    { href: "/forge", label: "Forge", icon: Hammer },
-  ];
+  const navLinks = [
+    { href: "/marketplace", label: "Marketplace", icon: Compass },
+  ];
```

```diff
-                    <DropdownMenuItem onClick={() => (window.location.href = "/forge")} className="cursor-pointer">
-                      <Hammer className="mr-2 h-4 w-4" />
-                      Open the Forge
-                    </DropdownMenuItem>
+                    <DropdownMenuItem onClick={() => (window.location.href = "/upload")} className="cursor-pointer">
+                      <Hammer className="mr-2 h-4 w-4" />
+                      Upload Skill
+                    </DropdownMenuItem>
```

### 2. `middleware.ts`

```diff
-  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/forge')) {
+  if (
+    request.nextUrl.pathname.startsWith('/dashboard') ||
+    request.nextUrl.pathname.startsWith('/upload')
+  ) {
```

### 3. `app/page.tsx` (Home)

**Changes**:
- Primary CTA changed from "Open the Forge" → "Browse Marketplace"
- Secondary CTA changed to "Get Started"

```diff
-            <Link href="/forge" ...>
-              Open the Forge <Hammer ... />
-            </Link>
-            <Link href="/explore" ...>
-              Browse Skills ...
-            </Link>
+            <Link href="/marketplace" ...>
+              Browse Marketplace ...
+            </Link>
+            <Link href="/login" ...>
+              Get Started
+            </Link>
```

---

## How to Review This Step

1. Open the project and run `npm run dev`
2. Verify:
   - No "Forge" text or links appear anywhere in the UI
   - Navbar only shows **Marketplace**
   - Clicking "Marketplace" goes to `/marketplace`
   - Logged-in users see "Upload Skill" in the avatar dropdown
   - Home page CTAs point to Marketplace and login
   - `/upload` is protected (redirects to login if not authenticated)
3. Confirm the aggressive removal of the old advanced features feels correct for the scoped MVP

---

## Next Steps (After Your Approval)

- **Step 0.2**: Add Stripe dependencies + update `.env.local.example` + basic price types
- Then database schema changes, etc.

---

**Please reply with:**

- `Approved — proceed to Step 0.2`
- Or any feedback / requested changes to this diff

This file (`steps/STEP-0.1.md`) can be committed or shared for permanent record of the change.
