export type Frequency = 'daily' | 'weekly' | 'monthly';

export const CATEGORIES = [
  'Gesundheit',
  'Sport & Fitness',
  'Lernen & Bildung',
  'Produktivität',
  'Ernährung',
  'Schlaf',
  'Achtsamkeit',
  'Soziales',
  'Finanzen',
  'Kreativität',
  'Sonstiges',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Habit {
  id: string;
  name: string;
  color: string;
  description?: string;
  category?: string;
  frequency: Frequency;
  archived: boolean;
  created_at: string;
  user_id?: string;
  position: number;
}

export interface HabitCompletion {
  id: number;
  habit_id: string;
  date: string;
}

export interface Todo {
  id: string;
  user_id: string;
  date: string;
  text: string;
  done: boolean;
  created_at: string;
}

export type View = 'today' | 'week' | 'month' | 'stats' | 'todos';
