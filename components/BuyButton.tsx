"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  slug: string;
  priceLabel: string;
  priceCents: number;
}

export function BuyButton({ slug, priceLabel, priceCents }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isFree = priceCents === 0;

  const handleClick = async () => {
    if (isFree) {
      // Free skill - directly claim it
      setLoading(true);
      try {
        const res = await fetch("/api/claim-free", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to claim free skill");
        }

        toast.success("Skill added to your library!", {
          description: "You now have full access to download and use this skill.",
        });

        // Refresh the page to show updated access state
        router.refresh();
      } catch (err: any) {
        toast.error("Failed to get skill", {
          description: err.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Paid skill - proceed with checkout
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error("Purchase failed", {
        description: err.message || "Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Button
      size="lg"
      className="btn-forge text-white px-10"
      onClick={handleClick}
      disabled={loading}
    >
      {loading 
        ? (isFree ? "Adding to your library..." : "Redirecting to checkout...") 
        : (isFree ? "Get for Free" : `Buy for ${priceLabel}`)
      }
    </Button>
  );
}
