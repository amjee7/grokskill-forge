import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-[140px] font-semibold tracking-tighter text-zinc-800">404</div>
      <div className="text-3xl font-semibold tracking-tight -mt-8">Skill not found</div>
      <p className="mt-3 max-w-sm text-zinc-400">The skill you're looking for doesn't exist or was moved.</p>
      <div className="mt-8 flex gap-3">
        <Link href="/explore" className="inline-flex h-10 items-center rounded-lg border border-zinc-700 px-6 text-sm font-medium transition hover:bg-zinc-950">
          Browse skills
        </Link>
        <Link href="/forge" className="inline-flex h-10 items-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-6 text-sm font-medium text-white transition hover:brightness-110">
          Open the Forge
        </Link>
      </div>
    </div>
  );
}
