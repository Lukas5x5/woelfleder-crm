# 🆘 Schnellhilfe - 404 Error beheben

## Problem: GitHub zeigt "404 Not Found"

Das passiert, wenn GitHub Pages noch nicht aktiviert ist oder noch lädt.

## ✅ Lösung (5 Minuten):

### Schritt 1: GitHub Pages aktivieren

1. Gehen Sie zu: **https://github.com/Lukas5x5/woelfleder-crm**
2. Klicken Sie oben rechts auf **"Settings"** (Zahnrad-Symbol)
3. Klicken Sie links im Menü auf **"Pages"**
4. Unter **"Source"**:
   - Wählen Sie **"Deploy from a branch"**
   - Branch: **"gh-pages"**
   - Folder: **"/ (root)"**
5. Klicken Sie **"Save"**

### Schritt 2: Warten (2-3 Minuten)

- GitHub baut die Seite jetzt
- Oben auf der Pages-Seite erscheint eine grüne Box mit:
  **"Your site is live at https://Lukas5x5.github.io/woelfleder-crm"**

### Schritt 3: Seite öffnen

Jetzt sollte die Seite funktionieren:
```
https://Lukas5x5.github.io/woelfleder-crm
```

---

## Immer noch 404?

### Überprüfen Sie:

1. **Branch existiert?**
   - Gehen Sie zu: https://github.com/Lukas5x5/woelfleder-crm
   - Klicken Sie auf das Dropdown links oben (steht "main")
   - Sehen Sie dort "gh-pages"? ✅
   - Wenn nicht: Führen Sie nochmal `npm run deploy` aus

2. **Richtige URL?**
   Die URL muss **exakt** sein:
   ```
   https://Lukas5x5.github.io/woelfleder-crm
   ```
   (mit Kleinbuchstaben bei "github.io")

3. **Cache leeren**
   - Browser-Cache leeren (Strg+Shift+Delete)
   - Oder im Inkognito-Modus öffnen

---

## Alternative: Nochmal deployen

Falls es immer noch nicht geht, deployen Sie nochmal:

```bash
cd "c:\Users\LRAus\Desktop\Wölfleder_Kunden\woelfleder-crm"
npm run deploy
```

Dann warten Sie 2-3 Minuten und versuchen Sie es erneut.

---

## Auf Handy als App hinzufügen

**NUR wenn die Seite funktioniert** (kein 404 mehr):

### iPhone:
1. Öffnen Sie die URL in Safari
2. Tippen Sie auf das "Teilen"-Symbol (Quadrat mit Pfeil)
3. Scrollen Sie runter → "Zum Home-Bildschirm"
4. Tippen Sie "Hinzufügen"

### Android:
1. Öffnen Sie die URL in Chrome
2. Tippen Sie auf die drei Punkte (⋮)
3. "Zum Startbildschirm hinzufügen"
4. Tippen Sie "Hinzufügen"

---

## Support

Falls es immer noch nicht geht:
1. Screenshot vom Settings → Pages Bereich machen
2. Mir zeigen, ich helfe weiter! 😊
