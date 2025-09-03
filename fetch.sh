#!/usr/bin/env bash
set -Eeuo pipefail

# ===== Config =====
BRANCH="${1:-main}"                 # pass a branch as 1st arg if not 'main'
APP_NAME="planner.mr-salih.org"     # PM2 process name
BUILD_FILE="BUILD_NUMBER.txt"       # optional: used for final message

echo "==> Deploying '$APP_NAME' from origin/$BRANCH"

# 1) Get latest code (hard reset; discards local changes)
git fetch origin
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -df

# 2) Install exact dependencies (uses package-lock if present)
if [[ -f package-lock.json ]]; then
  echo "==> Installing deps via npm ci"
  npm ci
else
  echo "==> Installing deps via npm install"
  npm install
fi

# 3) Build Next.js
echo "==> Building Next.js"
npm run build

# 4) Restart (or start) PM2 process
echo "==> Restarting PM2 process: $APP_NAME"
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  echo "==> PM2 process not found. Starting it."
  pm2 start npm --name "$APP_NAME" -- start
fi

# 5) Save process list so PM2 restarts on reboot
pm2 save

# 6) Optional: show build number in success message
BUILD_NUM="unknown"
if [[ -f "$BUILD_FILE" ]]; then
  BUILD_NUM="$(cat "$BUILD_FILE" || true)"
fi

echo "==> Deployment complete. Build ${BUILD_NUM} is successful."