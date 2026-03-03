# 🚀 Deployment Guide: Backup & Monitoring

## Step-by-Step Installation on VPS

### 1️⃣ Pull Latest Changes

```bash
ssh thomas@217.154.254.102
cd /var/www/publicfootprint
git pull origin main
```

### 2️⃣ Configure NTFY Topic (WICHTIG!)

**Option A: Public Topic (einfach, aber jeder kann mitlesen)**
```bash
# Lass Topic wie es ist: "publicfootprint-monitoring"
# Subscribe in NTFY App: https://ntfy.sh/publicfootprint-monitoring
```

**Option B: Private Topic (empfohlen)**
```bash
# Erstelle ein zufälliges Topic:
PRIVATE_TOPIC="pf-$(openssl rand -hex 6)"
echo "Your private topic: $PRIVATE_TOPIC"

# Update beide Scripts:
sudo sed -i "s/publicfootprint-monitoring/$PRIVATE_TOPIC/g" \
    /var/www/publicfootprint/scripts/backup-content.sh \
    /var/www/publicfootprint/scripts/monitor-website.sh
```

### 3️⃣ Install NTFY App

**📱 Smartphone:**
- Android: Play Store → "ntfy"
- iOS: App Store → "ntfy"
- Subscribe zu deinem Topic: `publicfootprint-monitoring` (oder dein privates)

**🖥️ Desktop:**
- Browser: https://ntfy.sh/publicfootprint-monitoring
- Oder installiere die Desktop App

### 4️⃣ Test Notifications

```bash
cd /var/www/publicfootprint
bash scripts/test-ntfy.sh
```

**Prüfe in deiner NTFY App ob 4 Test-Nachrichten ankommen!**

### 5️⃣ Install Cronjobs

```bash
sudo bash scripts/install-cronjobs.sh
```

**Das Script wird fragen ob du die Cronjobs installieren willst. Antworte mit `y`.**

### 6️⃣ Verify Installation

```bash
# Check Cronjobs
crontab -l | grep publicfootprint

# Should show:
# 0 3 * * * /var/www/publicfootprint/scripts/backup-content.sh
# */5 * * * * /var/www/publicfootprint/scripts/monitor-website.sh
```

### 7️⃣ Manual Test Run

```bash
# Test Backup
sudo bash /var/www/publicfootprint/scripts/backup-content.sh

# Test Monitoring
sudo bash /var/www/publicfootprint/scripts/monitor-website.sh

# Check Logs
tail -20 /var/log/publicfootprint-*.log
```

---

## 📊 What You Get

### Backup System
- ✅ **Daily backup** at 3 AM
- ✅ Git-based content backup
- ✅ Automatic push to GitHub
- ✅ Retry logic (3 attempts)
- ✅ **NTFY alert** on failure

### Monitoring System
- ✅ **Check every 5 minutes**
- ✅ Monitors both domains:
  - `publicfootprint.de`
  - `public-footprint.de`
- ✅ **NTFY alerts** for:
  - 🚨 Website DOWN (urgent)
  - ✅ Website recovered
  - ⚠️ Slow response (> 3s)
- ✅ **Anti-spam:** Only one notification per incident

---

## 📱 NTFY Notifications

### You Will Receive:

| Notification | When | Priority |
|---|---|---|
| 🚨 **Website Down** | Site unreachable | Urgent |
| ✅ **Website UP** | Site recovered | Normal |
| ⚠️ **Slow Response** | Response > 3s | Normal |
| ❌ **Backup Failed** | Git push failed | High |

### You Will NOT Receive:
- ✅ Successful backups (only logged)
- ✅ Successful health checks (only logged)

**Reason:** Avoid notification spam!

---

## 🔧 Troubleshooting

### Problem: Notifications nicht erhalten

**Check 1: Topic richtig subscribed?**
```bash
# Zeige aktuelles Topic:
grep NTFY_TOPIC /var/www/publicfootprint/scripts/*.sh

# Test-Notification senden:
bash scripts/test-ntfy.sh
```

**Check 2: NTFY App läuft?**
- Öffne https://ntfy.sh/dein-topic im Browser
- Schicke Test-Notification
- Sollte im Browser erscheinen

### Problem: Cronjobs laufen nicht

**Check 1: Sind sie installiert?**
```bash
crontab -l | grep publicfootprint
```

**Check 2: Scripts ausführbar?**
```bash
ls -la /var/www/publicfootprint/scripts/*.sh
# Sollte alle mit 'x' (executable) zeigen
```

**Check 3: Logs prüfen**
```bash
# Cron system logs
sudo grep CRON /var/log/syslog | tail -20

# Script logs
tail -50 /var/log/publicfootprint-*.log
```

### Problem: Git push schlägt fehl

**Check SSH Keys:**
```bash
sudo -u www-data ssh -T git@github.com
# Sollte zeigen: "Hi username! You've successfully authenticated"
```

**Fix SSH Keys:**
```bash
# Generate new key
sudo -u www-data ssh-keygen -t ed25519 -C "backup@publicfootprint.de"

# Add to GitHub:
sudo cat /var/www/.ssh/id_ed25519.pub
# Copy and add to: https://github.com/settings/keys
```

---

## 🎯 Quick Reference

### Logs
```bash
# Live monitoring
tail -f /var/log/publicfootprint-monitor.log

# Live backup
tail -f /var/log/publicfootprint-backup.log

# Both
tail -f /var/log/publicfootprint-*.log

# Only errors
grep "❌\|ERROR\|DOWN" /var/log/publicfootprint-*.log
```

### Manual Runs
```bash
# Force backup now
sudo bash /var/www/publicfootprint/scripts/backup-content.sh

# Check website now
sudo bash /var/www/publicfootprint/scripts/monitor-website.sh

# Test NTFY
bash scripts/test-ntfy.sh
```

### Cronjob Management
```bash
# View cronjobs
crontab -l

# Edit cronjobs
crontab -e

# Remove all cronjobs
crontab -r

# Reinstall
sudo bash scripts/install-cronjobs.sh
```

---

## 📞 Support

Bei Problemen:
1. Check logs: `tail -50 /var/log/publicfootprint-*.log`
2. Test manual: `sudo bash scripts/monitor-website.sh`
3. Check cron: `crontab -l`

**Logs zeigen alles was passiert!** 🔍
