/**
 * TypeScript type definitions for YouTube Playlist Feed Component
 */

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string | null;
  thumbnail: string;
  link: string;
}

export interface PlaylistResponse {
  videos: YouTubeVideo[];
  playlistId: string;
  count: number;
  error?: string;
  message?: string;
}

export interface YouTubePlaylistFeedProps {
  /** YouTube Playlist ID (required) */
  playlistId: string;
  
  /** Maximum number of videos to display */
  maxItems?: number;
  
  /** Number of columns in grid layout */
  columns?: number;
  
  /** Gap between grid items (in pixels) */
  gap?: number;
  
  /** Border radius for video cards (in pixels) */
  borderRadius?: number;
  
  /** Thumbnail width (in pixels) */
  thumbnailWidth?: number;
  
  /** Thumbnail height (in pixels) */
  thumbnailHeight?: number;
  
  /** Show video description */
  showDescription?: boolean;
  
  /** Show published date */
  showDate?: boolean;
  
  /** Card background color */
  cardBackground?: string;
  
  /** Text color */
  textColor?: string;
  
  /** Title font size (in pixels) */
  titleFontSize?: number;
  
  /** Description font size (in pixels) */
  descriptionFontSize?: number;
  
  /** Enable hover effects */
  enableHover?: boolean;
  
  /** Hover scale factor */
  hoverScale?: number;
  
  /** API endpoint URL (defaults to relative /api/ytPlaylist) */
  apiUrl?: string;
  
  /** Custom CSS class name */
  className?: string;
}

export interface PlaylistItemProps {
  video: YouTubeVideo;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
  borderRadius?: number;
  showDescription?: boolean;
  showDate?: boolean;
  cardBackground?: string;
  textColor?: string;
  titleFontSize?: number;
  descriptionFontSize?: number;
  enableHover?: boolean;
  hoverScale?: number;
}

