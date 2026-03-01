# Backup & Monitoring Scripts

## Setup

### 1. NTFY Topic erstellen

**Option A: Öffentliches Topic** (einfach, aber jeder kann mitlesen)
```bash
# In backup-content.sh:
NTFY_TOPIC="publicfootprint-monitoring"
```

**Option B: Privates Topic** (empfohlen, mit Passwort)
1. Gehe zu https://ntfy.sh
2. Erstelle ein Topic mit random Namen: `pf-mon-X7k9mR2q` (schwer zu erraten)
3. Optional: Setze Access Control auf ntfy.sh

**Option C: Eigener NTFY Server** (maximale Privacy)
```bash
# Installiere ntfy auf deinem Server
# Ändere in backup-content.sh:
curl -d "$message" "https://your-server.de/topic"
```

### 2. Script installieren

```bash
cd /var/www/publicfootprint

# Executable machen
chmod +x scripts/backup-content.sh

# Log-Datei erstellen
sudo touch /var/log/publicfootprint-backup.log
sudo chown www-data:www-data /var/log/publicfootprint-backup.log

# Test-Run
sudo -u www-data ./scripts/backup-content.sh
```

### 3. NTFY App installieren (zum Empfangen)

**Android/iOS:**
- App Store: "ntfy" installieren
- Topic subscriben: `publicfootprint-monitoring` (oder dein privates Topic)

**Desktop/Browser:**
- https://ntfy.sh/publicfootprint-monitoring

**CLI:**
```bash
# Subscriben im Terminal
ntfy subscribe publicfootprint-monitoring
```

### 4. Cron-Job einrichten

```bash
# Crontab bearbeiten
sudo crontab -e

# Hinzufügen (täglich um 2 Uhr nachts):
0 2 * * * /var/www/publicfootprint/scripts/backup-content.sh

# Oder mehrmals täglich (alle 6 Stunden):
0 */6 * * * /var/www/publicfootprint/scripts/backup-content.sh

# Oder stündlich (für wichtige Sites):
0 * * * * /var/www/publicfootprint/scripts/backup-content.sh
```

## Notifications

Das Script sendet **nur Fehler-Notifications** (keine Erfolgs-Meldungen):

- ❌ **Backup Failed** - Git push fehlgeschlagen
- ⚠️ **Website Down** - Website nicht erreichbar

**Erfolgreiches Backup** wird nur im Log vermerkt, **keine Notification**.

## Anpassungen

### Custom NTFY Topic

```bash
# In backup-content.sh ändern:
NTFY_TOPIC="dein-geheimer-topic-name"
```

### Custom Website-Check Intervall

Nur Website-Check ohne Backup:
```bash
# Separates Script: scripts/check-website.sh
#!/bin/bash
curl -f -s -o /dev/null "https://publicfootprint.de" || \
    curl -H "Title: Website Down" \
         -d "publicfootprint.de is not reachable!" \
         "https://ntfy.sh/your-topic"
```

Cron: Alle 5 Minuten checken
```
*/5 * * * * /var/www/publicfootprint/scripts/check-website.sh
```

## Logs anschauen

```bash
# Alle Logs
tail -f /var/log/publicfootprint-backup.log

# Nur Fehler
grep "❌\|ERROR" /var/log/publicfootprint-backup.log

# Letzte 50 Zeilen
tail -50 /var/log/publicfootprint-backup.log
```

## Troubleshooting

**Problem: Git push schlägt fehl**
```bash
# Check SSH Keys
sudo -u www-data ssh -T git@github.com

# Check Git Config
cd /var/www/publicfootprint
sudo -u www-data git config --list
```

**Problem: Notifications kommen nicht an**
```bash
# Test-Notification senden
curl -d "Test message" https://ntfy.sh/your-topic

# Checke in der App, ob Topic richtig geschrieben ist
```

**Problem: Permissions**
```bash
# Script muss als www-data laufen (oder User mit Git-Zugriff)
sudo chown www-data:www-data scripts/backup-content.sh
sudo chmod +x scripts/backup-content.sh
```
