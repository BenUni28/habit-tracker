import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useHabitStore } from '../../store/habitStore';

export const Statistics: React.FC = () => {
  const { getActiveHabits, getWeeklyStats, getHabitStreak } = useHabitStore();

  const activeHabits = useMemo(() => getActiveHabits(), [getActiveHabits()]);

  const weeklyData = useMemo(() => {
    return getWeeklyStats().map((stat) => ({
      date: stat.date.slice(-2),
      completed: stat.completed,
      total: stat.total,
      rate: Math.round(stat.completionRate),
    }));
  }, [getWeeklyStats()]);

  const habitStreaks = useMemo(() => {
    return activeHabits
      .map((h) => ({
        name: h.name,
        ...getHabitStreak(h.id),
      }))
      .sort((a, b) => b.currentStreak - a.currentStreak);
  }, [activeHabits, getHabitStreak]);

  // habitCompletionData für zukünftiges Use-Case reserviert
  // const habitCompletionData = useMemo(() => { ... }, [activeHabits]);

  const stats = useMemo(() => {
    const totalHabits = activeHabits.length;
    const avgStreak =
      habitStreaks.length > 0
        ? Math.round(habitStreaks.reduce((sum, h) => sum + h.currentStreak, 0) / habitStreaks.length)
        : 0;
    const bestStreak = habitStreaks[0]?.longestStreak || 0;

    return { totalHabits, avgStreak, bestStreak };
  }, [activeHabits, habitStreaks]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Aktive Habits</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{stats.totalHabits}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Ø Aktuelle Serie</p>
          <p className="text-4xl font-bold text-amber-600 dark:text-amber-400">{stats.avgStreak}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Beste Serie</p>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats.bestStreak}</p>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wöchentlicher Fortschritt</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Erledigt" radius={[8, 8, 0, 0]} />
            <Bar dataKey="total" fill="#3b82f6" name="Gesamt" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Completion Rate Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Erledigungsquote</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#8b5cf6"
              name="Erfolgsquote (%)"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Streaks */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Serien</h3>
        {habitStreaks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Keine Habits mit Serien vorhanden.</p>
        ) : (
          <div className="space-y-3">
            {habitStreaks.slice(0, 5).map((habit, idx) => (
              <div
                key={habit.habitId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-600 dark:text-gray-300">#{idx + 1}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{habit.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Längste Serie: {habit.longestStreak} Tage
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Aktuell</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{habit.currentStreak}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
