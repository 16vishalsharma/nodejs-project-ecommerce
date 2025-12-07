# Fix Token Permissions

The token might not have the correct permissions. Here's how to fix it:

## Step 1: Regenerate Token with Correct Permissions

1. Go to: https://github.com/settings/tokens
2. Find your token or create a new one
3. Make sure it has these scopes checked:
   - ✅ **repo** (Full control of private repositories)
     - This includes: repo:status, repo_deployment, public_repo, repo:invite, security_events
4. Save the token

## Step 2: Push Using the Token

After getting a token with `repo` scope, use one of these methods:

### Method 1: Interactive (Recommended)
```bash
git push -u origin main
```
When prompted:
- Username: `16vishalsharma`
- Password: `YOUR_NEW_TOKEN`

### Method 2: Token in URL
```bash
git push https://16vishalsharma:YOUR_TOKEN@github.com/16vishalsharma/nodejs-project-ecommerce.git main
```

### Method 3: Use Git Credential Helper
```bash
# Store credentials
git config --global credential.helper osxkeychain

# Then push (will prompt once and save)
git push -u origin main
```

## Step 3: Verify Token Permissions

Your token MUST have the `repo` scope. Without it, you cannot push code.

## Alternative: Use SSH

If tokens don't work, set up SSH:

1. Generate SSH key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add SSH key to GitHub:
   - Copy: `cat ~/.ssh/id_ed25519.pub`
   - Add to: https://github.com/settings/keys

3. Change remote to SSH:
```bash
git remote set-url origin git@github.com:16vishalsharma/nodejs-project-ecommerce.git
git push -u origin main
```

