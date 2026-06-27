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
const STORAGE_KEY = "jumpplan-youtube-search-cache-v1";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_STORED_ENTRIES = 80;

interface StoredYouTubeSearchCacheEntry {
  savedAt: number;
  results: YouTubeSearchResult[];
}

type StoredYouTubeSearchCache = Record<string, StoredYouTubeSearchCacheEntry>;

function getApiKey() {
  return process.env.EXPO_PUBLIC_YOUTUBE_API_KEY;
}

export function hasYouTubeSearchApiKey() {
  return Boolean(getApiKey());
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredCache(): StoredYouTubeSearchCache {
  if (!canUseLocalStorage()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredYouTubeSearchCache) : {};
  } catch {
    return {};
  }
}

function writeStoredCache(nextCache: StoredYouTubeSearchCache) {
  if (!canUseLocalStorage()) {
    return;
  }

  const entries = Object.entries(nextCache)
    .sort(([, first], [, second]) => second.savedAt - first.savedAt)
    .slice(0, MAX_STORED_ENTRIES);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Storage can be unavailable or full; in-memory cache still protects the current session.
  }
}

function readStoredResults(cacheKey: string) {
  const stored = readStoredCache()[cacheKey];

  if (!stored || Date.now() - stored.savedAt > CACHE_TTL_MS) {
    return undefined;
  }

  cache.set(cacheKey, stored.results);
  return stored.results;
}

function writeStoredResults(cacheKey: string, results: YouTubeSearchResult[]) {
  const stored = readStoredCache();
  stored[cacheKey] = {
    savedAt: Date.now(),
    results
  };
  writeStoredCache(stored);
}

export function hasCachedYouTubeSearchResults(query: string, maxResults = 3) {
  const cacheKey = `${query}:${maxResults}`;
  return Boolean(cache.get(cacheKey) ?? readStoredResults(cacheKey));
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

  const stored = readStoredResults(cacheKey);
  if (stored) {
    return stored;
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
  writeStoredResults(cacheKey, results);
  return results;
}
