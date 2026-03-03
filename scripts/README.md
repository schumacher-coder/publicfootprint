# Backup & Monitoring Scripts

## 📦 Available Scripts

1. **`backup-content.sh`** - Git-based content backup (daily)
2. **`monitor-website.sh`** - Website health monitoring (every 5 minutes)
3. **`install-cronjobs.sh`** - Automated cronjob installation

## 🚀 Quick Setup

### Automatic Installation (Recommended)

```bash
# On your VPS
cd /var/www/publicfootprint
sudo bash scripts/install-cronjobs.sh
```

This will:
- ✅ Make scripts executable
- ✅ Create log files
- ✅ Install cronjobs
- ✅ Backup existing crontab

---

## 📱 NTFY Setup

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

**Automatic (use install-cronjobs.sh)** or **Manual:**

```bash
# Crontab bearbeiten
sudo crontab -e

# Backup: täglich um 3 Uhr nachts
0 3 * * * /var/www/publicfootprint/scripts/backup-content.sh

# Monitoring: alle 5 Minuten
*/5 * * * * /var/www/publicfootprint/scripts/monitor-website.sh
```

**Custom schedules:**
```bash
# Backup alle 6 Stunden:
0 */6 * * * /var/www/publicfootprint/scripts/backup-content.sh

# Monitoring jede Minute (aggressiv):
* * * * * /var/www/publicfootprint/scripts/monitor-website.sh

# Monitoring alle 15 Minuten (sparsam):
*/15 * * * * /var/www/publicfootprint/scripts/monitor-website.sh
```

## 🔔 Notifications

### Backup Notifications (backup-content.sh)
**Nur Fehler:**
- ❌ **Backup Failed** - Git push fehlgeschlagen (priority: high)

### Monitoring Notifications (monitor-website.sh)
**Smart notifications:**
- 🚨 **Website Down** - Website nicht erreichbar (priority: urgent) - **nur beim ersten Mal!**
- ✅ **Website UP again** - Recovery notification - **nur wenn vorher down**
- ⚠️ **Slow Response** - Response time > 3 seconds (priority: default)

**Anti-Spam:** Notifications werden nur **einmal** gesendet bis sich der Status ändert.

**Monitored Sites:**
- ✅ `publicfootprint.de`
- ✅ `public-footprint.de`

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

## 📊 Logs anschauen

```bash
# Live monitoring logs
tail -f /var/log/publicfootprint-monitor.log

# Live backup logs
tail -f /var/log/publicfootprint-backup.log

# Both logs together
tail -f /var/log/publicfootprint-*.log

# Nur Fehler
grep "❌\|ERROR\|DOWN" /var/log/publicfootprint-*.log

# Letzte 50 Zeilen
tail -50 /var/log/publicfootprint-monitor.log
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
