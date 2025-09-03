#!/bin/bash
set -e  # Exit on any error

BRANCH="main"
FILE="BUILD_NUMBER.txt"

# Fetch latest from origin
git fetch origin

# Checkout the deployment branch
git checkout "$BRANCH"

# Reset working tree to remote
git reset --hard "origin/$BRANCH"

# Remove untracked files/dirs
git clean -df

# Read build number (if exists)
if [[ -f "$FILE" ]]; then
  num=$(cat "$FILE")
else
  num="(no build number found)"
fi

echo "Build $num is successful."