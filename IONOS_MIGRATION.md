# Ionos Migration Guide: Alt → Neu

**Schritt-für-Schritt Anleitung** zur sicheren Migration Ihrer Homepage auf Ionos VPS.

---

## 🎯 Strategie: Zero-Downtime Migration

```
Alte Homepage (läuft weiter)
    ↓
Neuer VPS (parallel aufbauen)
    ↓
Alles testen
    ↓
DNS umschalten (5-15 Minuten)
    ↓
Neue Homepage live!
    ↓
Problem? DNS zurück (30 Sekunden)
```

---

## 📋 Checkliste

- [ ] Ionos VPS M gebucht (2 vCore, 4 GB RAM)
- [ ] VPS-Setup abgeschlossen (siehe `VPS_SETUP.md`)
- [ ] Alle 7 Domains im Ionos-Portal vorhanden
- [ ] Nginx konfiguriert für alle Domains
- [ ] SSL-Zertifikate eingerichtet
- [ ] Website getestet (HTTP + HTTPS)
- [ ] Admin-CMS funktioniert
- [ ] Git-Push funktioniert
- [ ] DNS-Umstellung vorbereitet

---

## 🚀 Schritt-für-Schritt

### Phase 1: VPS einrichten (ohne DNS-Änderung!)

**1. Ionos VPS buchen**
- Ionos → Cloud Server → VPS M
- Ubuntu 22.04 LTS wählen
- Standort: Deutschland
- SSH-Key hinzufügen (oder Passwort merken)

**2. VPS-IP notieren**
```
Beispiel: 123.45.67.89
```

**3. Setup-Script ausführen**
```bash
ssh root@123.45.67.89
curl -O https://raw.githubusercontent.com/schumacher-coder/publicfootprint/main/setup-vps.sh
chmod +x setup-vps.sh
./setup-vps.sh
```

**4. Nginx für alle 7 Domains konfigurieren**
```bash
# Siehe nginx-config-example.conf
nano /etc/nginx/sites-available/publicfootprint.de
# ... für alle 7 Domains
```

**5. SSL-Zertifikate VORLÄUFIG überspringen**
(Erst nach DNS-Umstellung!)

---

### Phase 2: Testen (mit temporärer URL oder /etc/hosts)

**Option A: Mit IP testen**
```bash
# Lokal auf Ihrem Rechner
curl -H "Host: publicfootprint.de" http://123.45.67.89
```

**Option B: Mit /etc/hosts (Mac/Linux) oder C:\Windows\System32\drivers\etc\hosts (Windows)**

Datei bearbeiten:
```
123.45.67.89  publicfootprint.de
123.45.67.89  www.publicfootprint.de
123.45.67.89  reference-footprint.de
# ... für alle 7 Domains
```

Dann im Browser: `http://publicfootprint.de`

**Prüfen:**
- ✅ Alle 7 Domains erreichbar?
- ✅ Admin-CMS erreichbar unter `/admin`?
- ✅ Login funktioniert?
- ✅ Texte bearbeiten funktioniert?
- ✅ Git-Push funktioniert?

**Wichtig:** Hosts-Datei danach wieder entfernen!

---

### Phase 3: DNS umstellen (Der kritische Moment!)

**Vorbereitung:**
- ⏰ Wählen Sie einen ruhigen Zeitpunkt (Abends/Wochenende)
- 📝 Notieren Sie aktuelle DNS-Einstellungen (Backup!)
- 🔐 Ionos-Login bereit halten

**DNS-Umstellung bei Ionos:**

Für **jede** der 7 Domains:

1. **Ionos Login** → Domains
2. **Domain auswählen** (z.B. publicfootprint.de)
3. **DNS-Einstellungen** öffnen
4. **Alte A-Records notieren!** (Für Rollback)
   ```
   Beispiel alte Einträge:
   @ → 217.160.xxx.xxx (alter Webhosting-Server)
   www → 217.160.xxx.xxx
   ```
5. **Neue A-Records setzen:**
   ```
   @ → 123.45.67.89 (Ihre neue VPS-IP)
   www → 123.45.67.89
   ```
6. **Speichern**
7. **Für alle 7 Domains wiederholen**

**Domains:**
1. publicfootprint.de
2. reference-footprint.de
3. digital-footprint.de
4. media-footprint.de
5. social-footprint.de
6. event-footprint.de
7. marketing-footprint.de

---

### Phase 4: Propagation abwarten (5-15 Minuten)

```bash
# DNS-Propagation prüfen (auf lokalem Rechner)
nslookup publicfootprint.de

# Sollte jetzt Ihre neue VPS-IP zeigen (123.45.67.89)
# Falls nicht: 5 Minuten warten, nochmal prüfen
```

**Online-Tools zum Prüfen:**
- https://www.whatsmydns.net/#A/publicfootprint.de
- Zeigt DNS von verschiedenen Standorten weltweit

---

### Phase 5: SSL-Zertifikate einrichten

**Erst NACH DNS-Umstellung!**

```bash
ssh root@<vps-ip>

# Für jede Domain:
certbot --nginx -d publicfootprint.de -d www.publicfootprint.de
certbot --nginx -d reference-footprint.de -d www.reference-footprint.de
certbot --nginx -d digital-footprint.de -d www.digital-footprint.de
certbot --nginx -d media-footprint.de -d www.media-footprint.de
certbot --nginx -d social-footprint.de -d www.social-footprint.de
certbot --nginx -d event-footprint.de -d www.event-footprint.de
certbot --nginx -d marketing-footprint.de -d www.marketing-footprint.de
```

