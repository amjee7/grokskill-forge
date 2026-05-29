import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Lock } from "lucide-react";
import { getSkillBySlug, hasUserPurchasedSkill } from "@/lib/supabase/skills";
import { createClient } from "@/lib/supabase/server";
import { BuyButton } from "@/components/BuyButton";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ success?: string; canceled?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const skill = await getSkillBySlug(slug);
  return {
    title: skill ? `${skill.name} | GrokSkill Forge` : "Skill",
    description: skill?.description,
  };
}

export default async function MarketplaceSkillDetail({ params, searchParams }: Props & { searchParams: Promise<{ success?: string; canceled?: string }> }) {
  const { slug } = await params;
  const paramsData = await searchParams;

  // ULTRA-SIMPLE MVP HACK: Always load the first skill, ignore slug completely
  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Skill loaded!</h1>
        <p className="text-xl text-zinc-400">No skills found in the database yet.</p>
        <p className="mt-4 text-sm text-zinc-500">Upload a skill first from the dashboard.</p>
      </div>
    );
  }

  const priceLabel = skill.price_cents > 0 
    ? `$${(skill.price_cents / 100).toFixed(2)}` 
    : "Free";

  // MVP HACK: Always show full content + buttons
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" /> Back to Marketplace
      </Link>

      {/* Payment feedback banners */}
      {paramsData?.success === 'true' && (
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 text-emerald-400">
          Payment successful! (Test mode)
        </div>
      )}
      {paramsData?.canceled === 'true' && (
        <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-6 py-4 text-yellow-400">
          Checkout was canceled.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-5xl font-semibold tracking-tighter">{skill.name}</h1>
          <p className="mt-3 text-2xl text-zinc-400">{skill.description}</p>
        </div>
        <div className="shrink-0">
          <Badge className="text-lg px-5 py-1.5">{priceLabel}</Badge>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-zinc-400">
        {skill.category && <Badge variant="outline" className="capitalize">{skill.category}</Badge>}
        {skill.tags?.map((tag) => (
          <span key={tag} className="text-xs bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">#{tag}</span>
        ))}
      </div>

      {/* Content - Always visible for MVP */}
      <div className="border border-zinc-800 bg-[#121212] rounded-3xl p-8 lg:p-10 mb-8">
        <div className="markdown-preview">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-200">
            {skill.content}
          </pre>
        </div>
      </div>

      {/* Actions - Always visible for MVP */}
      <div className="flex flex-wrap gap-4">
        <a 
          href={`data:text/markdown;charset=utf-8,${encodeURIComponent(skill.content)}`} 
          download={`${skill.slug || 'skill'}.md`}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-700 px-6 text-sm font-medium hover:bg-zinc-900"
        >
          <Download className="w-4 h-4" /> Download .md
        </a>

        <BuyButton slug={skill.slug || skill.id} priceLabel={priceLabel} />

        <Link 
          href="/marketplace" 
          className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-700 px-6 text-sm font-medium hover:bg-zinc-900"
        >
          Back to Marketplace
        </Link>
      </div>

      <p className="text-xs text-zinc-500 mt-6 text-center">
        MVP Mode — Full content shown for testing. Real purchase flow coming next.
      </p>
    </div>
  );
}
