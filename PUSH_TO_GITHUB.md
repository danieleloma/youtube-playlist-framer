# Push to GitHub - Commands for danieleloma

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `youtube-playlist-framer` (or any name you prefer)
3. **Don't** check "Initialize with README" (we already have files)
4. Click "Create repository"

## Step 2: Push to GitHub

Run these commands in Terminal:

```bash
cd "/Users/danieleloma/Youtube Playlist"

# Connect to your GitHub repository
git remote add origin https://github.com/danieleloma/youtube-playlist-framer.git

# Ensure you're on main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** Replace `youtube-playlist-framer` with your actual repository name if different.

## If Repository Already Exists

If you already added the remote, use:

```bash
git remote set-url origin https://github.com/danieleloma/youtube-playlist-framer.git
git push -u origin main
```

## Authentication

You may be asked for:
- **Username:** `danieleloma`
- **Password:** Use a **Personal Access Token** (not your GitHub password)

### Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Vercel Deploy`
4. Select scope: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. Use this token as your password when pushing

## Verify Push

After pushing, check:
- Go to: https://github.com/danieleloma/youtube-playlist-framer
- You should see all your files!

## Next: Connect to Vercel

1. Go to: https://vercel.com
2. Click "Add New Project"
3. Import from GitHub
4. Select: `danieleloma/youtube-playlist-framer`
5. Deploy!

