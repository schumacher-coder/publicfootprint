#!/bin/bash
# Quick deployment script for PM2

set -e

echo "🚀 Deploying PublicFootprint..."

# Navigate to app directory
cd /home/thomas/projects/publicfootprint/apps/main

# Pull latest changes (optional - comment out if you deploy via git push)
# git pull origin main

# Install dependencies (if package.json changed)
echo "📦 Checking dependencies..."
npm install --production=false

# Clean build cache to prevent Server Action mismatches
echo "🧹 Cleaning build cache..."
rm -rf .next

# Build Next.js app
echo "🔨 Building application..."
npm run build

# Restart PM2 (clean restart - important for Server Actions!)
echo "♻️  Restarting PM2..."
cd /home/thomas/projects/publicfootprint
pm2 restart ecosystem.config.js --update-env

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
