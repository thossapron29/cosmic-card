export interface Deck {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image_key: string | null;
  theme_key: string | null;
  is_active: boolean;
  is_premium: boolean;
  sort_order: number;
  card_count?: number;
  is_locked?: boolean;
  access_reason?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeckPreviewCard {
  id: string;
  slug: string;
  card_no: number;
  title: string;
  short_message: string;
  category: string;
  energy_tag: string;
  image_key: string;
}

export interface DeckListResponse {
  success: true;
  decks: Deck[];
}

export interface DeckDetailResponse {
  success: true;
  deck: Deck;
  preview_cards: DeckPreviewCard[];
}
