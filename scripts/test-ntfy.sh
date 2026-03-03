#!/bin/bash

# Test script for NTFY notifications
# Usage: bash scripts/test-ntfy.sh [topic-name]

NTFY_TOPIC="${1:-publicfootprint-monitoring}"

echo "🔔 Testing NTFY notifications..."
echo "Topic: $NTFY_TOPIC"
echo "URL: https://ntfy.sh/$NTFY_TOPIC"
echo ""

# Test 1: Simple message
echo "Test 1: Simple message..."
curl -s -H "Title: Test Message" \
     -H "Tags: white_check_mark,test" \
     -d "This is a test notification from Public Footprint monitoring system." \
     "https://ntfy.sh/$NTFY_TOPIC"
echo "✅ Sent"
sleep 2

# Test 2: Warning message
echo ""
echo "Test 2: Warning message..."
curl -s -H "Title: ⚠️ Warning Test" \
     -H "Priority: default" \
     -H "Tags: warning,test" \
     -d "This is a warning test message." \
     "https://ntfy.sh/$NTFY_TOPIC"
echo "✅ Sent"
sleep 2

# Test 3: Critical alert
echo ""
echo "Test 3: Critical alert..."
curl -s -H "Title: 🚨 Critical Alert Test" \
     -H "Priority: urgent" \
     -H "Tags: rotating_light,alert,test" \
     -d "This is a critical alert test message. This would be sent when the website is down." \
     "https://ntfy.sh/$NTFY_TOPIC"
echo "✅ Sent"
sleep 2

# Test 4: Recovery message
echo ""
echo "Test 4: Recovery message..."
curl -s -H "Title: ✅ System Recovered" \
     -H "Priority: default" \
     -H "Tags: checkmark,recovery,test" \
     -d "System has recovered and is now operational." \
     "https://ntfy.sh/$NTFY_TOPIC"
echo "✅ Sent"

echo ""
echo "📱 Check your NTFY app or visit: https://ntfy.sh/$NTFY_TOPIC"
echo ""
echo "If you don't see the notifications:"
echo "  1. Make sure you subscribed to the topic in your NTFY app"
echo "  2. Check if the topic name is correct"
echo "  3. Try opening https://ntfy.sh/$NTFY_TOPIC in your browser"
