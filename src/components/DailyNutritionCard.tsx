import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { NutritionItemRow } from "@/components/NutritionItemRow";
import {
  getNutritionPlanForDayType,
  getTopNutritionItemsForToday,
  isTrainingActiveForNutrition
} from "@/logic/nutrition";
import type { DailyTrainingAdjustment, TrainingDayType } from "@/types/training";

interface DailyNutritionCardProps {
  dayType: TrainingDayType;
  adjustment?: DailyTrainingAdjustment;
  compact?: boolean;
}

export function DailyNutritionCard({ dayType, adjustment, compact = false }: DailyNutritionCardProps) {
  const router = useRouter();
  const trainingActive = isTrainingActiveForNutrition(dayType, adjustment);
  const plan = getNutritionPlanForDayType(dayType);
  const topItems = getTopNutritionItemsForToday(dayType, { adjustment });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>今日营养与补剂</Text>
      <Text style={styles.subtitle}>{plan.title}</Text>
      <Text style={styles.summary}>{plan.summary}</Text>
      {!trainingActive ? (
        <Text style={styles.hiddenNote}>今天如果不训练，已自动隐藏 L-瓜氨酸和训练前碳水。</Text>
      ) : null}

      {topItems.map((item) => (
        <NutritionItemRow key={item.id} item={item} compact={compact} />
      ))}

      {!compact
        ? plan.notes.slice(0, 2).map((note) => (
            <Text key={note} style={styles.note}>
              • {note}
            </Text>
          ))
        : null}

      <Pressable style={styles.button} onPress={() => router.push("/nutrition" as never)}>
        <Text style={styles.buttonText}>查看完整时间表</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#0969da",
    fontWeight: "900"
  },
  summary: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  hiddenNote: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff8c5",
    color: "#6e5500",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "800"
  },
  note: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  },
  button: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900"
  }
});
