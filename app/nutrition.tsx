import { ScrollView, StyleSheet, Text, View } from "react-native";

import { NutritionScheduleTimeline } from "@/components/NutritionScheduleTimeline";
import { NutritionSection } from "@/components/NutritionSection";
import { useReadiness } from "@/context/ReadinessContext";
import {
  getNutritionPlanForDayType,
  getVisibleNutritionItems,
  groupNutritionItemsByTiming,
  isTrainingActiveForNutrition
} from "@/logic/nutrition";
import { getNutritionScheduleForTrainingTime } from "@/logic/nutritionSchedule";
import { getTodayTrainingDay } from "@/logic/schedule";

const defaultTrainingTime = "18:00"; // TODO: move to app settings when settings exist.

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function NutritionScreen() {
  const day = getTodayTrainingDay();
  const { getReadinessEntry } = useReadiness();
  const readinessEntry = getReadinessEntry(todayDate());
  const adjustment = readinessEntry?.adjustment;
  const trainingActive = isTrainingActiveForNutrition(day.type, adjustment);
  const plan = getNutritionPlanForDayType(day.type);
  const visibleItems = getVisibleNutritionItems(plan.items, { trainingActive });
  const groups = groupNutritionItemsByTiming(visibleItems);
  const schedule = getNutritionScheduleForTrainingTime(day.type, defaultTrainingTime, adjustment);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>Today · Day {day.day}</Text>
      <Text style={styles.title}>今日营养与补剂</Text>
      <Text style={styles.subtitle}>{plan.title}</Text>
      <Text style={styles.summary}>{plan.summary}</Text>

      {!trainingActive ? (
        <View style={styles.hiddenBox}>
          <Text style={styles.hiddenTitle}>不训练日自动隐藏</Text>
          <Text style={styles.hiddenText}>今天如果不训练，L-瓜氨酸和训练前碳水不会显示在今日时间表里。</Text>
        </View>
      ) : null}

      <NutritionScheduleTimeline entries={schedule} trainingActive={trainingActive} />

      <Text style={styles.safetyTitle}>总原则</Text>
      <Text style={styles.safetyText}>
        补剂是辅助。训练编排、睡眠、总蛋白、碳水、水分和疼痛管理优先级更高。鱼油、谷氨酰胺、镁、锌都不应该被当作继续高冲击训练的理由。任何补剂让肠胃不舒服时，先减少剂量、随餐、换时间，或直接跳过。
      </Text>

      {groups.map((group) => (
        <NutritionSection key={group.timing} title={group.label} items={group.items} />
      ))}

      <View style={styles.notes}>
        <Text style={styles.notesTitle}>今日备注</Text>
        {plan.notes.map((note) => (
          <Text key={note} style={styles.note}>
            • {note}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
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
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#0969da",
    fontWeight: "900"
  },
  summary: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a"
  },
  hiddenBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d29922",
    backgroundColor: "#fff8c5"
  },
  hiddenTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  hiddenText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#6e5500"
  },
  safetyTitle: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  safetyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#57606a"
  },
  notes: {
    marginTop: 22,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  note: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  }
});
