// Link Preview Service
// Uses free APIs to fetch Open Graph metadata from URLs

export interface LinkPreviewData {
  url: string;
  title: string;
  description?: string;
  imageURL?: string;
  siteName?: string;
  favicon?: string;
}

// Free link preview API endpoint
const LINK_PREVIEW_API = 'https://api.microlink.io';

/**
 * Fetches link preview data using Microlink API (free tier available)
 * Alternative: linkpreview.net, opengraph.io
 */
export async function fetchLinkPreview(url: string): Promise<LinkPreviewData | null> {
  try {
    const response = await fetch(
      `${LINK_PREVIEW_API}?url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch link preview');
    }

    const data = await response.json();

    if (data.status === 'success' && data.data) {
      return {
        url: data.data.url || url,
        title: data.data.title || getDomain(url),
        description: data.data.description,
        imageURL: data.data.image?.url || data.data.logo?.url,
        siteName: data.data.publisher || getDomain(url),
        favicon: data.data.logo?.url,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching link preview:', error);
    return null;
  }
}

/**
 * Extract domain from URL
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Get a screenshot/thumbnail of a webpage using Microlink
 */
export function getScreenshotURL(url: string, width = 800, height = 600): string {
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}

/**
 * Platform-specific thumbnail handlers
 */
export function getPlatformThumbnail(url: string): string | null {
  // YouTube
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  // Vimeo - would need API call
  // Instagram - would need API call
  // TikTok - would need API call

  return null;
}

/**
 * Generate a simple preview using screenshot API as fallback
 */
export function generatePreviewImageURL(url: string): string {
  // First check for platform-specific thumbnails
  const platformThumb = getPlatformThumbnail(url);
  if (platformThumb) return platformThumb;

  // Use Microlink screenshot as fallback
  return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
}
