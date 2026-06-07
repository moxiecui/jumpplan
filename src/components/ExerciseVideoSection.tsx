import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { getExerciseVideoUrl } from "@/logic/videoLinks";
import type { Exercise } from "@/types/training";

interface ExerciseVideoSectionProps {
  exercise: Exercise;
  compact?: boolean;
}

export function ExerciseVideoSection({ exercise, compact = false }: ExerciseVideoSectionProps) {
  const videoUrl = getExerciseVideoUrl(exercise);

  if (!videoUrl) {
    return null;
  }

  const openVideo = () => {
    Linking.openURL(videoUrl).catch(() => {
      // Keep the UI stable if the platform cannot open the URL.
    });
  };

  return (
    <View style={[styles.block, compact && styles.compactBlock]}>
      <Text style={styles.blockTitle}>参考视频</Text>
      {exercise.videoNote ? <Text style={styles.note}>{exercise.videoNote}</Text> : null}
      <Pressable style={styles.button} onPress={openVideo}>
        <Text style={styles.buttonText}>在 YouTube 查看动作示范</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d8dee4",
    borderRadius: 8,
    backgroundColor: "#ffffff"
  },
  compactBlock: {
    marginTop: 12
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2328",
    marginBottom: 8
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a",
    marginBottom: 10
  },
  button: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900"
  }
});
