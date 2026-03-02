#!/bin/bash
# Quick deployment script for PM2

set -e

echo "🚀 Deploying PublicFootprint..."

# Navigate to app directory
cd /home/thomas/publicfootprint/apps/main

# Pull latest changes (optional - comment out if you deploy via git push)
# git pull origin main

# Install dependencies (if package.json changed)
echo "📦 Checking dependencies..."
npm install --production=false

# Build Next.js app
echo "🔨 Building application..."
npm run build

# Reload PM2 (zero-downtime)
echo "♻️  Reloading PM2..."
cd /home/thomas/publicfootprint
pm2 reload ecosystem.config.js --update-env

# Show status
echo ""
echo "✨ Deployment complete!"
echo ""
pm2 status publicfootprint
pm2 logs publicfootprint --lines 20 --nostream

echo ""
echo "📝 Useful commands:"
echo "  pm2 status              # Show all apps"
echo "  pm2 logs publicfootprint -f   # Follow logs"
echo "  pm2 monit               # Live monitoring"
echo "  pm2 restart publicfootprint   # Restart app"
