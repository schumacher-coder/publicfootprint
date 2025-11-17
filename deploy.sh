#!/bin/bash

###############################################################################
# Public Footprint Deployment Script
#
# This script pulls latest changes from GitHub and redeploys the application.
#
# Usage:
#   ./deploy.sh
#
###############################################################################

set -e # Exit on error

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${GREEN}=========================================="
echo " Public Footprint Deployment"
echo "==========================================${NC}"
echo ""

# Get installation directory (default to current directory)
INSTALL_DIR=${1:-$(pwd)}

echo -e "${YELLOW}➜${NC} Installation directory: $INSTALL_DIR"
echo ""

# Check if directory exists
if [ ! -d "$INSTALL_DIR" ]; then
  echo -e "${RED}✗${NC} Directory not found: $INSTALL_DIR"
  exit 1
fi

cd $INSTALL_DIR

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}⚠${NC}  You have uncommitted changes:"
  git status --short
  echo ""
  read -p "Stash changes and continue? (y/n): " STASH_CHANGES
  if [ "$STASH_CHANGES" = "y" ]; then
    git stash
    echo -e "${GREEN}✓${NC} Changes stashed"
  else
    echo -e "${RED}✗${NC} Deployment cancelled"
    exit 1
  fi
fi

echo -e "${YELLOW}➜${NC} Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo -e "${YELLOW}➜${NC} Installing dependencies..."
npm install

echo ""
echo -e "${YELLOW}➜${NC} Building application..."
cd apps/main
npm run build

echo ""
echo -e "${YELLOW}➜${NC} Restarting PM2 process..."
pm2 restart publicfootprint

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Application is running:"
echo "  PM2 Status: pm2 status"
echo "  PM2 Logs:   pm2 logs publicfootprint"
echo ""
echo "Check website:"
echo "  curl -I http://localhost:3000"
echo ""
