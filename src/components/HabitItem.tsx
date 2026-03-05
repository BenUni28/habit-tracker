import { Check, Flame, Pencil, Trash2 } from 'lucide-react';
import { Habit } from '../types';

interface Props {
  habit: Habit;
  completed: boolean;
  streak: number;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const FREQ_LABEL: Record<string, string> = {
  daily: 'tägl.',
  weekly: 'wöch.',
  monthly: 'monatl.',
};

export function HabitItem({ habit, completed, streak, onToggle, onEdit, onDelete }: Props) {
  const freq = habit.frequency ?? 'daily';

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 ${
        completed ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-800 border-slate-700'
      }`}
    >
      {/* Farbstreifen */}
      <div className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0" style={{ backgroundColor: habit.color }} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            className={`font-medium transition-colors ${
              completed ? 'line-through text-slate-500' : 'text-slate-100'
            }`}
          >
            {habit.name}
          </p>
          <span
            className="text-[11px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0"
            style={{ backgroundColor: habit.color + '25', color: habit.color }}
          >
            {FREQ_LABEL[freq]}
          </span>
        </div>

        {habit.category && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{habit.category}</p>
        )}

        {habit.description && !habit.category && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">{habit.description}</p>
        )}

        {streak > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Flame size={11} className="text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">{streak} Tage</span>
          </div>
        )}
      </div>

      {/* Aktionen */}
      <button
        onClick={onEdit}
        className="p-2 text-slate-600 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-700"
      >
        <Pencil size={14} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-slate-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
      >
        <Trash2 size={15} />
      </button>

      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150 active:scale-90 ${
          completed ? 'border-transparent shadow-lg' : 'border-slate-600 hover:border-slate-400'
        }`}
        style={completed ? { backgroundColor: habit.color } : {}}
      >
        {completed && <Check size={18} className="text-white" strokeWidth={3} />}
      </button>
    </div>
  );
}
