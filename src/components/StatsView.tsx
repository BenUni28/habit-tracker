import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Flame, TrendingUp, CheckSquare, Target } from 'lucide-react';
import { Habit, HabitCompletion } from '../types';

interface Props {
  habits: Habit[];
  completions: HabitCompletion[];
  getStreak: (habitId: string) => number;
  getBestStreak: (habitId: string) => number;
  getCompletionRate: (habitId: string, days?: number) => number;
  getHeatmapData: () => Array<{ date: string; count: number }>;
  today: string;
  isDark: boolean;
}

function heatmapColor(count: number, maxCount: number, dark: boolean): string {
  if (count === 0) return dark ? '#1e293b' : '#f1f5f9';
  const ratio = count / Math.max(maxCount, 1);
  if (ratio < 0.25) return dark ? '#312e81' : '#c7d2fe';
  if (ratio < 0.5) return dark ? '#4338ca' : '#818cf8';
  if (ratio < 0.75) return dark ? '#6366f1' : '#6366f1';
  return dark ? '#818cf8' : '#4338ca';
}

export function StatsView({
  habits,
  completions,
  getStreak,
  getBestStreak,
  getCompletionRate,
  getHeatmapData,
  today,
  isDark,
}: Props) {
  const heatmapData = useMemo(() => getHeatmapData(), [completions]);
  const maxHeatmapCount = useMemo(
    () => Math.max(...heatmapData.map((d) => d.count), 1),
    [heatmapData],
  );

  const weeks = useMemo(() => {
    const result: typeof heatmapData[] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);

  const thisMonthStart = today.slice(0, 7) + '-01';
  const completionsThisMonth = completions.filter((c) => c.date >= thisMonthStart && c.date <= today).length;
  const todayCompletions = completions.filter((c) => c.date === today).length;
  const todayRate = habits.length > 0 ? Math.round((todayCompletions / habits.length) * 100) : 0;
  const overallBestStreak = habits.length > 0 ? Math.max(...habits.map((h) => getBestStreak(h.id)), 0) : 0;

  const chartData = habits.map((h) => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + '…' : h.name,
    rate: getCompletionRate(h.id, 30),
    color: h.color,
  }));

  const tooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    color: isDark ? '#f1f5f9' : '#0f172a',
    fontSize: '13px',
  };

  const barBg = isDark ? '#0f172a' : '#f8fafc';

  return (
    <div className="space-y-5">
      {/* Summary Cards (2×2) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target size={15} className="text-indigo-500 dark:text-indigo-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aktive Habits</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{habits.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare size={15} className="text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Diesen Monat</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{completionsThisMonth}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Completions</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={15} className="text-orange-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bester Streak</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{overallBestStreak}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Tage</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={15} className="text-blue-500 dark:text-blue-400" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Heute</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{todayRate}%</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">erledigt</p>
        </div>
      </div>

      {/* Completion Rate Chart */}
      {habits.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-slate-100 font-semibold">Completion Rate</h3>
          <p className="text-xs text-slate-500 mb-4 mt-0.5">letzte 30 Tage pro Habit</p>
          <ResponsiveContainer width="100%" height={Math.max(habits.length * 46, 60)}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 45, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 11 }}
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                formatter={(value: number) => [`${value}%`, 'Rate']}
                contentStyle={tooltipStyle}
              />
              <Bar dataKey="rate" radius={[0, 6, 6, 0]} background={{ fill: barBg, radius: 6 }}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Heatmap */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
        <h3 className="text-slate-900 dark:text-slate-100 font-semibold">Aktivitäts-Heatmap</h3>
        <p className="text-xs text-slate-500 mb-4 mt-0.5">letzte 12 Wochen</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1 flex-shrink-0">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="w-7 h-7 rounded-md transition-colors cursor-default"
                  style={{ backgroundColor: heatmapColor(day.count, maxHeatmapCount, isDark) }}
                  title={`${day.date}: ${day.count} erledigt`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs text-slate-500">Weniger</span>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-sm"
              style={{ backgroundColor: heatmapColor(i, 4, isDark) }}
            />
          ))}
          <span className="text-xs text-slate-500">Mehr</span>
        </div>
      </div>

      {/* Streak-Tabelle */}
      {habits.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-900 dark:text-slate-100 font-semibold mb-4">Streaks</h3>
          <div className="space-y-3">
            {habits.map((habit) => {
              const current = getStreak(habit.id);
              const best = getBestStreak(habit.id);
              const rate = getCompletionRate(habit.id, 30);
              return (
                <div key={habit.id}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                    <span className="text-slate-800 dark:text-slate-200 text-sm flex-1 truncate font-medium">{habit.name}</span>
                    <div className="flex gap-5 text-right flex-shrink-0">
                      <div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Aktuell</div>
                        <div className="text-sm font-bold text-orange-400 flex items-center justify-end gap-0.5">
                          {current > 0 && <Flame size={11} />}
                          {current}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">Bester</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{best}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">30 Tage</div>
                        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{rate}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${rate}%`, backgroundColor: habit.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
