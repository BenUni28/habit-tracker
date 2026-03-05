import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CheckCircle2, CalendarDays, Calendar, BarChart2, Plus, AlertCircle } from 'lucide-react';
import { useHabits } from './hooks/useHabits';
import { Habit, View } from './types';
import { HabitItem } from './components/HabitItem';
import { HabitModal, HabitFormData } from './components/HabitModal';
import { WeekView } from './components/WeekView';
import { MonthView } from './components/MonthView';
import { StatsView } from './components/StatsView';

const NAV: { id: View; label: string; icon: React.ElementType }[] = [
  { id: 'today', label: 'Heute', icon: CheckCircle2 },
  { id: 'week', label: 'Woche', icon: CalendarDays },
  { id: 'month', label: 'Monat', icon: Calendar },
  { id: 'stats', label: 'Statistik', icon: BarChart2 },
];

export default function App() {
  const [view, setView] = useState<View>('today');
  const [showAdd, setShowAdd] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const {
    habits,
    completions,
    loading,
    error,
    today,
    isCompleted,
    isCompletedForPeriod,
    toggleCompletion,
    addHabit,
    editHabit,
    deleteHabit,
    getStreak,
    getBestStreak,
    getCompletionRate,
    getHeatmapData,
  } = useHabits();

  const completedToday = habits.filter((h) => isCompletedForPeriod(h)).length;
  const progress = habits.length > 0 ? completedToday / habits.length : 0;
  const allDone = habits.length > 0 && completedToday === habits.length;

  const handleSave = (data: HabitFormData) => {
    if (editingHabit) {
      editHabit(editingHabit.id, data);
    } else {
      addHabit(data);
    }
    setEditingHabit(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Lade Gewohnheiten…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="max-w-lg mx-auto px-4 pb-28">
        {/* Header */}
        <div className="pt-12 pb-6">
          <p className="text-slate-500 text-sm capitalize">
            {format(new Date(), 'EEEE, d. MMMM yyyy', { locale: de })}
          </p>
          <h1 className="text-3xl font-bold text-slate-100 mt-1">Habit Tracker</h1>
        </div>

        {/* Fehler-Banner */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-950/50 border border-red-800/50 rounded-2xl text-red-400">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Verbindungsfehler</p>
              <p className="text-xs mt-0.5 text-red-500">{error}</p>
              <p className="text-xs mt-1 text-red-600">
                SUPABASE_SETUP_NEU.sql + SUPABASE_MIGRATION.sql im SQL-Editor ausführen.
              </p>
            </div>
          </div>
        )}

        {/* Fortschritts-Karte (nur Heute) */}
        {view === 'today' && habits.length > 0 && (
          <div className="mb-5 bg-slate-800 rounded-2xl p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-300 font-medium">Heute</span>
              <span className="font-bold text-slate-100">
                {completedToday}
                <span className="text-slate-500 font-normal">/{habits.length}</span>
              </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: allDone ? '#10b981' : '#6366f1',
                }}
              />
            </div>
            {allDone && (
              <p className="text-emerald-400 text-sm mt-2.5 font-medium">
                Alle erledigt – super gemacht! 🎉
              </p>
            )}
          </div>
        )}

        {/* Heute-Ansicht */}
        {view === 'today' && (
          <div className="space-y-3">
            {habits.length === 0 && !error ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
                  <CheckCircle2 size={28} className="text-slate-600" />
                </div>
                <p className="font-medium text-slate-400">Noch keine Gewohnheiten</p>
                <p className="text-sm mt-1">Tippe auf + um deine erste hinzuzufügen</p>
              </div>
            ) : (
              habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  completed={isCompletedForPeriod(habit)}
                  streak={getStreak(habit.id)}
                  onToggle={() => toggleCompletion(habit.id)}
                  onEdit={() => setEditingHabit(habit)}
                  onDelete={() => deleteHabit(habit.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Wochen-Ansicht */}
        {view === 'week' && (
          <WeekView
            habits={habits}
            isCompleted={isCompleted}
            toggleCompletion={toggleCompletion}
            today={today}
          />
        )}

        {/* Monats-Ansicht */}
        {view === 'month' && (
          <MonthView habits={habits} isCompleted={isCompleted} today={today} />
        )}

        {/* Statistik-Ansicht */}
        {view === 'stats' && (
          <StatsView
            habits={habits}
            completions={completions}
            getStreak={getStreak}
            getBestStreak={getBestStreak}
            getCompletionRate={getCompletionRate}
            getHeatmapData={getHeatmapData}
            today={today}
          />
        )}
      </div>

      {/* FAB (nur in Heute-Ansicht) */}
      {view === 'today' && (
        <button
          onClick={() => setShowAdd(true)}
          className="fixed bottom-24 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-xl shadow-indigo-900/40 transition-all active:scale-90"
        >
          <Plus size={26} />
        </button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        <div className="max-w-lg mx-auto flex">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                view === id ? 'text-indigo-400' : 'text-slate-600'
              }`}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Add/Edit Modal */}
      {(showAdd || editingHabit !== null) && (
        <HabitModal
          habit={editingHabit ?? undefined}
          onSave={handleSave}
          onClose={() => {
            setShowAdd(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}
