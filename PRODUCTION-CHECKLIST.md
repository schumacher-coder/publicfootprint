# 🚀 Production Go-Live Checklist

Dieser Guide führt dich durch alle notwendigen Schritte, bevor du von `prprofis.de` (Test) auf deine echte Produktions-Domain umstellst.

---

## 📋 **Pre-Flight Checklist**

### 1. **Nginx Security Hardening** 🔒

#### **A. Security Headers hinzufügen**

Öffne deine Nginx-Config:
```bash
sudo nano /etc/nginx/all-domains.conf
```

Füge im `server` Block für deine Produktions-Domain hinzu:

```nginx
server {
    server_name deine-domain.de www.deine-domain.de;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Content Security Policy (anpassen falls externe Scripts/Fonts)
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:;" always;

    # Next.js Image Optimizer (bereits vorhanden, aber prüfen!)
    location /_next/image {
        proxy_pass http://localhost:3000;
        proxy_buffering off;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }

    # Statische Assets cachen
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }

    # Main Location
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

    # SSL Config (bereits von Certbot erstellt)
    listen [::]:443 ssl ipv6only=on;
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/deine-domain.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deine-domain.de/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

# HTTP -> HTTPS Redirect
server {
    if ($host = www.deine-domain.de) {
        return 301 https://$host$request_uri;
    }

    if ($host = deine-domain.de) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    listen [::]:80;
    server_name deine-domain.de www.deine-domain.de;
    return 404;
}
```

#### **B. Rate-Limiting einrichten**

Füge am **Anfang** der Nginx-Config (außerhalb des `server` Blocks):

```nginx
# Rate-Limiting Zones
limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

# Connection-Limit
limit_conn_zone $binary_remote_addr zone=addr:10m;
```

Dann im `location /` Block:
```nginx
location / {
    limit_req zone=general burst=20 nodelay;
    limit_conn addr 10;
    # ... rest der config
}
```

#### **C. Nginx testen und neu laden**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

### 2. **SSL/TLS Hardening** 🔐

#### **A. SSL-Konfiguration prüfen**
```bash
# Certbot sollte bereits TLS 1.2+ aktiviert haben
cat /etc/letsencrypt/options-ssl-nginx.conf
```

#### **B. SSL-Test durchführen**
```bash
# Nach dem Domain-Umzug:
# https://www.ssllabs.com/ssltest/
# Ziel: A+ Rating
```

#### **C. HSTS Preload einreichen (optional)**
Nach 1 Monat ohne Probleme:
- https://hstspreload.org/
- Domain zur HSTS Preload-Liste hinzufügen

---

### 3. **Next.js Production-Build optimieren** ⚡

#### **A. `next.config.js` anlegen/erweitern**

Erstelle/öffne:
```bash
nano /home/user/publicfootprint/apps/main/next.config.js
```

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-Optimierungen
  output: 'standalone', // Kleinerer Docker-Build (optional)
  compress: true, // Gzip-Kompression
  poweredByHeader: false, // X-Powered-By Header entfernen

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ]
  },

  // Bildoptimierung
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Trailing Slash (je nach Präferenz)
  trailingSlash: false,
}

module.exports = nextConfig
```

#### **B. Production-Build erstellen**
```bash
cd /home/user/publicfootprint
npm run build:main

# Output prüfen:
# - Bundle-Größen
# - Keine Fehler/Warnungen
```

#### **C. Build-Analyse (optional)**
```bash
# Im apps/main/package.json ergänzen:
"analyze": "ANALYZE=true next build"

# Dann:
npm run analyze
```

---

### 4. **Environment-Variablen setzen** 🔧

#### **A. Production .env erstellen**
```bash
cd /home/user/publicfootprint/apps/main
cp .env.example .env.production
nano .env.production
```

Setze:
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://deine-domain.de
```

#### **B. Systemd-Service aktualisieren**

