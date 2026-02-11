# 🚀 GitHub Push Anleitung

Git-Repository ist initialisiert! Jetzt können Sie das Projekt auf GitHub pushen.

## Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Nenne es: `habit-tracker` (oder wie du möchtest)
3. Beschreibung: "Webbasierte Habit-Tracking-Anwendung mit React und TypeScript"
4. Sichtbarkeit: Public oder Private (nach Wunsch)
5. Klick "Create repository" (NICHT "Initialize with README" anwählen)

## Schritt 2: Remote hinzufügen

Ersetze `YOUR_USERNAME` durch deinen GitHub Benutzernamen und führe aus:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/habit-tracker.git
git branch -M main
```

## Schritt 3: Push mit HTTPS (einfachste Methode)

### Option A: Mit Personal Access Token (empfohlen)

1. Gehe zu https://github.com/settings/tokens
2. Klick "Generate new token (classic)"
3. Gib einen Namen ein (z.B. "habit-tracker")
4. Wähle: `repo` (Full control of private repositories)
5. Klick "Generate token"
6. **Token copy!** (wird nur einmal angezeigt)

Dann führe aus:

```powershell
git push -u origin main
```

Wenn dich nach Passwort gefragt wird:
- **Username**: dein GitHub Benutzername
- **Password**: dein eben erstellter Token

### Option B: SSH (dauerhaft, keine Token nötig)

Wenn SSH schon eingerichtet ist:

```powershell
git remote remove origin
git remote add origin git@github.com:YOUR_USERNAME/habit-tracker.git
git push -u origin main
```

## Schritt 4: Nachfolgende Changes pushen

Nach Änderungen einfach:

```powershell
git add .
git commit -m "Beschreibung der Änderung"
git push
```

## 📋 Übersicht der Befehle

```powershell
# Zeige Status
git status

# Zeige Commits
git log --oneline

# Zeige Remote
git remote -v

# Pushе Änderungen
git push
```

---

**Noch Fragen?** Siehe auch: https://docs.github.com/en/get-started/importing-your-projects-to-github
