import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ExerciseRow } from "@/components/ExerciseRow";
import { getTrainingBlockTitle } from "@/logic/trainingDisplay";
import type { TrainingBlock } from "@/types/training";

interface DaySectionProps {
  block: TrainingBlock;
  dayLabel?: string;
}

export function DaySection({ block, dayLabel }: DaySectionProps) {
  const [expanded, setExpanded] = useState(block.type !== "optionalRecovery");
  if (block.items.length === 0) {
    return null;
  }

  const blockTitle = getTrainingBlockTitle(block);

  return (
    <View style={styles.section}>
      <Pressable style={styles.header} onPress={() => setExpanded((current) => !current)}>
        <Text style={styles.title}>{blockTitle}</Text>
        {block.type === "optionalRecovery" ? <Text style={styles.optional}>非必做</Text> : null}
        <Text style={styles.chevron}>{expanded ? "⌃" : "›"}</Text>
      </Pressable>
      {expanded ? block.items.map((item, index) => (
        <ExerciseRow
          key={`${item.exerciseId}-${index}`}
          item={item}
          logKey={`${dayLabel ?? "training"}-${block.type}-${index}-${item.exerciseId}`}
          dayLabel={dayLabel}
          blockTitle={blockTitle}
        />
      )) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2328"
  },
  header: {
    minHeight: 44,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  optional: {
    fontSize: 12,
    color: "#57606a",
    fontWeight: "800"
  },
  chevron: {
    fontSize: 24,
    color: "#0969da",
    fontWeight: "900"
  }
});
