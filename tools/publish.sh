#!/bin/bash

# Configuration
# Usage: ./publish.sh "Your commit message"
COMMIT_MSG=${1:-"Update site content and styling"}

echo "🚀 Starting publication process..."

# Stage changes (considering adding only tracked files or specific directories)
git add -A
# Optional: git add -u  # to skip new untracked files if desired

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "✨ No changes to commit."
else
    echo "📝 Committing changes: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
if git push; then
    echo "✅ Successfully published to GitHub!"
else
    echo "❌ Failed to push. Please check your connection or authentication (run 'gh auth login')."
    exit 1
fi
