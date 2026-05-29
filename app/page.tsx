import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, Upload, CreditCard, Download } from "lucide-react";
import { SkillCard } from "@/components/SkillCard";
import { demoSkills } from "@/lib/seeds";

export default function LandingPage() {
  const featured = demoSkills.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <div className="relative pt-20 pb-20 px-6 border-b border-zinc-800 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-1 text-xs tracking-[2px] border-zinc-700 bg-zinc-950 text-zinc-400">
            FOR THE GROK ECOSYSTEM
          </Badge>

          <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-none mb-6">
            The Marketplace for<br />Grok Skills
          </h1>
          
          <p className="max-w-2xl mx-auto text-2xl text-zinc-400 tracking-tight mb-10">
            Buy and sell high-quality, reusable skills for Grok.<br />
            Discover workflows others have already perfected.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-9 text-base font-medium text-white transition hover:brightness-110"
            >
              Browse Marketplace <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/upload"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-lg border border-zinc-700 px-9 text-base font-medium text-white transition hover:bg-zinc-950"
            >
              Upload Your Skill
            </Link>
          </div>

          <div className="mt-8 text-sm text-zinc-500">
            Works with Grok CLI and TUI • Test payments enabled
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="max-w-5xl mx-auto px-6 py-16 border-b border-zinc-800">
        <div className="text-center mb-12">
          <div className="uppercase tracking-[3px] text-xs text-violet-400 mb-2">SIMPLE PROCESS</div>
          <h2 className="text-4xl font-semibold tracking-tighter">How GrokSkill Forge Works</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: Search, title: "Browse", desc: "Explore skills in the Marketplace. Filter by category or price." },
            { icon: CreditCard, title: "Buy or Get Free", desc: "Purchase paid skills with Stripe test checkout or grab free ones instantly." },
            { icon: Upload, title: "Upload Your Own", desc: "Share your best workflows. Set a price or make them free." },
            { icon: Download, title: "Use in Grok", desc: "Download skills and use them directly with the Grok CLI and TUI." },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900">
                <step.icon className="h-7 w-7 text-violet-400" />
              </div>
              <div className="font-semibold text-lg tracking-tight mb-2">{step.title}</div>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Skills */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="uppercase tracking-[2px] text-xs text-violet-400 mb-2">COMMUNITY FAVORITES</div>
            <div className="text-4xl font-semibold tracking-tighter">Featured Skills</div>
          </div>
          <Link href="/marketplace" className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {featured.map((skill) => (
            <SkillCard key={skill.id} skill={skill} showAuthor />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/marketplace" className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-700 px-6 text-sm font-medium">
            Browse the full Marketplace
          </Link>
        </div>
      </div>

      {/* Final CTA */}
      <div className="border-t border-zinc-800 bg-[#0c0c0c] py-16 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-4xl font-semibold tracking-tighter mb-4">Ready to share your skills?</h2>
          <p className="text-xl text-zinc-400 mb-8">Upload your best Grok workflows today and start earning from the community.</p>
          <Link
            href="/upload"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-10 text-base font-medium text-white transition hover:brightness-110"
          >
            Upload Your First Skill
          </Link>
        </div>
      </div>
    </div>
  );
}
