# Framer Component Setup Guide

## Quick Fix: Drag & Drop Issue

If the component is refusing to drag and drop into Framer, use the **single-file version**:

### ✅ Use `code.tsx` File

The component has been created as a **single-file component** in:
```
components/YouTubePlaylistFeed/code.tsx
```

This file contains everything in one place and is optimized for Framer's drag-and-drop functionality.

## How to Add to Framer

### Method 1: Drag & Drop (Recommended)

1. **Open Framer** and create/open your project
2. **Navigate to the Components panel** (usually on the left sidebar)
3. **Open your file system** and navigate to:
   ```
   /Users/danieleloma/Youtube Playlist/components/YouTubePlaylistFeed/
   ```
4. **Drag the `code.tsx` file** directly into Framer's Components panel
5. The component should appear and be ready to use!

### Method 2: Manual Import

1. **Copy the `code.tsx` file** to your Framer project's components folder
2. **In Framer**, go to **File → Import → Code Component**
3. **Select the `code.tsx` file**
4. The component will be imported and available in your components panel

### Method 3: Copy-Paste Code

1. **Open `code.tsx`** in your editor
2. **Copy all the code**
3. **In Framer**, create a new Code Component
4. **Paste the code** into the editor
5. **Save** the component

## Troubleshooting

### Issue: Component still won't drag and drop

**Solution 1:** Make sure you're dragging `code.tsx` (not `index.tsx`)
- The single-file version is specifically designed for drag-and-drop

**Solution 2:** Check Framer version
- Make sure you're using the latest version of Framer
- Update if needed: Help → Check for Updates

**Solution 3:** Verify file location
- The file should be in: `components/YouTubePlaylistFeed/code.tsx`
- Make sure the file exists and is not corrupted

**Solution 4:** Try Method 2 or 3 above
- Sometimes manual import works better than drag-and-drop

### Issue: Component imports are failing

**Solution:** The `code.tsx` file is self-contained
- All types, utilities, and sub-components are included in one file
- No external file dependencies needed
- Just drag and drop the single file

### Issue: Property controls not showing

**Solution:** 
1. Make sure `addPropertyControls` is properly imported from `framer`
2. The component must be exported as a named export: `export function YouTubePlaylistFeed`
3. Restart Framer if controls don't appear

## File Structure

```
components/YouTubePlaylistFeed/
├── code.tsx          ← USE THIS FILE for drag-and-drop
├── index.tsx         ← Multi-file version (for reference)
├── PlaylistItem.tsx  ← Part of multi-file version
├── types.ts          ← Part of multi-file version
└── utils/
    └── formatters.ts ← Part of multi-file version
```

## After Adding the Component

1. **Set your Playlist ID** in the property controls
2. **Configure your API URL** (if using a custom endpoint)
3. **Customize the layout** using the property controls
4. **Test the component** to ensure it's fetching data correctly

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Verify your API endpoint is working
3. Make sure the playlist ID is correct
4. Ensure the playlist is public

---

**Remember:** Always use `code.tsx` for drag-and-drop functionality in Framer!

