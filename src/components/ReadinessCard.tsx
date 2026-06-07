import { StyleSheet, Text, View } from "react-native";

import type { ReadinessLevel } from "@/types/training";

interface ReadinessCardProps {
  level: ReadinessLevel;
  message: string;
  modifications: string[];
}

const levelMeta: Record<ReadinessLevel, { label: string; backgroundColor: string; borderColor: string }> = {
  green: {
    label: "Green",
    backgroundColor: "#dafbe1",
    borderColor: "#2da44e"
  },
  yellow: {
    label: "Yellow",
    backgroundColor: "#fff8c5",
    borderColor: "#bf8700"
  },
  red: {
    label: "Red",
    backgroundColor: "#ffebe9",
    borderColor: "#cf222e"
  }
};

export function ReadinessCard({ level, message, modifications }: ReadinessCardProps) {
  const meta = levelMeta[level];

  return (
    <View style={[styles.card, { backgroundColor: meta.backgroundColor, borderColor: meta.borderColor }]}>
      <Text style={styles.level}>{meta.label}</Text>
      <Text style={styles.message}>{message}</Text>
      {modifications.length > 0 ? (
        <View style={styles.modifications}>
          {modifications.map((modification) => (
            <Text key={modification} style={styles.modification}>
              • {modification}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.modification}>按当天计划执行，继续观察落地质量和肌腱反应。</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 18
  },
  level: {
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    color: "#1f2328"
  },
  message: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2328"
  },
  modifications: {
    marginTop: 10,
    gap: 6
  },
  modification: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  }
});
