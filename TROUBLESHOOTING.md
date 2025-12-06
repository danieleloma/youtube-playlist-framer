# Troubleshooting: 404 Error with YouTube Playlist

## Common Causes of 404 Errors

### 1. **Playlist is Private or Unlisted** ⚠️ (Most Common)

**Problem:** YouTube RSS feeds only work for **public playlists**. Private or unlisted playlists will return a 404 error.

**Solution:**
1. Go to your YouTube playlist
2. Click the **three dots (⋯)** menu
3. Select **"Playlist settings"** or **"Edit"**
4. Change visibility to **"Public"**
5. Save changes
6. Try the component again

### 2. **Playlist ID Extraction Issue**

**Problem:** The playlist ID might not be extracted correctly from the URL.

**Your URL:**
```
https://youtube.com/playlist?list=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE&si=DB0Mof9byA_Ecb9N
```

**Extracted Playlist ID:** `PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE`

**Solution:** The component should automatically extract this. If it doesn't, try using just the playlist ID:
```
PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
```

### 3. **RSS Feed URL Format**

**Expected RSS Feed URL:**
```
https://www.youtube.com/feeds/videos.xml?playlist_id=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
```

**Test this URL directly in your browser** - if it shows XML content, the playlist is accessible. If you get a 404, the playlist is likely private.

### 4. **Playlist Has No Videos**

**Problem:** Empty playlists may return 404 or empty responses.

**Solution:** Ensure the playlist contains at least one video.

## How to Verify Your Playlist is Public

1. **Open your playlist in an incognito/private browser window**
2. If you can see the playlist without logging in, it's public ✅
3. If you're asked to log in or see "This playlist is private", it's not public ❌

## Testing the RSS Feed Directly

1. Open this URL in your browser (replace with your playlist ID):
   ```
   https://www.youtube.com/feeds/videos.xml?playlist_id=PL9jpSjr09H4eqw6EjgDA1eCKpsNkrMkKE
   ```

2. **If you see XML content** → Playlist is public and accessible ✅
3. **If you see 404 or error page** → Playlist is private/unlisted ❌

## Updated Error Messages

The component now shows detailed error messages that include:
- Specific error reason
- Troubleshooting tips
- Suggestions for fixing the issue

## Quick Fix Checklist

- [ ] Playlist is set to **Public** (not Private or Unlisted)
- [ ] Playlist contains at least one video
- [ ] Playlist ID is correct (starts with `PL`)
- [ ] Testing RSS feed URL directly works
- [ ] API endpoint is correctly configured
- [ ] No CORS issues (if using custom API URL)

## Still Having Issues?

1. **Check the browser console** for detailed error messages
2. **Verify the playlist ID** by copying it directly from YouTube
3. **Test the RSS feed URL** in a new browser tab
4. **Check your API logs** (if using Vercel) for server-side errors

## Example: Making a Playlist Public

1. Go to YouTube Studio (studio.youtube.com)
2. Navigate to **Content** → **Playlists**
3. Find your playlist
4. Click the **visibility icon** (eye icon)
5. Select **"Public"**
6. Save

---

**Note:** The component has been updated with better error handling and diagnostics. Error messages will now provide more specific information about why a playlist cannot be accessed.

