import type { Exercise } from "@/types/training";

export function buildYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function getExerciseVideoUrl(exercise: Exercise): string | undefined {
  if (exercise.youtubeUrl) {
    return exercise.youtubeUrl;
  }

  if (exercise.youtubeSearchQuery) {
    return buildYouTubeSearchUrl(exercise.youtubeSearchQuery);
  }

  return undefined;
}
