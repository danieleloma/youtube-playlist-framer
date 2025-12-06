/**
 * Example usage of YouTubePlaylistFeed component
 * 
 * This file demonstrates how to use the component in your Framer project
 */

import React from 'react';
import { YouTubePlaylistFeed } from './index';

// Example 1: Basic usage
export const BasicExample = () => {
  return (
    <YouTubePlaylistFeed 
      playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
    />
  );
};

// Example 2: Customized layout
export const CustomizedExample = () => {
  return (
    <YouTubePlaylistFeed 
      playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
      maxItems={6}
      columns={2}
      gap={24}
      borderRadius={12}
      showDescription={true}
      cardBackground="#f5f5f5"
      textColor="#333333"
      enableHover={true}
      hoverScale={1.05}
    />
  );
};

// Example 3: Dark theme
export const DarkThemeExample = () => {
  return (
    <YouTubePlaylistFeed 
      playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
      maxItems={9}
      columns={3}
      cardBackground="#1a1a1a"
      textColor="#ffffff"
      borderRadius={8}
      enableHover={true}
    />
  );
};

// Example 4: Single column with descriptions
export const SingleColumnExample = () => {
  return (
    <YouTubePlaylistFeed 
      playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
      columns={1}
      maxItems={5}
      showDescription={true}
      gap={20}
      thumbnailHeight={200}
    />
  );
};

// Example 5: Compact grid
export const CompactGridExample = () => {
  return (
    <YouTubePlaylistFeed 
      playlistId="PLrAXtmRdnEQy6nuLM0v3YzA7nW7O7Y8XK"
      columns={4}
      gap={8}
      thumbnailHeight={120}
      titleFontSize={14}
      showDate={false}
      borderRadius={4}
    />
  );
};

