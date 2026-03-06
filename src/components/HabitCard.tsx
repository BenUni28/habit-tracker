import { Check, Flame, GripVertical, Pencil, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface Props {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  isDragging?: boolean;
}

const FREQ_LABEL: Record<string, string> = {
  daily: 'Täglich',
  weekly: 'Wöchentlich',
  monthly: 'Monatlich',
};

export function HabitCard({ habit, completed, streak, onToggle, onEdit, onDelete, dragHandleProps, isDragging }: Props) {
  const freq = habit.frequency ?? 'daily';

  return (
    <div
      className={`group bg-slate-800 rounded-2xl overflow-hidden border flex flex-col transition-all duration-200 ${
        isDragging
          ? 'border-indigo-500 shadow-2xl shadow-indigo-900/50 scale-105 opacity-90'
          : completed
          ? 'border-slate-600/50 opacity-75'
          : 'border-slate-700 hover:border-slate-500 hover:shadow-lg hover:shadow-slate-900/50'
      }`}
    >
      {/* Farbbalken oben */}
      <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: habit.color }} />

      <div className="p-4 flex flex-col flex-1">
        {/* Header: Drag-Handle + Name + Checkbox */}
        <div className="flex items-start gap-2 mb-3">
          {/* Drag Handle */}
          <div
            {...dragHandleProps}
            className="mt-1 p-0.5 text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 transition-colors"
            title="Verschieben"
          >
            <GripVertical size={16} />
          </div>

          {/* Name */}
          <h3
            className={`font-bold text-base leading-snug flex-1 transition-colors ${
              completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {habit.name}
          </h3>

          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-90 mt-0.5 ${
              completed ? 'border-transparent shadow-md' : 'border-slate-600 hover:border-slate-400'
            }`}
            style={completed ? { backgroundColor: habit.color } : {}}
          >
            {completed && <Check size={14} className="text-white" strokeWidth={3} />}
          </button>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {habit.category && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: habit.color + '25', color: habit.color }}
            >
              {habit.category}
            </span>
          )}
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-400 font-medium">
            {FREQ_LABEL[freq]}
          </span>
        </div>

        {/* Beschreibung */}
        {habit.description && (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3 flex-1">
            {habit.description}
          </p>
        )}

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 mb-3">
            <Flame size={13} className="text-orange-400" />
            <span className="text-xs text-orange-400 font-semibold">{streak} Tage Streak</span>
          </div>
        )}

        {/* Aktionen */}
        <div className="flex items-center gap-1 mt-auto pt-3 border-t border-slate-700/60">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Pencil size={12} />
            Bearbeiten
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
