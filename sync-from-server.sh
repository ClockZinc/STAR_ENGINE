#!/bin/bash
# 星光引擎 - 从服务器同步最新代码到本地
# Usage: ./sync-from-server.sh

SERVER_IP="43.143.239.236"
SERVER_USER="ubuntu"
PEM_KEY="./qingtianhotel.pem"
REMOTE_PATH="/opt/starlight-engine/"
LOCAL_PATH="."

echo "🌟 Starlight Engine - Sync from Server"
echo "========================================"
echo ""

# Check if PEM key exists
if [ ! -f "$PEM_KEY" ]; then
    echo "❌ Error: PEM key not found at $PEM_KEY"
    exit 1
fi

# Create backup
echo "📦 Creating backup..."
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r components services "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ Backup saved to $BACKUP_DIR"
echo ""

# Sync from server
echo "⬇️  Syncing backend code from server..."
scp -r -i "$PEM_KEY" "$SERVER_USER@$SERVER_IP:$REMOTE_PATH/backend/src" "$LOCAL_PATH/backend/"

echo ""
echo "✅ Sync completed!"
echo ""
echo "Next steps:"
echo "  1. git status          # Check changes"
echo "  2. git diff            # Review changes"
echo "  3. git add .           # Stage changes"
echo "  4. git commit -m '...' # Commit changes"
echo ""
