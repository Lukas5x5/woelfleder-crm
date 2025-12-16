# Wölfleder Stalltechnik - Kundenverwaltung (CRM)

Ein modernes, benutzerfreundliches Kundenverwaltungssystem speziell entwickelt für Wölfleder Stalltechnik. Das System hilft Ihnen, alle Kundenanfragen, Aufträge und Projekte effizient zu verwalten - sowohl am PC als auch mobil auf dem Handy.

## Features

### Kernfunktionen
- **Kundenverwaltung**: Erfassen und verwalten Sie alle Kundendaten zentral
- **Drei Auftragstypen**: Unterstützt Tore, Stallbau und Produkte mit jeweils spezifischen Workflows
- **Workflow-Tracking**: Verfolgen Sie den Status jedes Auftrags von der Anfrage bis zum Abschluss
- **Prioritätsverwaltung**: Markieren Sie wichtige Kunden und Aufträge
- **Erinnerungssystem**: Automatische Erinnerungen für Nachfass-Termine und wichtige Aufgaben
- **Aktivitätsprotokoll**: Dokumentieren Sie alle Interaktionen mit Kunden (Anrufe, Emails, Besuche)
- **Schnellsuche**: Finden Sie Kunden blitzschnell über Name, Firma, Telefon oder Email
- **Filter**: Filtern Sie nach Auftragstyp, Priorität, Status und mehr

### Technische Features
- **Progressive Web App (PWA)**: Funktioniert am PC und kann auf dem Handy wie eine App installiert werden
- **Offline-fähig**: Arbeiten Sie auch ohne Internetverbindung (Daten werden lokal gespeichert)
- **Responsive Design**: Optimiert für Desktop, Tablet und Smartphone
- **Lokale Datenbank**: Alle Daten werden sicher in Ihrem Browser gespeichert (IndexedDB)
- **Schnell & Modern**: Gebaut mit React, TypeScript und Tailwind CSS

## Workflows

### Tor-Aufträge
1. Anfrage erfasst
2. Ausmessen geplant
3. Angebot erstellt
4. Nachfassen (wenn nötig)
5. Angebot unterschrieben
6. An Firma gesendet
7. Auftragsbestätigung
8. In Produktion
9. Liefertermin
10. Montagetermin
11. Abgeschlossen

### Stallbau-Projekte
1. Erstgespräch
2. Zeichnung erstellt
3. Angebot erstellt
4. Nachfassen (wenn nötig)
5. Angebot angenommen
6. Profi-Plan angefordert
7. Plan unterschrieben
8. Bau begonnen
9. Baubegleitung
10. Fertigstellung
11. Abgeschlossen

### Produkt-Anfragen
Gleicher Workflow wie Tor-Aufträge

## Installation & Start

### Voraussetzungen
- Node.js (Version 18 oder höher) - [Download hier](https://nodejs.org/)
- Ein moderner Webbrowser (Chrome, Firefox, Safari, Edge)

### Schritt-für-Schritt Installation

1. **Terminal/Kommandozeile öffnen**
   - Windows: Win+R drücken, `cmd` eingeben und Enter
   - Mac: Terminal aus dem Programme-Ordner

2. **In das Projektverzeichnis wechseln**
   ```bash
   cd "c:\Users\LRAus\Desktop\Wölfleder_Kunden\woelfleder-crm"
   ```

3. **Dependencies installieren** (nur beim ersten Mal)
   ```bash
   npm install
   ```

4. **Entwicklungsserver starten**
   ```bash
   npm run dev
   ```

5. **Browser öffnen**
   - Die App läuft unter: http://localhost:5173
   - Öffnen Sie diese URL in Ihrem Browser

### Für Produktion bauen

Wenn Sie die App auf einem Server oder für den dauerhaften Einsatz bereitstellen möchten:

```bash
npm run build
```

Die fertige App befindet sich dann im `dist` Ordner.

Um die Produktionsversion lokal zu testen:

```bash
npm run preview
```

## Verwendung

### Neuen Kunden anlegen

1. Klicken Sie auf "Neuer Kunde" im Dashboard
2. Füllen Sie die Kontaktdaten aus:
   - Vorname, Nachname (Pflichtfelder)
   - Telefon (Pflichtfeld)
   - Optional: Firma, Email, Adresse
3. Wählen Sie den Auftragstyp (Tor, Stallbau oder Produkte)
4. Setzen Sie die Priorität (Hoch, Mittel, Niedrig)
5. Beschreiben Sie, was der Kunde braucht
6. Klicken Sie auf "Speichern"

### Kunden verwalten

- **Kunde finden**: Nutzen Sie die Suchleiste oder Filter
- **Details ansehen**: Klicken Sie auf einen Kunden in der Liste
- **Status ändern**: In der Kundendetailansicht mit "Weiter" und "Zurück"
- **Aktivität hinzufügen**: Dokumentieren Sie Anrufe, Emails oder Notizen
- **Erinnerung erstellen**: Setzen Sie Nachfass-Termine oder Erinnerungen

### Auf dem Handy installieren

#### iPhone/iPad (Safari)
1. Öffnen Sie die App in Safari
2. Tippen Sie auf das Teilen-Symbol
3. Scrollen Sie und wählen Sie "Zum Home-Bildschirm"
4. Bestätigen Sie mit "Hinzufügen"

#### Android (Chrome)
1. Öffnen Sie die App in Chrome
2. Tippen Sie auf das Menü (drei Punkte)
3. Wählen Sie "Zum Startbildschirm hinzufügen"
4. Bestätigen Sie mit "Hinzufügen"

Die App verhält sich dann wie eine normale App auf Ihrem Handy!

## Datenspeicherung

- **Alle Daten werden lokal im Browser gespeichert** (IndexedDB)
- Die Daten verlassen niemals Ihren Computer/Handy
- Sicher und privat
- Backup: Exportfunktion folgt in einer späteren Version

**WICHTIG**:
- Löschen Sie nicht die Browser-Daten/Cache, sonst gehen die Kundendaten verloren
- Nutzen Sie immer denselben Browser für den Zugriff
- Eine Backup-/Export-Funktion wird in der nächsten Version hinzugefügt

## Tastenkürzel (Desktop)

- `Strg/Cmd + K` - Schnellsuche öffnen (geplant)
- `ESC` - Dialoge schließen

## Geplante Features (Roadmap)

- [ ] Dokumenten-Upload und Verwaltung
- [ ] Kalenderansicht für Termine
- [ ] Export/Import von Daten (Backup)
- [ ] Email-Integration
- [ ] PDF-Angebote generieren
- [ ] Mehrbenutzer-Verwaltung
- [ ] Statistiken und Reports
- [ ] Cloud-Synchronisation (optional)

## Technologie-Stack

- **Frontend**: React 18 mit TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Datenbank**: Dexie.js (IndexedDB)
- **Datumsverarbeitung**: date-fns
- **Build-Tool**: Vite
- **PWA**: vite-plugin-pwa

## Support & Fragen

Bei Fragen oder Problemen:
1. Prüfen Sie, ob Node.js installiert ist: `node --version`
2. Prüfen Sie, ob npm funktioniert: `npm --version`
3. Löschen Sie `node_modules` und führen Sie `npm install` erneut aus
4. Prüfen Sie die Browser-Konsole auf Fehler (F12 drücken)

## Browser-Kompatibilität

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Browser (iOS Safari, Chrome Android)

## Lizenz

Dieses Projekt wurde speziell für Wölfleder Stalltechnik entwickelt.

---

**Version**: 1.0.0
**Entwickelt**: Dezember 2025
**Status**: Produktionsbereit
