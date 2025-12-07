#!/bin/bash

# Script to push code to GitHub
# Make sure you've created the repository on GitHub first!

echo "🚀 Pushing code to GitHub..."

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "Remote 'origin' already exists. Updating..."
    read -p "Enter your GitHub username: " username
    git remote set-url origin https://github.com/$username/nodejs-project-ecommerce.git
else
    read -p "Enter your GitHub username: " username
    git remote add origin https://github.com/$username/nodejs-project-ecommerce.git
fi

# Rename branch to main if needed
git branch -M main

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "Repository: https://github.com/$username/nodejs-project-ecommerce"
else
    echo "❌ Push failed. Make sure:"
    echo "1. Repository exists on GitHub: https://github.com/$username/nodejs-project-ecommerce"
    echo "2. You have proper authentication set up"
    echo "3. You have write access to the repository"
fi

