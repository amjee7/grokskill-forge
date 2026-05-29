import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import { getSkillBySlug } from '@/lib/supabase/skills';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to purchase a skill.' },
        { status: 401 }
      );
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Skill slug is required.' }, { status: 400 });
    }

    const skill = await getSkillBySlug(slug);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }

    if (skill.price_cents === 0) {
      return NextResponse.json({ error: 'This skill is free.' }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: skill.currency || 'usd',
            product_data: {
              name: skill.name,
              description: skill.description,
            },
            unit_amount: skill.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/marketplace/${slug}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/marketplace/${slug}?canceled=true`,
      metadata: {
        skill_id: skill.id,
        skill_slug: skill.slug,
        buyer_id: user.id,
      },
      customer_email: user.email ?? undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session.' },
      { status: 500 }
    );
  }
}
