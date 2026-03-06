import { useState } from 'react';
import { X } from 'lucide-react';
import { Habit, Frequency, CATEGORIES } from '../types';

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#10b981', '#3b82f6',
];

const FREQUENCIES: { value: Frequency; label: string }[] = [
  { value: 'daily', label: 'Täglich' },
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
];

export interface HabitFormData {
  name: string;
  color: string;
  description: string;
  category: string;
  frequency: Frequency;
}

interface Props {
  habit?: Habit;
  onSave: (data: HabitFormData) => void;
  onClose: () => void;
}

export function HabitModal({ habit, onSave, onClose }: Props) {
  const [name, setName] = useState(habit?.name ?? '');
  const [color, setColor] = useState(habit?.color ?? COLORS[0]);
  const [description, setDescription] = useState(habit?.description ?? '');
  const [category, setCategory] = useState(habit?.category ?? '');
  const [frequency, setFrequency] = useState<Frequency>(habit?.frequency ?? 'daily');

  const isEdit = !!habit;

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({ name: name.trim(), color, description: description.trim(), category, frequency });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md bg-slate-800 rounded-t-3xl sm:rounded-2xl border border-slate-700 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Farbakzent oben */}
        <div className="h-1 rounded-t-3xl sm:rounded-t-2xl transition-colors" style={{ backgroundColor: color }} />

        <div className="p-6">
          {/* Zieh-Griff */}
          <div className="w-10 h-1 bg-slate-600 rounded-full mx-auto mb-5 sm:hidden" />

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-100">
              {isEdit ? 'Gewohnheit bearbeiten' : 'Neue Gewohnheit'}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="z.B. Meditation, Sport, Lesen…"
              autoFocus
              className="w-full bg-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Beschreibung */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">
              Beschreibung <span className="text-slate-600 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kurze Beschreibung…"
              rows={2}
              className="w-full bg-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 border border-slate-600 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Kategorie – feste Optionen als Chips */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-400 mb-2">Kategorie</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    category === cat
                      ? 'text-white shadow-md'
                      : 'bg-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-600'
                  }`}
                  style={category === cat ? { backgroundColor: color } : {}}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Häufigkeit */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-400 mb-2">Häufigkeit</label>
            <div className="flex gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFrequency(f.value)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    frequency === f.value
                      ? 'text-white shadow-md'
                      : 'bg-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  style={frequency === f.value ? { backgroundColor: color } : {}}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Farbe */}
          <div className="mb-7">
            <label className="block text-sm font-medium text-slate-400 mb-3">Farbe</label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-full transition-all active:scale-90 ${
                    color === c
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-800 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            style={{ backgroundColor: color }}
          >
            {isEdit ? 'Speichern' : 'Hinzufügen'}
          </button>
        </div>
      </div>
    </div>
  );
}
