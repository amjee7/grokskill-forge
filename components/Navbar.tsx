"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Hammer, LogOut, User, LayoutDashboard, Compass } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks = [
    { href: "/marketplace", label: "Marketplace", icon: Compass },
  ];

  return (
    <nav className="nav-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center">
              <Hammer className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="font-semibold tracking-tighter text-xl">GrokSkill Forge</div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 transition-colors ${
                    active ? "text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex h-9 items-center gap-2.5 rounded-full pl-2 pr-3 text-sm text-zinc-400 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-zinc-800 text-xs">
                        {user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline max-w-[140px] truncate">
                      {user.email}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <div className="px-2 py-1.5 text-xs text-zinc-500">{user.email}</div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => (window.location.href = "/dashboard")} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => (window.location.href = "/upload")} className="cursor-pointer">
                      <Hammer className="mr-2 h-4 w-4" />
                      Upload Skill
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => (window.location.href = "/login")}>
                    Log in
                  </Button>
                  <Button size="sm" className="btn-forge text-white border-0" onClick={() => (window.location.href = "/signup")}>
                    Get started
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
