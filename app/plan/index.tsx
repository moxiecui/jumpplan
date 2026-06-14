import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { trainingPlan } from "@/data/plan";
import { RollingLoadSummaryCard } from "@/components/RollingLoadSummaryCard";
import {
  estimatedFatigueLabels,
  getTrainingDayTypeLabel,
  impactLevelLabels
} from "@/logic/trainingDisplay";
import type { TrainingDay, TrainingDayType } from "@/types/training";

type PlanFilter = TrainingDayType | "upper-body" | "core" | "isometric" | "all";

const filterOptions: Array<{ value: PlanFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "jump", label: "弹跳" },
  { value: "strength", label: "力量" },
  { value: "basketball", label: "篮球" },
  { value: "recovery", label: "恢复" },
  { value: "upper-body", label: "上肢" },
  { value: "core", label: "核心" },
  { value: "isometric", label: "等长" }
];

function matchesFilter(day: TrainingDay, filter: PlanFilter) {
  if (filter === "all") {
    return true;
  }

  if (filter === "upper-body") {
    return Boolean(day.upperBodyIncluded);
  }

  if (filter === "core") {
    return Boolean(day.coreIncluded);
  }

  if (filter === "isometric") {
    return Boolean(day.isometricIncluded);
  }

  return day.type === filter;
}

export default function PlanScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<PlanFilter>("all");
  const visiblePlan = useMemo(
    () => trainingPlan.filter((day) => matchesFilter(day, activeFilter)),
    [activeFilter]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>21天计划</Text>
      <Text style={styles.subtitle}>三阶段垂直弹跳计划：控制建立、力量转化、整合测试。</Text>
      <RollingLoadSummaryCard />

      <View style={styles.filterRow}>
        {filterOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.filterButton, activeFilter === option.value && styles.filterButtonActive]}
            onPress={() => setActiveFilter(option.value)}
          >
            <Text style={[styles.filterText, activeFilter === option.value && styles.filterTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {visiblePlan.map((day) => (
        <Pressable
          key={day.day}
          style={styles.dayCard}
          onPress={() =>
            router.push({
              pathname: "/plan/[day]",
              params: { day: String(day.day) }
            })
          }
        >
          <View style={styles.dayHeader}>
            <Text style={styles.dayNumber}>第 {day.day} 天</Text>
            <Text style={styles.dayType}>{getTrainingDayTypeLabel(day.type)}</Text>
          </View>
          {day.phaseTitle ? (
            <Text style={styles.phase}>
              第 {day.phase} 阶段 · {day.phaseTitle}
            </Text>
          ) : null}
          <Text style={styles.dayTitle}>{day.title}</Text>
          <Text style={styles.goal}>{day.goal}</Text>
          <Text style={styles.loadMeta}>
            冲击：{impactLevelLabels[day.impactLevel]} · 疲劳：{estimatedFatigueLabels[day.estimatedFatigue]}
            {day.plannedJumpContacts ? ` · 跳跃 ${day.plannedJumpContacts.min}–${day.plannedJumpContacts.max}` : ""}
          </Text>
          {day.performanceFocus?.length ? (
            <View style={styles.focusRow}>
              {day.performanceFocus.slice(0, 4).map((focus) => (
                <Text key={focus} style={styles.focusChip}>
                  {focus}
                </Text>
              ))}
            </View>
          ) : null}
          <Text style={styles.openHint}>查看训练 ›</Text>
        </Pressable>
      ))}

      <Pressable style={styles.generateButton} onPress={() => router.push("/adaptive-plan")}>
        <Text style={styles.generateButtonText}>周期结束后生成下一阶段计划</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 96
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a"
  },
  generateButton: {
    minHeight: 44,
    marginTop: 8,
    paddingVertical: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  generateButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 18
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff"
  },
  filterButtonActive: {
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  filterText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#57606a"
  },
  filterTextActive: {
    color: "#0969da"
  },
  dayCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 12
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0969da"
  },
  dayType: {
    fontSize: 12,
    fontWeight: "800",
    color: "#57606a"
  },
  phase: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "900",
    color: "#116329"
  },
  dayTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2328"
  },
  goal: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  loadMeta: {
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: "#57606a",
    fontWeight: "800"
  },
  focusRow: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  focusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f6f8fa",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "700"
  },
  openHint: {
    marginTop: 10,
    color: "#0969da",
    fontSize: 13,
    fontWeight: "900"
  }
});
