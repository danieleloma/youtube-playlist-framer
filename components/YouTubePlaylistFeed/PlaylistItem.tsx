/**
 * Individual video card component for playlist items
 */

import React from 'react';
import { PlaylistItemProps } from './types';
import { formatDate, formatRelativeTime, truncateText } from './utils/formatters';

export const PlaylistItem: React.FC<PlaylistItemProps> = ({
  video,
  thumbnailWidth = 320,
  thumbnailHeight = 180,
  borderRadius = 8,
  showDescription = false,
  showDate = true,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  enableHover = true,
  hoverScale = 1.02,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (video.link) {
      window.open(video.link, '_blank', 'noopener,noreferrer');
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBackground,
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: enableHover
      ? 'transform 0.2s ease, box-shadow 0.2s ease'
      : 'none',
    transform: enableHover && isHovered ? `scale(${hoverScale})` : 'scale(1)',
    boxShadow:
      enableHover && isHovered
        ? '0 8px 16px rgba(0, 0, 0, 0.15)'
        : '0 2px 4px rgba(0, 0, 0, 0.1)',
  };

  const thumbnailStyle: React.CSSProperties = {
    width: '100%',
    height: `${thumbnailHeight}px`,
    objectFit: 'cover',
    display: 'block',
  };

  const contentStyle: React.CSSProperties = {
    padding: '12px',
    color: textColor,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: `${titleFontSize}px`,
    fontWeight: 600,
    margin: '0 0 8px 0',
    lineHeight: 1.3,
    color: textColor,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: `${descriptionFontSize}px`,
    margin: '8px 0',
    lineHeight: 1.5,
    color: textColor,
    opacity: 0.8,
  };

  const dateStyle: React.CSSProperties = {
    fontSize: `${descriptionFontSize - 2}px`,
    margin: '8px 0 0 0',
    color: textColor,
    opacity: 0.6,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Watch video: ${video.title}`}
    >
      {/* Thumbnail */}
      <img
        src={video.thumbnail}
        alt={video.title}
        style={thumbnailStyle}
        loading="lazy"
        onError={(e) => {
          // Fallback to a placeholder if thumbnail fails to load
          const target = e.target as HTMLImageElement;
          target.src = `https://via.placeholder.com/${thumbnailWidth}x${thumbnailHeight}?text=No+Thumbnail`;
        }}
      />

      {/* Content */}
      <div style={contentStyle}>
        {/* Title */}
        <h3 style={titleStyle} title={video.title}>
          {truncateText(video.title, 60)}
        </h3>

        {/* Description */}
        {showDescription && video.description && (
          <p style={descriptionStyle}>
            {truncateText(video.description, 120)}
          </p>
        )}

        {/* Published Date */}
        {showDate && video.publishedAt && (
          <p style={dateStyle}>
            {formatRelativeTime(video.publishedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

