#!/bin/bash
# PublicFootprint Startup Script

cd /home/thomas/projects/publicfootprint/apps/main

# Load environment variables
export $(grep -v '^#' .env | xargs)
export NODE_ENV=production
export PORT=3003

# Start the app
/usr/bin/node node_modules/.bin/next start -p 3003
