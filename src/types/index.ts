export type Frequency = 'daily' | 'weekly' | 'monthly';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  frequency: Frequency;
  createdAt: string; // ISO format
  archived: boolean;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // ISO format YYYY-MM-DD
  completed: boolean;
  timestamp: string; // ISO format
}

export interface Statistics {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  avgCompletionRate: number;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
  completionRate: number;
}
