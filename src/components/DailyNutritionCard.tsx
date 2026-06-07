import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { NutritionItemRow } from "@/components/NutritionItemRow";
import {
  getDailyBaselineNutritionItems,
  getNutritionPlanForDayType,
  getVisibleNutritionItems,
  isTrainingActiveForNutrition
} from "@/logic/nutrition";
import type { NutritionItem } from "@/types/nutrition";
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
  const visibleItems = getVisibleNutritionItems(plan.items, { trainingActive });
  const trainingRelatedIds = trainingActive
    ? ["collagen-vitamin-c", "hydration-electrolytes", "whey-isolate", "pre-training-light-carb"]
    : ["whey-isolate"];
  const eveningIds = ["magnesium-glycinate", "zinc", "glutamine"];
  const trainingRelatedItems = pickItems(visibleItems, trainingRelatedIds).slice(0, compact ? 3 : 4);
  const dailyBaselineItems = getDailyBaselineNutritionItems(dayType, { adjustment });
  const eveningItems = pickItems(visibleItems, eveningIds).slice(0, compact ? 1 : 3);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>今日营养与补剂</Text>
      <Text style={styles.subtitle}>{plan.title}</Text>
      <Text style={styles.summary}>{plan.summary}</Text>
      {!trainingActive ? (
        <Text style={styles.hiddenNote}>今天如果不训练，已自动隐藏 L-瓜氨酸和训练前碳水。</Text>
      ) : null}

      <CardGroup title="训练相关" items={trainingRelatedItems} compact={compact} />
      <CardGroup title="日常基础" items={dailyBaselineItems} compact={compact} />
      <CardGroup title="睡前 / 晚间" items={eveningItems} compact={compact} />

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

function pickItems(items: NutritionItem[], ids: string[]) {
  return ids.map((id) => items.find((item) => item.id === id)).filter(Boolean) as NutritionItem[];
}

function CardGroup({ title, items, compact }: { title: string; items: NutritionItem[]; compact: boolean }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {items.map((item) => (
        <NutritionItemRow key={item.id} item={item} compact={compact} />
      ))}
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
  group: {
    marginTop: 14
  },
  groupTitle: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "900",
    color: "#1f2328"
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
