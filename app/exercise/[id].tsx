import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { ExerciseDetailView } from "@/components/ExerciseDetailView";
import { getExerciseById } from "@/data/exercises";

export default function ExerciseDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const exercise = id ? getExerciseById(id) : undefined;

  if (!exercise) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>找不到这个动作</Text>
        <Text style={styles.missingText}>动作 ID：{id ?? "未提供"}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ExerciseDetailView exercise={exercise} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  center: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1f2328"
  },
  missingText: {
    marginTop: 8,
    fontSize: 15,
    color: "#57606a"
  }
});
