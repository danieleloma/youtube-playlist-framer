/**
 * Vercel Serverless API Route
 * Fetches YouTube Playlist RSS feed and converts to JSON
 * 
 * Endpoint: /api/ytPlaylist?playlistId=XXXX
 */

export default async function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { playlistId } = req.query;

  // Validate playlist ID
  if (!playlistId || typeof playlistId !== 'string' || playlistId.trim() === '') {
    return res.status(400).json({ 
      error: 'Invalid playlist ID. Please provide a valid playlistId query parameter or YouTube playlist URL.' 
    });
  }

  try {
    // Extract playlist ID from URL if provided
    let extractedPlaylistId = extractPlaylistId(playlistId.trim());
    
    if (!extractedPlaylistId) {
      return res.status(400).json({ 
        error: 'Invalid playlist ID or URL. Please provide a valid YouTube playlist ID or URL.' 
      });
    }

    // Construct RSS feed URL
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${encodeURIComponent(extractedPlaylistId)}`;
    
    console.log('Fetching RSS feed from:', rssUrl);
    
    // Fetch RSS feed
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; YouTubePlaylistFeed/1.0)',
        'Accept': 'application/xml, text/xml, */*',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => '');
      console.error('RSS feed error:', response.status, responseText.substring(0, 200));
      
      if (response.status === 404) {
        return res.status(404).json({ 
          error: 'Playlist not found or not accessible via RSS feed.',
          details: [
            'The playlist may be private or unlisted (RSS feeds only work for public playlists)',
            'The playlist ID may be incorrect',
            'The playlist may not exist',
            `Attempted URL: ${rssUrl}`
          ],
          playlistId: extractedPlaylistId,
          suggestion: 'Please ensure the playlist is public and try again.'
        });
      }
      
      if (response.status === 403) {
        return res.status(403).json({
          error: 'Access denied to playlist RSS feed.',
          details: [
            'The playlist may be private or restricted',
            'YouTube may be blocking RSS feed access',
            `Attempted URL: ${rssUrl}`
          ],
          playlistId: extractedPlaylistId,
        });
      }
      
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();
    
    // Check if we got valid XML
    if (!xmlText || xmlText.trim().length === 0) {
      return res.status(500).json({
        error: 'Received empty response from YouTube RSS feed',
        playlistId: extractedPlaylistId,
      });
    }
    
    // Check for error messages in the XML
    if (xmlText.includes('<error>') || xmlText.includes('Invalid playlist')) {
      return res.status(404).json({
        error: 'Invalid playlist or playlist not accessible',
        details: 'YouTube returned an error for this playlist',
        playlistId: extractedPlaylistId,
      });
    }

    // Parse XML to extract video entries
    const videos = parseRSSFeed(xmlText);

    if (videos.length === 0) {
      return res.status(200).json({ 
        videos: [],
        message: 'Playlist found but contains no videos.' 
      });
    }

    // Set cache headers (1 hour)
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    return res.status(200).json({
      videos,
      playlistId: extractedPlaylistId,
      count: videos.length,
    });

  } catch (error) {
    console.error('Error fetching YouTube playlist:', error);
    
    return res.status(500).json({ 
      error: 'Failed to fetch playlist data',
      message: error.message || 'Unknown error occurred'
    });
  }
}

/**
 * Parse RSS XML feed and extract video data
 * @param {string} xmlText - Raw XML string from RSS feed
 * @returns {Array} Array of video objects
 */
function parseRSSFeed(xmlText) {
  const videos = [];
  
  try {
    // Extract all <entry> elements using regex (lightweight, no XML parser needed)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;

    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entryXml = match[1];
      
      try {
        // Extract video ID from <yt:videoId>
        const videoIdMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        if (!videoIdMatch) continue;
        const videoId = videoIdMatch[1];

        // Extract title
        const titleMatch = entryXml.match(/<title>([^<]+)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'Untitled';

        // Extract published date
        const publishedMatch = entryXml.match(/<published>([^<]+)<\/published>/);
        const publishedAt = publishedMatch ? publishedMatch[1] : null;

        // Extract description (may contain CDATA)
        const descriptionMatch = entryXml.match(/<media:description[^>]*>([\s\S]*?)<\/media:description>/);
        let description = '';
        if (descriptionMatch) {
          description = descriptionMatch[1]
            .replace(/<!\[CDATA\[/g, '')
            .replace(/\]\]>/g, '')
            .trim();
        }

        // Extract link
        const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"[^>]*>/);
        const link = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${videoId}`;

        // Construct thumbnail URL
        const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        videos.push({
          videoId,
          title: decodeHTMLEntities(title),
          description: decodeHTMLEntities(description),
          publishedAt,
          thumbnail,
          link,
        });
      } catch (entryError) {
        // Skip malformed entries
        console.warn('Skipping malformed entry:', entryError);
        continue;
      }
    }
  } catch (parseError) {
    console.error('Error parsing RSS feed:', parseError);
    throw new Error('Failed to parse RSS feed');
  }

  return videos;
}

/**
 * Extract playlist ID from YouTube URL or return ID if already provided
 * @param {string} input - Playlist ID or YouTube playlist URL
 * @returns {string|null} Extracted playlist ID or null if invalid
 */
function extractPlaylistId(input) {
  if (!input) return null;

  // If it's already a playlist ID (starts with PL, starts with letters/numbers, no http)
  if (!input.includes('http') && !input.includes('youtube.com') && !input.includes('youtu.be')) {
    // Check if it looks like a playlist ID (typically starts with PL and is 34 chars)
    if (input.length >= 10 && /^[A-Za-z0-9_-]+$/.test(input)) {
      return input;
    }
  }

  // Try to extract from various URL patterns
  const patterns = [
    // https://www.youtube.com/playlist?list=PLAYLIST_ID
    /[?&]list=([A-Za-z0-9_-]+)/,
    // https://youtube.com/playlist?list=PLAYLIST_ID
    /youtube\.com\/playlist[?&]list=([A-Za-z0-9_-]+)/,
    // https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
    /[?&]list=([A-Za-z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If no match, check if input itself is a valid playlist ID
  if (/^[A-Za-z0-9_-]+$/.test(input) && input.length >= 10) {
    return input;
  }

  return null;
}

/**
 * Decode HTML entities in text
 * @param {string} text - Text that may contain HTML entities
 * @returns {string} Decoded text
 */
function decodeHTMLEntities(text) {
  if (!text) return '';
  
  const entityMap = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
  };

  return text.replace(/&[#\w]+;/g, (entity) => {
    return entityMap[entity] || entity;
  });
}

