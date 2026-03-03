#!/bin/bash

# Installation script for cronjobs
# Run this on your VPS: sudo bash scripts/install-cronjobs.sh

echo "🔧 Installing Public Footprint Monitoring & Backup Cronjobs..."

# Make scripts executable
chmod +x /var/www/publicfootprint/scripts/backup-content.sh
chmod +x /var/www/publicfootprint/scripts/monitor-website.sh

# Create log directory
mkdir -p /var/log
touch /var/log/publicfootprint-backup.log
touch /var/log/publicfootprint-monitor.log
chmod 644 /var/log/publicfootprint-*.log

# Backup existing crontab
crontab -l > /tmp/crontab-backup-$(date +%Y%m%d-%H%M%S).txt 2>/dev/null || true

# Create new crontab entry
cat > /tmp/publicfootprint-cron << 'EOF'
# Public Footprint - Monitoring & Backups
# Generated on: $(date)

# Backup content every day at 3 AM
0 3 * * * /var/www/publicfootprint/scripts/backup-content.sh >> /var/log/publicfootprint-backup.log 2>&1

# Monitor website every 5 minutes
*/5 * * * * /var/www/publicfootprint/scripts/monitor-website.sh >> /var/log/publicfootprint-monitor.log 2>&1

# Weekly backup summary (every Sunday at 8 AM)
0 8 * * 0 echo "[$(date)] Weekly summary: Backup system is running" >> /var/log/publicfootprint-backup.log

EOF

# Install crontab
echo ""
echo "📋 New crontab entries:"
cat /tmp/publicfootprint-cron

echo ""
echo "Do you want to install these cronjobs? (y/n)"
read -r response

if [[ "$response" == "y" ]]; then
    # Append to existing crontab or create new
    (crontab -l 2>/dev/null; cat /tmp/publicfootprint-cron) | crontab -
    echo "✅ Cronjobs installed successfully!"
    echo ""
    echo "📊 Current crontab:"
    crontab -l
else
    echo "❌ Installation cancelled"
    exit 1
fi

# Cleanup
rm /tmp/publicfootprint-cron

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Change NTFY_TOPIC in both scripts to your private topic"
echo "   2. Test the scripts manually:"
echo "      sudo bash /var/www/publicfootprint/scripts/monitor-website.sh"
echo "      sudo bash /var/www/publicfootprint/scripts/backup-content.sh"
echo "   3. Check logs:"
echo "      tail -f /var/log/publicfootprint-monitor.log"
echo "      tail -f /var/log/publicfootprint-backup.log"
