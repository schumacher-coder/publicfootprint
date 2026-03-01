# Markdown-Beispiel für Service-Pages

## So nutzt du Markdown in deinen Service-Texten:

### 1. Einfache Formatierung

```json
{
  "type": "text",
  "content": "In der B2B-IT-Welt entscheidet **Ihre Online-Präsenz** über *Vertrauen* und `Geschäftserfolg`."
}
```

**Ergebnis:**
- `**fett**` → **fett**
- `*kursiv*` → *kursiv*
- `` `Code` `` → `Code`

---

### 2. Listen

```json
{
  "type": "text",
  "content": "Unsere Leistungen:\n\n- Executive Ghostwriting\n- LinkedIn-Strategie\n- Content-Planung\n- KI-gestützte Recherche"
}
```

**Ergebnis:**
- Bullet-Points mit `-`
- Nummerierte Listen mit `1.`, `2.`, etc.

---

### 3. Links

```json
{
  "type": "text",
  "content": "Mehr Infos auf [LinkedIn](https://linkedin.com) oder in unserem [Blog](https://blog.example.com)."
}
```

**Ergebnis:** Klickbare Links mit `[Text](URL)`

---

### 4. Überschriften in Texten

```json
{
  "type": "text",
  "content": "## Warum Personal Footprint?\n\nWeil authentische Kommunikation zählt.\n\n### Drei Vorteile\n\n1. **Zeitersparnis**: KI-gestützt\n2. **Expertise**: 20+ Jahre Erfahrung\n3. **Authentizität**: Menschlich gedacht"
}
```

---

### 5. Zitate

```json
{
  "type": "text",
  "content": "> \"In der digitalen Welt ist Ihre persönliche Marke Ihre wichtigste Währung.\"\n\nGenau deshalb existiert Personal Footprint."
}
```

---

### 6. Code-Blöcke (falls relevant)

```json
{
  "type": "text",
  "content": "Beispiel für API-Integration:\n\n```javascript\nconst response = await fetch('/api/content')\n```"
}
```

---

## Vollständiges Beispiel für `personal.json`:

```json
{
  "domain": "https://personal-footprint.de",
  "hero": {
    "title": "Personal Footprint",
    "subtitle": "Executive Ghostwriting. KI gestützt. Menschlich gedacht.",
    "description": "Ihre persönliche Marke im digitalen Zeitalter - professionell positioniert und authentisch kommuniziert.",
    "image": ""
  },
  "sections": [
    {
      "id": "intro",
      "title": "Ihre digitale Visitenkarte",
      "content": [
        {
          "type": "text",
          "content": "In der **B2B-IT-Welt** entscheidet Ihre Online-Präsenz über:\n\n- **Vertrauen** bei potenziellen Kunden\n- **Sichtbarkeit** in Ihrer Branche\n- **Geschäftserfolg** auf LinkedIn\n\nWir helfen *Führungskräften* und *Experten*, ihre persönliche Marke strategisch aufzubauen."
        },
        {
          "type": "text",
          "content": "## Unsere Expertise\n\nMit über **20 Jahren Erfahrung** in der B2B-IT-Kommunikation kombinieren wir:\n\n1. KI-gestützte Effizienz\n2. Menschliche Expertise\n3. Strategisches Denken\n\n> \"Content, der nicht nur auffällt, sondern überzeugt.\""
        },
        {
          "type": "text",
          "content": "### Warum Personal Footprint?\n\nErfahren Sie mehr auf [LinkedIn](https://linkedin.com/company/publicfootprint) oder kontaktieren Sie uns direkt."
        }
      ]
    }
  ],
  "cta": {
    "title": "Bereit für Ihren Personal Footprint?",
    "buttonText": "Jetzt Kontakt aufnehmen",
    "buttonLink": "https://publicfootprint.de/kontakt"
  }
}
```

---

## Wichtig:

- **Zeilenumbrüche**: Verwende `\n\n` für Absätze
- **Escaping**: Nutze `\"` für Anführungszeichen in JSON
- **Listen**: Brauchen eine Leerzeile davor (`\n\n-`)
- **Links**: Öffnen automatisch in neuem Tab (ist schon konfiguriert)

---

## Unterstützte Markdown-Features:

✅ **Fett** (`**text**`)
✅ *Kursiv* (`*text*`)
✅ `Code` (`` `text` ``)
✅ Listen (ungeordnet + nummeriert)
✅ Links (`[text](url)`)
✅ Überschriften (`## H2`, `### H3`, etc.)
✅ Zitate (`> quote`)
✅ Code-Blöcke (` ```language `)
✅ Tabellen (GitHub-Flavored Markdown)
✅ ~~Durchgestrichen~~ (`~~text~~`)
