import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#0a0a0a] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-y-10 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center">
              <span className="text-white text-[10px]">⚒</span>
            </div>
            <span className="font-semibold tracking-tight">GrokSkill Forge</span>
          </div>
          <p className="text-zinc-500 text-xs leading-relaxed max-w-[180px]">
            The official platform for crafting, sharing, and discovering Grok skills.
          </p>
        </div>

        <div>
          <div className="font-medium mb-3 text-zinc-300">Product</div>
          <div className="space-y-2 text-zinc-500">
            <div><Link href="/explore" className="hover:text-zinc-300">Explore Skills</Link></div>
            <div><Link href="/forge" className="hover:text-zinc-300">The Forge</Link></div>
            <div><Link href="/dashboard" className="hover:text-zinc-300">Dashboard</Link></div>
          </div>
        </div>

        <div>
          <div className="font-medium mb-3 text-zinc-300">Resources</div>
          <div className="space-y-2 text-zinc-500">
            <a href="https://github.com" target="_blank" className="hover:text-zinc-300 block">GitHub</a>
            <a href="https://docs.x.ai" target="_blank" className="hover:text-zinc-300 block">Grok Docs</a>
            <a href="https://x.ai" target="_blank" className="hover:text-zinc-300 block">xAI</a>
          </div>
        </div>

        <div>
          <div className="font-medium mb-3 text-zinc-300">Community</div>
          <div className="space-y-2 text-zinc-500 text-xs leading-relaxed">
            Skills created here work seamlessly with the Grok CLI and TUI.
            <div className="pt-2 text-[10px] text-zinc-600">Built for makers who automate.</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 text-xs text-zinc-500 flex flex-col md:flex-row justify-between gap-2">
        <div>© {new Date().getFullYear()} GrokSkill Forge — Not affiliated with xAI</div>
        <div className="flex gap-4">
          <span>Made for the Grok ecosystem</span>
        </div>
      </div>
    </footer>
  );
}
