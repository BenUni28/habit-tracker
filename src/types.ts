export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  color: string;
  description?: string;
  category?: string;
  frequency: Frequency;
  archived: boolean;
  created_at: string;
}

export interface HabitCompletion {
  id: number;
  habit_id: string;
  date: string;
}

export type View = 'today' | 'week' | 'month' | 'stats';
