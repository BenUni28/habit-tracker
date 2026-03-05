import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Habit } from '../types';

interface Props {
  habits: Habit[];
  isCompleted: (habitId: string, date: string) => boolean;
  today: string;
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function MonthView({ habits, isCompleted, today }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  const isCurrentMonth = format(currentDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-5 bg-slate-800 rounded-2xl p-3 border border-slate-700">
        <button
          onClick={() => setCurrentDate((d) => subMonths(d, 1))}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <p className="text-slate-100 font-medium capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </p>
          {!isCurrentMonth && (
            <button onClick={() => setCurrentDate(new Date())} className="text-xs text-indigo-400 mt-0.5">
              Heute
            </button>
          )}
        </div>
        <button
          onClick={() => setCurrentDate((d) => addMonths(d, 1))}
          disabled={isCurrentMonth}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Kalender */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Wochentage-Header */}
        <div className="grid grid-cols-7 border-b border-slate-700">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-xs font-medium text-slate-500">
              {d}
            </div>
          ))}
        </div>

        {/* Tage-Grid */}
        <div className="grid grid-cols-7">
          {calDays.map((day, i) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const inMonth = isSameMonth(day, currentDate);
            const isToday = dateStr === today;
            const isFuture = dateStr > today;
            const completedHabits = habits.filter((h) => isCompleted(h.id, dateStr));

            return (
              <div
                key={i}
                className={`min-h-[56px] p-1.5 border-b border-r border-slate-700/40 ${
                  i % 7 === 6 ? 'border-r-0' : ''
                } ${!inMonth ? 'opacity-25' : ''}`}
              >
                {/* Tageszahl */}
                <div
                  className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                    isToday
                      ? 'bg-indigo-500 text-white font-bold'
                      : isFuture
                      ? 'text-slate-600'
                      : 'text-slate-400'
                  }`}
                >
                  {format(day, 'd')}
                </div>

                {/* Habit-Dots */}
                <div className="flex flex-wrap gap-0.5">
                  {completedHabits.slice(0, 8).map((h) => (
                    <div
                      key={h.id}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: h.color }}
                      title={h.name}
                    />
                  ))}
                  {completedHabits.length > 8 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" title="Weitere…" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legende */}
      {habits.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 px-1">
          {habits.map((h) => (
            <div key={h.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: h.color }} />
              <span className="text-xs text-slate-400 truncate max-w-[80px]">{h.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
