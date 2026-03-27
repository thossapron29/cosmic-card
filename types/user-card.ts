import { Card } from './card';

export interface UserCard {
  id: string; // uuid
  user_id: string;
  profile_id?: string | null;
  anonymous_device_id?: string | null;
  card_id: string;
  deck_id?: string | null;
  revealed_at: string;
  local_date: string; // YYYY-MM-DD
  reveal_type: string;
  interpretation_mode?: string | null;
  source_context?: Record<string, unknown> | null;
  share_theme_used?: string | null;
  is_favorite: boolean;
  favorited_at: string | null;
  journal_note: string | null;
  journal_updated_at: string | null;
  created_at?: string;
  card?: Card | null;
}

export interface HistoryListResponse {
  success: true;
  history: UserCard[];
}

export interface HistoryDetailResponse {
  success: true;
  item: UserCard;
}

export interface RevealResponse {
  success: true;
  user_card_id: string;
  user_card: UserCard;
  card: Card;
}
