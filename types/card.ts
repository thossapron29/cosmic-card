export interface Card {
  id: string; // uuid
  title: string;
  message: string;
  affirmation: string;
  reflection: string;
  created_at?: string;
}
