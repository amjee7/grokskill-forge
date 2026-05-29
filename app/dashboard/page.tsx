"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hammer, Plus, Eye, EyeOff, Trash2, Edit3, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Skill } from "@/types/skill";
import { toast } from "sonner";

export default function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserEmail(user.email ?? null);

    // Load skills I created
    const { data: mySkills, error: skillsError } = await supabase
      .from("skills")
      .select("*")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    if (skillsError) {
      setSkills([]);
    } else {
      setSkills(mySkills as Skill[]);
    }

    // Load skills I purchased
    const { data: myPurchases, error: purchasesError } = await supabase
      .from("purchases")
      .select(`
        id,
        amount_cents,
        created_at,
        skill:skills (
          id,
          name,
          slug,
          description,
          price_cents
        )
      `)
      .eq("buyer_id", user.id)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false });

    if (purchasesError) {
      setPurchases([]);
    } else {
      setPurchases(myPurchases || []);
    }

    // Load earnings (purchases on skills I own)
    const { data: earningsRaw, error: earningsError } = await supabase
      .from("purchases")
      .select(`
        id,
        amount_cents,
        created_at,
        skill:skills!inner (
          id,
          name,
          slug
        )
      `)
      .eq("skill.owner_id", user.id)
      .eq("status", "succeeded")
      .order("created_at", { ascending: false });

    if (earningsError) {
      setEarnings([]);
      setTotalEarnings(0);
    } else {
      const raw = earningsRaw || [];
      setEarnings(raw);

      const total = raw.reduce((sum, p) => sum + (p.amount_cents || 0), 0);
      setTotalEarnings(total);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleVisibility = async (skill: Skill) => {
    const newVis = skill.visibility === "public" ? "private" : "public";
    const { error } = await supabase
      .from("skills")
      .update({ visibility: newVis, published_at: newVis === "public" ? new Date().toISOString() : null })
      .eq("id", skill.id);

    if (error) {
      toast.error("Failed to update visibility");
    } else {
      toast.success(`Skill is now ${newVis}`);
      loadData();
    }
  };

  const deleteSkill = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete skill");
    } else {
      toast.success("Skill deleted");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-9">
        <div>
          <div className="text-xs tracking-[2px] text-violet-400">YOUR WORKSPACE</div>
          <h1 className="text-5xl font-semibold tracking-tighter">Dashboard</h1>
        </div>
        <Link
          href="/upload"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-6 text-sm font-medium text-white transition hover:brightness-110"
        >
          <Plus className="w-4 h-4" /> Upload New Skill
        </Link>
      </div>

      {userEmail && (
        <div className="mb-8 text-sm text-zinc-500">
          Signed in as <span className="text-zinc-400">{userEmail}</span>
        </div>
      )}

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="mb-8 bg-zinc-950 border border-zinc-800">
          <TabsTrigger value="skills">My Skills ({skills.length})</TabsTrigger>
          <TabsTrigger value="purchases">My Purchases ({purchases.length})</TabsTrigger>
          <TabsTrigger value="earnings">My Earnings</TabsTrigger>
        </TabsList>

        {/* My Skills Tab */}
        <TabsContent value="skills">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-60 rounded-2xl border border-zinc-800 bg-zinc-950 animate-pulse" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <div className="empty-state border border-zinc-800 rounded-3xl py-20 text-center max-w-xl mx-auto">
              <Hammer className="w-12 h-12 mx-auto text-violet-500 mb-6" />
              <div className="text-3xl font-semibold tracking-tight mb-3">You haven't uploaded any skills yet</div>
              <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                Start sharing your reusable Grok workflows with the community.
              </p>
              <Link
                href="/upload"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-8 text-sm font-medium text-white transition hover:brightness-110"
              >
                Upload Your First Skill
              </Link>
              <div className="mt-4 text-xs text-zinc-600">or browse the public marketplace</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {skills.map((skill) => (
                <div key={skill.id} className="group border border-zinc-800 bg-[#121212] rounded-2xl p-6 flex flex-col">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/marketplace/${skill.slug}`} className="font-semibold text-2xl tracking-tight hover:text-violet-400 transition">
                        {skill.name}
                      </Link>
                      <Badge variant="outline" className={skill.visibility === "public" ? "border-emerald-600 text-emerald-400" : "border-zinc-700"}>
                        {skill.visibility}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-zinc-400 line-clamp-3">{skill.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-5 mt-5 border-t border-zinc-800 text-sm">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-3 text-xs"
                        onClick={() => toggleVisibility(skill)}
                      >
                        {skill.visibility === "public" ? <EyeOff className="w-3.5 h-3.5 mr-1.5" /> : <Eye className="w-3.5 h-3.5 mr-1.5" />}
                        {skill.visibility === "public" ? "Make private" : "Publish"}
                      </Button>

                      <Link
                        href={`/marketplace/${skill.slug}`}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-white/90 hover:bg-zinc-900"
                      >
                        View
                      </Link>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-400 hover:bg-red-950/60 hover:text-red-400"
                      onClick={() => deleteSkill(skill.id, skill.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* My Purchases Tab */}
        <TabsContent value="purchases">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-60 rounded-2xl border border-zinc-800 bg-zinc-950 animate-pulse" />
              ))}
            </div>
          ) : purchases.length === 0 ? (
            <div className="empty-state border border-zinc-800 rounded-3xl py-20 text-center max-w-xl mx-auto">
              <Download className="w-12 h-12 mx-auto text-violet-500 mb-6" />
              <div className="text-3xl font-semibold tracking-tight mb-3">You haven't purchased any skills yet</div>
              <p className="text-zinc-400 mb-8 max-w-xs mx-auto">
                Explore the marketplace and unlock powerful Grok skills created by the community.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-violet-500 px-8 text-sm font-medium text-white transition hover:brightness-110"
              >
                Browse Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {purchases.map((purchase: any) => {
                const skill = purchase.skill;
                if (!skill) return null;

                return (
                  <div key={purchase.id} className="group border border-zinc-800 bg-[#121212] rounded-2xl p-6 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/marketplace/${skill.slug}`} className="font-semibold text-2xl tracking-tight hover:text-violet-400 transition">
                          {skill.name}
                        </Link>
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          Purchased
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-zinc-400 line-clamp-3">{skill.description}</p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-zinc-800 text-sm space-y-3">
                      <div className="flex justify-between text-zinc-400">
                        <span>Paid</span>
                        <span className="font-medium text-white">${(purchase.amount_cents / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Purchased</span>
                        <span>{new Date(purchase.created_at).toLocaleDateString()}</span>
                      </div>

                      <Link
                        href={`/marketplace/${skill.slug}`}
                        className="inline-flex w-full h-10 items-center justify-center gap-2 rounded-lg border border-zinc-700 text-sm font-medium hover:bg-zinc-900 transition"
                      >
                        <Download className="w-4 h-4" /> View & Download Skill
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Earnings Tab */}
        <TabsContent value="earnings">
          {loading ? (
            <div className="h-40 rounded-2xl border border-zinc-800 bg-zinc-950 animate-pulse" />
          ) : (
            <>
              {/* Total Earnings Summary */}
              <div className="mb-8 rounded-2xl border border-zinc-800 bg-[#121212] p-8">
                <div className="text-sm text-zinc-400 tracking-widest">TOTAL EARNINGS (TEST MODE)</div>
                <div className="mt-2 text-6xl font-semibold tracking-tighter">
                  ${(totalEarnings / 100).toFixed(2)}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  From {earnings.length} sale{earnings.length === 1 ? '' : 's'} across your skills
                </div>
              </div>

              {earnings.length === 0 ? (
                <div className="empty-state border border-zinc-800 rounded-3xl py-16 text-center">
                  <div className="text-2xl font-semibold tracking-tight mb-2">No sales yet</div>
                  <p className="text-zinc-400 max-w-xs mx-auto">
                    Upload paid skills to the Marketplace and start earning when others buy them.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Grouped by skill */}
                  {Object.values(
                    earnings.reduce((acc: any, purchase: any) => {
                      const skill = purchase.skill;
                      if (!skill) return acc;

                      if (!acc[skill.id]) {
                        acc[skill.id] = {
                          skill,
                          total: 0,
                          count: 0,
                          purchases: [],
                        };
                      }
                      acc[skill.id].total += purchase.amount_cents || 0;
                      acc[skill.id].count += 1;
                      acc[skill.id].purchases.push(purchase);
                      return acc;
                    }, {})
                  ).map((group: any) => (
                    <div key={group.skill.id} className="border border-zinc-800 bg-[#121212] rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/marketplace/${group.skill.slug}`} className="font-semibold text-xl hover:text-violet-400">
                            {group.skill.name}
                          </Link>
                          <div className="text-sm text-zinc-400 mt-1">
                            {group.count} sale{group.count > 1 ? 's' : ''} • ${(group.total / 100).toFixed(2)} earned
                          </div>
                        </div>
                        <Link
                          href={`/marketplace/${group.skill.slug}`}
                          className="text-sm text-violet-400 hover:underline"
                        >
                          View Skill →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-12 text-center text-xs text-zinc-600">
        Earnings shown are from test payments only.
      </div>
    </div>
  );
}
