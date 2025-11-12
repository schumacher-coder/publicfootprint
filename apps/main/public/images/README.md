# Bilder-Verzeichnis

## Struktur

```
/public/images/
  /portraits/     - Porträtfotos (z.B. Thomas, Team)
  /logos/         - Logos (Public Footprint, Partner, etc.)
```

## Verwendung

Bilder in Next.js referenzieren:

```tsx
import Image from 'next/image'

<Image
  src="/images/portraits/thomas.jpg"
  alt="Thomas Krings"
  width={400}
  height={400}
/>
```

Oder als einfaches Bild:
```html
<img src="/images/logos/public-footprint-logo.svg" alt="Public Footprint Logo" />
```

## Empfohlene Formate

- **Logos:** SVG (skalierbar) oder PNG (transparent)
- **Porträts:** JPG oder WebP
- **Optimale Größen:**
  - Porträts: 800x800px (wird automatisch optimiert)
  - Logos: SVG (vektorbasiert) oder 2x Auflösung für Retina

## Dateinamen

Verwenden Sie sprechende, lowercase Namen mit Bindestrichen:
- ✅ `thomas-krings.jpg`
- ✅ `public-footprint-logo.svg`
- ❌ `IMG_1234.jpg`
- ❌ `Logo Final v3.png`
