#!/bin/bash

# Configuration
NTFY_TOPIC="publicfootprint-monitoring"  # Ändere dies zu deinem privaten Topic
LOG_FILE="/var/log/publicfootprint-monitor.log"
STATE_FILE="/tmp/publicfootprint-monitor-state"

# Websites to monitor
declare -A WEBSITES=(
    ["publicfootprint.de"]="https://publicfootprint.de"
    ["public-footprint.de"]="https://public-footprint.de"
)

# Logging-Funktion
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# NTFY Notification senden
notify() {
    local title="$1"
    local message="$2"
    local priority="${3:-default}"
    local tags="${4:-monitoring,publicfootprint}"

    curl -s -H "Title: $title" \
         -H "Priority: $priority" \
         -H "Tags: $tags" \
         -d "$message" \
         "https://ntfy.sh/$NTFY_TOPIC" 2>&1 >> "$LOG_FILE"
}

# Check if site was previously down (to avoid spam)
was_down() {
    local domain="$1"
    grep -q "DOWN:$domain" "$STATE_FILE" 2>/dev/null
}

# Mark site as down
mark_down() {
    local domain="$1"
    echo "DOWN:$domain" >> "$STATE_FILE"
}

# Mark site as up (remove from state)
mark_up() {
    local domain="$1"
    grep -v "DOWN:$domain" "$STATE_FILE" 2>/dev/null > "${STATE_FILE}.tmp" || true
    mv "${STATE_FILE}.tmp" "$STATE_FILE" 2>/dev/null || true
}

log "=== Starting website monitoring ==="

# Monitor each website
for domain in "${!WEBSITES[@]}"; do
    url="${WEBSITES[$domain]}"
    log "Checking $domain ($url)..."

    # HTTP Status und Response Time
    response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" --max-time 10 "$url")
    http_code=$(echo "$response" | cut -d'|' -f1)
    response_time=$(echo "$response" | cut -d'|' -f2)

    if [[ "$http_code" == "200" ]]; then
        log "✅ $domain is UP (${http_code}, ${response_time}s)"

        # If it was down before, send recovery notification
        if was_down "$domain"; then
            notify "✅ $domain is UP again" \
                   "$domain is now reachable (Response time: ${response_time}s)" \
                   "default" \
                   "checkmark,recovery"
            mark_up "$domain"
        fi

        # Warn if slow
        if (( $(echo "$response_time > 3.0" | bc -l) )); then
            log "⚠️  $domain is slow (${response_time}s)"
            notify "⚠️ Slow Response" \
                   "$domain responded in ${response_time}s (threshold: 3s)" \
                   "default" \
                   "warning,performance"
        fi
    else
        log "❌ $domain is DOWN! (HTTP $http_code)"

        # Only send notification if not already notified
        if ! was_down "$domain"; then
            notify "🚨 $domain is DOWN!" \
                   "HTTP Status: $http_code\nURL: $url" \
                   "urgent" \
                   "rotating_light,alert,down"
            mark_down "$domain"
        fi
    fi
done

log "=== Monitoring completed ==="
