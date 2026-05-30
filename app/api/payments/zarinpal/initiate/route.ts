import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const isSandbox = process.env.NEXT_PUBLIC_ZARINPAL_SANDBOX === 'true';
const ZARINPAL_BASE = isSandbox 
  ? 'https://sandbox.zarinpal.com' 
  : 'https://api.zarinpal.com';

const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID!;

export async function POST(request: NextRequest) {
  try {
    const { skillId, amountToman, description } = await request.json();

    if (!skillId || !amountToman) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const callbackUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/zarinpal/verify?skill_id=${skillId}`;

    const response = await fetch(`${ZARINPAL_BASE}/pg/v4/payment/request.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        merchant_id: MERCHANT_ID,
        amount: amountToman,
        callback_url: callbackUrl,
        description: description || 'خرید مهارت از GrokSkill Forge',
        metadata: {
          email: user.email,
        },
      }),
    });

    const result = await response.json();

    if (result.data?.authority) {
      const redirectUrl = `${ZARINPAL_BASE}/pg/StartPay/${result.data.authority}`;
      
      return NextResponse.json({
        success: true,
        authority: result.data.authority,
        redirectUrl,
      });
    } else {
      console.error('Zarinpal error:', result.errors);
      return NextResponse.json(
        { error: 'Failed to create Zarinpal payment', details: result.errors },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Zarinpal initiate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

Now the verify route.