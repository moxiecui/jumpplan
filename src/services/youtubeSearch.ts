export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  url: string;
}

interface YouTubeApiSearchItem {
  id?: {
    videoId?: string;
  };
  snippet?: {
    title?: string;
    channelTitle?: string;
    thumbnails?: {
      medium?: {
        url?: string;
      };
      default?: {
        url?: string;
      };
    };
  };
}

interface YouTubeApiSearchResponse {
  items?: YouTubeApiSearchItem[];
}

const cache = new Map<string, YouTubeSearchResult[]>();

function getApiKey() {
  return process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
}

export function hasYouTubeSearchApiKey() {
  return Boolean(getApiKey());
}

export async function searchYouTubeVideos(
  query: string,
  maxResults = 3
): Promise<YouTubeSearchResult[]> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return [];
  }

  const cacheKey = `${query}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    safeSearch: "moderate",
    maxResults: String(maxResults),
    q: query,
    key: apiKey
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`YouTube search failed: ${response.status}`);
  }

  const data = (await response.json()) as YouTubeApiSearchResponse;
  const results = (data.items ?? [])
    .map((item): YouTubeSearchResult | undefined => {
      const videoId = item.id?.videoId;
      const title = item.snippet?.title;
      const thumbnailUrl = item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.default?.url;

      if (!videoId || !title || !thumbnailUrl) {
        return undefined;
      }

      return {
        videoId,
        title,
        channelTitle: item.snippet?.channelTitle ?? "YouTube",
        thumbnailUrl,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`
      };
    })
    .filter((item): item is YouTubeSearchResult => Boolean(item));

  cache.set(cacheKey, results);
  return results;
}
