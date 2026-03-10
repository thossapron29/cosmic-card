import { Card } from './card';

export interface UserCard {
  id: string; // uuid
  user_id: string;
  card_id: string;
  revealed_date: string; // YYYY-MM-DD
  created_at?: string;
  card?: Card;
}
