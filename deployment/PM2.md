# 🚀 PM2 Deployment Guide

## Quick Start

### First-time Setup:
```bash
cd /home/thomas/publicfootprint

# Create logs directory
mkdir -p logs

# Build the app
cd apps/main
npm run build

# Start with PM2
cd /home/thomas/publicfootprint
pm2 start ecosystem.config.js

# Save PM2 config (auto-start on boot)
pm2 save
pm2 startup
```

---

## Deployment Workflow

### Easy Way (Recommended):
```bash
# One-command deploy
./deploy.sh
```

### Manual Way:
```bash
cd /home/thomas/publicfootprint/apps/main
npm run build
cd ..
pm2 reload ecosystem.config.js
```

---

## PM2 Commands

### Status & Monitoring:
```bash
pm2 status                    # Show all apps
pm2 show publicfootprint      # Detailed info
pm2 monit                     # Live monitoring (CPU, memory)
```

### Logs:
```bash
pm2 logs publicfootprint -f   # Follow live logs
pm2 logs publicfootprint --lines 100  # Last 100 lines
pm2 flush                     # Clear all logs
```

### Control:
```bash
pm2 reload publicfootprint    # Zero-downtime reload
pm2 restart publicfootprint   # Hard restart
pm2 stop publicfootprint      # Stop app
pm2 delete publicfootprint    # Remove from PM2
```

### Auto-Start on Boot:
```bash
pm2 save                      # Save current PM2 list
pm2 startup                   # Generate startup script
```

---

## Configuration (ecosystem.config.js)

### Current Settings:
- **App Name:** `publicfootprint`
- **Port:** `3003`
- **Node Version:** `/usr/bin/node`
- **Working Dir:** `/home/thomas/publicfootprint/apps/main`
- **Mode:** `fork` (single instance)
- **Max Memory:** `1GB` (auto-restart if exceeded)
- **Logs:** `/home/thomas/publicfootprint/logs/`

### Environment Variables:
Loaded from `/home/thomas/publicfootprint/apps/main/.env`

---

## Troubleshooting

### App won't start:
```bash
# Check logs for errors
pm2 logs publicfootprint --err

# Check if port is already in use
sudo lsof -i :3003

# Verify Node.js path
/usr/bin/node --version
```

### High memory usage:
```bash
# Check memory
pm2 monit

# App auto-restarts at 1GB
# Increase in ecosystem.config.js if needed:
# max_memory_restart: '2G'
```

### Logs too large:
```bash
# Install PM2 log rotate
pm2 install pm2-logrotate

# Configure rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## Nginx Integration

Make sure Nginx proxies to port **3003**:

```nginx
location / {
    proxy_pass http://localhost:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Performance Tips

### Enable Clustering (Multi-Core):
```javascript
// In ecosystem.config.js:
instances: 'max',  // Use all CPU cores
exec_mode: 'cluster'
```

### Monitor Performance:
```bash
# Real-time monitoring
pm2 monit

# Advanced metrics (requires keymetrics.io)
pm2 install pm2-server-monit
```

---

## Updating the App

### After Code Changes:
```bash
# Option 1: Use deploy script
./deploy.sh

# Option 2: Manual
cd /home/thomas/publicfootprint/apps/main
git pull
npm install
npm run build
pm2 reload publicfootprint
```

### After Config Changes:
```bash
# Restart with new config
pm2 reload ecosystem.config.js --update-env
```

---

## Backup & Recovery

### Save PM2 Config:
```bash
pm2 save
# Config saved to: ~/.pm2/dump.pm2
```

### Restore After Server Reboot:
```bash
pm2 resurrect
```

### Complete Reset:
```bash
pm2 kill          # Stop PM2 daemon
pm2 start ecosystem.config.js
pm2 save
```

---

## Migration from systemd

If you previously used systemd:

```bash
# Stop systemd service
sudo systemctl stop publicfootprint
sudo systemctl disable publicfootprint

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## Useful Links

- PM2 Docs: https://pm2.keymetrics.io/docs/usage/quick-start/
- Next.js PM2: https://nextjs.org/docs/deployment#pm2
- PM2 Clustering: https://pm2.keymetrics.io/docs/usage/cluster-mode/
