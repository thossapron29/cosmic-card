import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getTodayDateStr } from '@/lib/utils';
import { USER_CARD_SELECT, selectRandomCard } from '@/lib/server/select-random-card';
import { getViewerContext } from '@/lib/server/viewer';
import { canAccessDeck } from '@/lib/access/control';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const payload = await request.json();
    const userId = typeof payload?.userId === 'string' ? payload.userId.trim() : '';
    const deckSlug = typeof payload?.deckSlug === 'string' ? payload.deckSlug.trim() : '';
    const localDate =
      typeof payload?.localDate === 'string'
        ? payload.localDate
        : typeof payload?.localDateStr === 'string'
          ? payload.localDateStr
          : undefined;

    const viewer = await getViewerContext(supabase, {
      anonymousId: userId || null,
      ensureAnonymous: !Boolean(await supabase.auth.getUser().then(({ data }) => data.user)),
    });

    if (!viewer.profileId && !userId) {
      return NextResponse.json({ error: 'User ID is required for anonymous reveal' }, { status: 400 });
    }

    let deckId: string | null = null;
    let selectedDeck:
      | {
          id: string;
          slug: string;
          is_premium: boolean;
        }
      | null = null;

    if (deckSlug) {
      const { data: deck, error: deckError } = await supabase
        .from('decks')
        .select('id, slug, is_premium')
        .eq('slug', deckSlug)
        .eq('is_active', true)
        .single();

      if (deckError || !deck) {
        return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
      }

      const access = canAccessDeck(viewer, deck);
      if (!access.can_access) {
        return NextResponse.json(
          { error: 'Premium deck access required', premiumRequired: true },
          { status: 403 }
        );
      }

      selectedDeck = deck;
      deckId = deck.id;
    }

    const selectedCard = await selectRandomCard(supabase, { deckId });
    const nowIso = new Date().toISOString();
    const todayStr = localDate || getTodayDateStr();

    const { data: insertedUserCard, error: insertError } = await supabase
      .from('user_cards')
      .insert({
        user_id: userId || viewer.profileId || 'authenticated',
        profile_id: viewer.profileId,
        anonymous_device_id: viewer.anonymousDeviceId,
        card_id: selectedCard.id,
        deck_id: selectedCard.deck_id,
        revealed_at: nowIso,
        local_date: todayStr,
        reveal_type: 'standard',
        interpretation_mode: 'standard',
        source_context: deckSlug ? { deckSlug } : {},
      })
      .select(USER_CARD_SELECT)
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save reveal history' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      user_card_id: insertedUserCard.id,
      user_card: insertedUserCard,
      card: selectedCard,
      deck: selectedDeck,
    });

  } catch (error) {
    console.error('Reveal API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message === 'No active cards available' ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
