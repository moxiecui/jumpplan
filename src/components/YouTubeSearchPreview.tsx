import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import { buildYouTubeSearchUrl } from "@/logic/videoLinks";
import {
  hasCachedYouTubeSearchResults,
  hasYouTubeSearchApiKey,
  searchYouTubeVideos,
  type YouTubeSearchResult
} from "@/services/youtubeSearch";

interface YouTubeSearchPreviewProps {
  query?: string;
  compact?: boolean;
}

function openUrl(url: string) {
  Linking.openURL(url).catch(() => {
    // Keep the training screen stable if the platform cannot open the URL.
  });
}

export function YouTubeSearchPreview({ query, compact = false }: YouTubeSearchPreviewProps) {
  const [searchState, setSearchState] = useState<{
    query: string;
    results: YouTubeSearchResult[];
    error: boolean;
  }>({ query: "", results: [], error: false });
  const safeQuery = query ?? "";
  const hasQuery = safeQuery.length > 0;
  const hasApiKey = hasYouTubeSearchApiKey();
  const cachedAtRender = hasQuery ? hasCachedYouTubeSearchResults(safeQuery) : false;

  useEffect(() => {
    let cancelled = false;

    if (!safeQuery || !hasApiKey) {
      return;
    }

    searchYouTubeVideos(safeQuery)
      .then((nextResults) => {
        if (!cancelled) {
          setSearchState({ query: safeQuery, results: nextResults, error: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSearchState({ query: safeQuery, results: [], error: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hasApiKey, safeQuery]);

  if (!hasQuery) {
    return null;
  }

  const searchUrl = buildYouTubeSearchUrl(safeQuery);
  const loading = hasApiKey && searchState.query !== safeQuery && !searchState.error;
  const results = searchState.query === safeQuery ? searchState.results : [];
  const error = searchState.query === safeQuery && searchState.error;

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>相关视频，可选观看</Text>
        {hasApiKey ? (
          <Text style={styles.pill}>{cachedAtRender ? "已缓存" : "Top search"}</Text>
        ) : (
          <Text style={styles.pill}>搜索链接</Text>
        )}
      </View>

      {!hasApiKey ? (
        <Text style={styles.note}>未配置 YouTube API key，先显示搜索入口；配置后会自动显示前 3 个搜索结果缩略图。</Text>
      ) : null}
      {error ? <Text style={styles.note}>暂时无法读取 YouTube 搜索结果，仍可打开搜索页查看。</Text> : null}
      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator />
          <Text style={styles.note}>正在读取 YouTube 搜索结果...</Text>
        </View>
      ) : null}

      {results.map((result) => (
        <Pressable key={result.videoId} style={styles.videoRow} onPress={() => openUrl(result.url)}>
          <Image source={{ uri: result.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.videoText}>
            <Text style={styles.videoTitle} numberOfLines={2}>
              {result.title}
            </Text>
            <Text style={styles.channel} numberOfLines={1}>
              {result.channelTitle}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      ))}

      <Pressable style={styles.searchButton} onPress={() => openUrl(searchUrl)}>
        <Text style={styles.searchButtonText}>打开 YouTube 搜索</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8dee4",
    borderRadius: 8,
    backgroundColor: "#ffffff"
  },
  compactCard: {
    marginTop: 10
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "900",
    color: "#1f2328"
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#f6f8fa",
    color: "#57606a",
    fontSize: 11,
    fontWeight: "900"
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    color: "#57606a"
  },
  loadingRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  videoRow: {
    minHeight: 78,
    marginTop: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#f6f8fa",
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  thumbnail: {
    width: 96,
    height: 54,
    borderRadius: 6,
    backgroundColor: "#d0d7de"
  },
  videoText: {
    flex: 1,
    minWidth: 0
  },
  videoTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  channel: {
    marginTop: 4,
    fontSize: 12,
    color: "#57606a",
    fontWeight: "700"
  },
  chevron: {
    fontSize: 24,
    color: "#57606a",
    fontWeight: "700"
  },
  searchButton: {
    minHeight: 44,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff"
  },
  searchButtonText: {
    color: "#0969da",
    fontSize: 14,
    fontWeight: "900"
  }
});
