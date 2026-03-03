#!/bin/bash
# Setup Alias Domain Redirects with SSL

set -e

echo "🚀 Setting up Alias Domain Redirects..."

# 1. Install nginx config
echo "📝 Installing nginx config..."
sudo cp /home/thomas/projects/publicfootprint/deployment/nginx-alias-redirects.conf \
    /etc/nginx/sites-available/footprint-alias-redirects

sudo ln -sf /etc/nginx/sites-available/footprint-alias-redirects \
    /etc/nginx/sites-enabled/footprint-alias-redirects

# 2. Test nginx config (without SSL first)
echo "🧪 Testing nginx config..."
sudo nginx -t

# 3. Reload nginx
echo "♻️  Reloading nginx..."
sudo systemctl reload nginx

# 4. Get SSL certificates (certbot)
echo "🔒 Setting up SSL certificates..."

# Certbot für publicfootprint.de (ohne Bindestrich)
sudo certbot certonly --nginx \
    -d publicfootprint.de \
    -d www.publicfootprint.de \
    --non-interactive \
    --agree-tos \
    --email thomas@public-footprint.de \
    || echo "⚠️  SSL für publicfootprint.de fehlgeschlagen"

# Certbot für public-footprint.com
sudo certbot certonly --nginx \
    -d public-footprint.com \
    -d www.public-footprint.com \
    --non-interactive \
    --agree-tos \
    --email thomas@public-footprint.de \
    || echo "⚠️  SSL für public-footprint.com fehlgeschlagen"

# 5. Final nginx reload (with SSL)
echo "♻️  Final nginx reload..."
sudo systemctl reload nginx

echo "✅ Alias Domain Redirects sind live!"
echo ""
echo "Test:"
echo "  curl -I http://publicfootprint.de"
echo "  curl -I http://public-footprint.com"
