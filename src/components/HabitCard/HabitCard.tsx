import React from 'react';
import { Trash2, Edit, ChevronRight } from 'lucide-react';
import { Habit, HabitStreak } from '../../types';

interface HabitCardProps {
  habit: Habit;
  streak?: HabitStreak;
  isCompleted?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  showDetails?: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  streak,
  isCompleted,
  onToggle,
  onEdit,
  onDelete,
  onClick,
  showDetails = false,
}) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition transform hover:scale-105 cursor-pointer ${
        isCompleted
          ? 'border-green-500 bg-green-50 dark:bg-green-950'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {onToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className={`w-6 h-6 rounded-full border-2 mt-1 transition flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {isCompleted && <span className="text-white text-sm">✓</span>}
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-lg line-clamp-2 ${
                isCompleted
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {habit.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-block w-3 h-3 rounded-full`}
                style={{ backgroundColor: habit.color }}
              />
              {habit.category && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
                  {habit.category}
                </span>
              )}
              <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-700 dark:text-blue-200">
                {habit.frequency === 'daily' ? 'Täglich' : habit.frequency === 'weekly' ? 'Wöchentlich' : 'Monatlich'}
              </span>
            </div>
            {showDetails && streak && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">Aktuelle Serie</p>
                  <p className="text-2xl font-bold text-blue-500">{streak.currentStreak}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400">Längste Serie</p>
                  <p className="text-2xl font-bold text-amber-500">{streak.longestStreak}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-2">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition"
              >
                <Edit size={18} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            )}
            {!onEdit && !onDelete && (
              <ChevronRight className="text-gray-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
