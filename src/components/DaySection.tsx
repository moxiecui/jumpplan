import { StyleSheet, Text, View } from "react-native";

import { ExerciseRow } from "@/components/ExerciseRow";
import { getTrainingBlockTitle } from "@/logic/trainingDisplay";
import type { TrainingBlock } from "@/types/training";

interface DaySectionProps {
  block: TrainingBlock;
  dayLabel?: string;
}

export function DaySection({ block, dayLabel }: DaySectionProps) {
  if (block.items.length === 0) {
    return null;
  }

  const blockTitle = getTrainingBlockTitle(block);

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{blockTitle}</Text>
      {block.items.map((item, index) => (
        <ExerciseRow
          key={`${item.exerciseId}-${index}`}
          item={item}
          logKey={`${dayLabel ?? "training"}-${block.type}-${index}-${item.exerciseId}`}
          dayLabel={dayLabel}
          blockTitle={blockTitle}
        />
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