Falls du PM2/systemd nutzt:
```bash
sudo nano /etc/systemd/system/publicfootprint.service
```

```ini
[Service]
Environment="NODE_ENV=production"
EnvironmentFile=/home/user/publicfootprint/apps/main/.env.production
```

---

### 5. **SEO & Meta-Tags** 🎯

#### **A. robots.txt erstellen**
```bash
nano /home/user/publicfootprint/apps/main/public/robots.txt
```

```
User-agent: *
Allow: /

Sitemap: https://deine-domain.de/sitemap.xml
```

#### **B. Sitemap generieren**

Erstelle `apps/main/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://deine-domain.de/</loc>
    <lastmod>2026-03-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://deine-domain.de/services</loc>
    <lastmod>2026-03-01</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Weitere Seiten hier -->
</urlset>
```

#### **C. Meta-Tags prüfen**

In `apps/main/src/app/layout.tsx`:
```typescript
export const metadata = {
  title: 'Public Footprint - Dein Slogan',
  description: 'Professionelle PR & Kommunikation',
  keywords: 'PR, Kommunikation, Öffentlichkeitsarbeit',
  openGraph: {
    type: 'website',
    url: 'https://deine-domain.de',
    title: 'Public Footprint',
    description: 'Professionelle PR',
    siteName: 'Public Footprint',
  },
  twitter: {
    card: 'summary_large_image',
  },
}
```

---

### 6. **Monitoring & Logging** 📊

#### **A. Nginx Access-Logs analysieren**
```bash
# Log-Rotation prüfen
ls -lh /var/log/nginx/

# Echtzeit-Monitoring
sudo tail -f /var/log/nginx/access.log
```

#### **B. PM2 Monitoring (falls genutzt)**
```bash
pm2 monit
pm2 logs
```

#### **C. Fail2Ban einrichten (optional)**
```bash
sudo apt install fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
```

---

### 7. **Backup-Strategie** 💾

#### **A. Automatisches Git-Backup**

Erstelle Backup-Script:
```bash
nano ~/backup-publicfootprint.sh
chmod +x ~/backup-publicfootprint.sh
```

```bash
#!/bin/bash
cd /home/user/publicfootprint
git add -A
git commit -m "Auto-backup $(date +%Y-%m-%d_%H:%M)"
git push origin main
```

#### **B. Cronjob einrichten**
```bash
crontab -e
```

```cron
# Täglich um 3 Uhr morgens
0 3 * * * /home/user/backup-publicfootprint.sh >> /var/log/backup.log 2>&1
```

#### **C. Nginx-Config sichern**
```bash
sudo cp -r /etc/nginx /home/user/nginx-backup-$(date +%Y%m%d)
```

---

### 8. **DNS & Domain-Umstellung** 🌐

#### **A. DNS-Records vorbereiten**

Beim Domain-Provider (z.B. Hetzner, Strato, etc.):

```dns
# A-Record für Root-Domain
@       A       <DEINE-SERVER-IP>

# A-Record für www
www     A       <DEINE-SERVER-IP>

# Optional: AAAA für IPv6
@       AAAA    <DEINE-IPv6>
www     AAAA    <DEINE-IPv6>
```

#### **B. SSL-Zertifikat für neue Domain**
```bash
# WICHTIG: Erst NACH DNS-Umstellung!
sudo certbot --nginx -d deine-domain.de -d www.deine-domain.de

# Auto-Renewal testen
sudo certbot renew --dry-run
```

#### **C. Alte Domain weiterleiten (optional)**

In `/etc/nginx/all-domains.conf`:
```nginx
# Redirect von alter Test-Domain
server {
    server_name prprofis.de www.prprofis.de;
    return 301 https://deine-domain.de$request_uri;

    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/prprofis.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prprofis.de/privkey.pem;
}
```

---

### 9. **Performance-Testing** 🚀

