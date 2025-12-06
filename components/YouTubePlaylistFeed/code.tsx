/**
 * Advanced YouTube Playlist Player Component for Framer
 * 
 * Features:
 * - Support for Playlist ID or YouTube URL
 * - Multiple display modes: Pro Player, Grid, Slider
 * - Video type filtering: videos, shorts, podcast, music
 * - Advanced playback options: autoplay, shuffle, loop, speed, start/end times
 * - Interactive and background modes
 * - Slider with auto-slide, drag, controls, pagination
 * - Grid with load more, aspect ratio control
 */

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

// ============================================================================
// TYPES
// ============================================================================

interface YouTubeVideo {
  videoId: string
  title: string
  description: string
  publishedAt: string | null
  thumbnail: string
  link: string
  duration?: string
  type?: 'video' | 'short' | 'podcast' | 'music'
}

interface PlaylistResponse {
  videos: YouTubeVideo[]
  playlistId: string
  count: number
  error?: string
  message?: string
  details?: string[]
  suggestion?: string
}

type DisplayMode = 'pro-player' | 'grid' | 'slider'
type VideoType = 'all' | 'videos' | 'shorts' | 'podcast' | 'music'
type SliderMode = 'auto' | 'drag' | 'manual'
type InteractionMode = 'interactive' | 'background'

interface Props {
  playlistIdOrUrl: string
  displayMode?: DisplayMode
  videoType?: VideoType
  maxItems?: number
  
  // Grid settings
  gridColumns?: number
  gridGap?: number
  gridAspectRatio?: string
  gridLoadMore?: boolean
  gridItemsPerPage?: number
  
  // Slider settings
  sliderMode?: SliderMode
  sliderAutoSlideInterval?: number
  sliderShowControls?: boolean
  sliderShowPagination?: boolean
  sliderItemsPerView?: number
  
  // Pro Player settings
  proPlayerWidth?: number
  proPlayerHeight?: number
  proPlayerAspectRatio?: string
  
  // Playback options
  autoplay?: boolean
  shuffle?: boolean
  loop?: boolean
  playbackSpeed?: number
  startTime?: number
  endTime?: number
  interactionMode?: InteractionMode
  
  // Styling
  borderRadius?: number
  cardBackground?: string
  textColor?: string
  titleFontSize?: number
  descriptionFontSize?: number
  showDescription?: boolean
  showDate?: boolean
  
