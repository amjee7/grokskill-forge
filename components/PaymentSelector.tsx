"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet } from "lucide-react";

interface PaymentSelectorProps {
  skill: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
  };
  onStripeCheckout: () => void;
  onZarinpalCheckout: (amountToman: number) => void;
}

export function PaymentSelector({ 
  skill, 
  onStripeCheckout, 
  onZarinpalCheckout 
}: PaymentSelectorProps) {
  const [currency, setCurrency] = useState<"toman" | "usd">("toman");

  const USD_TO_TOMAN = 65000;
  const usdPrice = (skill.price_cents / 100).toFixed(2);
  const tomanPrice = Math.round((skill.price_cents / 100) * USD_TO_TOMAN);

  const handlePay = () => {
    if (currency === "usd") {
      onStripeCheckout();
    } else {
      onZarinpalCheckout(tomanPrice);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-zinc-400 mb-2">انتخاب واحد پرداخت</div>
        <Tabs value={currency} onValueChange={(v) => setCurrency(v as "toman" | "usd")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="toman" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              تومان (ایرانی)
            </TabsTrigger>
            <TabsTrigger value="usd" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              دلار (بین‌المللی)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="border-zinc-800 bg-[#121212]">
        <CardContent className="pt-6">
          {currency === "toman" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">پرداخت تومانی با زرین‌پال</div>
                  <div className="text-sm text-emerald-400">پیش‌فرض برای کاربران ایرانی</div>
                </div>
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">
                  توصیه‌شده
                </Badge>
              </div>
              <div className="text-3xl font-semibold tracking-tight">
                {tomanPrice.toLocaleString("fa-IR")} تومان
              </div>
              <div className="text-xs text-zinc-500">
                پرداخت امن از طریق درگاه زرین‌پال (سندباکس برای تست)
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="font-medium">پرداخت دلاری با Stripe</div>
                <div className="text-sm text-blue-400">برای کاربران بین‌المللی</div>
              </div>
              <div className="text-3xl font-semibold tracking-tight">
                ${usdPrice}
              </div>
              <div className="text-xs text-zinc-500">
                پرداخت بین‌المللی از طریق Stripe (Test Mode)
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={handlePay} 
        className="w-full h-12 text-base btn-forge"
      >
        {currency === "toman" ? "پرداخت با زرین‌پال" : "Pay with Stripe"}
      </Button>

      <p className="text-center text-xs text-zinc-500">
        {currency === "toman" 
          ? "شما به درگاه پرداخت زرین‌پال منتقل می‌شوید" 
          : "You will be redirected to Stripe Checkout"}
      </p>
    </div>
  );
}
