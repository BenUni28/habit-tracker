import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHabitStore } from '../../store/habitStore';
import { getDateString, getTodayString } from '../../utils/dateHelpers';
import { addDays, parse } from 'date-fns';

interface WeekViewProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  onEditHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ selectedDate, onDateChange }) => {
  const [weekStart, setWeekStart] = React.useState(selectedDate || getTodayString());
  const { getActiveHabits, isHabitCompleted, toggleCompletion } = useHabitStore();

  const weekDays = useMemo(() => {
    // Parse the weekStart date and get all days
    const date = parse(weekStart, 'yyyy-MM-dd', new Date());
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Set to Monday

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = getDateString(d);
      days.push({
        date: dateStr,
        label: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'][i],
        isToday: dateStr === getTodayString(),
      });
    }
    return days;
  }, [weekStart]);

  const dailyHabits = useMemo(() => {
    return getActiveHabits().filter((h) => h.frequency === 'daily').sort((a, b) => a.name.localeCompare(b.name));
  }, [getActiveHabits()]);

  const habitCompletionData = useMemo(() => {
    return dailyHabits.map((habit) => ({
      habit,
      completions: weekDays.map((day) => ({
        date: day.date,
        isCompleted: isHabitCompleted(habit.id, day.date),
      })),
    }));
  }, [dailyHabits, weekDays, isHabitCompleted]);

  const handlePreviousWeek = () => {
    const date = parse(weekStart, 'yyyy-MM-dd', new Date());
    const newDate = addDays(date, -7);
    setWeekStart(getDateString(newDate));
    onDateChange?.(getDateString(newDate));
  };

  const handleNextWeek = () => {
    const date = parse(weekStart, 'yyyy-MM-dd', new Date());
    const newDate = addDays(date, 7);
    setWeekStart(getDateString(newDate));
    onDateChange?.(getDateString(newDate));
  };

  const handleCellClick = (habitId: string, date: string) => {
    toggleCompletion(habitId, date);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Woche {weekDays[0]?.date} - {weekDays[6]?.date}
          </h2>

          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-700">
                Habit
              </th>
              {weekDays.map((day) => (
                <th
                  key={day.date}
                  className={`px-3 py-3 text-center font-semibold text-sm ${
                    day.isToday
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div>{day.label}</div>
                  <div className="text-xs">{day.date.split('-')[2]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habitCompletionData.map((item) => (
              <tr
                key={item.habit.id}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-4 font-medium text-gray-900 dark:text-white sticky left-0 bg-white dark:bg-gray-800 max-w-xs truncate">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.habit.color }}
                    />
                    {item.habit.name}
                  </div>
                </td>
                {item.completions.map((completion) => (
                  <td key={completion.date} className="px-3 py-4 text-center">
                    <button
                      onClick={() => handleCellClick(item.habit.id, completion.date)}
                      className={`w-8 h-8 rounded-lg transition ${
                        completion.isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {completion.isCompleted ? '✓' : ''}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {dailyHabits.length === 0 && (
          <div className="p-8 text-center text-gray-600 dark:text-gray-400">
            Keine täglichen Habits erstellt.
          </div>
        )}
      </div>
    </div>
  );
};
