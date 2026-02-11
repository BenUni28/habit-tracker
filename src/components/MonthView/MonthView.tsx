import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabitStore } from '../../store/habitStore';
import { getMonthDaysGrid, getTodayString } from '../../utils/dateHelpers';
import { format, addMonths, startOfMonth, parse } from 'date-fns';
import { de } from 'date-fns/locale';

interface MonthViewProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onEditHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({ selectedDate, onDateChange }) => {
  const [currentDate, setCurrentDate] = React.useState(
    selectedDate ? parse(selectedDate, 'yyyy-MM-dd', new Date()) : new Date()
  );

  const { getDailyStats } = useHabitStore();

  const monthStart = startOfMonth(currentDate);
  const monthDays = getMonthDaysGrid(currentDate);
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  const dayStats = useMemo(() => {
    const stats = new Map<string, { completed: number; total: number; rate: number }>();
    monthDays
      .filter((d) => d !== null)
      .forEach((date) => {
        if (date) {
          const dayStats = getDailyStats(date);
          stats.set(date, {
            completed: dayStats.completed,
            total: dayStats.total,
            rate: dayStats.completionRate,
          });
        }
      });
    return stats;
  }, [monthDays, getDailyStats]);

  const handlePreviousMonth = () => {
    const newDate = addMonths(currentDate, -1);
    setCurrentDate(newDate);
    onDateChange?.(`${format(newDate, 'yyyy-MM')}-01`);
  };

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    onDateChange?.(`${format(newDate, 'yyyy-MM')}-01`);
  };

  const getBackgroundColor = (completionRate: number): string => {
    if (completionRate === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (completionRate < 25) return 'bg-orange-200 dark:bg-orange-900';
    if (completionRate < 50) return 'bg-yellow-200 dark:bg-yellow-900';
    if (completionRate < 75) return 'bg-lime-200 dark:bg-lime-900';
    return 'bg-green-200 dark:bg-green-900';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(monthStart, 'MMMM yyyy', { locale: de })}
          </h2>

          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-gray-700 dark:text-gray-300 text-sm py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((dateStr, idx) => {
            if (!dateStr) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const stats = dayStats.get(dateStr);
            const isToday = dateStr === getTodayString();

            return (
              <div
                key={dateStr}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition transform hover:scale-105 ${
                  isToday ? 'ring-2 ring-blue-500' : ''
                } ${getBackgroundColor(stats?.rate || 0)}`}
              >
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  {dateStr.split('-')[2]}
                </span>
                {stats && stats.total > 0 && (
                  <div className="text-center">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {stats.completed}/{stats.total}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400 block">
                      {Math.round(stats.rate)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Legende:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 dark:bg-green-900" />
            <span className="text-gray-700 dark:text-gray-300">75-100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-lime-200 dark:bg-lime-900" />
            <span className="text-gray-700 dark:text-gray-300">50-75%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-200 dark:bg-yellow-900" />
            <span className="text-gray-700 dark:text-gray-300">25-50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-orange-200 dark:bg-orange-900" />
            <span className="text-gray-700 dark:text-gray-300">0-25%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
