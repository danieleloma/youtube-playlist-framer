# Complete Setup Guide: YouTube Playlist Component

## ⚠️ IMPORTANT: You Need 2 Things

The component **cannot work by itself**. You need:

1. ✅ **The Component Code** (in Framer)
2. ✅ **The API Backend** (deployed on Vercel)

The component makes requests to the API, which then fetches data from YouTube. Without the API, you'll get errors.

---

## 📋 Step-by-Step Setup

### **STEP 1: Deploy the API to Vercel** (REQUIRED)

The API is in the `api/ytPlaylist.js` file. You need to deploy it to Vercel.

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI** (if you don't have it):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to your project folder**:
   ```bash
   cd "/Users/danieleloma/Youtube Playlist"
   ```

3. **Login to Vercel**:
   ```bash
   vercel login
   ```

4. **Deploy the project**:
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? → **No** (first time)
   - Project name? → Press Enter (or choose a name)
   - Directory? → Press Enter (uses current directory)
   - Override settings? → **No**

5. **Note your deployment URL**:
   After deployment, you'll see something like:
   ```
   ✅ Production: https://your-project-name.vercel.app
   ```
   
   **Save this URL!** You'll need it in Step 3.

#### Option B: Using Vercel Dashboard (Web Interface)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your project**:
   - If it's a Git repo, connect it
   - Or drag and drop the project folder
4. **Configure**:
   - Framework Preset: **Other**
   - Root Directory: `.` (current directory)
   - Build Command: Leave empty (no build needed)
   - Output Directory: Leave empty
5. **Deploy**
6. **Copy your deployment URL** (e.g., `https://your-project.vercel.app`)

#### Verify API is Working

Test your API endpoint:
```
https://your-project.vercel.app/api/ytPlaylist?playlistId=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
```

Open this URL in your browser. You should see JSON data, not an error.

---

### **STEP 2: Add Component to Framer**

1. **Open Framer**
2. **Open your project**
3. **Drag `code.tsx` into Framer**:
   - Navigate to: `/Users/danieleloma/Youtube Playlist/components/YouTubePlaylistFeed/`
   - Drag `code.tsx` into Framer's Components panel
4. **The component should appear** in your components list

---

### **STEP 3: Configure the API URL** (CRITICAL!)

1. **In Framer**, select your `YouTubePlaylistFeed` component
2. **In the Properties panel**, find the **"API URL"** field
3. **Enter your Vercel deployment URL**:
   ```
   https://your-project.vercel.app/api/ytPlaylist
   ```
   
   Replace `your-project.vercel.app` with your actual Vercel URL from Step 1.

4. **Set your Playlist ID or URL**:
   - In the **"Playlist ID or URL"** field, enter:
     ```
     PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
     ```
     OR
     ```
     https://youtube.com/playlist?list=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
     ```

---

### **STEP 4: Verify Everything Works**

1. **Check the browser console** (F12 → Console tab)
2. **Look for any errors**
3. **The component should load videos** from your playlist

---

## 🔍 Troubleshooting

### Error: "Failed to fetch playlist: 404"

**Possible causes:**

1. **API not deployed** → Deploy to Vercel (Step 1)
2. **Wrong API URL** → Check the URL in component properties
3. **Playlist is private** → Make playlist public on YouTube
4. **API endpoint not working** → Test the API URL directly in browser

### Error: "Network error" or "CORS error"

- **Solution**: Make sure your API URL is correct and the API is deployed
- The API already has CORS headers enabled

### Component shows "Loading..." forever

- **Check browser console** for errors
- **Verify API URL** is correct
- **Test API endpoint** directly in browser

### API returns 404 when tested directly

1. **Check Vercel deployment logs**:
   - Go to Vercel dashboard
   - Click your project
   - Go to "Deployments" tab
   - Check logs for errors

2. **Verify file structure**:
   - Make sure `api/ytPlaylist.js` exists
   - Make sure `vercel.json` exists (for configuration)

3. **Redeploy**:
   ```bash
   vercel --prod
   ```

---

## 📁 Required Files for Deployment

Make sure these files exist in your project:

```
/
├── api/
│   └── ytPlaylist.js     ← API endpoint (REQUIRED)
├── vercel.json           ← Vercel config (REQUIRED)
└── package.json          ← Dependencies (optional, but recommended)
```

---

## 🎯 Quick Checklist

Before the component will work, verify:

- [ ] **API deployed to Vercel** (Step 1)
- [ ] **API URL tested and working** (opens in browser, shows JSON)
- [ ] **Component added to Framer** (Step 2)
- [ ] **API URL configured in component** (Step 3)
- [ ] **Playlist ID/URL entered** (Step 3)
- [ ] **Playlist is public** (not private/unlisted)

---

## 🚀 Alternative: Use a Public API (If You Don't Want to Deploy)

If you don't want to deploy your own API, you could:

1. **Use a public CORS proxy** (not recommended for production)
2. **Ask someone else to host the API** for you
3. **Use a different service** that provides YouTube playlist APIs

However, **deploying to Vercel is free and takes 5 minutes**, so it's the recommended approach.

---

## 💡 Pro Tips

1. **Keep your Vercel URL handy** - You'll need it every time you use the component
2. **Test the API first** - Always test the API URL in browser before using in component
3. **Check Vercel logs** - If something breaks, check deployment logs in Vercel dashboard
4. **Use environment variables** - For production, consider using Vercel environment variables

---

## 📞 Still Having Issues?

1. **Check Vercel deployment**:
   - Go to vercel.com
   - Check if deployment succeeded
   - Look at deployment logs

2. **Test API directly**:
   - Open: `https://your-project.vercel.app/api/ytPlaylist?playlistId=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE`
   - Should see JSON, not error

3. **Check browser console**:
   - Open DevTools (F12)
   - Look at Network tab
   - See what requests are failing

4. **Verify playlist is public**:
   - Open playlist in incognito window
   - Should be accessible without login

---

**Remember**: The component is just the frontend. It needs the API backend to fetch data from YouTube!

