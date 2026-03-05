-- ============================================
-- MIGRATION: Neue Spalten für Habits
-- ============================================
-- Diese Datei einmalig im Supabase SQL-Editor ausführen!

ALTER TABLE habits ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'daily';

-- Fertig! Bestehende Habits bekommen frequency = 'daily' als Standard.
