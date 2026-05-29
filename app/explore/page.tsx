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

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [sort, setSort] = useState<"popular" | "newest">("popular");

  const filteredSkills = useMemo(() => {
    let result = [...demoSkills];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Sort
    if (sort === "popular") {
      result.sort((a, b) => (b.stars_count + b.downloads_count) - (a.stars_count + a.downloads_count));
    } else {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [search, selectedCategory, sort]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSort("popular");
  };

  const hasActiveFilters = search || selectedCategory !== "all" || sort !== "popular";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="uppercase tracking-[3px] text-xs text-violet-400 mb-2">THE CATALOG</div>
        <h1 className="text-6xl font-semibold tracking-tighter">Explore Skills</h1>
        <p className="mt-3 text-xl text-zinc-400 max-w-2xl">
          Discover battle-tested workflows created by the community. Install any skill with a single command in Grok.
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
            variant="outline"
            className={`border-zinc-700 ${sort === "popular" ? "bg-zinc-900" : ""}`}
            onClick={() => setSort("popular")}
          >
            Popular
          </Button>
          <Button
            variant="outline"
            className={`border-zinc-700 ${sort === "newest" ? "bg-zinc-900" : ""}`}
            onClick={() => setSort("newest")}
          >
            Newest
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="gap-1.5">
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {filteredSkills.length > 0 ? (
        <>
          <div className="text-sm text-zinc-500 mb-4">
            Showing {filteredSkills.length} skill{filteredSkills.length === 1 ? "" : "s"}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} showAuthor />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state border border-zinc-800 rounded-3xl py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold tracking-tight mb-2">No skills found</div>
          <p className="text-zinc-400 mb-6">Try broadening your search or clearing filters.</p>
          <Button onClick={clearFilters} variant="outline">Clear all filters</Button>
        </div>
      )}

      {/* Info footer */}
      <div className="mt-16 pt-8 border-t border-zinc-800 text-sm text-zinc-500 flex flex-col md:flex-row gap-x-8 gap-y-2">
        <div>Skills are plain Markdown files that live in <span className="font-mono text-zinc-400">~/.grok/skills/</span></div>
        <div>Install with <span className="font-mono text-zinc-400">/skills &lt;name&gt;</span> inside Grok</div>
      </div>
    </div>
  );
}
