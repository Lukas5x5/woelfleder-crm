# Fehlerbehandlung und Debugging

## Update: Speicherfehler behoben (16.12.2025)

### Was wurde behoben:

1. **UUID-Generierung**: Fallback für ältere Browser hinzugefügt
2. **Bessere Fehlermeldungen**: Detaillierte Fehlerausgabe in der Browser-Konsole
3. **Console-Logging**: Debugging-Ausgaben beim Speichern hinzugefügt

### Wenn ein Fehler beim Speichern auftritt:

1. **Browser-Konsole öffnen:**
   - **iPhone (Safari)**: Settings → Safari → Advanced → Web Inspector → Enable
   - **Android (Chrome)**: chrome://inspect → Ihr Gerät auswählen
   - **Desktop**: F12 drücken oder Rechtsklick → "Untersuchen"

2. **Console-Tab öffnen** und nach Fehlermeldungen suchen

3. **Häufige Fehlerursachen:**
   - IndexedDB nicht verfügbar (Private/Inkognito-Modus)
   - Browser-Speicher voll
   - Fehlende Pflichtfelder
   - Browser-Version zu alt

### IndexedDB im Browser prüfen:

**Desktop (Chrome/Edge):**
1. F12 drücken
2. Application/Anwendung Tab
3. IndexedDB → WoelflederCRM
4. Hier sehen Sie alle gespeicherten Kunden

**Safari:**
1. Safari → Entwickler → Web-Inspektor
2. Storage Tab
3. IndexedDB

### Daten sichern/exportieren (manuell):

Da die automatische Export-Funktion noch nicht implementiert ist:

1. Browser-Konsole öffnen (F12)
2. Folgenden Code eingeben:
```javascript
// Alle Kunden exportieren
import { db } from './src/db/database';
const kunden = await db.customers.toArray();
console.log(JSON.stringify(kunden, null, 2));
// Kopieren Sie die Ausgabe und speichern Sie sie in einer Textdatei
```

### Falls nichts hilft:

1. **Browser-Cache leeren:**
   - Einstellungen → Datenschutz → Browserdaten löschen
   - ACHTUNG: Alle Kundendaten gehen verloren!

2. **App neu installieren:**
   - App vom Home-Bildschirm entfernen
   - Browser-Daten löschen
   - URL neu aufrufen und App neu installieren

3. **Anderen Browser probieren:**
   - Chrome statt Safari (oder umgekehrt)
   - Sicherstellen dass Sie NICHT im Private/Inkognito-Modus sind

### Supportierte Browser:

- Chrome/Edge 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Samsung Internet 14+ ✅

### Nicht unterstützt:

- Private/Inkognito-Modus ❌
- Internet Explorer ❌
- Sehr alte Browser-Versionen ❌

## Neue Fehlermeldungen:

Ab jetzt zeigt die App detaillierte Fehlermeldungen wenn etwas schief geht:

```
Fehler beim Speichern des Kunden:
[Detaillierte Fehlerbeschreibung]

Bitte überprüfen Sie die Browser-Konsole für mehr Details.
```

## Console-Logs zum Debugging:

Die App gibt jetzt folgende Logs aus:

1. **"Versuche Kunde zu speichern:"** - Zeigt die zu speichernden Daten
2. **"Kunde erfolgreich gespeichert:"** - Bestätigung mit Kunden-ID
3. **"Fehler beim Speichern in IndexedDB:"** - Detaillierter Fehler

---

**Bei weiteren Problemen:**
Machen Sie einen Screenshot der Fehlermeldung und der Browser-Konsole.
