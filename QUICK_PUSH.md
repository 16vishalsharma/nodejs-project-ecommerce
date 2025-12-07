# Quick Push to GitHub

Your code is ready! Follow these steps to push to GitHub:

## Step 1: Get Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Name: `nodejs-project-ecommerce`
4. Expiration: Choose your preference (90 days recommended)
5. Select scope: ✅ **repo** (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** immediately (you won't see it again!)

## Step 2: Push the Code

Run this command:
```bash
git push -u origin main
```

When prompted:
- **Username:** `16vishalsharma`
- **Password:** Paste your **Personal Access Token** (NOT your GitHub password)

## Alternative: Use Token in URL

Or use the token directly in the command:
```bash
git push https://16vishalsharma:YOUR_TOKEN@github.com/16vishalsharma/nodejs-project-ecommerce.git main
```

Replace `YOUR_TOKEN` with your actual token.

## Verify

After pushing, check: https://github.com/16vishalsharma/nodejs-project-ecommerce

You should see all your files!

