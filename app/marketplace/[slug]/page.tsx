import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import { getSkillBySlug } from "@/lib/supabase/skills";
import { createClient } from "@/lib/supabase/server";
import { PaymentSelector } from "@/components/PaymentSelector";
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
  console.log("Loading skill with slug:", slug);

  const paramsData = await searchParams;

  const skill = await getSkillBySlug(slug);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-semibold tracking-tight mb-4">Skill not found</h1>
        <p className="text-xl text-zinc-400">We couldn't find a skill matching "{slug}".</p>
        <p className="mt-4 text-sm text-zinc-500">It may have been deleted or the link is incorrect.</p>
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

      {/* Conditional Payment / Free Access */}
      <div className="mt-8">
        {skill.price_cents === 0 ? (
          <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-2xl p-6 text-center">
            <div className="text-emerald-400 font-medium mb-2">This skill is free</div>
            <BuyButton 
              slug={skill.slug} 
              priceLabel="Free" 
              priceCents={0} 
            />
            <p className="text-xs text-zinc-500 mt-3">
              Click above to instantly add it to your library
            </p>
          </div>
        ) : (
          <div className="border border-zinc-800 rounded-2xl p-6 bg-[#121212]">
            <h3 className="font-semibold text-lg mb-4">انتخاب روش پرداخت</h3>
            <PaymentSelector
              skill={{
                id: skill.id,
                slug: skill.slug,
                name: skill.name,
                price_cents: skill.price_cents,
              }}
              onStripeCheckout={() => {
                window.location.href = `/api/checkout?skill_id=${skill.id}`;
              }}
              onZarinpalCheckout={(amountToman) => {
                fetch('/api/payments/zarinpal/initiate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    skillId: skill.id,
                    amountToman,
                    description: `خرید مهارت ${skill.name}`,
                  }),
                })
                  .then(res => res.json())
                  .then(data => {
                    if (data.redirectUrl) {
                      window.location.href = data.redirectUrl;
                    } else {
                      alert('خطا در اتصال به زرین‌پال');
                    }
                  });
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Link 
          href="/marketplace" 
          className="text-sm text-zinc-400 hover:text-white"
        >
          بازگشت به مارکت‌پلیس
        </Link>
      </div>
    </div>
  );
}
