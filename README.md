# 🎯 Habit Tracker

Eine moderne, webbasierte Habit-Tracking-Anwendung mit React und TypeScript. Verfolgen Sie Ihre täglichen Gewohnheiten, visualisieren Sie Ihre Fortschritte und erkennen Sie Ihre Streaks!

## 📋 Features

### Kern-Funktionalitäten

- **Habit Management**: Erstellen, bearbeiten und löschen Sie Habits mit Namen, Beschreibungen, Kategorien und Farben
- **Flexible Häufigkeiten**: Unterstützt täglich, wöchentlich und monatlich wiederkehrende Habits
- **Tracking mit Timestamps**: Markieren Sie erledigte Habits und verfolgen Sie sie zeitgenau
- **Streak-Berechnung**: Automatische Berechnung von aktuellen und längsten Serien

### Ansichten

| Ansicht | Beschreibung |
|---------|-------------|
| **Tagesansicht** | Alle täglichen Habits für heute mit Live-Fortschrittsanzeige |
| **Wochenansicht** | 7-Tage Kalender mit Checkboxes für schnelle Übersicht |
| **Monatsansicht** | Heatmap ähnlich GitHub Contributions mit Farbcodierung |
| **Listensicht** | Alle Habits mit Suche, Filterung nach Kategorie und Streaks |
| **Statistiken** | Diagramme, Erfolgsquoten und Top-Serien |

### Zusatzfeatures

✨ **Dark Mode** - Umschalter für Nachtsichtmodus  
💾 **Export/Import** - Daten als JSON speichern und wiederherstellen  
🔍 **Suche** - Schnelle Habitsuche  
🏷️ **Kategorien** - Organisieren Sie Habits logisch  
📱 **Responsive Design** - Funktioniert auf Desktop, Tablet und Handy  
⚡ **Hot-Reload** - Live-Updates während der Entwicklung  

## 🚀 Schnellstart

### Voraussetzungen
- Node.js (v24+) installiert auf E:\ (oder anpassen Sie den Pfad)
- npm (kommt mit Node.js)

### Installation & Start (einfachste Methode)

**Option 1: Batch-Datei erstellen und ausführen**

1. Erstelle eine Datei `start-habit-tracker.cmd` im Projektverzeichnis mit folgendem Inhalt:
```batch
@echo off
cd /d "c:\Users\benib\Documents\Programmieren\Vibe_coding\Bucketlist_with_CoPilot\habit-tracker"
set PATH=E:;%PATH%
E:\npm.cmd run dev
pause
```

2. Doppelklick auf `start-habit-tracker.cmd`
3. Browser öffnet sich automatisch auf **http://localhost:5173/**

**Option 2: Manuell via PowerShell**

```powershell
cd "c:\Users\benib\Documents\Programmieren\Vibe_coding\Bucketlist_with_CoPilot\habit-tracker"
$env:PATH = "E:;" + $env:PATH
E:\npm.cmd run dev
```

Dann öffne: **http://localhost:5173/**

### Verfügbare NPM-Befehle

```bash
# Entwicklungs-Server starten (mit Hot-Reload)
E:\npm.cmd run dev

# Production-Build erstellen
E:\npm.cmd run build

# Gebaut App testen
E:\npm.cmd run preview

# Dependencies installieren (nur einmalig nötig)
E:\npm.cmd install
```

## 📁 Projektstruktur

```
habit-tracker/
├── src/
│   ├── components/          # React-Komponenten
│   │   ├── DayView/        # Tagesansicht
│   │   ├── WeekView/       # Wochenansicht
│   │   ├── MonthView/      # Monatsansicht
│   │   ├── HabitForm/      # Habit-Erstellung/-Bearbeitung
│   │   ├── HabitCard/      # Habit-Element
│   │   ├── HabitList/      # Listensicht
│   │   └── Statistics/     # Statistiken- & Chart-Komponenten
│   ├── store/              # Zustand Store (habitStore.ts)
│   ├── types/              # TypeScript Interfaces
│   ├── utils/              # Utility-Funktionen (dateHelpers.ts)
│   ├── App.tsx             # Hauptkomponente
│   ├── main.tsx            # Einstiegspunkt
│   └── index.css           # Globale Styles
├── package.json            # Dependencies & Scripts
├── tsconfig.json           # TypeScript Konfiguration
├── vite.config.ts          # Vite Konfiguration
├── tailwind.config.js      # Tailwind CSS Konfiguration
└── index.html              # HTML-Template
```

## 🛠️ Tech-Stack

| Technologie | Version | Zweck |
|------------|---------|-------|
| **React** | 18.2 | UI-Bibliothek |
| **TypeScript** | 5.2 | Typsicherheit |
| **Tailwind CSS** | 3.3 | Styling |
| **Zustand** | 4.4 | State Management |
| **Recharts** | 2.10 | Datenvisualisierung |
| **date-fns** | 3.0 | Datumsverwaltung |
| **Vite** | 5.4 | Build Tool & Dev Server |
| **lucide-react** | Latest | Icons |

## 📊 Datenstruktur

### Habit
```typescript
interface Habit {
  id: string;
  name: string;
  description?: string;
  category?: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
  archived: boolean;
}
```

### HabitCompletion
```typescript
interface HabitCompletion {
  habitId: string;
  date: string; // ISO format YYYY-MM-DD
  completed: boolean;
  timestamp: string;
}
```

Alle Daten werden in **LocalStorage** gespeichert - keine Internetverbindung erforderlich!

## 💡 Tipps zur effizienten Nutzung

1. **Gewohnheiten kategorisieren**: Nutzen Sie Kategorien (Gesundheit, Fitness, Lernen, etc.)
2. **Farbcodes nutzen**: Zuweisen Sie verschiedenen Habits unterschiedliche Farben für schnelle Erkennung
3. **Wöchentliche Reviews**: Schauen Sie sich die Statistiken an, um Muster zu erkennen
4. **Streaks verfolgen**: Die Serien-Anzeige motiviert, Gewohnheiten durchzuhalten
5. **Export regelmäßig**: Sichern Sie Ihre Daten gelegentlich mit Export

## 🔒 Datenschutz

- ✅ Keine externen Server - alles läuft lokal
- ✅ Alle Daten im Browser gespeichert (LocalStorage)
- ✅ Kein Tracking oder Telemetrie
- ✅ Export/Import für volle Kontrolle Ihrer Daten

## 🐛 Bekannte Einschränkungen

- Daten werden pro Browser/Gerät gespeichert
- Browser-Cache löschen löscht auch alle Daten (Export vorher!)
- Mobile Ansicht noch nicht vollständig optimiert

## 🚀 Zukünftige Features (geplant)

- [ ] Cloud-Synchronisation
- [ ] Multi-Device Sync
- [ ] Habit-Templates
- [ ] Benachrichtigungen
- [ ] Kolaborative Habits
- [ ] Erweiterte Statistiken

## 📝 Lizenz

Persönliches Projekt - frei nutzbar für private Zwecke.

---

**Viel Erfolg beim Tracking Ihrer Gewohnheiten! 🎯**
