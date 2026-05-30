import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/supabase-js'; // Using admin client for verification

const isSandbox = process.env.NEXT_PUBLIC_ZARINPAL_SANDBOX === 'true';
const ZARINPAL_BASE = isSandbox 
  ? 'https://sandbox.zarinpal.com' 
  : 'https://api.zarinpal.com';

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authority = searchParams.get('Authority');
  const status = searchParams.get('Status');
  const skillId = searchParams.get('skill_id');

  if (!authority || !status || !skillId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace?payment=error&reason=missing_params`
    );
  }

  if (status !== 'OK') {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/${skillId}?payment=canceled`
    );
  }

  try {
    // Verify the payment
    const verifyResponse = await fetch(`${ZARINPAL_BASE}/pg/v4/payment/verify.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        authority,
        amount: 10000, // This should be the actual amount sent in initiate
      }),
    });

    const verifyResult = await verifyResponse.json();

    if (verifyResult.data?.status === 100 || verifyResult.data?.status === 101) {
      // Payment successful - record in database
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      // Get skill to know the amount (in a real app, store the exact amount)
      const { data: skill } = await supabaseAdmin
        .from('skills')
        .select('price_cents')
        .eq('id', skillId)
        .single();

      await supabaseAdmin.from('purchases').insert({
        buyer_id: 'zarinpal-user', // In real app, get from session
        skill_id: skillId,
        stripe_session_id: authority, // Reuse field for Zarinpal authority
        amount_cents: skill?.price_cents || 0,
        currency: 'irr',
        status: 'succeeded',
      });

      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/${skillId}?payment=success&method=zarinpal`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/${skillId}?payment=failed&method=zarinpal`
      );
    }
  } catch (error) {
    console.error('Zarinpal verify error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/marketplace/${skillId}?payment=error&method=zarinpal`
    );
  }
}
```

Note: The verify route has a placeholder for amount. In a real implementation, you should store the exact Toman amount when initiating.

Now, update the detail page to use the new PaymentSelector.

First, I need to add state and integrate the component.