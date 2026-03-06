-- ============================================
-- AUTH SETUP: Google Login + User-Isolation
-- ============================================
-- Dieses SQL einmalig im Supabase SQL-Editor ausführen!
-- WICHTIG: Vorher Google OAuth in Supabase konfigurieren (siehe GOOGLE_AUTH_SETUP.md)

-- Schritt 1: user_id Spalte zu habits hinzufügen
ALTER TABLE habits ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Schritt 2: RLS aktivieren
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Schritt 3: Alte Policies löschen (falls vorhanden)
DROP POLICY IF EXISTS "habits_user_policy" ON habits;
DROP POLICY IF EXISTS "completions_user_policy" ON habit_completions;

-- Schritt 4: Neue Policies - jeder User sieht nur seine eigenen Daten
CREATE POLICY "habits_user_policy" ON habits
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "completions_user_policy" ON habit_completions
  FOR ALL TO authenticated
  USING (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  )
  WITH CHECK (
    habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid())
  );

-- Fertig! Jetzt Google OAuth in Supabase einrichten (siehe GOOGLE_AUTH_SETUP.md)
