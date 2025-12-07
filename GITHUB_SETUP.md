# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `nodejs-project-ecommerce`
5. Description: "Node.js E-commerce API with MongoDB, JWT Authentication, and Server-Side Rendering"
6. Choose Public or Private
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Add Remote and Push

After creating the repository on GitHub, run these commands:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/nodejs-project-ecommerce.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## Alternative: Using SSH

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/nodejs-project-ecommerce.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

After pushing, verify on GitHub:
- All files should be visible
- README.md should display
- .gitignore should be working (node_modules should not be visible)

## Future Updates

To push future changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

