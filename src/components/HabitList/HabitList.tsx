import React, { useMemo } from 'react';
import { HabitCard } from '../HabitCard/HabitCard';
import { useHabitStore } from '../../store/habitStore';

interface HabitListProps {
  onEditHabit?: (habitId: string) => void;
  onDeleteHabit?: (habitId: string) => void;
  showArchived?: boolean;
  filterCategory?: string;
  searchQuery?: string;
}

export const HabitList: React.FC<HabitListProps> = ({
  onEditHabit,
  onDeleteHabit,
  showArchived = false,
  filterCategory,
  searchQuery = '',
}) => {
  const { getActiveHabits, getArchivedHabits, getHabitStreak } = useHabitStore();

  const habits = showArchived ? getArchivedHabits() : getActiveHabits();

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesSearch =
        habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filterCategory || habit.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [habits, searchQuery, filterCategory]);

  if (filteredHabits.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-md">
        <p className="text-gray-600 dark:text-gray-400">
          {showArchived ? 'Keine archivierten Habits vorhanden.' : 'Keine Habits entsprechen den Filtern.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredHabits.map((habit) => {
        const streak = getHabitStreak(habit.id);
        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            streak={streak}
            onEdit={() => onEditHabit?.(habit.id)}
            onDelete={() => onDeleteHabit?.(habit.id)}
            showDetails={true}
          />
        );
      })}
    </div>
  );
};
