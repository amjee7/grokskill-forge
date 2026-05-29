"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSkillAction } from "./actions";

const CATEGORIES = [
  "development",
  "devops",
  "productivity",
  "research",
  "writing",
  "testing",
] as const;

const PRICE_TIERS = [
  { label: "Free", value: "0" },
  { label: "$4.99", value: "499" },
  { label: "$9.99", value: "999" },
  { label: "$19.99", value: "1999" },
  { label: "$29.99", value: "2999" },
  { label: "Custom amount", value: "custom" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="btn-forge text-white h-12 px-10 text-base flex-1"
    >
      {pending ? "Publishing..." : "Publish to Marketplace"}
    </Button>
  );
}


export default function UploadSkillPage() {
  const [selectedPrice, setSelectedPrice] = useState("0");
  const [customPrice, setCustomPrice] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="mb-10">
        <h1 className="text-5xl font-semibold tracking-tighter">Upload a New Skill</h1>
        <p className="mt-3 text-xl text-zinc-400">
          Share your reusable Grok workflow with the community. You can set it as free or charge for it.
        </p>
      </div>

      <form action={createSkillAction} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="name">Skill Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. deploy-staging"
            required
            className="h-12 text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="What does this skill do? One or two sentences."
            required
            rows={3}
            className="resize-y"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Skill Content (SKILL.md body)</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Paste the full instructions / markdown content here..."
            required
            rows={12}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="deploy, ci, staging"
            />
          </div>
        </div>

        {/* Price Section */}
        <div className="space-y-4 border border-zinc-800 rounded-2xl p-6 bg-[#121212]">
          <Label className="text-base">Pricing</Label>

          <input type="hidden" name="priceTier" value={selectedPrice} />

          <div className="space-y-2">
            <Select
              value={selectedPrice}
              onValueChange={(val) => setSelectedPrice(val || "0")}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    {tier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPrice === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customPrice">Custom Price (USD)</Label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-zinc-400">$</span>
                <Input
                  id="customPrice"
                  name="customPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="49.99"
                  className="pl-8 h-12"
                  required
                />
              </div>
              <p className="text-xs text-zinc-500">Enter the amount in dollars (e.g. 49.99)</p>
            </div>
          )}

          <p className="text-xs text-zinc-500 pt-1">
            Buyers will pay this amount (in test mode) to unlock the full skill content.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <SubmitButton />
          <Link 
            href="/dashboard" 
            className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-700 px-8 text-sm font-medium transition hover:bg-zinc-900"
          >
            Cancel
          </Link>
        </div>

        <p className="text-center text-xs text-zinc-500">
          Your skill will be publicly visible in the Marketplace immediately.
        </p>
      </form>
    </div>
  );
}
