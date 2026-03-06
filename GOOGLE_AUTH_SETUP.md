# Google Login einrichten

## Schritt 1: Google Cloud Console

1. Gehe zu https://console.cloud.google.com/
2. Neues Projekt erstellen (oder bestehendes wählen)
3. Links: **APIs & Services → Credentials**
4. Klick **+ Create Credentials → OAuth Client ID**
5. Application Type: **Web Application**
6. Name: z.B. `Habit Tracker`
7. **Authorized redirect URIs** – diese zwei eintragen:
   ```
   https://zpjsphhrgyybsyzbfrrh.supabase.co/auth/v1/callback
   ```
8. Klick **Create** → du bekommst **Client ID** und **Client Secret**

---

## Schritt 2: Supabase

1. Gehe zu https://supabase.com → dein Projekt
2. Links: **Authentication → Providers**
3. Klick auf **Google**
4. Toggle auf **Enabled**
5. Client ID und Client Secret aus Schritt 1 eintragen
6. **Site URL** setzen: `https://habit-tracker-ten-psi-73.vercel.app`
7. Unter **Redirect URLs** eintragen:
   ```
   https://habit-tracker-ten-psi-73.vercel.app
   http://localhost:5173
   ```
8. Klick **Save**

---

## Schritt 3: SQL ausführen

`SUPABASE_AUTH_SETUP.sql` im SQL-Editor ausführen.

---

## Fertig!

Jetzt kannst du dich mit deinem Google-Konto anmelden.
Jeder Benutzer sieht nur seine eigenen Habits.
