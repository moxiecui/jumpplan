import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { DaySection } from "@/components/DaySection";
import { DailyNutritionCard } from "@/components/DailyNutritionCard";
import { getTrainingDay } from "@/logic/schedule";

export default function DayDetailScreen() {
  const { day: dayParam } = useLocalSearchParams<{ day?: string }>();
  const dayNumber = Number(Array.isArray(dayParam) ? dayParam[0] : dayParam);
  const day = getTrainingDay(dayNumber);

  if (!day) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>找不到这个训练日</Text>
        <Text style={styles.missingText}>请从 14-Day Plan 选择 Day 1 到 Day 14。</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Day {day.day}</Text>
      <Text style={styles.title}>{day.title}</Text>
      <Text style={styles.type}>{day.type}</Text>
      <Text style={styles.goal}>{day.goal}</Text>

      {day.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Readiness Warning</Text>
          <Text style={styles.warningText}>{day.readinessRule}</Text>
        </View>
      ) : null}

      {day.blocks.map((block) => (
        <DaySection key={block.type} block={block} />
      ))}

      <DailyNutritionCard dayType={day.type} compact />
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
    lineHeight: 22,
    color: "#57606a",
    textAlign: "center"
  },
  eyebrow: {
    fontSize: 13,
    color: "#57606a",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  type: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "800"
  },
  goal: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#24292f"
  },
  warning: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d29922",
    backgroundColor: "#fff8c5"
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  warningText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  }
});
