import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HabitCard } from '../HabitCard/HabitCard';
import { useHabitStore } from '../../store/habitStore';
import { formatDate, getTodayString, getDateString } from '../../utils/dateHelpers';
import { addDays, parse } from 'date-fns';

interface DayViewProps {
  onEditHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
  selectedDate?: string;
  onDateChange?: (date: string) => void;
}

export const DayView: React.FC<DayViewProps> = ({
  onEditHabit,
  onDeleteHabit,
  selectedDate,
  onDateChange,
}) => {
  const [currentDate, setCurrentDate] = React.useState(selectedDate || getTodayString());
  const { getActiveHabits, toggleCompletion, isHabitCompleted, getHabitStreak } = useHabitStore();

  const dailyHabits = useMemo(() => {
    return getActiveHabits().filter((h) => h.frequency === 'daily');
  }, [getActiveHabits()]);

  const completedCount = useMemo(() => {
    return dailyHabits.filter((h) => isHabitCompleted(h.id, currentDate)).length;
  }, [dailyHabits, currentDate, isHabitCompleted]);

  const handleDateChange = (date: string) => {
    setCurrentDate(date);
    onDateChange?.(date);
  };

  const goToPreviousDay = () => {
    const date = parse(currentDate, 'yyyy-MM-dd', new Date());
    const newDate = addDays(date, -1);
    handleDateChange(getDateString(newDate));
  };

  const goToNextDay = () => {
    const date = parse(currentDate, 'yyyy-MM-dd', new Date());
    const newDate = addDays(date, 1);
    handleDateChange(getDateString(newDate));
  };

  const goToToday = () => {
    handleDateChange(getTodayString());
  };

  return (
    <div className="space-y-4">
      {/* Header with Date Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatDate(currentDate)}
            </h2>
            {currentDate !== getTodayString() && (
              <button
                onClick={goToToday}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
              >
                Heute
              </button>
            )}
          </div>

          <button
            onClick={goToNextDay}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Fortschritt
            </span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {completedCount} / {dailyHabits.length}
            </span>
          </div>
          <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: dailyHabits.length > 0 ? `${(completedCount / dailyHabits.length) * 100}%` : '0%',
              }}
            />
          </div>
        </div>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {dailyHabits.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Keine täglichen Habits erstellt.
            </p>
          </div>
        ) : (
          dailyHabits.map((habit) => {
            const isCompleted = isHabitCompleted(habit.id, currentDate);
            const streak = getHabitStreak(habit.id);

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={streak}
                isCompleted={isCompleted}
                onToggle={() => toggleCompletion(habit.id, currentDate)}
                onEdit={() => onEditHabit?.(habit.id)}
                onDelete={() => onDeleteHabit?.(habit.id)}
                showDetails={false}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
