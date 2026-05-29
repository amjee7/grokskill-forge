import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const skillId = session.metadata?.skill_id;
    const buyerId = session.metadata?.buyer_id;
    const amount = session.amount_total;

    if (!skillId || !buyerId || !amount) {
      console.error('Missing metadata in checkout session:', session.id);
      return NextResponse.json({ received: true });
    }

    // Use Supabase Service Role client for webhook (bypasses RLS)
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

    const { error } = await supabaseAdmin.from('purchases').insert({
      buyer_id: buyerId,
      skill_id: skillId,
      stripe_session_id: session.id,
      amount_cents: amount,
      currency: session.currency || 'usd',
      status: 'succeeded',
    });

    if (error) {
      console.error('Failed to record purchase:', error);
      // Still return 200 so Stripe doesn't retry forever
    } else {
      console.log(`Purchase recorded for session ${session.id}`);
    }
  } else {
    // Log other events for now
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
