# 🚀 Connect to Vercel - Step by Step

## ✅ Git Repository Ready!

Your project is now a Git repository with all files committed. Here's how to connect it to Vercel:

---

## 📋 Quick Steps

### 1. Push to GitHub (or GitLab/Bitbucket)

**Option A: Create New GitHub Repo**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `youtube-playlist-framer`
3. **Don't** initialize with README (we already have one)
4. Click "Create repository"

**Option B: Use Existing GitHub Repo**

If you already have a repository, just note the URL.

### 2. Connect Local Repo to GitHub

Run these commands (replace `YOUR_USERNAME` with your GitHub username):

```bash
cd "/Users/danieleloma/Youtube Playlist"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/youtube-playlist-framer.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You may need to authenticate. Use a Personal Access Token if prompted.

### 3. Import to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Click "Import Git Repository"**
4. **Select your GitHub account** (if not connected, connect it)
5. **Find and select** `youtube-playlist-framer`
6. **Click "Import"**

### 4. Configure Vercel Project

Vercel will auto-detect settings, but verify:

- **Framework Preset:** Other
- **Root Directory:** `.` (current directory)
- **Build Command:** (leave empty)
- **Output Directory:** (leave empty)
- **Install Command:** (leave empty)

**Click "Deploy"**

### 5. Get Your API URL

After deployment (takes ~1 minute):

1. **Copy your deployment URL** (e.g., `https://youtube-playlist-framer.vercel.app`)
2. **Your API endpoint is:** `https://youtube-playlist-framer.vercel.app/api/ytPlaylist`

### 6. Test the API

Open in browser:
```
https://youtube-playlist-framer.vercel.app/api/ytPlaylist?playlistId=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
```

Should see JSON data ✅

### 7. Configure Framer Component

1. **In Framer**, select `YouTubePlaylistFeed` component
2. **Set "API URL"** to: `https://youtube-playlist-framer.vercel.app/api/ytPlaylist`
3. **Set "Playlist ID or URL"** to your playlist
4. **Done!** 🎉

---

## 🔄 Auto-Deploy on Changes

Now whenever you push to GitHub:

```bash
git add .
git commit -m "Update component"
git push
```

Vercel will **automatically redeploy** your API! No manual steps needed.

---

## 📝 Alternative: Deploy Without Git Hosting

If you don't want to use GitHub:

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "Add New Project"**
3. **Click "Deploy without Git"** or drag & drop your folder
4. **Deploy**

**Note:** This won't auto-deploy. You'll need to manually redeploy on changes.

---

## ✅ Checklist

- [ ] Git repository initialized ✅ (Done!)
- [ ] All files committed ✅ (Done!)
- [ ] GitHub repository created
- [ ] Local repo connected to GitHub
- [ ] Pushed to GitHub
- [ ] Imported to Vercel
- [ ] Deployment successful
- [ ] Got API URL from Vercel
- [ ] Tested API in browser
- [ ] Configured component in Framer

---

## 🆘 Troubleshooting

### "Repository not found"
- Make sure you created the repo on GitHub first
- Check the repository name matches

### "Authentication failed"
- Use Personal Access Token instead of password
- GitHub: Settings → Developer settings → Personal access tokens
- Generate token with `repo` scope

### "Nothing to push"
- Your files are already committed
- Just push: `git push -u origin main`

### Vercel deployment fails
- Check Vercel logs in dashboard
- Make sure `api/ytPlaylist.js` exists
- Verify `vercel.json` is present

---

## 🎯 Current Status

✅ **Git repository:** Initialized and committed  
⏳ **GitHub:** Need to create and push  
⏳ **Vercel:** Need to import and deploy  
⏳ **Framer:** Need to configure API URL  

**You're halfway there!** Just need to push to GitHub and connect to Vercel.

---

**Next:** Follow steps 1-7 above to complete the setup! 🚀

