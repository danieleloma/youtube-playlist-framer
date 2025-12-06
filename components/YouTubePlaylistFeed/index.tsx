/**
 * YouTube Playlist Feed Component for Framer
 * 
 * Displays the latest videos from a YouTube Playlist using RSS feeds
 * No API keys required - uses free YouTube RSS feeds
 */

import React, { useState, useEffect, useCallback } from 'react';
import { addPropertyControls, ControlType } from 'framer';
import { YouTubePlaylistFeedProps, YouTubeVideo, PlaylistResponse } from './types';
import { PlaylistItem } from './PlaylistItem';

/**
 * Main YouTube Playlist Feed Component
 */
export const YouTubePlaylistFeed: React.FC<YouTubePlaylistFeedProps> = ({
  playlistId,
  maxItems = 12,
  columns = 3,
  gap = 16,
  borderRadius = 8,
  thumbnailWidth = 320,
  thumbnailHeight = 180,
  showDescription = false,
  showDate = true,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  enableHover = true,
  hoverScale = 1.02,
  apiUrl,
  className,
}) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Determine API URL (use provided or default to relative path)
  const apiEndpoint = apiUrl || '/api/ytPlaylist';

  /**
   * Fetch playlist data from API
   */
  const fetchPlaylist = useCallback(async () => {
    if (!playlistId || playlistId.trim() === '') {
      setError('Please provide a valid playlist ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${apiEndpoint}?playlistId=${encodeURIComponent(playlistId.trim())}`;
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Failed to fetch playlist: ${response.status}`
        );
      }

      const data: PlaylistResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Limit videos to maxItems
      const limitedVideos = data.videos.slice(0, maxItems);
      setVideos(limitedVideos);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load playlist';
      setError(errorMessage);
      console.error('Error fetching YouTube playlist:', err);
    } finally {
      setLoading(false);
    }
  }, [playlistId, maxItems, apiEndpoint]);

  // Fetch data when component mounts or dependencies change
  useEffect(() => {
    fetchPlaylist();
  }, [fetchPlaylist]);

  // Container styles
  const containerStyle: React.CSSProperties = {
    width: '100%',
    padding: '0',
  };

  // Grid container styles
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
  };

  // Loading skeleton styles
  const skeletonStyle: React.CSSProperties = {
    backgroundColor: '#f0f0f0',
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    animation: 'pulse 1.5s ease-in-out infinite',
  };

  const skeletonContentStyle: React.CSSProperties = {
    padding: '12px',
  };

  // Error message styles
  const errorStyle: React.CSSProperties = {
    padding: '24px',
    textAlign: 'center',
    color: textColor,
    backgroundColor: cardBackground,
    borderRadius: `${borderRadius}px`,
    border: `1px solid ${textColor}20`,
  };

  // Empty state styles
  const emptyStyle: React.CSSProperties = {
    padding: '24px',
    textAlign: 'center',
    color: textColor,
    opacity: 0.6,
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    return Array.from({ length: maxItems }).map((_, index) => (
      <div key={`skeleton-${index}`} style={skeletonStyle}>
        <div
          style={{
            width: '100%',
            height: `${thumbnailHeight}px`,
            backgroundColor: '#e0e0e0',
          }}
        />
        <div style={skeletonContentStyle}>
          <div
            style={{
              height: `${titleFontSize}px`,
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              marginBottom: '8px',
            }}
          />
          <div
            style={{
              height: `${titleFontSize - 4}px`,
              width: '60%',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>
    ));
  };

  // Render error state
  if (error && !loading) {
    return (
      <div style={containerStyle} className={className}>
        <div style={errorStyle}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 600 }}>
            Error loading playlist
          </p>
          <p style={{ margin: 0, fontSize: `${descriptionFontSize}px` }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div style={containerStyle} className={className}>
        <div style={gridStyle}>{renderSkeleton()}</div>
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.6;
              }
            }
          `}
        </style>
      </div>
    );
  }

  // Render empty state
  if (videos.length === 0) {
    return (
      <div style={containerStyle} className={className}>
        <div style={emptyStyle}>
          <p style={{ margin: 0 }}>No videos found in this playlist.</p>
        </div>
      </div>
    );
  }

  // Render video grid
  return (
    <div style={containerStyle} className={className}>
      <div style={gridStyle}>
        {videos.map((video) => (
          <PlaylistItem
            key={video.videoId}
            video={video}
            thumbnailWidth={thumbnailWidth}
            thumbnailHeight={thumbnailHeight}
            borderRadius={borderRadius}
            showDescription={showDescription}
            showDate={showDate}
            cardBackground={cardBackground}
            textColor={textColor}
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
            enableHover={enableHover}
            hoverScale={hoverScale}
          />
        ))}
      </div>
    </div>
  );
};

