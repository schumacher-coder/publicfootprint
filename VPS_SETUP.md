# VPS Setup Guide für Public Footprint

Komplette Anleitung zur Installation auf einem Ionos/Hetzner VPS mit Ubuntu 22.04.

---

## 🚀 Schnellstart

```bash
# 1. Als root einloggen
ssh root@<vps-ip>

# 2. Setup-Script herunterladen und ausführen
curl -O https://raw.githubusercontent.com/schumacher-coder/publicfootprint/main/setup-vps.sh
chmod +x setup-vps.sh
sudo ./setup-vps.sh
```

Das war's! Das Script installiert alles automatisch.

---

## 📋 Was wird installiert?

- ✅ **Node.js 20.x** - JavaScript Runtime
- ✅ **PM2** - Process Manager (hält die App am Laufen)
- ✅ **Nginx** - Reverse Proxy (leitet Domains zur App)
- ✅ **Certbot** - SSL-Zertifikate (HTTPS)
- ✅ **Git** - Versionskontrolle
- ✅ **Repository** - Ihr Code wird geklont
- ✅ **Build** - Next.js wird gebaut
- ✅ **Auto-Start** - App startet automatisch nach Reboot

---

## 🔧 Manuelle Installation (falls Script nicht funktioniert)

### 1. System aktualisieren

```bash
apt update && apt upgrade -y
apt install -y curl wget git build-essential
```

### 2. Node.js 20.x installieren

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Prüfen
node --version  # sollte v20.x.x zeigen
npm --version   # sollte 10.x.x zeigen
```

### 3. PM2 installieren

```bash
npm install -g pm2
```

### 4. Nginx installieren

```bash
apt install -y nginx
```

### 5. Certbot installieren

```bash
apt install -y certbot python3-certbot-nginx
```

### 6. Repository klonen

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/schumacher-coder/publicfootprint.git
cd publicfootprint
```

### 7. Dependencies installieren

```bash
npm install
```

### 8. Environment-Variablen setzen

```bash
nano apps/main/.env
```

Inhalt:
```
ADMIN_PASSWORD=IhrGeheimesPasswort123
NODE_ENV=production
```

### 9. Build erstellen

```bash
npm run build
```

### 10. PM2 starten

```bash
cd apps/main
pm2 start npm --name "publicfootprint" -- start
pm2 startup
pm2 save
```

### 11. PM2 prüfen

```bash
pm2 status
pm2 logs publicfootprint
```

---

## 🔐 Git-Credentials konfigurieren

Damit das Admin-CMS zu GitHub pushen kann:

### Option 1: SSH Key (Empfohlen)

```bash
# 1. SSH Key generieren
ssh-keygen -t ed25519 -C "vps@publicfootprint" -f ~/.ssh/id_ed25519 -N ""

# 2. Public Key anzeigen
cat ~/.ssh/id_ed25519.pub

# 3. Kopieren und zu GitHub hinzufügen:
#    https://github.com/settings/keys
#    → "New SSH key" → Key einfügen

# 4. SSH-Verbindung testen
ssh -T git@github.com
# Sollte "Hi schumacher-coder!" zeigen

# 5. Git User konfigurieren
git config --global user.name "Ihr Name"
git config --global user.email "ihre@email.de"
```

### Option 2: Personal Access Token

```bash
# 1. Token erstellen auf GitHub:
#    https://github.com/settings/tokens
#    → "Generate new token (classic)"
#    → Permission: "repo" (Full control of private repositories)
#    → Token kopieren

# 2. Beim ersten git push wird nach Passwort gefragt:
#    Username: schumacher-coder
#    Password: <token einfügen>

# 3. Git Credential Helper aktivieren (speichert Token)
git config --global credential.helper store
```

---

## 🌐 Nginx für 7 Domains konfigurieren

### DNS bei Ionos konfigurieren (ZUERST!)

Für **jede** Domain (publicfootprint.de, reference-footprint.de, etc.):

1. Ionos → Domains → Domain auswählen
2. DNS-Einstellungen
3. A-Records hinzufügen:
   ```
   @ → <VPS-IP> (z.B. 123.45.67.89)
   www → <VPS-IP>
   ```
4. Speichern
5. **15-30 Minuten warten** (DNS-Propagation)

### Nginx-Konfiguration erstellen

```bash
# Beispiel-Config kopieren
nano /etc/nginx/sites-available/publicfootprint.de
```

Inhalt (für publicfootprint.de):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name publicfootprint.de www.publicfootprint.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Für alle 7 Domains wiederholen!**

### Sites aktivieren

```bash
# Symlinks erstellen
ln -s /etc/nginx/sites-available/publicfootprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/reference-footprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/digital-footprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/media-footprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/social-footprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/event-footprint.de /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/marketing-footprint.de /etc/nginx/sites-enabled/

# Default-Site deaktivieren
rm /etc/nginx/sites-enabled/default

# Nginx testen
nginx -t

# Nginx neu laden
systemctl reload nginx
```

---

## 🔒 SSL-Zertifikate (HTTPS)

