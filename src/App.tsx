import { useState, useEffect, useRef } from 'react';
import { format, subDays, addDays, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  CheckCircle2, CalendarDays, Calendar, BarChart2, Plus, AlertCircle,
  LogOut, User, Sun, Moon, ChevronLeft, ChevronRight, ClipboardList,
} from 'lucide-react';
import {
  DndContext, closestCenter, DragEndEvent, DragOverlay,
  PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from './hooks/useAuth';
import { useHabits } from './hooks/useHabits';
import { useTodos } from './hooks/useTodos';
import { Habit, View } from './types';
import { LoginPage } from './components/LoginPage';
import { HabitCard } from './components/HabitCard';
import { HabitModal, HabitFormData } from './components/HabitModal';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { StatsView } from './components/StatsView';
import { TodoView } from './components/TodoView';

function SortableHabitCard(props: {
  habit: Habit; completed: boolean; streak: number;
  onToggle: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.habit.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0 : 1 }}>
      <HabitCard {...props} dragHandleProps={{ ...attributes, ...listeners }} isDragging={false} />
    </div>
  );
}

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'today', label: 'Heute', icon: CheckCircle2 },
  { id: 'week', label: 'Woche', icon: CalendarDays },
  { id: 'month', label: 'Monat', icon: Calendar },
  { id: 'stats', label: 'Statistik', icon: BarChart2 },
  { id: 'todos', label: 'To-Dos', icon: ClipboardList },
];

