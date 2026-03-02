# 🚀 Deployment Setup

## Systemd Service Installation

### Quick Install:
```bash
sudo ./deployment/install-service.sh
```

### Manual Installation:
```bash
# Copy service file
sudo cp deployment/publicfootprint.service /etc/systemd/system/

# Reload, enable, and start
sudo systemctl daemon-reload
sudo systemctl enable publicfootprint.service
sudo systemctl start publicfootprint.service
```

## Service Management

### Check Status:
```bash
sudo systemctl status publicfootprint
```

### View Logs:
```bash
# Follow live logs
sudo journalctl -u publicfootprint -f

# Show last 100 lines
sudo journalctl -u publicfootprint -n 100
```

### Control Service:
```bash
sudo systemctl start publicfootprint    # Start
sudo systemctl stop publicfootprint     # Stop
sudo systemctl restart publicfootprint  # Restart
sudo systemctl disable publicfootprint  # Disable auto-start
```

## Requirements

- **Node.js 22+** installed at `/usr/bin/node`
- **Next.js app** built (`npm run build` in `apps/main/`)
- **Environment file** at `apps/main/.env`
- **Port 3003** available
- **Nginx** configured to proxy to `localhost:3003`

## Service Features

- ✅ Auto-start on boot
- ✅ Auto-restart on crash (10s delay)
- ✅ Production mode (NODE_ENV=production)
- ✅ Systemd logging via journalctl
- ✅ Environment variables from .env file

## Nginx Configuration

The service runs on port **3003**. Make sure your Nginx config proxies to it:

```nginx
location / {
    proxy_pass http://localhost:3003;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Troubleshooting

### Service won't start:
```bash
# Check logs for errors
sudo journalctl -u publicfootprint -n 50

# Verify Node.js path
which node
/usr/bin/node --version

# Check if port is already in use
sudo lsof -i :3003
```

### Permission issues:
```bash
# Make sure .env file is readable
ls -la /home/thomas/publicfootprint/apps/main/.env
```

### Update after code changes:
```bash
# Rebuild and restart
cd /home/thomas/publicfootprint/apps/main
npm run build
sudo systemctl restart publicfootprint
```
