import { useState } from 'react';
import { format, startOfWeek, addDays, addWeeks } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';

interface Props {
  habits: Habit[];
  isCompleted: (habitId: string, date: string) => boolean;
  toggleCompletion: (habitId: string, date: string) => void;
  today: string;
}

const DAY_NAMES = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function WeekView({ habits, isCompleted, toggleCompletion, today }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekDayStrings = weekDays.map((d) => format(d, 'yyyy-MM-dd'));

  const weekLabel =
    weekOffset === 0
      ? 'Diese Woche'
      : `${format(weekStart, 'd. MMM', { locale: de })} – ${format(weekDays[6], 'd. MMM yyyy', { locale: de })}`;

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
        <p>Noch keine Gewohnheiten vorhanden</p>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-5 bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-slate-900 dark:text-slate-100 font-medium">{weekLabel}</p>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)} className="text-xs text-indigo-500 dark:text-indigo-400 mt-0.5">
              Heute
            </button>
          )}
        </div>
        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          disabled={weekOffset >= 0}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Grid */}
      <div className="space-y-3">
        {/* Wochentag-Header */}
        <div className="flex items-center gap-1 px-3">
          <div className="flex-1" />
          {weekDays.map((day, i) => {
            const isToday = weekDayStrings[i] === today;
            return (
              <div key={i} className="w-9 text-center">
                <div className={`text-xs font-medium ${isToday ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-500'}`}>
                  {DAY_NAMES[i]}
                </div>
                <div className={`text-xs mt-0.5 ${isToday ? 'text-indigo-500 dark:text-indigo-400 font-bold' : 'text-slate-400 dark:text-slate-600'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Habit-Zeilen */}
        {habits.map((habit) => {
          const doneCount = weekDayStrings.filter((d) => isCompleted(habit.id, d)).length;
          return (
            <div key={habit.id} className="bg-white dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />
                <span className="text-slate-900 dark:text-slate-100 font-medium flex-1 text-sm truncate">{habit.name}</span>
                <span className="text-xs text-slate-500 font-medium">
                  {doneCount}
                  <span className="text-slate-300 dark:text-slate-700">/7</span>
                </span>
              </div>
              <div className="flex gap-1">
                {weekDays.map((_, i) => {
                  const dateStr = weekDayStrings[i];
                  const done = isCompleted(habit.id, dateStr);
                  const isToday = dateStr === today;
                  const isFuture = dateStr > today;
                  return (
                    <button
                      key={i}
                      onClick={() => !isFuture && toggleCompletion(habit.id, dateStr)}
                      disabled={isFuture}
                      className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
                        done
                          ? 'border-transparent'
                          : isToday
                          ? 'border-slate-400 dark:border-slate-500 border-dashed'
                          : isFuture
                          ? 'border-slate-100 dark:border-slate-800 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer'
                      }`}
                      style={done ? { backgroundColor: habit.color } : {}}
                    >
                      {done && (
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3}>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