```bash
# Für jede Domain einzeln:
certbot --nginx -d publicfootprint.de -d www.publicfootprint.de
certbot --nginx -d reference-footprint.de -d www.reference-footprint.de
certbot --nginx -d digital-footprint.de -d www.digital-footprint.de
certbot --nginx -d media-footprint.de -d www.media-footprint.de
certbot --nginx -d social-footprint.de -d www.social-footprint.de
certbot --nginx -d event-footprint.de -d www.event-footprint.de
certbot --nginx -d marketing-footprint.de -d www.marketing-footprint.de

# Auto-Renewal testen
certbot renew --dry-run
```

Certbot erneuert Zertifikate automatisch alle 60 Tage.

---

## 🎯 Admin-CMS nutzen

1. Browser öffnen: `https://publicfootprint.de/admin`
2. Login mit Ihrem `ADMIN_PASSWORD`
3. Texte bearbeiten
4. Speichern
5. **"Push"-Button klicken** im Dashboard
6. → Änderungen sind in GitHub
7. Optional: `./deploy.sh` auf VPS ausführen (falls nötig)

---

## 🔄 Updates deployen

### Variante A: Über Admin-CMS (für Content-Änderungen)

1. Admin-CMS → Änderungen machen → Speichern
2. "Push"-Button klicken
3. Fertig! (Änderungen sind live)

### Variante B: Manuell (für Code-Änderungen)

```bash
ssh root@<vps-ip>
cd /var/www/publicfootprint
./deploy.sh
```

Das Script macht automatisch:
- Git pull
- npm install
- npm run build
- PM2 restart

---

## 🛠️ Wichtige Befehle

### PM2 (App-Management)

```bash
pm2 status                    # Status aller Apps
pm2 logs publicfootprint      # Live-Logs anzeigen
pm2 restart publicfootprint   # App neu starten
pm2 stop publicfootprint      # App stoppen
pm2 start publicfootprint     # App starten
pm2 monit                     # Live-Monitoring (CPU, RAM)
```

### Nginx

```bash
nginx -t                      # Config testen
systemctl status nginx        # Status
systemctl restart nginx       # Neu starten
systemctl reload nginx        # Config neu laden
tail -f /var/log/nginx/access.log  # Access-Log
tail -f /var/log/nginx/error.log   # Error-Log
```

### Git

```bash
git status                    # Änderungen anzeigen
git log --oneline -10         # Letzte 10 Commits
git pull origin main          # Updates holen
git add content/              # Änderungen stagen
git commit -m "Update"        # Committen
git push origin main          # Zu GitHub pushen
```

### System

```bash
df -h                         # Festplatten-Nutzung
free -h                       # RAM-Nutzung
htop                          # System-Monitor
journalctl -u nginx -f        # Nginx System-Logs
```

---

## 🚨 Troubleshooting

### Problem: "Cannot connect to VPS"

```bash
# Firewall prüfen
ufw status

# Ports öffnen
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw enable
```

### Problem: "502 Bad Gateway"

```bash
# PM2 läuft nicht
pm2 status
pm2 start publicfootprint

# Port 3000 blockiert
netstat -tlnp | grep 3000
```

### Problem: "Site not found"

```bash
# DNS noch nicht propagiert (15-30 Min warten)
nslookup publicfootprint.de

# Nginx-Config prüfen
nginx -t
ls -la /etc/nginx/sites-enabled/
```

### Problem: "Git push failed"

```bash
# SSH-Key noch nicht hinzugefügt
cat ~/.ssh/id_ed25519.pub
# → Zu GitHub hinzufügen

# SSH-Verbindung testen
ssh -T git@github.com
```

### Problem: "Admin-CMS Push funktioniert nicht"

```bash
# Logs prüfen
pm2 logs publicfootprint

# Git-Status prüfen
cd /var/www/publicfootprint
git status

# Git-Credentials prüfen
git config --global --list
```

---

## 🔐 Sicherheit

### Firewall aktivieren

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### SSH-Login mit Key (ohne Passwort)

```bash
# Auf lokalem Rechner:
ssh-keygen -t ed25519
ssh-copy-id root@<vps-ip>

# Auf VPS: Passwort-Login deaktivieren
nano /etc/ssh/sshd_config
# Ändern: PasswordAuthentication no
systemctl restart sshd
```

### Admin-Passwort ändern

```bash
nano /var/www/publicfootprint/apps/main/.env
# ADMIN_PASSWORD ändern
pm2 restart publicfootprint
```

---

## 💰 Kosten-Übersicht (Ionos VPS M)

| Service | Kosten/Monat |
|---------|--------------|
| Ionos VPS M (2 vCore, 4 GB RAM) | ~12€ |
| Domains (7x) bei Ionos | ~7€ |
| SSL-Zertifikate (Let's Encrypt) | 0€ |
| **Gesamt** | **~19€** |

Alle 7 Domains laufen auf **einem** VPS!

---

## 📞 Support

Bei Problemen:
- PM2 Logs: `pm2 logs publicfootprint`
- Nginx Logs: `tail -f /var/log/nginx/error.log`
- GitHub Issues: https://github.com/schumacher-coder/publicfootprint/issues

---

**Viel Erfolg! 🚀**
