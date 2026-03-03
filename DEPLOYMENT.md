# Deployment Guide

## PM2 on VPS Setup (Current Production)

### Quick Deploy

```bash
cd ~/projects/publicfootprint
git pull
./deploy.sh
```

The `deploy.sh` script:
1. Installs dependencies (`npm install`)
2. Builds Next.js app (`npm run build`)
3. Reloads PM2 with zero-downtime (`pm2 reload`)

### DNS Setup (Ionos)

Current DNS configuration:
```
@    A      217.154.254.102  (VPS IP)
www  CNAME  public-footprint.de
```

### PM2 Management

```bash
pm2 status                    # Show all apps
pm2 logs publicfootprint -f   # Follow logs
pm2 monit                     # Live monitoring
pm2 restart publicfootprint   # Restart app
```

### Alias Domain Redirects

**Alias-Domains** (redirect to `public-footprint.de`):
- `publicfootprint.de` (ohne Bindestrich)
- `public-footprint.com` (.com statt .de)

**Option A: Ionos Domain-Weiterleitung (Empfohlen)**
1. Bei Ionos: Domain-Verwaltung → Weiterleitung einrichten
2. Ziel: `https://public-footprint.de`
3. Typ: `301 Permanent Redirect`
4. Wildcard aktivieren (für www-Subdomain)

**Option B: VPS Nginx Redirect**
```bash
cd ~/projects/publicfootprint
./deployment/setup-alias-domains.sh
```

Das Script:
1. Installiert nginx-config für Alias-Redirects
2. Erstellt SSL-Zertifikate (Let's Encrypt)
3. Aktiviert die Redirects

---

## Alternative: Vercel Setup für Multi-Domain Monorepo

### Schritt 1: Vercel-Projekt für Main App erstellen

1. **Vercel Dashboard** öffnen: https://vercel.com
2. **"Add New Project"** → GitHub-Repo `publicfootprint` verbinden
3. **Configure Project:**
   - Framework Preset: **Next.js**
   - Root Directory: **`apps/main`** (wichtig!)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Environment Variables** (falls benötigt):
   - Keine für MVP nötig

5. **Deploy** klicken

### Schritt 2: Custom Domain hinzufügen

1. Nach erfolgreichem Deployment: **Settings** → **Domains**
2. **Add Domain:** `publicfootprint.de`
3. Vercel zeigt DNS-Records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Schritt 3: DNS bei Ionos konfigurieren

1. **Ionos Login** → Domain-Verwaltung
2. **DNS-Einstellungen** für `publicfootprint.de`
3. **Bestehende A/CNAME Records** für `@` und `www` löschen
4. **Neue Records** hinzufügen (von Vercel kopiert)
5. **MX Records** für E-Mail NICHT ändern!
6. Speichern

**Propagation:** 10 Minuten bis 48 Stunden

### Schritt 4: SSL-Zertifikat

- Vercel erstellt automatisch Let's Encrypt SSL
- Nach DNS-Propagation: HTTPS automatisch aktiv
- Erzwingen: Vercel Settings → **Force HTTPS**

---

## Weitere Footprint-Domains (später)

### reference-footprint.de

1. **Neues Vercel-Projekt** erstellen
2. Root Directory: **`apps/reference`**
3. Custom Domain: `reference-footprint.de`
4. DNS bei Ionos analog konfigurieren

### visual-footprint.de, medien-footprint.de, etc.

- Gleicher Prozess wie reference-footprint.de
- Jede Domain = eigenes Vercel-Projekt
- Alle nutzen dasselbe GitHub-Repo

---

## Free Tier Limits

- ✅ Unlimited Projekte
- ✅ Unlimited Domains
- ✅ 100 GB Bandwidth/Monat
- ✅ 100 Deployments/Tag

Für 7-8 Marketing-Sites **mehr als ausreichend**!

---

## Mobile Workflow: Notizen bearbeiten

### Via GitHub Web (Browser):

1. https://github.com/schumacher-coder/publicfootprint
2. **Navigate:** `apps/main/src/app/notizen/page.tsx`
3. **Edit** (Stift-Icon)
4. **Neuen Eintrag** hinzufügen:
   ```tsx
   <article className="border-t-2 border-gray-300 pt-8">
     <time className="block font-mono text-sm text-gray-500 mb-4">
       12.11.2025
     </time>
     <div className="prose prose-lg max-w-none space-y-4 text-gray-700">
       <p>
         Dein neuer Eintrag hier...
       </p>
     </div>
   </article>
   ```
5. **Commit changes** → Vercel deployed automatisch!

### Via GitHub Mobile App:

1. **GitHub App** installieren (iOS/Android)
2. Repo öffnen → File navigieren
3. Edit → Commit → Push
4. Vercel deployed automatisch

**Dauer:** Edit (2 Min) + Deploy (30 Sek) = Live! 🚀

---

## Build & Test lokal

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev:main

# Browser öffnen
http://localhost:3000

# Build testen (vor Deployment)
npm run build:main
```

---

## Troubleshooting

### Build Failed

- Check `npm run build:main` lokal
- TypeScript-Errors beheben
- Dependencies mit `npm install` refreshen

### Domain zeigt nicht auf Vercel

- DNS-Propagation abwarten (bis 48h)
- DNS-Check: https://dnschecker.org
- Vercel Domain-Status prüfen

### SSL-Fehler

- DNS muss vollständig propagiert sein
- Vercel Settings → **Renew Certificate**

---

## Nächste Schritte

- [ ] Main App deployen
- [ ] Custom Domain `publicfootprint.de` verbinden
- [ ] DNS bei Ionos konfigurieren
- [ ] Google Forms Embed-URL hinzufügen
- [ ] Google Calendar Embed-URL hinzufügen
- [ ] Impressum vervollständigen (Handelsregister, USt-ID)
- [ ] Mobile Workflow testen (Notizen editieren)
- [ ] LinkedIn-Link aktualisieren
- [ ] Analytics einbinden (Google Analytics / Plausible)
