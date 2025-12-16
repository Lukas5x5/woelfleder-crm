# 🚀 GitHub Deployment - Wölfleder CRM

## Schritt 1: Supabase SQL ausführen (WICHTIG - zuerst!)

**Bevor Sie deployen**, müssen Sie die Datenbank einrichten:

1. Gehen Sie zu https://supabase.com/dashboard
2. Wählen Sie Ihr Projekt aus
3. Klicken Sie links auf **"SQL Editor"**
4. Öffnen Sie die Datei `supabase-schema.sql` auf Ihrem Computer
5. Kopieren Sie den **gesamten Inhalt**
6. Fügen Sie ihn in den SQL Editor ein
7. Klicken Sie auf **"Run"** (oder Strg+Enter)

✅ Jetzt sind die Tabellen erstellt!

---

## Schritt 2: GitHub Repository erstellen

### A) Bei GitHub anmelden
- Gehen Sie zu https://github.com
- Melden Sie sich an (oder erstellen Sie einen kostenlosen Account)

### B) Neues Repository erstellen
1. Klicken Sie oben rechts auf das **"+"** Symbol
2. Wählen Sie **"New repository"**
3. Geben Sie einen Namen ein: `woelfleder-crm`
4. Lassen Sie es auf **"Public"** (kostenlos) oder wählen Sie **"Private"**
5. **NICHT** "Initialize this repository with a README" anklicken
6. Klicken Sie auf **"Create repository"**

### C) Code hochladen
GitHub zeigt Ihnen jetzt Befehle an. Führen Sie diese in Ihrem Projekt-Ordner aus:

```bash
# Im Ordner: c:\Users\LRAus\Desktop\Wölfleder_Kunden\woelfleder-crm

# Ersetzen Sie IHR-USERNAME durch Ihren GitHub-Benutzernamen:
git remote add origin https://github.com/IHR-USERNAME/woelfleder-crm.git
git branch -M main
git push -u origin main
```

**Beispiel:**
```bash
git remote add origin https://github.com/max-mustermann/woelfleder-crm.git
git branch -M main
git push -u origin main
```

✅ Ihr Code ist jetzt auf GitHub!

---

## Schritt 3: Mit Vercel deployen (Die Seite online stellen)

### A) Bei Vercel anmelden
1. Gehen Sie zu https://vercel.com
2. Klicken Sie auf **"Sign Up"**
3. Wählen Sie **"Continue with GitHub"**
4. Erlauben Sie Vercel den Zugriff auf Ihre Repositories

### B) Projekt importieren
1. Sie sind jetzt im Vercel Dashboard
2. Klicken Sie auf **"Add New..."** → **"Project"**
3. Sie sehen eine Liste Ihrer GitHub Repositories
4. Suchen Sie **"woelfleder-crm"**
5. Klicken Sie auf **"Import"**

### C) Projekt konfigurieren
Vercel erkennt automatisch, dass es sich um ein Vite-Projekt handelt:

- **Framework Preset**: Vite ✅ (automatisch erkannt)
- **Root Directory**: `.` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

**WICHTIG**: Scrollen Sie runter und klicken Sie auf **"Deploy"**

### D) Warten (ca. 2-3 Minuten)
Vercel baut Ihre App und stellt sie online. Sie sehen:
- ✅ Building...
- ✅ Deploying...
- 🎉 **Congratulations!** Ihre App ist live!

---

## Schritt 4: Ihre App ist ONLINE! 🎉

Vercel gibt Ihnen eine URL, z.B.:
```
https://woelfleder-crm.vercel.app
```

oder

```
https://woelfleder-crm-ihr-name.vercel.app
```

### Diese URL können Sie:
- ✅ Mit Ihrem Team teilen
- ✅ Auf dem Handy öffnen
- ✅ Auf jedem Computer öffnen
- ✅ Als Lesezeichen speichern

**Alle Geräte sehen die gleichen Daten!**

---

## Schritt 5: Updates deployen (wenn Sie etwas ändern)

Wenn Sie später etwas an der App ändern möchten:

```bash
# Im Projekt-Ordner:
git add .
git commit -m "Beschreibung der Änderung"
git push
```

**Vercel deployt automatisch!** Nach 2-3 Minuten ist die neue Version online.

---

## Wichtige URLs zum Speichern

- **Ihre App**: https://woelfleder-crm-XXX.vercel.app (wird von Vercel angezeigt)
- **GitHub Repo**: https://github.com/IHR-USERNAME/woelfleder-crm
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

---

## Fehlerbehebung

### "Build failed" Fehler bei Vercel

Falls der Build fehlschlägt:
1. Gehen Sie zum Vercel Dashboard
2. Klicken Sie auf Ihr Projekt
3. Klicken Sie auf den fehlgeschlagenen Deployment
4. Scrollen Sie nach unten zu "Build Logs"
5. Schauen Sie, welcher Fehler aufgetreten ist

**Häufige Fehler:**
- **TypeScript-Fehler**: Beheben Sie die Fehler lokal mit `npm run build`
- **Fehlende Dependencies**: Führen Sie `npm install` aus

### "Failed to fetch" beim Öffnen der App

Falls die App Fehler beim Laden der Daten zeigt:
1. Überprüfen Sie, ob Sie das SQL-Schema in Supabase ausgeführt haben
2. Gehen Sie zu Supabase → Table Editor
3. Prüfen Sie, ob die Tabelle "customers" existiert

### App funktioniert lokal, aber nicht online

Öffnen Sie die Browser-Konsole (F12) auf der Live-Site und schauen Sie nach Fehlern.

---

## Kosten (ALLES KOSTENLOS! 🎉)

- ✅ **GitHub**: Kostenlos (unbegrenzte öffentliche Repositories)
- ✅ **Vercel**: Kostenlos (unbegrenztes Hosting für private Projekte)
- ✅ **Supabase**: Kostenlos (500 MB Datenbank, 50.000 Anfragen/Monat)

Für Ihr CRM ist das mehr als genug!

---

## Nächste Schritte (Optional)

### Eigene Domain (später)
Sie können später eine eigene Domain verbinden:
- z.B. `crm.woelfleder.at`
- Kostet ca. 10-15 € pro Jahr
- In Vercel unter Settings → Domains

### Authentifizierung (später)
Aktuell kann jeder mit der URL auf Ihre Daten zugreifen. Wenn Sie das ändern möchten:
- Supabase Auth einrichten (Login/Passwort)
- Fragen Sie mich, ich helfe Ihnen dabei!

---

## Support

Bei Fragen:
1. Schauen Sie in die Deployment-Logs (Vercel)
2. Schauen Sie in die Browser-Konsole (F12)
3. Fragen Sie mich! 😊
