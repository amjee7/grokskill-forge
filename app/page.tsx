import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, Clock, DollarSign, Users, Globe, Shield, Zap, 
  Star, TrendingUp, Wallet 
} from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { demoSkills } from "@/lib/seeds";

export default function LandingPage() {
  const featuredSkills = demoSkills.slice(0, 3);

  return (
    <div className="bg-[#0a0a0a] text-white">
      {/* ========== HERO ========== */}
      <section className="relative pt-20 pb-24 px-6 border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_0.8px,transparent_1px)] bg-[length:4px_4px] opacity-40" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <Badge 
            variant="outline" 
            className="mb-6 px-5 py-1 text-xs tracking-[3px] border-zinc-700 bg-zinc-950 text-violet-400"
          >
            OFFICIAL GROK ECOSYSTEM MARKETPLACE
          </Badge>

          <h1 className="text-6xl md:text-7xl lg:text-[82px] font-semibold tracking-tighter leading-[0.92] mb-6">
            The Official Marketplace<br />for Grok Build Skills
          </h1>
          
          <p className="max-w-3xl mx-auto text-2xl md:text-3xl text-zinc-400 tracking-tight mb-10">
            Save <span className="font-semibold text-white">3–5 days per project</span>.<br />
            Earn from your best workflows.<br />
            Built for Iranian + global developers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/marketplace"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-10 text-lg font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.01]"
            >
              Browse Skills <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/upload"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-8 text-lg font-medium text-white transition-all hover:bg-zinc-900"
            >
              Upload My Skill
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 font-medium"
            >
              Get Pro <Star className="w-4 h-4" />
            </Link>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-500">No credit card required to start</span>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS ========== */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-12">
          <div className="inline-block rounded-full bg-violet-500/10 px-4 py-1 text-sm text-violet-400 mb-3">
            WHY DEVELOPERS LOVE GROKSKILL FORGE
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter">
            Build faster. Earn more.<br />Solve real pain.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Clock,
              title: "Save 3–5 Days Per Project",
              desc: "Stop rewriting the same workflows. Buy battle-tested skills from the best developers in the ecosystem."
            },
            {
              icon: DollarSign,
              title: "Earn From Your Expertise",
              desc: "Upload your best Grok skills and get paid in Toman (Zarinpal) or USD (Stripe). Turn your knowledge into income."
            },
            {
              icon: Globe,
              title: "Iran-Friendly by Design",
              desc: "Finally — a platform that respects Iranian developers. Zarinpal support + full Persian-friendly experience."
            }
          ].map((benefit, index) => (
            <div key={index} className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-8 transition-all hover:border-zinc-700">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-violet-400 group-hover:bg-violet-500/10">
                <benefit.icon className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold tracking-tight mb-3">{benefit.title}</h3>
              <p className="text-lg text-zinc-400 leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========== TRUST SIGNALS ========== */}
      <section className="border-y border-zinc-800 bg-zinc-950 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-center">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Shield className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold">Powered by Stripe</div>
                <div className="text-xs text-zinc-500">Global payments</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-semibold">Zarinpal Native</div>
                <div className="text-xs text-zinc-500">تومان • Iranian developers</div>
              </div>
            </div>

            <div className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-300">
              Used by 200+ Iranian freelancers & agencies
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED SKILLS ========== */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row mb-10">
          <div>
            <div className="text-violet-400 text-sm font-medium tracking-widest mb-2">COMMUNITY FAVORITES</div>
            <h2 className="text-4xl font-semibold tracking-tighter">Featured Skills</h2>
          </div>
          <Link 
            href="/marketplace" 
            className="group inline-flex items-center gap-2 text-lg font-medium text-zinc-400 hover:text-white"
          >
            Browse all skills 
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} showAuthor />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link 
            href="/upload" 
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-700 px-8 font-medium text-white hover:bg-zinc-950"
          >
            Upload your own skill and start earning
          </Link>
        </div>
      </section>

      {/* ========== SOCIAL PROOF / IRAN + GLOBAL ========== */}
      <section className="border-y border-zinc-800 bg-zinc-950 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-1 text-sm">
            <Users className="h-4 w-4 text-violet-400" />
            <span>Trusted across borders</span>
          </div>
          
          <h3 className="text-3xl font-semibold tracking-tight mb-4">
            Built for Iranian + Global Developers
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-zinc-400">
            Whether you're in Tehran, Berlin, or Dubai — GrokSkill Forge is designed to work for you.
          </p>

          <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
            {[
              "Iranian freelancers finally get paid fairly in their own currency",
              "Global teams can instantly buy battle-tested Grok workflows",
              "Creators earn recurring income from skills used across the world"
            ].map((text, i) => (
              <div key={i} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="font-medium leading-relaxed">{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FINAL CTA ========== */}
      <section className="py-20 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-5xl font-semibold tracking-tighter mb-6">
            Stop rebuilding.<br />Start building.
          </h2>
          <p className="text-2xl text-zinc-400 mb-10">
            Join hundreds of smart developers who are already saving time and earning from their skills.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/marketplace"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-10 text-lg font-semibold text-white transition-all hover:brightness-110 sm:w-auto"
            >
              Browse Skills <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/upload"
              className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-zinc-700 bg-zinc-950 px-8 text-lg font-medium text-white transition-all hover:bg-zinc-900 sm:w-auto"
            >
              Upload My Skill
            </Link>
          </div>

          <div className="mt-6 text-sm text-zinc-500">
            Free to browse • Earn from day one • Iranian payment supported
          </div>
        </div>
      </section>
    </div>
  );
}
