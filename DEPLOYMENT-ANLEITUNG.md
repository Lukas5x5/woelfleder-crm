# Deployment-Anleitung - Wölfleder CRM

Ihre CRM-Anwendung ist jetzt für die Cloud vorbereitet! Folgen Sie diesen Schritten:

## Schritt 1: Supabase-Datenbank einrichten

1. **Öffnen Sie Ihr Supabase-Dashboard**:
   - Gehen Sie zu https://supabase.com/dashboard
   - Wählen Sie Ihr Projekt aus

2. **SQL-Schema ausführen**:
   - Klicken Sie links auf "SQL Editor"
   - Öffnen Sie die Datei `supabase-schema.sql` (im Projektordner)
   - Kopieren Sie den gesamten Inhalt
   - Fügen Sie ihn in den SQL Editor ein
   - Klicken Sie auf "Run" oder drücken Sie Strg+Enter

   ✅ Die Tabellen `customers` und `reminders` sollten jetzt erstellt sein

3. **Überprüfen Sie die Tabellen**:
   - Klicken Sie links auf "Table Editor"
   - Sie sollten die Tabellen "customers" und "reminders" sehen

## Schritt 2: Lokale Tests

Bevor Sie online gehen, testen Sie lokal:

```bash
npm run dev
```

- Erstellen Sie einen neuen Kunden
- Die Daten werden jetzt in Supabase gespeichert (nicht mehr lokal!)
- Überprüfen Sie in Supabase unter "Table Editor" → "customers", ob der Kunde erscheint

## Schritt 3: Online deployen (Vercel - EMPFOHLEN)

Vercel ist kostenlos und perfekt für React/Vite-Apps:

1. **Erstellen Sie ein GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Wölfleder CRM"
   git branch -M main
   git remote add origin https://github.com/IHR-USERNAME/woelfleder-crm.git
   git push -u origin main
   ```

2. **Bei Vercel anmelden**:
   - Gehen Sie zu https://vercel.com
   - Melden Sie sich mit GitHub an

3. **Projekt importieren**:
   - Klicken Sie auf "Add New" → "Project"
   - Wählen Sie Ihr GitHub-Repository
   - Klicken Sie auf "Import"

4. **Build-Einstellungen** (Vercel erkennt Vite automatisch):
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Klicken Sie auf "Deploy"

5. **Fertig!**
   - Nach ca. 2 Minuten ist Ihre App online
   - URL: https://woelfleder-crm.vercel.app (oder ähnlich)

## Schritt 4: Von anderen Geräten zugreifen

✅ **WICHTIG**: Ihre Daten sind jetzt in Supabase gespeichert!

- Öffnen Sie die Vercel-URL auf Ihrem Handy
- Öffnen Sie sie auf einem anderen PC
- **Alle Geräte sehen die gleichen Kundendaten!**
- Änderungen werden sofort synchronisiert

## Alternative: GitHub Pages (etwas komplexer)

Falls Sie GitHub Pages bevorzugen:

1. **Installieren Sie gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Fügen Sie in package.json hinzu**:
   ```json
   "homepage": "https://IHR-USERNAME.github.io/woelfleder-crm",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deployen**:
   ```bash
   npm run deploy
   ```

4. **GitHub Pages aktivieren**:
   - Gehen Sie zu GitHub → Settings → Pages
   - Source: gh-pages branch
   - Speichern

## Wichtige Hinweise

### Sicherheit

⚠️ **WICHTIG**: Aktuell kann JEDER auf Ihre Daten zugreifen!

Die Row Level Security (RLS) Policies in Supabase sind so eingestellt, dass jeder alle Daten lesen und bearbeiten kann. Das ist für den Start okay, aber später sollten Sie:

1. **Authentifizierung hinzufügen** (Benutzer/Passwort)
2. **RLS-Policies anpassen**, damit nur authentifizierte Benutzer Zugriff haben

Wenn Sie das möchten, kann ich Ihnen dabei helfen!

### URL teilen

Wenn Sie die App online haben, können Sie die URL mit Ihrem Team teilen:
- Alle sehen die gleichen Daten
- Änderungen werden sofort für alle sichtbar
- Funktioniert auf PC, Tablet und Handy

### Kosten

- **Supabase**: Kostenlos bis 500 MB Datenbank und 50.000 monatliche Anfragen
- **Vercel**: Kostenlos für unbegrenztes Hosting
- **GitHub**: Kostenlos

Für Ihr CRM ist das mehr als ausreichend!

## Fehlerbehebung

### "Failed to fetch" Fehler

Falls Sie Fehler beim Laden der Daten sehen:
1. Überprüfen Sie, ob das SQL-Schema korrekt ausgeführt wurde
2. Überprüfen Sie die Supabase-URL und den API-Key in `src/lib/supabase.ts`
3. Schauen Sie in der Browser-Konsole nach Fehlermeldungen

### Daten werden nicht gespeichert

1. Öffnen Sie die Browser-Konsole (F12)
2. Schauen Sie nach Fehlermeldungen
3. Überprüfen Sie in Supabase unter "Table Editor", ob die Tabellen existieren

## Support

Bei Fragen oder Problemen:
1. Schauen Sie in die Browser-Konsole (F12) für Fehlermeldungen
2. Überprüfen Sie die Supabase-Logs unter "Logs" im Dashboard
3. Fragen Sie mich! 😊
