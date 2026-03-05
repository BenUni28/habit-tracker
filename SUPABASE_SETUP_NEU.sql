-- ============================================
-- HABIT TRACKER - NEUES SETUP (komplett neu)
-- ============================================
-- SCHRITT 1: Altes löschen (falls vorhanden)
DROP TABLE IF EXISTS habit_completions CASCADE;
DROP TABLE IF EXISTS habits CASCADE;

-- SCHRITT 2: Neue Tabellen erstellen
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE habit_completions (
  id BIGSERIAL PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  UNIQUE(habit_id, date)
);

-- SCHRITT 3: Indexes für bessere Performance
CREATE INDEX ON habit_completions(habit_id);
CREATE INDEX ON habit_completions(date);

-- SCHRITT 4: RLS deaktivieren (Single-User-App, kein Login nötig)
ALTER TABLE habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions DISABLE ROW LEVEL SECURITY;

-- Fertig! Du kannst jetzt die App starten.
