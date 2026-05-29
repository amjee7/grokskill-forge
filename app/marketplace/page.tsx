import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { getPublicSkills } from "@/lib/supabase/skills";
import type { Category } from "@/types/skill";
import { CATEGORIES } from "@/types/skill";

interface MarketplacePageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: "all" | "free" | "paid";
  }>;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = await searchParams;

  const search = params.q || "";
  const selectedCategory = (params.category as Category | "all") || "all";
  const priceFilter = (params.price as "all" | "free" | "paid") || "all";

  // MVP: super simple fetch of ALL skills (no filters)
  const skills = await getPublicSkills();

  const hasActiveFilters = search || selectedCategory !== "all" || priceFilter !== "all";

  const createFilterUrl = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams();
    if (search) newParams.set("q", search);
    if (selectedCategory !== "all") newParams.set("category", selectedCategory);
    if (priceFilter !== "all") newParams.set("price", priceFilter);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
      else newParams.delete(key);
    });

    const query = newParams.toString();
    return query ? `/marketplace?${query}` : "/marketplace";
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
        <form action="/marketplace" className="relative flex-1">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-zinc-500" />
          <Input
            name="q"
            defaultValue={search}
            placeholder="Search skills by name, description or tag..."
            className="pl-11 h-12 bg-zinc-950 border-zinc-800 text-base"
          />
        </form>

        <div className="flex gap-2 flex-wrap">
          <a 
            href={createFilterUrl({ category: undefined })} 
            className={selectedCategory === "all" ? "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition" : "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900"}
          >
            All
          </a>
          {CATEGORIES.map((cat) => (
            <a 
              key={cat} 
              href={createFilterUrl({ category: cat })} 
              className={selectedCategory === cat ? "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition capitalize" : "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900 capitalize"}
            >
              {cat}
            </a>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <a 
            href={createFilterUrl({ price: undefined })} 
            className={priceFilter === "all" ? "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition" : "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900"}
          >
            All Prices
          </a>
          <a 
            href={createFilterUrl({ price: "free" })} 
            className={priceFilter === "free" ? "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition" : "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900"}
          >
            Free
          </a>
          <a 
            href={createFilterUrl({ price: "paid" })} 
            className={priceFilter === "paid" ? "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition" : "inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900"}
          >
            Paid
          </a>

          {hasActiveFilters && (
            <a href="/marketplace" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-4 text-sm font-medium transition hover:bg-zinc-900">
              <X className="w-4 h-4" /> Clear
            </a>
          )}
        </div>
      </div>

      <Suspense fallback={<div className="text-zinc-400">Loading skills...</div>}>
        {skills.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} showAuthor />
            ))}
          </div>
        ) : (
          <div className="empty-state border border-zinc-800 rounded-3xl py-20 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-xl font-semibold tracking-tight mb-2">No skills found</div>
            <p className="text-zinc-400 mb-6">Try broadening your search or clearing filters.</p>
            <a href="/marketplace" className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-5 text-sm font-medium transition hover:bg-zinc-900">
              Clear all filters
            </a>
          </div>
        )}
      </Suspense>

      <div className="mt-16 pt-8 border-t border-zinc-800 text-sm text-zinc-500">
        Skills are plain text files that work with the Grok CLI and TUI. Paid skills unlock full content after purchase.
      </div>
    </div>
  );
}
