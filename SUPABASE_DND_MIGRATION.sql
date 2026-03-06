-- ============================================
-- MIGRATION: Drag & Drop Reihenfolge
-- ============================================
-- Einmalig im Supabase SQL-Editor ausführen!

ALTER TABLE habits ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Bestehenden Habits eine initiale Position geben
UPDATE habits SET position = 0 WHERE position IS NULL;
