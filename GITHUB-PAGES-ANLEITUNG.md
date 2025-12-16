# 🚀 GitHub Pages Deployment - Einfache Anleitung

## ⚠️ WICHTIG - Erst Supabase SQL ausführen!

**Bevor Sie deployen**, müssen Sie die Datenbank einrichten:

1. Gehen Sie zu https://supabase.com/dashboard
2. SQL Editor öffnen
3. Kopieren Sie den Inhalt von `supabase-schema.sql`
4. Fügen Sie ihn ein und klicken Sie "Run"

---

## Schritt 1: GitHub Repository erstellen

### A) Bei GitHub anmelden
- Gehen Sie zu https://github.com
- Melden Sie sich an (oder erstellen Sie einen Account)

### B) Neues Repository erstellen
1. Klicken Sie oben rechts auf **"+"** → **"New repository"**
2. Repository Name: **`woelfleder-crm`** (genau so!)
3. Wählen Sie **Public** (kostenlos)
4. **NICHT** "Add a README file" anklicken
5. Klicken Sie **"Create repository"**

---

## Schritt 2: package.json anpassen

**WICHTIG**: Öffnen Sie die Datei `package.json` und ändern Sie Zeile 6:

```json
"homepage": "https://IHR-GITHUB-USERNAME.github.io/woelfleder-crm",
```

Ersetzen Sie **IHR-GITHUB-USERNAME** durch Ihren echten GitHub-Benutzernamen!

**Beispiel:**
- Wenn Ihr GitHub-Username "max-mustermann" ist:
- Dann: `"homepage": "https://max-mustermann.github.io/woelfleder-crm",`

**Speichern Sie die Datei!**

---

## Schritt 3: Code zu GitHub hochladen

Öffnen Sie die **Kommandozeile** im Projekt-Ordner und führen Sie diese Befehle aus:

```bash
# Ersetzen Sie IHR-GITHUB-USERNAME mit Ihrem echten Benutzernamen!
git remote add origin https://github.com/IHR-GITHUB-USERNAME/woelfleder-crm.git
git branch -M main
git push -u origin main
```

**Beispiel:**
```bash
git remote add origin https://github.com/max-mustermann/woelfleder-crm.git
git branch -M main
git push -u origin main
```

Sie werden nach Ihrem GitHub-Passwort gefragt. Geben Sie es ein.

✅ Ihr Code ist jetzt auf GitHub!

---

## Schritt 4: Auf GitHub Pages deployen

Jetzt deployen Sie die Seite:

```bash
npm run deploy
```

Das Deployment dauert ca. 1-2 Minuten. Sie sehen:
- "Building..."
- "Publishing..."
- ✅ "Published"

---

## Schritt 5: GitHub Pages aktivieren

1. Gehen Sie zu GitHub: https://github.com/IHR-USERNAME/woelfleder-crm
2. Klicken Sie auf **"Settings"** (oben rechts)
3. Klicken Sie links auf **"Pages"**
4. Unter "Source" sollte **"gh-pages"** ausgewählt sein
5. Falls nicht: Wählen Sie "gh-pages" und klicken Sie "Save"

**Warten Sie 1-2 Minuten...**

---

## 🎉 Fertig! Ihre App ist ONLINE!

Ihre URL ist:
```
https://IHR-GITHUB-USERNAME.github.io/woelfleder-crm
```

**Beispiel:**
```
https://max-mustermann.github.io/woelfleder-crm
```

### Diese URL können Sie:
- ✅ Mit Ihrem Team teilen
- ✅ Auf dem Handy öffnen
- ✅ Auf jedem Computer öffnen
- ✅ Als Lesezeichen/Favoriten speichern

**Alle Geräte sehen die gleichen Kundendaten!**

---

## Updates deployen (später)

Wenn Sie etwas an der App ändern:

```bash
git add .
git commit -m "Beschreibung der Änderung"
git push
npm run deploy
```

Nach 1-2 Minuten ist die neue Version online!

---

## Fehlerbehebung

### "Failed to fetch" beim Öffnen der App

1. Überprüfen Sie, ob Sie das SQL-Schema in Supabase ausgeführt haben
2. Gehen Sie zu Supabase → Table Editor
3. Prüfen Sie, ob die Tabelle "customers" existiert

### "404 - Page not found"

1. Warten Sie 2-3 Minuten nach dem Deployment
2. Überprüfen Sie die URL (muss exakt sein!)
3. Gehen Sie zu GitHub → Settings → Pages
4. Prüfen Sie, ob "gh-pages" branch ausgewählt ist

### App zeigt leere Seite

1. Öffnen Sie die Browser-Konsole (F12)
2. Schauen Sie nach Fehlermeldungen
3. Überprüfen Sie, ob Sie die `homepage` in package.json richtig gesetzt haben

---

## Kosten

✅ **ALLES KOSTENLOS!**
- GitHub: Kostenlos
- GitHub Pages: Kostenlos
- Supabase: Kostenlos (500 MB Datenbank)

---

## Support

Bei Problemen:
1. Öffnen Sie die Browser-Konsole (F12) und schauen Sie nach Fehlern
2. Fragen Sie mich! 😊

---

## Wichtige Links zum Speichern

- **Ihre App**: https://IHR-USERNAME.github.io/woelfleder-crm
- **GitHub Repo**: https://github.com/IHR-USERNAME/woelfleder-crm
- **Supabase Dashboard**: https://supabase.com/dashboard

Ersetzen Sie überall **IHR-USERNAME** mit Ihrem echten GitHub-Benutzernamen!
