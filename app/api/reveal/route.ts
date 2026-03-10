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

    // 1. Check if user already revealed today
    const { data: existingUserCard, error: existingError } = await supabase
      .from('user_cards')
      .select('*, card:cards(*)')
      .eq('user_id', userId)
      .eq('revealed_date', todayStr)
      .single();

    if (existingUserCard && !existingError) {
      // Already revealed today
      return NextResponse.json({ card: existingUserCard.card, isNewReveal: false });
    }

    // 2. Not revealed today -> Pick a random card
    // Note: Since the dataset is small (e.g. 12-50 cards), we can just fetch all IDs and pick one in memory,
    // or use a Postgres function. We'll fetch all IDs for simplicity and speed on small tables.
    const { data: allCards, error: allCardsError } = await supabase
      .from('cards')
      .select('id, title, message, affirmation, reflection');

    if (allCardsError || !allCards || allCards.length === 0) {
      return NextResponse.json({ error: 'No cards available' }, { status: 500 });
    }

    const randomIndex = Math.floor(Math.random() * allCards.length);
    const selectedCard = allCards[randomIndex];

    // 3. Save to user_cards
    const { error: insertError } = await supabase
      .from('user_cards')
      .insert({
        user_id: userId,
        card_id: selectedCard.id,
        revealed_date: todayStr,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save daily reveal' }, { status: 500 });
    }

    return NextResponse.json({ card: selectedCard, isNewReveal: true });

  } catch (error) {
    console.error('Reveal API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
