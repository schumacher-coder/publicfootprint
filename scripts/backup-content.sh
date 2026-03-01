#!/bin/bash

# Configuration
NTFY_TOPIC="publicfootprint-monitoring"  # Ändere dies zu deinem privaten Topic
REPO_PATH="/var/www/publicfootprint"
LOG_FILE="/var/log/publicfootprint-backup.log"
WEBSITE_URL="https://publicfootprint.de"

# Logging-Funktion
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# NTFY Notification senden
notify() {
    local title="$1"
    local message="$2"
    local priority="${3:-default}"  # default, high, urgent
    local tags="${4:-backup,publicfootprint}"

    curl -H "Title: $title" \
         -H "Priority: $priority" \
         -H "Tags: $tags" \
         -d "$message" \
         "https://ntfy.sh/$NTFY_TOPIC" 2>&1 >> "$LOG_FILE"
}

# Fehlerbehandlung
trap 'notify "❌ Backup Failed" "Content backup failed at step: $BASH_COMMAND" "high" "warning,backup"; exit 1' ERR

log "=== Starting backup and monitoring ==="

# 1. Website-Ping Check
log "Checking website availability..."
if curl -f -s -o /dev/null --max-time 10 "$WEBSITE_URL"; then
    log "✅ Website is reachable"
else
    log "❌ Website is DOWN!"
    notify "⚠️ Website Down" "$WEBSITE_URL is not reachable!" "urgent" "warning,alert"
fi

# 2. Git Content Backup
log "Checking for content changes..."
cd "$REPO_PATH" || exit 1

# Git Status checken
if [[ -n $(git status -s content/) ]]; then
    log "Changes detected in content/"

    # Content hinzufügen
    git add content/

    # Commit erstellen
    COMMIT_MSG="Auto-backup content $(date '+%Y-%m-%d %H:%M')"
    git commit -m "$COMMIT_MSG"

    # Push mit Retry-Logik
    MAX_RETRIES=3
    RETRY_COUNT=0

    log "Pushing to GitHub..."
    until git push origin main 2>&1 | tee -a "$LOG_FILE" || [ $RETRY_COUNT -eq $MAX_RETRIES ]; do
        RETRY_COUNT=$((RETRY_COUNT + 1))
        log "Push failed, retry $RETRY_COUNT/$MAX_RETRIES..."
        sleep 5
    done

    if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
        notify "❌ Backup Failed" "Git push failed after $MAX_RETRIES retries" "high" "warning,backup"
        exit 1
    fi

    log "✅ Content backup completed successfully"
    # No notification on success - only errors are reported
else
    log "No changes in content/, skipping backup"
fi

log "=== Backup and monitoring completed ==="
