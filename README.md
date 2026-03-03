# Public Footprint Network

Multi-domain architecture for Public Footprint GmbH.

## Struktur

```
/apps
  /main          → publicfootprint.de
  /reference     → reference-footprint.de (coming soon)
  /visual        → visual-footprint.de (coming soon)
  /medien        → medien-footprint.de (coming soon)
  /digital       → digital-footprint.de (coming soon)

/shared
  /components    → Shared React components
  /styles        → Global styles
```

## Development

```bash
# Install dependencies
npm install

# Run main app
npm run dev:main

# Build all apps
npm run build
```

## Deployment

Deployed on VPS with PM2:
- Main app: https://public-footprint.de
- Reference: reference-footprint.de (coming soon)
- etc.

**Deploy command:**
```bash
cd ~/projects/publicfootprint
git pull
./deploy.sh
```

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- React 18
- PM2 on VPS (Hosting)
- Ionos (Domain & DNS)
