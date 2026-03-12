import { useState, useEffect, useCallback } from 'react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { supabase } from '../lib/supabase';
import { Habit, HabitCompletion, Frequency } from '../types';

interface HabitInput {
  name: string;
  color: string;
  description?: string;
  category?: string;
  frequency: Frequency;
}

export function useHabits(userId: string | null) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  const fetchAll = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const oneYearAgo = format(subDays(new Date(), 365), 'yyyy-MM-dd');
      const [habitsRes, completionsRes] = await Promise.all([
        supabase.from('habits').select('*').eq('archived', false).eq('user_id', userId)
          .order('position', { ascending: true }).order('created_at', { ascending: true }),
        supabase.from('habit_completions').select('*').gte('date', oneYearAgo),
      ]);
      if (habitsRes.error) throw habitsRes.error;
      if (completionsRes.error) throw completionsRes.error;
      setHabits(habitsRes.data ?? []);
      setCompletions(completionsRes.data ?? []);
    } catch (e) {
      console.error(e);
      setError('Verbindung zu Supabase fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { setLoading(true); fetchAll(); }, [fetchAll]);

  const isCompleted = (habitId: string, date: string = today): boolean =>
    completions.some((c) => c.habit_id === habitId && c.date === date);

  const isCompletedForPeriod = (habit: Habit, forDate: string = today): boolean => {
    const freq = habit.frequency ?? 'daily';
    if (freq === 'daily') return isCompleted(habit.id, forDate);
    if (freq === 'weekly') {
      const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
      return completions.some((c) => c.habit_id === habit.id && c.date >= weekStart && c.date <= weekEnd);
    }
    const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
    const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
    return completions.some((c) => c.habit_id === habit.id && c.date >= monthStart && c.date <= monthEnd);
  };

  const toggleCompletion = async (habitId: string, date: string = today) => {
    const existing = completions.find((c) => c.habit_id === habitId && c.date === date);
    if (existing) {
      setCompletions((prev) => prev.filter((c) => c.id !== existing.id));
      const { error } = await supabase.from('habit_completions').delete().eq('id', existing.id);
      if (error) setCompletions((prev) => [...prev, existing]);
    } else {
      const temp: HabitCompletion = { id: -Date.now(), habit_id: habitId, date };
      setCompletions((prev) => [...prev, temp]);
      const { data, error } = await supabase.from('habit_completions').insert({ habit_id: habitId, date }).select().single();
      if (error) setCompletions((prev) => prev.filter((c) => c.id !== temp.id));
      else if (data) setCompletions((prev) => prev.map((c) => (c.id === temp.id ? data : c)));
    }
  };

  const addHabit = async (input: HabitInput) => {
    if (!userId) return;
    const position = habits.length;
    const { data, error } = await supabase.from('habits').insert({ ...input, user_id: userId, position }).select().single();
    if (!error && data) setHabits((prev) => [...prev, data]);
  };

  const editHabit = async (id: string, updates: Partial<HabitInput>) => {
    const { error } = await supabase.from('habits').update(updates).eq('id', id);
    if (!error) setHabits((prev) => prev.map((h) => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHabit = async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => prev.filter((c) => c.habit_id !== id));
    await supabase.from('habits').delete().eq('id', id);
  };

  // Reihenfolge neu setzen (Drag & Drop)
  const reorderHabits = async (newOrder: Habit[]) => {
    setHabits(newOrder);
    await Promise.all(
      newOrder.map((habit, index) =>
        supabase.from('habits').update({ position: index }).eq('id', habit.id)
      )
    );
  };

  const getStreak = (habitId: string): number => {
    let streak = 0;
    let date = new Date();
    if (!isCompleted(habitId, format(date, 'yyyy-MM-dd'))) date = subDays(date, 1);
    while (streak < 365) {
      if (!isCompleted(habitId, format(date, 'yyyy-MM-dd'))) break;
      streak++;
      date = subDays(date, 1);
    }
    return streak;
  };

  const getBestStreak = (habitId: string): number => {
    const sorted = completions.filter((c) => c.habit_id === habitId).map((c) => c.date).sort();
    if (sorted.length === 0) return 0;
    let best = 1, current = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round((new Date(sorted[i] + 'T12:00:00').getTime() - new Date(sorted[i - 1] + 'T12:00:00').getTime()) / 86400000);
      if (diff === 1) { current++; if (current > best) best = current; }
      else if (diff > 1) current = 1;
    }
    return best;
  };

  const getCompletionRate = (habitId: string, days = 30): number => {
    const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');
    const count = completions.filter((c) => c.habit_id === habitId && c.date >= startDate && c.date <= today).length;
    return Math.round((count / days) * 100);
  };

  const getHeatmapData = (): Array<{ date: string; count: number }> =>
    Array.from({ length: 84 }, (_, i) => {
      const date = format(subDays(new Date(), 83 - i), 'yyyy-MM-dd');
      return { date, count: completions.filter((c) => c.date === date).length };
    });

  return {
    habits, completions, loading, error, today,
    isCompleted, isCompletedForPeriod, toggleCompletion,
    addHabit, editHabit, deleteHabit, reorderHabits,
    getStreak, getBestStreak, getCompletionRate, getHeatmapData,
  };
}
