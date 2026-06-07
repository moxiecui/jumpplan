import { StyleSheet, Text, View } from "react-native";

import { ExerciseRow } from "@/components/ExerciseRow";
import type { TrainingBlock } from "@/types/training";

interface DaySectionProps {
  block: TrainingBlock;
}

export function DaySection({ block }: DaySectionProps) {
  if (block.items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{block.title}</Text>
      {block.items.map((item, index) => (
        <ExerciseRow key={`${item.exerciseId}-${index}`} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2328",
    marginBottom: 10
  }
});
