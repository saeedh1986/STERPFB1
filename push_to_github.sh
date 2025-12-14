#!/bin/bash

# This script helps push your existing project to GitHub.
# Make sure you have created a Personal Access Token on GitHub with 'repo' scope.

echo "Step 1: Setting branch to 'main'..."
git branch -M main

echo "Step 2: Adding all files for commit..."
git add .

echo "Step 3: Committing changes..."
# The '|| true' part ensures the script continues even if there's nothing new to commit.
git commit -m "chore: prepare for GitHub push" || true

echo "Step 4: Removing old remote origin if it exists..."
git remote remove origin || true

echo "Step 5: Adding new remote origin..."
git remote add origin https://github.com/saeedh1986/STERPFB1.git

echo "Step 6: Pushing to GitHub..."
echo "You will be prompted for your GitHub username and password."
echo "For the password, use the Personal Access Token you created."
git push -u origin main

echo "Done! Check your GitHub repository page."
