"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Download, User } from "lucide-react";
import type { Skill } from "@/types/skill";

interface SkillCardProps {
  skill: Skill;
  showAuthor?: boolean;
}

export function SkillCard({ skill, showAuthor = true }: SkillCardProps) {
  const categoryColors: Record<string, string> = {
    development: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    devops: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    productivity: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    research: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    writing: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    testing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <Link href={`/marketplace/${skill.slug || skill.id}`} className="block group">
      <div className="skill-card border border-zinc-800 bg-[#121212] rounded-2xl p-6 h-full flex flex-col hover:border-zinc-700">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-lg tracking-tight group-hover:text-violet-400 transition-colors line-clamp-2">
              {skill.name}
            </div>
            {showAuthor && skill.profiles?.email && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
                <User className="w-3 h-3" />
                {skill.profiles.email.split("@")[0]}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {skill.category && (
              <Badge
                variant="outline"
                className={`text-[10px] font-mono tracking-widest uppercase ${categoryColors[skill.category] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
              >
                {skill.category}
              </Badge>
            )}
            <Badge 
              variant="secondary" 
              className="bg-black/60 text-white border-zinc-700 font-medium"
            >
              {skill.price_cents > 0 
                ? `$${(skill.price_cents / 100).toFixed(2)}` 
                : 'Free'}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-zinc-400 line-clamp-3 flex-1 mb-5">
          {skill.description}
        </p>

        {skill.tags && skill.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {skill.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-zinc-900 text-zinc-400 px-2.5 py-px rounded-full border border-zinc-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-4 border-t border-zinc-800 text-zinc-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5" />
              <span>{skill.stars_count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>{skill.forks_count ?? 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />
              <span>{skill.downloads_count ?? 0}</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-zinc-600">
            {new Date(skill.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </div>
        </div>
      </div>
    </Link>
  );
}