  // API
  apiUrl?: string
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function extractPlaylistId(input: string): string | null {
  if (!input) return null

  // If it's already a playlist ID (no http, no youtube.com)
  if (!input.includes('http') && !input.includes('youtube.com') && !input.includes('youtu.be')) {
    if (input.length >= 10 && /^[A-Za-z0-9_-]+$/.test(input)) {
      return input
    }
  }

  // Extract from URL patterns
  const patterns = [
    /[?&]list=([A-Za-z0-9_-]+)/,
    /youtube\.com\/playlist[?&]list=([A-Za-z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  if (/^[A-Za-z0-9_-]+$/.test(input) && input.length >= 10) {
    return input
  }

  return null
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Date unavailable'
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (isNaN(date.getTime())) return 'Date unavailable'
    const intervals: { [key: string]: number } = {
      year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600, minute: 60,
    }
    for (const [unit, seconds] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / seconds)
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`
      }
    }
    return 'Just now'
  } catch {
    return 'Date unavailable'
  }
}

function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function detectVideoType(video: YouTubeVideo): 'video' | 'short' | 'podcast' | 'music' {
  const title = video.title.toLowerCase()
  const desc = video.description.toLowerCase()
  
  if (title.includes('#shorts') || desc.includes('#shorts') || title.includes('short')) {
    return 'short'
  }
  if (title.includes('podcast') || desc.includes('podcast')) {
    return 'podcast'
  }
  if (title.includes('music') || desc.includes('music') || title.includes('song')) {
    return 'music'
  }
  return 'video'
}

function filterVideosByType(videos: YouTubeVideo[], type: VideoType): YouTubeVideo[] {
  if (type === 'all') return videos
  
  return videos.filter(video => {
    const detectedType = detectVideoType(video)
    return detectedType === type
  })
}

function buildYouTubeEmbedUrl(
  videoId: string,
  autoplay: boolean,
  startTime?: number,
  endTime?: number,
  speed?: number
): string {
  let url = `https://www.youtube.com/embed/${videoId}?`
  const params: string[] = []
  
  if (autoplay) params.push('autoplay=1')
  if (startTime) params.push(`start=${startTime}`)
  if (endTime) params.push(`end=${endTime}`)
  if (speed && speed !== 1) params.push(`playbackRate=${speed}`)
  
  params.push('rel=0')
  params.push('modestbranding=1')
  
  return url + params.join('&')
}

// ============================================================================
// VIDEO CARD COMPONENT
// ============================================================================

function VideoCard({
  video,
  onClick,
  aspectRatio = '16/9',
  borderRadius = 8,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  showDescription = false,
  showDate = true,
}: {
  video: YouTubeVideo
  onClick?: () => void
  aspectRatio?: string
  borderRadius?: number
  cardBackground?: string
  textColor?: string
  titleFontSize?: number
  descriptionFontSize?: number
  showDescription?: boolean
  showDate?: boolean
}) {
  const [isHovered, setIsHovered] = React.useState(false)

  const cardStyle: React.CSSProperties = {
    backgroundColor: cardBackground,
    borderRadius: `${borderRadius}px`,
    overflow: 'hidden',
    cursor: onClick ? 'pointer' : 'default',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    transform: isHovered && onClick ? 'scale(1.02)' : 'scale(1)',
    boxShadow: isHovered && onClick
      ? '0 8px 16px rgba(0, 0, 0, 0.15)'
      : '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
  }

  const thumbnailContainerStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: aspectRatio,
    position: 'relative',
    overflow: 'hidden',
  }

  const thumbnailStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  }

  const playButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: isHovered ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div style={thumbnailContainerStyle}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={thumbnailStyle}
          loading="lazy"
        />
        {onClick && (
          <div style={playButtonStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>
      <div style={{ padding: '12px', color: textColor }}>
        <h3 style={{ fontSize: `${titleFontSize}px`, fontWeight: 600, margin: '0 0 8px 0', lineHeight: 1.3, color: textColor }}>
          {truncateText(video.title, 60)}
        </h3>
        {showDescription && video.description && (
          <p style={{ fontSize: `${descriptionFontSize}px`, margin: '8px 0', lineHeight: 1.5, color: textColor, opacity: 0.8 }}>
            {truncateText(video.description, 120)}
          </p>
        )}
        {showDate && video.publishedAt && (
          <p style={{ fontSize: `${descriptionFontSize - 2}px`, margin: '8px 0 0 0', color: textColor, opacity: 0.6 }}>
            {formatRelativeTime(video.publishedAt)}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// PRO PLAYER COMPONENT
// ============================================================================

function ProPlayer({
  video,
  autoplay,
  startTime,
  endTime,
  speed,
  width = 800,
  height = 450,
  aspectRatio,
  interactionMode,
}: {
  video: YouTubeVideo
  autoplay?: boolean
  startTime?: number
  endTime?: number
  speed?: number
  width?: number
  height?: number
  aspectRatio?: string
  interactionMode?: InteractionMode
}) {
  const embedUrl = buildYouTubeEmbedUrl(video.videoId, autoplay || false, startTime, endTime, speed)
  
  const containerStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: `${width}px`,
    aspectRatio: aspectRatio || `${width}/${height}`,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '8px',
  }

  const iframeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: interactionMode === 'interactive' ? 'auto' : 'none',
  }

  return (
    <div style={containerStyle}>
      <iframe
        src={embedUrl}
        style={iframeStyle}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={video.title}
      />
    </div>
  )
}

// ============================================================================
// SLIDER COMPONENT
// ============================================================================

function SliderPlayer({
  videos,
  currentIndex,
  onVideoChange,
  autoSlideInterval = 0,
  showControls = true,
  showPagination = true,
  itemsPerView = 1,
  aspectRatio = '16/9',
  borderRadius = 8,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  showDescription = false,
  showDate = true,
  autoplay = false,
  startTime,
  endTime,
  speed,
  interactionMode = 'interactive',
}: {
  videos: YouTubeVideo[]
  currentIndex: number
  onVideoChange: (index: number) => void
  autoSlideInterval?: number
  showControls?: boolean
  showPagination?: boolean
  itemsPerView?: number
  aspectRatio?: string
  borderRadius?: number
  cardBackground?: string
  textColor?: string
  titleFontSize?: number
  descriptionFontSize?: number
  showDescription?: boolean
  showDate?: boolean
  autoplay?: boolean
  startTime?: number
  endTime?: number
  speed?: number
  interactionMode?: InteractionMode
}) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [dragStart, setDragStart] = React.useState(0)
  const [dragOffset, setDragOffset] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Auto-slide
  React.useEffect(() => {
    if (autoSlideInterval > 0 && !isDragging) {
      const timer = setInterval(() => {
        onVideoChange((currentIndex + 1) % videos.length)
      }, autoSlideInterval * 1000)
      return () => clearInterval(timer)
    }
  }, [autoSlideInterval, currentIndex, videos.length, isDragging, onVideoChange])

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (interactionMode !== 'interactive') return
    setIsDragging(true)
    setDragStart(e.clientX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setDragOffset(e.clientX - dragStart)
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    const threshold = 50
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        onVideoChange(currentIndex - 1)
      } else if (dragOffset < 0 && currentIndex < videos.length - 1) {
        onVideoChange(currentIndex + 1)
      }
    }
    
    setIsDragging(false)
    setDragOffset(0)
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  }

  const slidesStyle: React.CSSProperties = {
    display: 'flex',
    transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    width: `${videos.length * 100}%`,
  }

  const slideStyle: React.CSSProperties = {
    width: `${100 / videos.length}%`,
    flexShrink: 0,
    padding: '0 8px',
  }

  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  }

  return (
    <div style={containerStyle}>
      {showControls && currentIndex > 0 && (
        <button
          style={{ ...controlsStyle, left: '10px' }}
          onClick={() => onVideoChange(currentIndex - 1)}
        >
          ‹
        </button>
      )}
      {showControls && currentIndex < videos.length - 1 && (
        <button
          style={{ ...controlsStyle, right: '10px' }}
          onClick={() => onVideoChange(currentIndex + 1)}
        >
          ›
        </button>
      )}
      
      <div
        ref={containerRef}
        style={slidesStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {videos.map((video, index) => (
          <div key={video.videoId} style={slideStyle}>
            {index === currentIndex ? (
              <ProPlayer
                video={video}
                autoplay={autoplay}
                startTime={startTime}
                endTime={endTime}
                speed={speed}
                aspectRatio={aspectRatio}
                interactionMode={interactionMode}
              />
            ) : (
              <VideoCard
                video={video}
                aspectRatio={aspectRatio}
                borderRadius={borderRadius}
                cardBackground={cardBackground}
                textColor={textColor}
                titleFontSize={titleFontSize}
                descriptionFontSize={descriptionFontSize}
                showDescription={showDescription}
                showDate={showDate}
                onClick={() => onVideoChange(index)}
              />
            )}
          </div>
        ))}
      </div>

      {showPagination && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => onVideoChange(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex ? '#ff0000' : '#ccc',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// GRID COMPONENT
// ============================================================================

function GridPlayer({
  videos,
  columns = 3,
  gap = 16,
  aspectRatio = '16/9',
  loadMore = false,
  itemsPerPage = 12,
  borderRadius = 8,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  showDescription = false,
  showDate = true,
  onVideoClick,
}: {
  videos: YouTubeVideo[]
  columns?: number
  gap?: number
  aspectRatio?: string
  loadMore?: boolean
  itemsPerPage?: number
  borderRadius?: number
  cardBackground?: string
  textColor?: string
  titleFontSize?: number
  descriptionFontSize?: number
  showDescription?: boolean
  showDate?: boolean
  onVideoClick?: (video: YouTubeVideo) => void
}) {
  const [displayedCount, setDisplayedCount] = React.useState(itemsPerPage)

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: `${gap}px`,
    width: '100%',
  }

  const displayedVideos = videos.slice(0, displayedCount)
  const hasMore = displayedCount < videos.length

  return (
    <div>
      <div style={gridStyle}>
        {displayedVideos.map((video) => (
          <VideoCard
            key={video.videoId}
            video={video}
            onClick={onVideoClick ? () => onVideoClick(video) : undefined}
            aspectRatio={aspectRatio}
            borderRadius={borderRadius}
            cardBackground={cardBackground}
            textColor={textColor}
            titleFontSize={titleFontSize}
            descriptionFontSize={descriptionFontSize}
            showDescription={showDescription}
            showDate={showDate}
          />
        ))}
      </div>
      {loadMore && hasMore && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => setDisplayedCount(prev => Math.min(prev + itemsPerPage, videos.length))}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff0000',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Load More ({videos.length - displayedCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function YouTubePlaylistFeed({
  playlistIdOrUrl,
  displayMode = 'grid',
  videoType = 'all',
  maxItems = 50,
  gridColumns = 3,
  gridGap = 16,
  gridAspectRatio = '16/9',
  gridLoadMore = false,
  gridItemsPerPage = 12,
  sliderMode = 'manual',
  sliderAutoSlideInterval = 5,
  sliderShowControls = true,
  sliderShowPagination = true,
  sliderItemsPerView = 1,
  proPlayerWidth = 800,
  proPlayerHeight = 450,
  proPlayerAspectRatio = '16/9',
  autoplay = false,
  shuffle = false,
  loop = false,
  playbackSpeed = 1,
  startTime,
  endTime,
  interactionMode = 'interactive',
  borderRadius = 8,
  cardBackground = '#ffffff',
  textColor = '#000000',
  titleFontSize = 16,
  descriptionFontSize = 14,
  showDescription = false,
  showDate = true,
  apiUrl,
}: Props) {
  const [videos, setVideos] = React.useState<YouTubeVideo[]>([])
  const [loading, setLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0)
  const [selectedVideo, setSelectedVideo] = React.useState<YouTubeVideo | null>(null)

  // Default API endpoint - automatically uses deployed Vercel API
  // Users can override this by setting apiUrl prop if needed
  const apiEndpoint = apiUrl || 'https://youtube-playlist-framer.vercel.app/api/ytPlaylist'

  const fetchPlaylist = React.useCallback(async () => {
    const extractedId = extractPlaylistId(playlistIdOrUrl)
    
    if (!extractedId) {
      setError('Invalid playlist ID or URL. Please provide a valid YouTube playlist ID or URL.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = `${apiEndpoint}?playlistId=${encodeURIComponent(extractedId)}`
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Failed to fetch playlist: ${response.status}`)
      }

      const data: PlaylistResponse = await response.json()

      if (data.error) {
        // Build detailed error message
        let errorMessage = data.error
        if (data.details && Array.isArray(data.details)) {
          errorMessage += '\n\n' + data.details.join('\n')
        }
        if (data.suggestion) {
          errorMessage += '\n\n' + data.suggestion
        }
        throw new Error(errorMessage)
      }

      // Detect and assign video types
      let processedVideos: YouTubeVideo[] = data.videos.map(video => ({
        ...video,
        type: detectVideoType(video),
      }))

      // Filter by video type
      processedVideos = filterVideosByType(processedVideos, videoType)

      // Shuffle if requested
      if (shuffle) {
        processedVideos = shuffleArray(processedVideos)
      }

      // Limit to maxItems
      processedVideos = processedVideos.slice(0, maxItems)

      setVideos(processedVideos)
      
      if (processedVideos.length > 0) {
        setSelectedVideo(processedVideos[0])
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load playlist'
      setError(errorMessage)
      console.error('Error fetching YouTube playlist:', err)
    } finally {
      setLoading(false)
    }
  }, [playlistIdOrUrl, maxItems, apiEndpoint, videoType, shuffle])

  React.useEffect(() => {
    fetchPlaylist()
  }, [fetchPlaylist])

  // Handle loop
  React.useEffect(() => {
    if (loop && displayMode === 'slider' && currentVideoIndex >= videos.length && videos.length > 0) {
      setCurrentVideoIndex(0)
    }
  }, [loop, displayMode, currentVideoIndex, videos.length])

  const handleVideoChange = React.useCallback((index: number) => {
    if (index >= 0 && index < videos.length) {
      setCurrentVideoIndex(index)
      setSelectedVideo(videos[index])
    } else if (loop && index >= videos.length) {
      setCurrentVideoIndex(0)
      setSelectedVideo(videos[0])
    }
  }, [videos, loop])

  const handleVideoClick = React.useCallback((video: YouTubeVideo) => {
    const index = videos.findIndex(v => v.videoId === video.videoId)
    if (index !== -1) {
      handleVideoChange(index)
    }
  }, [videos, handleVideoChange])

  // Loading skeleton
  if (loading) {
    return (
      <div style={{ width: '100%', padding: '24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #ff0000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ marginTop: '16px', color: textColor }}>Loading playlist...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    const errorLines = error.split('\n').filter(line => line.trim())
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: textColor, backgroundColor: cardBackground, borderRadius: `${borderRadius}px`, maxWidth: '600px', margin: '0 auto' }}>
        <p style={{ margin: '0 0 16px 0', fontWeight: 600, fontSize: `${titleFontSize}px` }}>Error loading playlist</p>
        <div style={{ textAlign: 'left', fontSize: `${descriptionFontSize}px`, lineHeight: 1.6 }}>
          {errorLines.map((line, index) => (
            <p key={index} style={{ margin: index === 0 ? '0 0 8px 0' : '4px 0', color: textColor, opacity: index === 0 ? 1 : 0.8 }}>
              {line}
            </p>
          ))}
        </div>
        <p style={{ margin: '16px 0 0 0', fontSize: `${descriptionFontSize - 2}px`, opacity: 0.7 }}>
          💡 Tip: Make sure the playlist is <strong>public</strong> (RSS feeds don't work for private/unlisted playlists)
        </p>
      </div>
    )
  }

  // Empty state
  if (videos.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: textColor, opacity: 0.6 }}>
        <p style={{ margin: 0 }}>No videos found in this playlist.</p>
      </div>
    )
  }

  // Render based on display mode
  if (displayMode === 'pro-player') {
    if (!selectedVideo) return null
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <ProPlayer
          video={selectedVideo}
          autoplay={autoplay}
          startTime={startTime}
          endTime={endTime}
          speed={playbackSpeed}
          width={proPlayerWidth}
          height={proPlayerHeight}
          aspectRatio={proPlayerAspectRatio}
          interactionMode={interactionMode}
        />
      </div>
    )
  }

  if (displayMode === 'slider') {
    return (
      <SliderPlayer
        videos={videos}
        currentIndex={currentVideoIndex}
        onVideoChange={handleVideoChange}
        autoSlideInterval={sliderMode === 'auto' ? sliderAutoSlideInterval : 0}
        showControls={sliderShowControls}
        showPagination={sliderShowPagination}
        itemsPerView={sliderItemsPerView}
        aspectRatio={proPlayerAspectRatio}
        borderRadius={borderRadius}
        cardBackground={cardBackground}
        textColor={textColor}
        titleFontSize={titleFontSize}
        descriptionFontSize={descriptionFontSize}
        showDescription={showDescription}
        showDate={showDate}
        autoplay={autoplay}
        startTime={startTime}
        endTime={endTime}
        speed={playbackSpeed}
        interactionMode={interactionMode}
      />
    )
  }

  // Grid mode (default)
  return (
    <GridPlayer
      videos={videos}
      columns={gridColumns}
      gap={gridGap}
      aspectRatio={gridAspectRatio}
      loadMore={gridLoadMore}
      itemsPerPage={gridItemsPerPage}
      borderRadius={borderRadius}
      cardBackground={cardBackground}
      textColor={textColor}
      titleFontSize={titleFontSize}
      descriptionFontSize={descriptionFontSize}
      showDescription={showDescription}
      showDate={showDate}
      onVideoClick={handleVideoClick}
    />
  )
}

// ============================================================================
// FRAMER PROPERTY CONTROLS
// ============================================================================

addPropertyControls(YouTubePlaylistFeed, {
  playlistIdOrUrl: {
    type: ControlType.String,
    title: 'Playlist ID or URL',
    description: 'YouTube Playlist ID or full URL',
    defaultValue: '',
    placeholder: 'PL... or https://youtube.com/playlist?list=...',
  },
  displayMode: {
    type: ControlType.Enum,
    title: 'Display Mode',
    description: 'Choose how videos are displayed',
    options: ['pro-player', 'grid', 'slider'],
    optionTitles: ['Pro Player', 'Grid', 'Slider'],
    defaultValue: 'grid',
  },
  videoType: {
    type: ControlType.Enum,
    title: 'Video Type',
    description: 'Filter videos by type',
    options: ['all', 'videos', 'shorts', 'podcast', 'music'],
    optionTitles: ['All', 'Videos', 'Shorts', 'Podcast', 'Music'],
    defaultValue: 'all',
  },
  maxItems: {
    type: ControlType.Number,
    title: 'Max Items',
    description: 'Maximum number of videos',
    defaultValue: 50,
    min: 1,
    max: 100,
    step: 1,
  },
  // Grid settings
  gridColumns: {
    type: ControlType.Number,
    title: 'Grid Columns',
    description: 'Number of columns in grid',
    defaultValue: 3,
    min: 1,
    max: 6,
    step: 1,
    hidden: (props) => props.displayMode !== 'grid',
  },
  gridGap: {
    type: ControlType.Number,
    title: 'Grid Gap',
    description: 'Gap between grid items (px)',
    defaultValue: 16,
    min: 0,
    max: 48,
    step: 4,
    hidden: (props) => props.displayMode !== 'grid',
  },
  gridAspectRatio: {
    type: ControlType.String,
    title: 'Grid Aspect Ratio',
    description: 'Aspect ratio for grid items (e.g., 16/9)',
    defaultValue: '16/9',
    hidden: (props) => props.displayMode !== 'grid',
  },
  gridLoadMore: {
    type: ControlType.Boolean,
    title: 'Grid Load More',
    description: 'Enable load more button',
    defaultValue: false,
    hidden: (props) => props.displayMode !== 'grid',
  },
  gridItemsPerPage: {
    type: ControlType.Number,
    title: 'Grid Items Per Page',
    description: 'Items to show per page',
    defaultValue: 12,
    min: 1,
    max: 50,
    step: 1,
    hidden: (props) => props.displayMode !== 'grid',
  },
  // Slider settings
  sliderMode: {
    type: ControlType.Enum,
    title: 'Slider Mode',
    description: 'Slider interaction mode',
    options: ['auto', 'drag', 'manual'],
    optionTitles: ['Auto Slide', 'Drag', 'Manual'],
    defaultValue: 'manual',
    hidden: (props) => props.displayMode !== 'slider',
  },
  sliderAutoSlideInterval: {
    type: ControlType.Number,
    title: 'Auto Slide Interval',
    description: 'Seconds between auto slides',
    defaultValue: 5,
    min: 1,
    max: 60,
    step: 1,
    hidden: (props) => props.displayMode !== 'slider' || props.sliderMode !== 'auto',
  },
  sliderShowControls: {
    type: ControlType.Boolean,
    title: 'Show Controls',
    description: 'Show navigation controls',
    defaultValue: true,
    hidden: (props) => props.displayMode !== 'slider',
  },
  sliderShowPagination: {
    type: ControlType.Boolean,
    title: 'Show Pagination',
    description: 'Show pagination dots',
    defaultValue: true,
    hidden: (props) => props.displayMode !== 'slider',
  },
  // Pro Player settings
  proPlayerWidth: {
    type: ControlType.Number,
    title: 'Player Width',
    description: 'Player width (px)',
    defaultValue: 800,
    min: 320,
    max: 1920,
    step: 10,
    hidden: (props) => props.displayMode !== 'pro-player',
  },
  proPlayerHeight: {
    type: ControlType.Number,
    title: 'Player Height',
    description: 'Player height (px)',
    defaultValue: 450,
    min: 180,
    max: 1080,
    step: 10,
    hidden: (props) => props.displayMode !== 'pro-player',
  },
  proPlayerAspectRatio: {
    type: ControlType.String,
    title: 'Player Aspect Ratio',
    description: 'Aspect ratio (e.g., 16/9)',
    defaultValue: '16/9',
    hidden: (props) => props.displayMode !== 'pro-player',
  },
  // Playback options
  autoplay: {
    type: ControlType.Boolean,
    title: 'Autoplay',
    description: 'Automatically play videos',
    defaultValue: false,
  },
  shuffle: {
    type: ControlType.Boolean,
    title: 'Shuffle',
    description: 'Randomize video order',
    defaultValue: false,
  },
  loop: {
    type: ControlType.Boolean,
    title: 'Loop',
    description: 'Loop playlist',
    defaultValue: false,
  },
  playbackSpeed: {
    type: ControlType.Number,
    title: 'Playback Speed',
    description: 'Playback speed multiplier',
    defaultValue: 1,
    min: 0.25,
    max: 2,
    step: 0.25,
  },
  startTime: {
    type: ControlType.Number,
    title: 'Start Time (seconds)',
    description: 'Start video at this time',
    defaultValue: 0,
    min: 0,
    step: 1,
  },
  endTime: {
    type: ControlType.Number,
    title: 'End Time (seconds)',
    description: 'End video at this time (0 = no end)',
    defaultValue: 0,
    min: 0,
    step: 1,
  },
  interactionMode: {
    type: ControlType.Enum,
    title: 'Interaction Mode',
    description: 'User interaction level',
    options: ['interactive', 'background'],
    optionTitles: ['Interactive', 'Background'],
    defaultValue: 'interactive',
  },
  // Styling
  borderRadius: {
    type: ControlType.Number,
    title: 'Border Radius',
    description: 'Border radius (px)',
    defaultValue: 8,
    min: 0,
    max: 32,
    step: 2,
  },
  cardBackground: {
    type: ControlType.Color,
    title: 'Card Background',
    description: 'Card background color',
    defaultValue: '#ffffff',
  },
  textColor: {
    type: ControlType.Color,
    title: 'Text Color',
    description: 'Text color',
    defaultValue: '#000000',
  },
  titleFontSize: {
    type: ControlType.Number,
    title: 'Title Font Size',
    description: 'Title font size (px)',
    defaultValue: 16,
    min: 12,
    max: 24,
    step: 1,
  },
  descriptionFontSize: {
    type: ControlType.Number,
    title: 'Description Font Size',
    description: 'Description font size (px)',
    defaultValue: 14,
    min: 10,
    max: 20,
    step: 1,
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
})
