# YouTube Playlist Feed Component for Framer

A production-ready Framer component that displays the latest videos from a YouTube Playlist using **free RSS feeds** — no API keys required!

## ✨ Features

- ✅ **100% Free** - Uses YouTube's public RSS feeds
- ✅ **No API Keys** - Zero authentication required
- ✅ **Fast & Cached** - 1-hour cache with stale-while-revalidate
- ✅ **Fully Customizable** - Extensive property controls in Framer
- ✅ **TypeScript** - Fully typed for better development experience
- ✅ **Error Handling** - Graceful error states and loading skeletons
- ✅ **Responsive** - Grid-based layout with customizable columns
- ✅ **Accessible** - Keyboard navigation and ARIA labels

## 📁 Project Structure

```
/
├── api/
│   └── ytPlaylist.js          # Vercel serverless API route
├── components/
│   └── YouTubePlaylistFeed/
│       ├── index.tsx          # Main Framer component
│       ├── types.ts           # TypeScript type definitions
│       ├── PlaylistItem.tsx   # Individual video card component
│       └── utils/
│           └── formatters.ts  # Date and text formatting utilities
├── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier works)
- A Framer project

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the API route**:
   ```bash
   vercel
   ```
   
   Follow the prompts to link your project or create a new one.

3. **Note your Vercel deployment URL** (e.g., `https://your-project.vercel.app`)

### Step 3: Add Component to Framer

1. **Copy the component files** to your Framer project:
   - Copy the entire `components/YouTubePlaylistFeed/` folder to your Framer components directory

2. **Update the API URL** (if needed):
   - In Framer, set the `apiUrl` property to your Vercel deployment URL:
     ```
     https://your-project.vercel.app/api/ytPlaylist
     ```
   - Or leave it empty to use the default relative path (if your Framer site is on the same domain)

3. **Import and use the component**:
   ```tsx
   import { YouTubePlaylistFeed } from './components/YouTubePlaylistFeed';
   ```

## 📖 Usage

### Basic Usage

```tsx
<YouTubePlaylistFeed 
  playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
/>
```

### Finding Your Playlist ID

1. Open your YouTube playlist in a browser
2. Look at the URL: `https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK`
3. Copy the part after `list=` — that's your playlist ID

### Available Properties

The component includes extensive property controls in Framer:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `playlistId` | string | - | **Required.** YouTube Playlist ID |
| `maxItems` | number | 12 | Maximum number of videos to display (1-50) |
| `columns` | number | 3 | Number of columns in grid (1-6) |
| `gap` | number | 16 | Gap between grid items in pixels (0-48) |
| `borderRadius` | number | 8 | Border radius for cards in pixels (0-32) |
| `thumbnailWidth` | number | 320 | Thumbnail width in pixels (160-640) |
| `thumbnailHeight` | number | 180 | Thumbnail height in pixels (90-360) |
| `showDescription` | boolean | false | Display video description |
| `showDate` | boolean | true | Display published date |
| `cardBackground` | color | #ffffff | Background color for video cards |
| `textColor` | color | #000000 | Text color for titles and descriptions |
| `titleFontSize` | number | 16 | Font size for titles in pixels (12-24) |
| `descriptionFontSize` | number | 14 | Font size for descriptions in pixels (10-20) |
| `enableHover` | boolean | true | Enable hover effects on cards |
| `hoverScale` | number | 1.02 | Scale factor on hover (1.0-1.2) |
| `apiUrl` | string | - | Custom API endpoint URL (optional) |

## 🔧 How It Works

### RSS Feed Parsing

The component uses YouTube's public RSS feed endpoint:
```
https://www.youtube.com/feeds/videos.xml?playlist_id=PLAYLIST_ID
```

### API Route (`/api/ytPlaylist.js`)

1. Accepts `playlistId` as a query parameter
2. Fetches the RSS feed from YouTube
3. Parses XML and extracts video data
4. Returns clean JSON with video information
5. Includes 1-hour cache headers for performance

### Data Flow

```
Framer Component → Vercel API → YouTube RSS → Parsed JSON → Component Display
```

## 🎨 Customization Examples

### Dark Theme

```tsx
<YouTubePlaylistFeed 
  playlistId="YOUR_PLAYLIST_ID"
  cardBackground="#1a1a1a"
  textColor="#ffffff"
  borderRadius={12}
  enableHover={true}
  hoverScale={1.05}
/>
```

### Single Column Layout

```tsx
<YouTubePlaylistFeed 
  playlistId="YOUR_PLAYLIST_ID"
  columns={1}
  maxItems={5}
  showDescription={true}
  gap={24}
/>
```

### Compact Grid

```tsx
<YouTubePlaylistFeed 
  playlistId="YOUR_PLAYLIST_ID"
  columns={4}
  gap={8}
  thumbnailHeight={120}
  titleFontSize={14}
  showDate={false}
/>
```

## 🐛 Troubleshooting

### "Playlist not found" Error

- Verify the playlist ID is correct
- Ensure the playlist is public (private playlists won't work)
- Check that the playlist contains videos

### "Failed to fetch playlist" Error

- Verify your Vercel deployment is live
- Check the API URL in component properties
- Ensure CORS is enabled (already included in the API route)

### Component Not Loading

- Check browser console for errors
- Verify all dependencies are installed
- Ensure TypeScript types are properly imported

### Images Not Loading

- Thumbnails use YouTube's CDN (`i.ytimg.com`)
- Check network tab for failed requests
- Component includes fallback placeholder images

## 🔒 Legal & Privacy

- ✅ Uses official YouTube RSS feeds (public data)
- ✅ No API keys or authentication required
- ✅ Complies with YouTube's Terms of Service
- ✅ No user data collection
- ✅ Open source and free to use

## 📝 Notes

- **Caching**: API responses are cached for 1 hour to reduce load
- **Rate Limits**: YouTube RSS feeds are generally rate-limited, but normal usage should be fine
- **Updates**: Videos appear in the feed as they're added to the playlist
- **Performance**: Component uses lazy loading for images and debounced fetching

## 🛠️ Development

### Local Development

```bash
# Install dependencies
npm install

# Run Vercel dev server
npm run dev

# Type check
npm run type-check
```

### Testing the API Locally

```bash
# Start Vercel dev server
vercel dev

# Test the endpoint
curl "http://localhost:3000/api/ytPlaylist?playlistId=YOUR_PLAYLIST_ID"
```

## 📄 License

MIT License - Feel free to use in your projects!

## 🤝 Contributing

This is a standalone component. Feel free to fork and modify for your needs!

---

**Built with ❤️ for the Framer community**

