"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.", {
          description: "You can also continue with the magic link in your inbox.",
        });
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
      toast.success("Magic link sent!", { description: "Check your email inbox." });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center">
            <span className="text-white text-lg">⚒</span>
          </div>
        </div>
        <h1 className="text-4xl font-semibold tracking-tighter">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-zinc-400 mt-2">
          {mode === "login" ? "Sign in to manage your skills" : "Start forging and publishing skills today"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-xs tracking-widest text-zinc-500">EMAIL</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@company.com"
            className="mt-1.5 h-12 bg-zinc-950 border-zinc-800"
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-xs tracking-widest text-zinc-500">PASSWORD</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
            className="mt-1.5 h-12 bg-zinc-950 border-zinc-800"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-12 btn-forge text-white mt-2">
          {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-[#0a0a0a] px-3 text-zinc-500">OR</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-12 border-zinc-700"
        onClick={handleMagicLink}
        disabled={loading}
      >
        Send magic link instead
      </Button>

      <p className="text-center text-sm text-zinc-500 mt-8">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link href="/signup" className="text-white hover:underline">Create an account</Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">Sign in</Link>
          </>
        )}
      </p>
    </div>
  );
}
