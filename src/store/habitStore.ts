import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Habit, HabitCompletion, HabitStreak, DailyStats } from '../types';
import { getTodayString, calculateStreak, calculateLongestStreak, getLastNDays } from '../utils/dateHelpers';

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];
  
  // Habit management
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  archiveHabit: (id: string) => void;
  unarchiveHabit: (id: string) => void;
  
  // Completion tracking
  toggleCompletion: (habitId: string, date: string) => void;
  markComplete: (habitId: string, date: string) => void;
  markIncomplete: (habitId: string, date: string) => void;
  
  // Query methods
  getHabit: (id: string) => Habit | undefined;
  getActiveHabits: () => Habit[];
  getArchivedHabits: () => Habit[];
  getCompletion: (habitId: string, date: string) => HabitCompletion | undefined;
  isHabitCompleted: (habitId: string, date: string) => boolean;
  getHabitStreak: (habitId: string) => HabitStreak;
  getDailyStats: (date: string) => DailyStats;
  getWeeklyStats: () => DailyStats[];
  
  // Data management
  clearAllData: () => void;
  exportData: () => { habits: Habit[]; completions: HabitCompletion[] };
  importData: (data: { habits: Habit[]; completions: HabitCompletion[] }) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],

      addHabit: (habitData) => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newHabit: Habit = {
          ...habitData,
          id,
          createdAt: new Date().toISOString(),
          archived: false,
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
        }));
      },

      updateHabit: (id, updates) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates as Habit } : h)),
        }));
      },

      deleteHabit: (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter((c) => c.habitId !== id),
        }));
      },

      archiveHabit: (id) => {
        get().updateHabit(id, { archived: true });
      },

      unarchiveHabit: (id) => {
        get().updateHabit(id, { archived: false });
      },

      toggleCompletion: (habitId, date) => {
        const isCompleted = get().isHabitCompleted(habitId, date);
        if (isCompleted) {
          get().markIncomplete(habitId, date);
        } else {
          get().markComplete(habitId, date);
        }
      },

      markComplete: (habitId, date) => {
        const existing = get().getCompletion(habitId, date);
        if (existing) return;

        const completion: HabitCompletion = {
          habitId,
          date,
          completed: true,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          completions: [...state.completions, completion],
        }));
      },

      markIncomplete: (habitId, date) => {
        set((state) => ({
          completions: state.completions.filter(
            (c) => !(c.habitId === habitId && c.date === date)
          ),
        }));
      },

      getHabit: (id) => {
        return get().habits.find((h) => h.id === id);
      },

      getActiveHabits: () => {
        return get().habits.filter((h) => !h.archived);
      },

      getArchivedHabits: () => {
        return get().habits.filter((h) => h.archived);
      },

      getCompletion: (habitId, date) => {
        return get().completions.find((c) => c.habitId === habitId && c.date === date);
      },

      isHabitCompleted: (habitId, date) => {
        return get().completions.some((c) => c.habitId === habitId && c.date === date && c.completed);
      },

      getHabitStreak: (habitId) => {
        const completions = get().completions.filter((c) => c.habitId === habitId);
        const completionMap = new Map(completions.map((c) => [c.date, c.completed]));
        
        const today = getTodayString();
        const allDates = getLastNDays(365); // Last year

        const currentStreak = calculateStreak(completionMap, today);
        const longestStreak = calculateLongestStreak(completionMap, allDates);

        const lastCompletion = completions
          .filter((c) => c.completed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        return {
          habitId,
          currentStreak,
          longestStreak,
          lastCompletedDate: lastCompletion?.date,
        };
      },

      getDailyStats: (date) => {
        const habits = get().getActiveHabits();
        const completions = get().completions.filter((c) => c.date === date && c.completed);

        let total = 0;
        let completed = 0;

        for (const habit of habits) {
          if (habit.frequency === 'daily') {
            total++;
            if (completions.some((c) => c.habitId === habit.id)) {
              completed++;
            }
          }
        }

        return {
          date,
          completed,
          total,
          completionRate: total > 0 ? (completed / total) * 100 : 0,
        };
      },

      getWeeklyStats: () => {
        const days = getLastNDays(7);
        return days.map((date) => get().getDailyStats(date));
      },

      clearAllData: () => {
        set({ habits: [], completions: [] });
      },

      exportData: () => {
        return {
          habits: get().habits,
          completions: get().completions,
        };
      },

      importData: (data) => {
        set({
          habits: data.habits,
          completions: data.completions,
        });
      },
    }),
    {
      name: 'habit-tracker-storage',
    }
  )
);
