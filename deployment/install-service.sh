#!/bin/bash
# Install systemd service for PublicFootprint

set -e

echo "📦 Installing PublicFootprint systemd service..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Copy service file
echo "📋 Copying service file to /etc/systemd/system/"
cp /home/thomas/projects/publicfootprint/deployment/publicfootprint.service /etc/systemd/system/

# Reload systemd
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

# Enable service
echo "✅ Enabling service (auto-start on boot)..."
systemctl enable publicfootprint.service

# Start service
echo "🚀 Starting service..."
systemctl start publicfootprint.service

# Show status
echo ""
echo "✨ Service installed and started!"
echo ""
systemctl status publicfootprint.service --no-pager

echo ""
echo "📝 Useful commands:"
echo "  sudo systemctl status publicfootprint   # Check status"
echo "  sudo systemctl restart publicfootprint  # Restart service"
echo "  sudo journalctl -u publicfootprint -f   # View logs"
