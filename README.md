# Habit Tracker

Eine webbasierte Habit-Tracking-App mit React, TypeScript und Supabase.

**Live:** https://habit-tracker-ten-psi-73.vercel.app/

---

## Setup

```
Browser
   ↕
Vercel  (Frontend-Hosting, kostenlos)
   ↕
Supabase  (Datenbank, kostenlos)
```

- **Vercel** hostet die App 24/7 unter der obigen URL
- **Supabase** speichert alle Habits und Completions dauerhaft
- **GitHub** (`BenUni28/habit-tracker`) ist die Verbindung zwischen beiden – jeder Push auf `main` löst ein automatisches Deployment aus

---

## Features

**4 Ansichten:**
- **Heute** – Habits abhaken, Fortschrittsbalken, Streak-Anzeige
- **Woche** – 7-Tage-Grid, vergangene Tage können interaktiv getoggled werden
- **Monat** – Kalender mit farbigen Dots pro abgeschlossenem Habit
- **Statistik** – Summary-Karten, Completion-Rate-Chart, Heatmap (12 Wochen), Streak-Tabelle

**Habit-Verwaltung:**
- Name, Beschreibung, Kategorie (optional)
- Häufigkeit: täglich / wöchentlich / monatlich
- Farbauswahl
- Bearbeiten & Löschen

---

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die App läuft dann auf `http://localhost:5173`.
Im gleichen WLAN ist sie auch über die Netzwerk-IP erreichbar (wird im Terminal angezeigt).

**Änderungen deployen:**
```bash
git add -A
git commit -m "Beschreibung der Änderung"
git push
```
Vercel baut und deployed automatisch – fertig.

---

## Datenbank (Supabase)

Zwei Tabellen:

```sql
habits (
  id UUID PRIMARY KEY,
  name TEXT,
  color TEXT,
  description TEXT,
  category TEXT,
  frequency TEXT,  -- 'daily' | 'weekly' | 'monthly'
  archived BOOLEAN,
  created_at TIMESTAMPTZ
)

habit_completions (
  id BIGSERIAL PRIMARY KEY,
  habit_id UUID REFERENCES habits(id),
  date DATE,
  UNIQUE(habit_id, date)
)
```

Die SQL-Setup-Dateien liegen im Projektordner:
- `SUPABASE_SETUP_NEU.sql` – einmalig ausführen für frische Installation
- `SUPABASE_MIGRATION.sql` – neue Spalten zu bestehender DB hinzufügen

---

## Tech-Stack

| | |
|---|---|
| React 18 + TypeScript | UI |
| Tailwind CSS | Styling |
| Supabase | Datenbank |
| Recharts | Charts |
| date-fns | Datumsverwaltung |
| Vite | Build Tool |
| Vercel | Hosting |
