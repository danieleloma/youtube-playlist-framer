# ⚡ Quick Start: Get It Working in 5 Minutes

## The Problem

You copied the component to Framer, but it's not working. That's because:

```
Component (Framer) → ❌ Nothing → Error!
```

The component needs an API backend to fetch data from YouTube.

## The Solution

```
Component (Framer) → API (Vercel) → YouTube → ✅ Works!
```

---

## 🎯 3 Steps to Fix

### Step 1: Deploy API (2 minutes)

Open Terminal and run:

```bash
cd "/Users/danieleloma/Youtube Playlist"
npm install -g vercel
vercel
```

**What happens:**
- Vercel asks you to login (first time)
- Creates a project
- Deploys your API
- Gives you a URL like: `https://abc123.vercel.app`

**✅ Success:** You get a URL ending in `.vercel.app`

---

### Step 2: Test API (30 seconds)

Open this URL in your browser (replace with YOUR URL):

```
https://your-project.vercel.app/api/ytPlaylist?playlistId=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
```

**✅ Success:** You see JSON data (not an error page)

**❌ Failure:** You see 404 or error → Check deployment logs in Vercel dashboard

---

### Step 3: Configure Component (1 minute)

1. **In Framer**, select your `YouTubePlaylistFeed` component
2. **Find "API URL"** in properties panel
3. **Enter your Vercel URL**:
   ```
   https://your-project.vercel.app/api/ytPlaylist
   ```
4. **Enter Playlist ID**:
   ```
   PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
   ```

**✅ Success:** Component loads videos!

---

## 🔍 Still Not Working?

### Check These:

1. **API deployed?**
   - Go to vercel.com
   - See if your project exists
   - Check deployment status

2. **API URL correct?**
   - Must end with `/api/ytPlaylist`
   - Must be `https://` (not `http://`)
   - No trailing slash

3. **Playlist public?**
   - Open playlist in incognito window
   - Should see it without logging in

4. **Browser console?**
   - Press F12
   - Check Console tab for errors
   - Check Network tab for failed requests

---

## 📋 What Files Do What?

| File | Purpose | Where It Goes |
|------|---------|---------------|
| `code.tsx` | Component code | Framer (drag & drop) |
| `api/ytPlaylist.js` | API backend | Vercel (deploy) |
| `vercel.json` | Vercel config | Vercel (deploy) |

---

## 💡 Common Mistakes

❌ **"I only copied the component"**
- You need BOTH component AND API

❌ **"I deployed but didn't configure the URL"**
- Component needs to know where API is

❌ **"I used the wrong URL format"**
- Must be: `https://xxx.vercel.app/api/ytPlaylist`
- Not: `https://xxx.vercel.app` (missing `/api/ytPlaylist`)

❌ **"Playlist is private"**
- RSS feeds only work for public playlists
- Make it public on YouTube

---

## 🎓 Understanding the Architecture

```
┌─────────────┐
│   Framer    │  ← You drag component here
│  Component  │
└──────┬──────┘
       │ HTTP Request
       │ (fetch)
       ▼
┌─────────────┐
│   Vercel    │  ← You deploy API here
│     API     │
└──────┬──────┘
       │ RSS Feed
       │ (fetch)
       ▼
┌─────────────┐
│  YouTube    │  ← Public RSS feed
│    RSS      │
└─────────────┘
```

**Without the middle layer (Vercel API), the component can't reach YouTube!**

---

## ✅ Final Checklist

Before it will work:

- [ ] API deployed to Vercel
- [ ] Got Vercel URL (xxx.vercel.app)
- [ ] Tested API URL in browser (shows JSON)
- [ ] Component added to Framer
- [ ] API URL set in component properties
- [ ] Playlist ID entered
- [ ] Playlist is public

**All checked?** → It should work! 🎉

---

## 🆘 Need More Help?

1. **Read:** `COMPLETE_SETUP_GUIDE.md` (detailed instructions)
2. **Read:** `DEPLOY.md` (deployment steps)
3. **Read:** `TROUBLESHOOTING.md` (common issues)

---

**Remember:** Component alone = ❌ | Component + API = ✅