// Default props
YouTubePlaylistFeed.defaultProps = {
  maxItems: 12,
  columns: 3,
  gap: 16,
  borderRadius: 8,
  thumbnailWidth: 320,
  thumbnailHeight: 180,
  showDescription: false,
  showDate: true,
  cardBackground: '#ffffff',
  textColor: '#000000',
  titleFontSize: 16,
  descriptionFontSize: 14,
  enableHover: true,
  hoverScale: 1.02,
};

// Framer Property Controls
addPropertyControls(YouTubePlaylistFeed, {
  playlistId: {
    type: ControlType.String,
    title: 'Playlist ID',
    description: 'YouTube Playlist ID (e.g., PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK)',
    defaultValue: '',
    placeholder: 'Enter playlist ID',
  },
  maxItems: {
    type: ControlType.Number,
    title: 'Max Items',
    description: 'Maximum number of videos to display',
    defaultValue: 12,
    min: 1,
    max: 50,
    step: 1,
  },
  columns: {
    type: ControlType.Number,
    title: 'Columns',
    description: 'Number of columns in grid layout',
    defaultValue: 3,
    min: 1,
    max: 6,
    step: 1,
  },
  gap: {
    type: ControlType.Number,
    title: 'Gap',
    description: 'Gap between grid items (px)',
    defaultValue: 16,
    min: 0,
    max: 48,
    step: 4,
  },
  borderRadius: {
    type: ControlType.Number,
    title: 'Border Radius',
    description: 'Border radius for video cards (px)',
    defaultValue: 8,
    min: 0,
    max: 32,
    step: 2,
  },
  thumbnailWidth: {
    type: ControlType.Number,
    title: 'Thumbnail Width',
    description: 'Thumbnail width (px)',
    defaultValue: 320,
    min: 160,
    max: 640,
    step: 20,
  },
  thumbnailHeight: {
    type: ControlType.Number,
    title: 'Thumbnail Height',
    description: 'Thumbnail height (px)',
    defaultValue: 180,
    min: 90,
    max: 360,
    step: 10,
  },
  showDescription: {
    type: ControlType.Boolean,
    title: 'Show Description',
    description: 'Display video description',
    defaultValue: false,
  },
  showDate: {
    type: ControlType.Boolean,
    title: 'Show Date',
    description: 'Display published date',
    defaultValue: true,
  },
  cardBackground: {
    type: ControlType.Color,
    title: 'Card Background',
    description: 'Background color for video cards',
    defaultValue: '#ffffff',
  },
  textColor: {
    type: ControlType.Color,
    title: 'Text Color',
    description: 'Text color for titles and descriptions',
    defaultValue: '#000000',
  },
  titleFontSize: {
    type: ControlType.Number,
    title: 'Title Font Size',
    description: 'Font size for video titles (px)',
    defaultValue: 16,
    min: 12,
    max: 24,
    step: 1,
  },
  descriptionFontSize: {
    type: ControlType.Number,
    title: 'Description Font Size',
    description: 'Font size for descriptions (px)',
    defaultValue: 14,
    min: 10,
    max: 20,
    step: 1,
  },
  enableHover: {
    type: ControlType.Boolean,
    title: 'Enable Hover',
    description: 'Enable hover effects on cards',
    defaultValue: true,
  },
  hoverScale: {
    type: ControlType.Number,
    title: 'Hover Scale',
    description: 'Scale factor on hover (1.0 = no scale)',
    defaultValue: 1.02,
    min: 1.0,
    max: 1.2,
    step: 0.01,
    hidden: (props) => !props.enableHover,
  },
  apiUrl: {
    type: ControlType.String,
    title: 'API URL',
    description: 'Custom API endpoint URL (leave empty for default)',
    defaultValue: '',
    placeholder: '/api/ytPlaylist',
  },
});

export default YouTubePlaylistFeed;

