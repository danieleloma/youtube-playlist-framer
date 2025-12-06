# Git Repository Setup for Vercel

## ✅ Git Repository Initialized

Your project is now a Git repository! Here's how to connect it to Vercel:

---

## Option 1: Connect via GitHub (Recommended)

### Step 1: Create GitHub Repository

1. **Go to [github.com](https://github.com)** and sign in
2. **Click the "+" icon** → **"New repository"**
3. **Repository name:** `youtube-playlist-framer` (or any name you like)
4. **Visibility:** Public or Private (your choice)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click "Create repository"**

### Step 2: Connect Local Repository to GitHub

Run these commands in Terminal:

```bash
cd "/Users/danieleloma/Youtube Playlist"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/youtube-playlist-framer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** You'll be asked for your GitHub username and password (or token).

### Step 3: Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import Git Repository**
4. **Select your GitHub repository** (`youtube-playlist-framer`)
5. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: `.` (current directory)
   - Build Command: Leave empty
   - Output Directory: Leave empty
6. **Click "Deploy"**

Vercel will automatically:
- Deploy your API
- Give you a URL
- Auto-deploy on every push to GitHub

---

## Option 2: Connect via GitLab

Same process, but use GitLab instead of GitHub:

1. Create repository on GitLab
2. Add remote: `git remote add origin https://gitlab.com/YOUR_USERNAME/youtube-playlist-framer.git`
3. Push: `git push -u origin main`
4. Import to Vercel from GitLab

---

## Option 3: Connect via Bitbucket

Same process, but use Bitbucket:

1. Create repository on Bitbucket
2. Add remote: `git remote add origin https://bitbucket.org/YOUR_USERNAME/youtube-playlist-framer.git`
3. Push: `git push -u origin main`
4. Import to Vercel from Bitbucket

---

## Option 4: Deploy Directly (No Git Hosting)

If you don't want to use GitHub/GitLab/Bitbucket:

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Click "Deploy without Git"** or **"Upload"**
4. **Drag and drop your project folder**
5. **Deploy**

**Note:** This won't auto-deploy on changes. You'll need to manually redeploy.

---

## 🔄 Making Changes and Redeploying

### If Connected via GitHub/GitLab/Bitbucket:

```bash
# Make your changes
# Then:
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically redeploy! 🎉

### If Deployed Directly:

1. Make your changes
2. Go to Vercel dashboard
3. Click "Redeploy" or upload again

---

## 📋 Current Git Status

Your repository is initialized with:
- ✅ All project files committed
- ✅ `.gitignore` configured
- ✅ Ready to push to remote

---

## 🚀 Quick Commands Reference

```bash
# Check status
git status

# See what's changed
git diff

# Add changes
git add .

# Commit changes
git commit -m "Your message"

# Push to remote (after setting up remote)
git push

# See commit history
git log
```

---

## ✅ Next Steps

1. **Choose a Git hosting service** (GitHub recommended)
2. **Create repository** on that service
3. **Add remote and push** (commands above)
4. **Connect to Vercel** via Git import
5. **Get your API URL** from Vercel
6. **Configure component** in Framer with API URL

---

## 🆘 Troubleshooting

### "Repository not found"
- Check repository name is correct
- Make sure repository exists on GitHub/GitLab/Bitbucket
- Verify you have access to the repository

### "Authentication failed"
- Use a Personal Access Token instead of password
- For GitHub: Settings → Developer settings → Personal access tokens
- Generate token with `repo` permissions

### "Nothing to commit"
- Your files are already committed
- Make a change, then commit and push

---

**Your project is ready for Vercel!** 🎉

