# Quick Deploy Guide

## 🚀 Deploy in 3 Commands

```bash
# 1. Navigate to project folder
cd "/Users/danieleloma/Youtube Playlist"

# 2. Install Vercel CLI (if not installed)
npm install -g vercel

# 3. Deploy
vercel
```

That's it! Vercel will:
- Ask you to login (first time only)
- Create a project
- Deploy your API
- Give you a URL like: `https://your-project.vercel.app`

## 📝 After Deployment

1. **Copy your Vercel URL** (e.g., `https://your-project.vercel.app`)

2. **In Framer**, set the API URL property to:
   ```
   https://your-project.vercel.app/api/ytPlaylist
   ```

3. **Test it works** by opening this URL in your browser:
   ```
   https://your-project.vercel.app/api/ytPlaylist?playlistId=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
   ```

   You should see JSON data, not an error.

## ✅ Success Checklist

- [ ] Vercel deployment completed
- [ ] Got a URL (e.g., `https://xxx.vercel.app`)
- [ ] API URL works when opened in browser
- [ ] Component has API URL configured
- [ ] Component shows videos (not errors)

## 🆘 If Deployment Fails

1. **Make sure you're in the right folder**:
   ```bash
   pwd
   # Should show: /Users/danieleloma/Youtube Playlist
   ```

2. **Check files exist**:
   ```bash
   ls api/ytPlaylist.js
   ls vercel.json
   ```
   Both should exist.

3. **Try again**:
   ```bash
   vercel --force
   ```

## 📚 More Help

See `COMPLETE_SETUP_GUIDE.md` for detailed instructions.

