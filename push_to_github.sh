#!/bin/bash

# This script simplifies pushing your existing project to GitHub.
# It handles initialization, adding files, committing, and pushing.

echo "Step 1: Initializing repository and setting branch to 'main'..."
git init
git branch -M main

echo "Step 2: Adding all files for commit..."
git add .

echo "Step 3: Committing changes (if any)..."
# The '|| true' part ensures the script continues even if there's nothing new to commit.
git commit -m "chore: initial commit of Saeed Store ERP Lite" || true

echo "Step 4: Setting up the remote 'origin'..."
# Remove old origin if it exists, then add the new one.
git remote remove origin || true
git remote add origin https://github.com/saeedh1986/STERPFB1.git

echo "Step 5: Pushing to GitHub..."
echo "You will be prompted for your GitHub username and password."
echo "For the password, use the Personal Access Token you created."
git push -u --force origin main

echo "Done! Check your GitHub repository page."
