#!/bin/bash

###############################################################################
# Public Footprint VPS Setup Script
#
# This script sets up a fresh Ubuntu 22.04 VPS (Ionos/Hetzner) with:
# - Node.js 20.x
# - PM2 (Process Manager)
# - Nginx (Reverse Proxy)
# - Certbot (SSL Certificates)
# - Git Configuration
# - Repository clone and build
#
# Usage:
#   curl -O https://raw.githubusercontent.com/schumacher-coder/publicfootprint/main/setup-vps.sh
#   chmod +x setup-vps.sh
#   sudo ./setup-vps.sh
#
###############################################################################

set -e # Exit on error

echo "=========================================="
echo " Public Footprint VPS Setup"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  Bitte als root ausführen: sudo $0"
  exit 1
fi

echo -e "${GREEN}✓${NC} Updating system packages..."
apt update && apt upgrade -y

echo ""
echo -e "${GREEN}✓${NC} Installing base packages..."
apt install -y curl wget git build-essential

echo ""
echo -e "${GREEN}✓${NC} Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION installed"
echo -e "${GREEN}✓${NC} npm $NPM_VERSION installed"

echo ""
echo -e "${GREEN}✓${NC} Installing PM2..."
npm install -g pm2

echo ""
echo -e "${GREEN}✓${NC} Installing Nginx..."
apt install -y nginx

echo ""
echo -e "${GREEN}✓${NC} Installing Certbot for SSL..."
apt install -y certbot python3-certbot-nginx

echo ""
echo -e "${YELLOW}➜${NC} Cloning repository..."
echo "   Repository URL: https://github.com/schumacher-coder/publicfootprint.git"

# Ask for installation directory
read -p "Installation directory [/var/www/publicfootprint]: " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-/var/www/publicfootprint}

# Create directory if it doesn't exist
mkdir -p $(dirname $INSTALL_DIR)

# Clone repository
if [ -d "$INSTALL_DIR" ]; then
  echo -e "${YELLOW}⚠${NC}  Directory already exists. Pulling latest changes..."
  cd $INSTALL_DIR
  git pull origin main
else
  git clone https://github.com/schumacher-coder/publicfootprint.git $INSTALL_DIR
  cd $INSTALL_DIR
fi

echo ""
echo -e "${GREEN}✓${NC} Installing dependencies..."
npm install

echo ""
echo -e "${GREEN}✓${NC} Building application..."
npm run build

echo ""
echo -e "${YELLOW}➜${NC} Setting up environment variables..."
if [ ! -f "$INSTALL_DIR/apps/main/.env" ]; then
  echo "Creating .env file..."
  read -s -p "Enter Admin Password: " ADMIN_PASSWORD
  echo ""
  echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" > $INSTALL_DIR/apps/main/.env
  echo "NODE_ENV=production" >> $INSTALL_DIR/apps/main/.env
  echo -e "${GREEN}✓${NC} .env file created"
else
  echo -e "${YELLOW}⚠${NC}  .env file already exists, skipping..."
fi

echo ""
echo -e "${YELLOW}➜${NC} Starting application with PM2..."
cd $INSTALL_DIR/apps/main

# Stop existing PM2 process if running
pm2 delete publicfootprint 2>/dev/null || true

# Start with PM2
pm2 start npm --name "publicfootprint" -- start
pm2 startup
pm2 save

echo ""
echo -e "${GREEN}✓${NC} Application is running on http://localhost:3000"

echo ""
echo -e "${YELLOW}➜${NC} Configuring Git..."
echo "For GitHub push to work, you need to configure Git credentials."
echo ""
echo "Option 1: SSH Key (Recommended)"
echo "  1. Generate SSH key: ssh-keygen -t ed25519 -C 'vps@publicfootprint'"
echo "  2. Add to GitHub: cat ~/.ssh/id_ed25519.pub"
echo "  3. GitHub.com → Settings → SSH Keys → Add"
echo ""
echo "Option 2: Personal Access Token"
echo "  1. GitHub.com → Settings → Developer settings → Personal access tokens"
echo "  2. Create token with 'repo' permission"
echo "  3. Use token as password when git asks"
echo ""
read -p "Configure Git now? (y/n): " CONFIGURE_GIT

if [ "$CONFIGURE_GIT" = "y" ]; then
  echo ""
  echo "Generating SSH key..."
  ssh-keygen -t ed25519 -C "vps@publicfootprint" -f ~/.ssh/id_ed25519 -N ""
  echo ""
  echo -e "${GREEN}✓${NC} SSH key generated!"
  echo ""
  echo "Your public key (add this to GitHub):"
  echo "=========================================="
  cat ~/.ssh/id_ed25519.pub
  echo "=========================================="
  echo ""
  echo "Add this key to GitHub:"
  echo "https://github.com/settings/keys"
  echo ""
  read -p "Press Enter when you've added the key to GitHub..."

  # Test SSH connection
  echo "Testing GitHub connection..."
  ssh -T git@github.com || true

  # Configure Git user
  read -p "Your name for Git commits: " GIT_NAME
  read -p "Your email for Git commits: " GIT_EMAIL
  git config --global user.name "$GIT_NAME"
  git config --global user.email "$GIT_EMAIL"

  echo -e "${GREEN}✓${NC} Git configured!"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next Steps:"
echo ""
echo "1. Configure Nginx for your domains:"
echo "   See: nginx-config-example.conf"
echo ""
echo "2. Get SSL certificates:"
echo "   sudo certbot --nginx -d publicfootprint.de -d www.publicfootprint.de"
echo ""
echo "3. Access Admin CMS:"
echo "   https://publicfootprint.de/admin"
echo ""
echo "4. Monitor application:"
echo "   pm2 status"
echo "   pm2 logs publicfootprint"
echo ""
echo "5. Deploy updates:"
echo "   cd $INSTALL_DIR"
echo "   git pull origin main"
echo "   npm install"
echo "   npm run build"
echo "   pm2 restart publicfootprint"
echo ""
echo -e "${GREEN}Happy Publishing! 🚀${NC}"
