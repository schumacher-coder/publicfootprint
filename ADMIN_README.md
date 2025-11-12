# Content Management System - Anleitung

Das CMS ermöglicht es Ihnen, alle Texte und Services auf der Website zu bearbeiten, ohne direkt im Code arbeiten zu müssen.

## Zugriff auf das Admin-Panel

1. Öffnen Sie: `https://publicfootprint.de/admin`
2. Geben Sie das Admin-Passwort ein
3. Standardpasswort: `admin123`

### Passwort ändern

Erstellen Sie eine `.env` Datei in `apps/main/`:

```bash
ADMIN_PASSWORD=IhrSicheresPasswort123!
```

## Features

### 1. Homepage bearbeiten

**Pfad:** `/admin/homepage`

Hier können Sie bearbeiten:
- **Hero-Bereich**: Haupttitel und Absätze
- **Public Footprint Bereich**: Über-uns-Text
- **Services-Bereich**: Überschrift
- **Call-to-Action**: Abschluss-Text und Button

**Markdown-Unterstützung:**
- `**Text**` für fette Schrift
- Absätze können hinzugefügt/entfernt werden

### 2. Services verwalten

**Pfad:** `/admin/services`

Funktionen:
- ✅ Neuen Service hinzufügen
- ✅ Service bearbeiten (Titel, Beschreibung, Domain)
- ✅ Service löschen
- ✅ Service aktivieren/deaktivieren
- ✅ Reihenfolge ändern (mit Pfeilen)
- ✅ Direkt zur Landing Page des Services springen

**Service-Felder:**
- **Titel**: Name des Services (z.B. "Digital Footprint")
- **Slug**: URL-Teil (z.B. "digital")
- **Domain**: Vollständige URL (z.B. "https://digital-footprint.de")
- **Excerpt**: Kurzbeschreibung auf der Homepage
- **Aktiviert**: Checkbox - Service auf Website anzeigen

### 3. Landing Pages bearbeiten

**Pfad:** `/admin/apps`

Für jeden Service gibt es eine eigene Landing Page:

**Struktur:**
- **Hero-Bereich**: Titel, Untertitel, Beschreibung
- **Inhaltsbereiche**: Beliebig viele Abschnitte mit Titel und Text
- **Call-to-Action**: Abschluss mit Button

**Funktionen:**
- Neue Inhaltsbereiche hinzufügen
- Bestehende Bereiche bearbeiten oder entfernen
- Domain anpassen

## Multi-Domain-Konzept

### Service hinzufügen und verlinken

1. Gehen Sie zu `/admin/services`
2. Klicken Sie "Neuer Service"
3. Füllen Sie alle Felder aus:
   - Titel: "Event Footprint"
   - Slug: "event"
   - Domain: "https://event-footprint.de"
   - Excerpt: "Kurzbeschreibung..."
4. Aktivieren Sie den Service
5. Speichern Sie
6. Klicken Sie "Landing Page bearbeiten"
7. Erstellen Sie den Content für die Landing Page

### Service löschen

1. In `/admin/services` auf "Löschen" klicken
2. Service wird von der Homepage entfernt
3. Landing Page-Daten bleiben erhalten (können in `/admin/apps` weiter bearbeitet werden)

## Content-Struktur

Alle Inhalte werden in JSON-Dateien gespeichert:

```
/content
  /main
    - homepage.json          # Homepage-Inhalte
    - services.json          # Service-Liste
  /apps
    - reference.json         # Landing Page für reference-footprint.de
    - digital.json           # Landing Page für digital-footprint.de
    - media.json             # Landing Page für media-footprint.de
    - ...
```

Diese Dateien können Sie:
- ✅ Über das Admin-Panel bearbeiten
- ✅ Direkt im Editor bearbeiten (für Bulk-Changes)
- ✅ Mit Git versionieren
- ✅ Backup erstellen

## Tipps

### Landing Page on-the-fly erstellen

1. Service in `/admin/services` anlegen
2. Auf "Landing Page bearbeiten" klicken
3. Wenn noch nicht vorhanden, wird automatisch ein Template erstellt
4. Content anpassen und speichern

### Service vorübergehend ausblenden

Nutzen Sie die "Aktiviert"-Checkbox in der Service-Verwaltung. Der Service wird dann nicht auf der Homepage angezeigt, die Landing Page bleibt aber verfügbar.

### Reihenfolge ändern

Nutzen Sie die Pfeil-Buttons (↑ ↓) neben jedem Service, um die Sortierung zu ändern.

### Backup erstellen

Kopieren Sie einfach den gesamten `/content` Ordner:

```bash
cp -r content content-backup-2025-01-12
```

## Entwickler-Notizen

### Neue App hinzufügen

Für eine komplett neue Service-Domain (z.B. visual-footprint.de):

1. Erstellen Sie die App in `/apps/visual`
2. Nutzen Sie die `LandingPage` Komponente aus `/shared/components`
3. Laden Sie den Content mit `getAppContent('visual')`
4. Fügen Sie den Service in `/admin/services` hinzu

Beispiel:

```tsx
import { getAppContent } from '@/lib/content'
import { LandingPage } from '@publicfootprint/shared-components'

export default function VisualPage() {
  const content = getAppContent('visual')

  if (!content) {
    return <div>Loading...</div>
  }

  return <LandingPage content={content} />
}
```

### API Endpoints

- `POST /api/admin/auth` - Login
- `DELETE /api/admin/auth` - Logout
- `GET /api/admin/homepage` - Homepage-Content laden
- `POST /api/admin/homepage` - Homepage-Content speichern
- `GET /api/admin/services` - Services laden
- `POST /api/admin/services` - Services speichern
- `GET /api/admin/apps/[slug]` - App-Content laden
- `POST /api/admin/apps/[slug]` - App-Content speichern
- `DELETE /api/admin/apps/[slug]` - App-Content löschen

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Browser-Konsole auf Fehler
2. Stellen Sie sicher, dass die JSON-Dateien valide sind
3. Überprüfen Sie Dateirechte im `/content` Ordner