export default function App() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [view, setView] = useState<View>('today');
  const [showAdd, setShowAdd] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeHabit, setActiveHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [showOpenTodosAlert, setShowOpenTodosAlert] = useState(false);
  const alertShownRef = useRef(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(isDark));
  }, [isDark]);

  const {
    habits, completions, loading, error, today,
    isCompleted, isCompletedForPeriod, toggleCompletion,
    addHabit, editHabit, deleteHabit, reorderHabits,
    getStreak, getBestStreak, getCompletionRate, getHeatmapData,
  } = useHabits(user?.id ?? null);

  const { todos, loading: todosLoading, addTodo, toggleTodo, deleteTodo, openTodosFromPast } = useTodos(user?.id ?? null);

  // Show popup once if there are open todos from past days
  useEffect(() => {
    if (!todosLoading && openTodosFromPast.length > 0 && !alertShownRef.current) {
      setShowOpenTodosAlert(true);
      alertShownRef.current = true;
    }
  }, [todosLoading, openTodosFromPast.length]);

  // Reset selected date to today when switching to the today view
  useEffect(() => {
    if (view === 'today') setSelectedDate(today);
  }, [view, today]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveHabit(null);
    if (!over || active.id === over.id) return;
    const oldIndex = habits.findIndex((h) => h.id === active.id);
    const newIndex = habits.findIndex((h) => h.id === over.id);
    reorderHabits(arrayMove(habits, oldIndex, newIndex));
  };

  const handleSave = (data: HabitFormData) => {
    if (editingHabit) editHabit(editingHabit.id, data);
    else addHabit(data);
    setEditingHabit(null);
  };

  const isSelectedToday = selectedDate === today;

  const goToPrevDay = () => setSelectedDate((d) => format(subDays(parseISO(d), 1), 'yyyy-MM-dd'));
  const goToNextDay = () => {
    if (selectedDate < today) setSelectedDate((d) => format(addDays(parseISO(d), 1), 'yyyy-MM-dd'));
  };

  const completedForDate = habits.filter((h) => isCompletedForPeriod(h, selectedDate)).length;
  const progress = habits.length > 0 ? completedForDate / habits.length : 0;
  const allDone = habits.length > 0 && completedForDate === habits.length;

  const selectedDateLabel = isSelectedToday
    ? 'Heute'
    : format(parseISO(selectedDate), 'EEEE, d. MMMM', { locale: de });

  if (authLoading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <LoginPage onSignIn={signInWithGoogle} />;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-500 text-sm">Lade Gewohnheiten...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto px-4 pb-28">

        <div className="pt-10 pb-6 flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm capitalize">{format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">Habit Tracker</h1>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 border border-slate-200 dark:border-slate-700">
              {user.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full" />
                : <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center"><User size={14} className="text-white" /></div>}
              <span className="text-sm text-slate-700 dark:text-slate-300 hidden sm:block max-w-[120px] truncate">
                {user.user_metadata?.full_name ?? user.email}
              </span>
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex items-center px-1 border ${
                isDark ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-200 border-slate-300'
              }`}
              title={isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
            >
              <span className={`w-4 h-4 bg-white rounded-full shadow flex items-center justify-center transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}>
                {isDark ? <Moon size={9} className="text-indigo-600" /> : <Sun size={9} className="text-amber-500" />}
              </span>
            </button>

            <button onClick={signOut} className="p-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors" title="Abmelden">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div><p className="font-medium text-sm">Verbindungsfehler</p><p className="text-xs mt-0.5 opacity-80">{error}</p></div>
          </div>
        )}

        {view === 'today' && habits.length > 0 && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevDay}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                  title="Vorheriger Tag"
                >
                  <ChevronLeft size={18} />
                </button>
                <div>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold text-lg capitalize">{selectedDateLabel}</span>
                  {allDone && isSelectedToday && <span className="ml-3 text-emerald-600 dark:text-emerald-400 text-sm font-medium">Alle erledigt! 🎉</span>}
                </div>
                <button
                  onClick={goToNextDay}
                  disabled={isSelectedToday}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSelectedToday
                      ? 'opacity-30 cursor-not-allowed text-slate-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                  title="Nächster Tag"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{completedForDate}<span className="text-slate-400 font-normal text-lg">/{habits.length}</span></span>
            </div>
            <div className="h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress * 100}%`, backgroundColor: allDone ? '#10b981' : '#6366f1' }} />
            </div>
          </div>
        )}

        {view === 'today' && (
          habits.length === 0 && !error ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 dark:text-slate-500">
              <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 size={36} className="text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-semibold text-slate-500 dark:text-slate-400 text-lg">Noch keine Gewohnheiten</p>
              <p className="text-sm mt-1">Tippe auf + um deine erste hinzuzufügen</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={(e) => setActiveHabit(habits.find((h) => h.id === e.active.id) ?? null)}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveHabit(null)}
            >
              <SortableContext items={habits.map((h) => h.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {habits.map((habit) => (
                    <SortableHabitCard
                      key={habit.id} habit={habit}
                      completed={isCompletedForPeriod(habit, selectedDate)} streak={getStreak(habit.id)}
                      onToggle={() => toggleCompletion(habit.id, selectedDate)}
                      onEdit={() => setEditingHabit(habit)}
                      onDelete={() => deleteHabit(habit.id)}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeHabit && (
                  <HabitCard habit={activeHabit} completed={isCompletedForPeriod(activeHabit, selectedDate)} streak={getStreak(activeHabit.id)} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} isDragging />
                )}
              </DragOverlay>
            </DndContext>
          )
        )}

        {view === 'week' && <div className="max-w-2xl mx-auto"><WeekView habits={habits} isCompleted={isCompleted} toggleCompletion={toggleCompletion} today={today} /></div>}
        {view === 'month' && <div className="max-w-2xl mx-auto"><MonthView habits={habits} isCompleted={isCompleted} today={today} /></div>}
        {view === 'stats' && <div className="max-w-2xl mx-auto"><StatsView habits={habits} completions={completions} getStreak={getStreak} getBestStreak={getBestStreak} getCompletionRate={getCompletionRate} getHeatmapData={getHeatmapData} today={today} isDark={isDark} /></div>}
        {view === 'todos' && (
          <div className="max-w-2xl mx-auto">
            <TodoView
              todos={todos}
              today={today}
              loading={todosLoading}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              openTodosFromPast={openTodosFromPast}
            />
          </div>
        )}
      </div>

      {view === 'today' && isSelectedToday && (
        <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-900/40 transition-all active:scale-90">
          <Plus size={26} className="text-white" />
        </button>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto flex">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)} className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${view === id ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>
              <Icon size={20} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {(showAdd || editingHabit !== null) && (
        <HabitModal habit={editingHabit ?? undefined} onSave={handleSave} onClose={() => { setShowAdd(false); setEditingHabit(null); }} />
      )}

      {/* Open todos popup */}
      {showOpenTodosAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-amber-500" />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">Offene To-Dos</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Du hast noch{' '}
              <span className="font-semibold text-amber-500">{openTodosFromPast.length}</span>{' '}
              offene{openTodosFromPast.length === 1 ? 's' : ''} To-Do{openTodosFromPast.length === 1 ? '' : 's'} von vorherigen Tagen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowOpenTodosAlert(false); setView('todos'); }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Zu den To-Dos
              </button>
              <button
                onClick={() => setShowOpenTodosAlert(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-colors"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
