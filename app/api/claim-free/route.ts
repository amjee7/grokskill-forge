import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be logged in to claim a skill.' },
        { status: 401 }
      );
    }

    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Skill slug is required.' }, { status: 400 });
    }

    const { data: skill, error: skillError } = await supabase
      .from('skills')
      .select('id, price_cents')
      .eq('slug', slug)
      .single();

    if (skillError || !skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }

    if (skill.price_cents !== 0) {
      return NextResponse.json({ error: 'This skill is not free.' }, { status: 400 });
    }

    // Check if user already has it
    const { data: existing } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', user.id)
      .eq('skill_id', skill.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ success: true, message: 'Already in your library' });
    }

    // Record the free claim
    const { error: insertError } = await supabase.from('purchases').insert({
      buyer_id: user.id,
      skill_id: skill.id,
      stripe_session_id: `free-${Date.now()}`, // marker for free claims
      amount_cents: 0,
      currency: 'usd',
      status: 'succeeded',
    });

    if (insertError) {
      console.error('Error claiming free skill:', insertError);
      return NextResponse.json({ error: 'Failed to claim skill.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Claim free error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to claim free skill.' },
      { status: 500 }
    );
  }
}
