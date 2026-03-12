import { useState, useRef } from 'react';
import { format, parseISO, subDays, addDays } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Check, Trash2, AlertCircle } from 'lucide-react';
import { Todo } from '../types';

interface Props {
  todos: Todo[];
  today: string;
  loading: boolean;
  onAdd: (text: string, date: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  openTodosFromPast: Todo[];
}

export function TodoView({ todos, today, loading, onAdd, onToggle, onDelete, openTodosFromPast }: Props) {
  const [selectedDate, setSelectedDate] = useState(today);
  const [inputText, setInputText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isToday = selectedDate === today;

  const goToPrev = () => {
    setSelectedDate((d) => format(subDays(parseISO(d), 1), 'yyyy-MM-dd'));
  };

  const goToNext = () => {
    if (selectedDate < today) {
      setSelectedDate((d) => format(addDays(parseISO(d), 1), 'yyyy-MM-dd'));
    }
  };

  const todosForDate = todos.filter((t) => t.date === selectedDate);
  const completedCount = todosForDate.filter((t) => t.done).length;

  const handleAdd = () => {
    if (!inputText.trim()) return;
    onAdd(inputText, selectedDate);
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  const dateLabel = isToday
    ? 'Heute'
    : format(parseISO(selectedDate), 'EEEE, d. MMMM', { locale: de });

  return (
    <div>
      {/* Date navigation header */}
      <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goToPrev}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg capitalize">{dateLabel}</span>
            {todosForDate.length > 0 && (
              <p className="text-sm text-slate-400 mt-0.5">{completedCount}/{todosForDate.length} erledigt</p>
            )}
          </div>
          <button
            onClick={goToNext}
            disabled={isToday}
            className={`p-2 rounded-xl transition-colors ${
              isToday
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {todosForDate.length > 0 && (
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(completedCount / todosForDate.length) * 100}%`,
                backgroundColor: completedCount === todosForDate.length ? '#10b981' : '#6366f1',
              }}
            />
          </div>
        )}
      </div>

      {/* Add todo input */}
      <div className="mb-5 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isToday ? 'Neues To-Do für heute...' : `Neues To-Do für ${dateLabel}...`}
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={!inputText.trim()}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Todos for selected date */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : todosForDate.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-400 dark:text-slate-500">
          <p className="text-sm">Keine To-Dos für diesen Tag</p>
        </div>
      ) : (
        <div className="space-y-2">
          {todosForDate.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}

      {/* Open todos from past */}
      {openTodosFromPast.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-500" />
            <h2 className="font-semibold text-slate-700 dark:text-slate-300">
              Offene To-Dos ({openTodosFromPast.length})
            </h2>
          </div>
          <div className="space-y-2">
            {openTodosFromPast.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} showDate />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TodoItem({
  todo,
  onToggle,
  onDelete,
  showDate = false,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  showDate?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border transition-colors ${
        todo.done
          ? 'border-emerald-200 dark:border-emerald-800/50 opacity-60'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          todo.done
            ? 'border-emerald-500 bg-emerald-500'
            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
        }`}
      >
        {todo.done && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>
      <div className="flex-1 min-w-0">
        <span className={`text-sm text-slate-900 dark:text-slate-100 ${todo.done ? 'line-through' : ''}`}>
          {todo.text}
        </span>
        {showDate && (
          <p className="text-xs text-amber-500 mt-0.5 capitalize">
            {format(parseISO(todo.date), 'EEEE, d. MMMM', { locale: de })}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
