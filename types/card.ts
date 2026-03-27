export interface Card {
  id: string; // uuid
  deck_id: string | null;
  slug: string;
  card_no: number;
  title: string;
  short_message: string;
  full_message: string;
  category: string;
  energy_tag: string;
  image_key: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