#### **A. Lighthouse-Audit durchführen**
```bash
# Im Browser (Chrome DevTools):
# F12 → Lighthouse → Generate Report
# Ziel: >90 in allen Kategorien
```

#### **B. PageSpeed Insights**
- https://pagespeed.web.dev/
- URL eingeben nach Go-Live
- Optimierungen umsetzen

#### **C. Load-Testing (optional)**
```bash
# Mit Apache Bench
sudo apt install apache2-utils
ab -n 1000 -c 10 https://deine-domain.de/

# Mit wrk (fortgeschritten)
wrk -t4 -c100 -d30s https://deine-domain.de/
```

---

### 10. **Final Pre-Launch Checks** ✅

**48h vor Go-Live:**

- [ ] Alle Bilder optimiert (WebP/AVIF)
- [ ] Alle Links funktionieren (kein 404)
- [ ] Kontaktformular getestet (falls vorhanden)
- [ ] Mobile-Ansicht auf echten Geräten getestet
- [ ] Cross-Browser-Test (Chrome, Firefox, Safari, Edge)
- [ ] Impressum & Datenschutz aktuell
- [ ] Google Analytics / Matomo eingerichtet (optional)
- [ ] Favicon im `public/` Ordner

**24h vor Go-Live:**

- [ ] DNS-Records beim Provider vorbereitet (noch nicht aktiv)
- [ ] Nginx-Config für neue Domain erstellt
- [ ] Backup der aktuellen Installation
- [ ] Downtime-Page vorbereitet (falls nötig)

**Am Go-Live-Tag:**

1. DNS-Records aktivieren
2. 30-60 Min warten (DNS-Propagation)
3. SSL-Zertifikat mit Certbot holen
4. Nginx neu laden
5. Website auf neuer Domain testen
6. Alte Domain → Redirect einrichten

---

## 🔍 **Security-Audit-Tools**

Nach dem Go-Live einmalig durchführen:

```bash
# 1. SSL-Test
# https://www.ssllabs.com/ssltest/

# 2. Security-Headers
# https://securityheaders.com/

# 3. Observatory
# https://observatory.mozilla.org/

# 4. OWASP ZAP (lokal)
# https://www.zaproxy.org/
```

---

## 📞 **Troubleshooting-Checkliste**

**Website nicht erreichbar?**
```bash
# 1. Nginx-Status
sudo systemctl status nginx

# 2. Next.js-Prozess läuft?
ps aux | grep next
# oder bei PM2:
pm2 list

# 3. Logs checken
sudo tail -f /var/log/nginx/error.log
pm2 logs

# 4. DNS-Propagation
dig deine-domain.de
nslookup deine-domain.de
```

**SSL-Fehler?**
```bash
# Zertifikat erneuern
sudo certbot renew --force-renewal

# Nginx neu starten
sudo systemctl restart nginx
```

**500er Fehler?**
```bash
# Next.js neu starten
pm2 restart publicfootprint

# oder:
cd /home/user/publicfootprint/apps/main
npm run build
npm run start
```

---

## 📚 **Nützliche Kommandos**

```bash
# Nginx-Config testen
sudo nginx -t

# Nginx neu laden (ohne Downtime)
sudo systemctl reload nginx

# Nginx komplett neu starten
sudo systemctl restart nginx

# SSL-Zertifikate auflisten
sudo certbot certificates

# Disk-Space prüfen
df -h

# RAM-Nutzung
free -h

# Top-Prozesse
htop
```

---

## 🎯 **Post-Launch (erste 7 Tage)**

- [ ] Tag 1: SSL-Test durchführen
- [ ] Tag 1: Security-Headers prüfen
- [ ] Tag 2: Google Search Console einreichen
- [ ] Tag 3: PageSpeed-Audit
- [ ] Tag 7: Logs auf Fehler prüfen
- [ ] Tag 7: Backup-Cronjob verifizieren

---

**Viel Erfolg beim Launch! 🚀**

Bei Fragen: Einfach melden!
