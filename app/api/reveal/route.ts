import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getTodayDateStr } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const payload = await request.json();
    const { userId, localDateStr } = payload;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const todayStr = localDateStr || getTodayDateStr();

    // Pick a random card (unlimited reveals)
    const { data: allCards, error: allCardsError } = await supabase
      .from('cards')
      .select('id, title, message, affirmation, reflection');

    if (allCardsError || !allCards || allCards.length === 0) {
      return NextResponse.json({ error: 'No cards available' }, { status: 500 });
    }

    const randomIndex = Math.floor(Math.random() * allCards.length);
    const selectedCard = allCards[randomIndex];

    // Save to user_cards history (no unique constraint)
    const { error: insertError } = await supabase
      .from('user_cards')
      .insert({
        user_id: userId,
        card_id: selectedCard.id,
        revealed_date: todayStr,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      // Continue even if insert fails (constraint may still exist)
    }

    return NextResponse.json({ card: selectedCard, isNewReveal: true });

  } catch (error) {
    console.error('Reveal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
