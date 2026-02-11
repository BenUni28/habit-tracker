import React, { useState, useMemo } from 'react';
import { Menu, X, Plus, Download, Upload } from 'lucide-react';
import { HabitForm } from './components/HabitForm/HabitForm';
import { DayView } from './components/DayView/DayView';
import { WeekView } from './components/WeekView/WeekView';
import { MonthView } from './components/MonthView/MonthView';
import { HabitList } from './components/HabitList/HabitList';
import { Statistics } from './components/Statistics/Statistics';
import { useHabitStore } from './store/habitStore';

type ViewMode = 'day' | 'week' | 'month' | 'list' | 'stats';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const { addHabit, updateHabit, deleteHabit, getHabit, getActiveHabits, exportData, importData } =
    useHabitStore();

  const editingHabit = editingHabitId ? getHabit(editingHabitId) : null;
  const categories = useMemo(() => {
    const cats = new Set<string>();
    getActiveHabits().forEach((h) => {
      if (h.category) cats.add(h.category);
    });
    return Array.from(cats).sort();
  }, [getActiveHabits()]);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleHabitSubmit = (habit: any) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, habit);
    } else {
      addHabit(habit);
    }
    setShowForm(false);
    setEditingHabitId(null);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm('Sind Sie sicher, dass Sie dieses Habit löschen möchten?')) {
      deleteHabit(habitId);
    }
  };

  const handleEditHabit = (habitId: string) => {
    setEditingHabitId(habitId);
    setShowForm(true);
  };

  const handleExport = () => {
    const data = exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (confirm('Bestehende Daten überschreiben?')) {
              importData(data);
            }
          } catch (error) {
            alert('Fehler beim Importieren der Datei');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const navItems: { label: string; icon: string; mode: ViewMode }[] = [
    { label: 'Tag', icon: '📅', mode: 'day' },
    { label: 'Woche', icon: '📊', mode: 'week' },
    { label: 'Monat', icon: '📈', mode: 'month' },
    { label: 'Liste', icon: '📝', mode: 'list' },
    { label: 'Statistiken', icon: '📉', mode: 'stats' },
  ];

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎯</div>
              <h1 className="text-2xl font-bold">Habit Tracker</h1>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => {
                  setEditingHabitId(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Plus size={20} />
                Neues Habit
              </button>
              <button
                onClick={handleExport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title="Daten exportieren"
              >
                <Download size={20} />
              </button>
              <button
                onClick={handleImport}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                title="Daten importieren"
              >
                <Upload size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMenu && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 p-4 space-y-2">
              <button
                onClick={() => {
                  setEditingHabitId(null);
                  setShowForm(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Plus size={20} />
                Neues Habit
              </button>
              <button
                onClick={() => {
                  handleExport();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <Download size={20} />
                Exportieren
              </button>
              <button
                onClick={() => {
                  handleImport();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <Upload size={20} />
                Importieren
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                {darkMode ? '☀️ Heller Modus' : '🌙 Dunkler Modus'}
              </button>
            </div>
          )}
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto gap-1">
              {navItems.map((item) => (
                <button
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)}
                  className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                    viewMode === item.mode
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          {viewMode === 'list' && (
            <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
              <div>
                <input
                  type="text"
                  placeholder="Habits durchsuchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                />
              </div>
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nach Kategorie filtern
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition"
                  >
                    <option value="">-- Alle Kategorien --</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Views */}
          {viewMode === 'day' && (
            <DayView onEditHabit={handleEditHabit} onDeleteHabit={handleDeleteHabit} />
          )}
          {viewMode === 'week' && (
            <WeekView onEditHabit={handleEditHabit} onDeleteHabit={handleDeleteHabit} />
          )}
          {viewMode === 'month' && (
            <MonthView onEditHabit={handleEditHabit} onDeleteHabit={handleDeleteHabit} />
          )}
          {viewMode === 'list' && (
            <HabitList
              searchQuery={searchQuery}
              filterCategory={filterCategory}
              onEditHabit={handleEditHabit}
              onDeleteHabit={handleDeleteHabit}
            />
          )}
          {viewMode === 'stats' && <Statistics />}
        </main>

        {/* Habit Form Modal */}
        {showForm && (
          <HabitForm
            initialHabit={editingHabit || undefined}
            onSubmit={handleHabitSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingHabitId(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