Certbot:
- Fragt nach E-Mail (für Ablauf-Warnungen)
- Akzeptiert Terms of Service
- Konfiguriert HTTPS automatisch
- Richtet Auto-Renewal ein

---

### Phase 6: Testen (LIVE!)

**Alle 7 Domains testen:**

1. **HTTP → HTTPS Redirect**
   ```
   http://publicfootprint.de → https://publicfootprint.de ✅
   ```

2. **SSL-Zertifikat gültig?**
   - Grünes Schloss im Browser
   - Kein Zertifikat-Warnung

3. **Admin-CMS erreichbar?**
   ```
   https://publicfootprint.de/admin
   ```

4. **Alle Seiten laden?**
   - Homepage
   - About
   - Kontakt
   - Notizen
   - Services
   - Impressum
   - Datenschutz

5. **Git-Push funktioniert?**
   - Admin → Text ändern → Speichern → Push

---

## 🚨 Rollback-Plan (falls Problem)

**Bei Problemen:**

### Schneller Rollback (30 Sekunden)

1. Ionos → Domains → DNS
2. A-Records zurücksetzen auf alte IP:
   ```
   @ → 217.160.xxx.xxx (alte IP)
   www → 217.160.xxx.xxx
   ```
3. Speichern
4. 5 Minuten warten
5. → Alte Homepage läuft wieder!

**Dann in Ruhe Problem auf VPS lösen.**

---

## 📞 Ionos Support nutzen

**Bei Problemen während Migration:**

1. **Telefon:** 0721 / 170 77 07 (24/7)
2. **Chat:** Im Ionos-Portal
3. **Ticket:** Control Panel → Support

**Sagen Sie:**
- "Ich migriere auf einen VPS"
- "DNS-Umstellung von Webhosting auf VPS"
- "A-Records für Domain publicfootprint.de"

Ionos Support hilft bei:
- DNS-Konfiguration
- VPS-Zugriff
- Nginx-Setup (Basics)

---

## 🎉 Nach erfolgreicher Migration

### Alter Webhosting kündbar?

**WARTEN SIE 1-2 WOCHEN!**

- Testen Sie die neue Seite ausgiebig
- Prüfen Sie alle Funktionen
- Stellen Sie sicher, dass alles läuft

**Dann erst alten Webhosting-Tarif kündigen.**

### Backup-Strategie

**Git = Ihr Backup!**

Alle Änderungen sind in GitHub:
```bash
# Auf VPS
cd /var/www/publicfootprint
git log --oneline -20  # Letzte 20 Änderungen
```

**Zusätzlich: VPS-Snapshot bei Ionos**
- Ionos → Cloud Server → Snapshots
- Vor größeren Änderungen Snapshot erstellen
- Kosten: ~0,04€/GB/Monat

---

## 🔐 Sicherheits-Checkliste nach Migration

- [ ] Firewall aktiviert (`ufw enable`)
- [ ] SSH nur mit Key-Auth (kein Passwort)
- [ ] Admin-Passwort geändert (nicht mehr Standard)
- [ ] SSL-Zertifikate aktiv (HTTPS)
- [ ] Auto-Renewal für SSL aktiviert
- [ ] PM2 Auto-Start bei Reboot
- [ ] Git-Credentials sicher (SSH-Key, kein Token in Files)

---

## 📊 Kosten-Vergleich

| Service | Alt (Webhosting) | Neu (VPS) | Unterschied |
|---------|------------------|-----------|-------------|
| Hosting | ~8-15€/Monat | 12€/Monat | ± 0€ |
| Domains (7x) | ~7€/Monat | ~7€/Monat | 0€ |
| SSL | ~20€/Jahr/Domain | **0€** (Let's Encrypt) | **-140€/Jahr!** |
| **Gesamt/Jahr** | ~260€ | **~120€** | **-140€ Ersparnis** |

**Plus:**
- Volle Kontrolle über Server
- Beliebig viele Domains ohne Aufpreis
- Node.js/Next.js optimal
- Keine Limits (Traffic, CPU, RAM)

---

## 💡 Tipps

### 1. TTL vorher senken

2 Tage VOR Migration:
- DNS-Einstellungen → TTL (Time To Live) auf 300 setzen
- Dann propagiert DNS schneller (5 Min statt 1 Stunde)

### 2. Maintenance-Seite vorbereiten (optional)

Für die 5-15 Min während DNS-Umstellung:
```nginx
# In Nginx-Config
return 503 "Kurze Wartung, gleich zurück!";
```

### 3. Monitoring einrichten

Nach Migration:
```bash
# UptimeRobot (kostenlos)
https://uptimerobot.com/

# Prüft alle 5 Min, ob Seite erreichbar
# E-Mail bei Ausfall
```

---

## 🚀 Los geht's!

**Sie sind bereit für die Migration!**

Folgen Sie den Phasen 1-6 der Reihe nach.

Bei Fragen:
- Ionos Support: 0721 / 170 77 07
- VPS-Logs: `pm2 logs publicfootprint`
- Nginx-Logs: `tail -f /var/log/nginx/error.log`

**Viel Erfolg! 🎉**
