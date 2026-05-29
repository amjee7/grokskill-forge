"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  slug: string;
  priceLabel: string;
}

export function BuyButton({ slug, priceLabel }: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBuy = async () => {
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
        // Redirect to Stripe Checkout
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
      onClick={handleBuy}
      disabled={loading}
    >
      {loading ? "Redirecting to checkout..." : `Buy for ${priceLabel}`}
    </Button>
  );
}
