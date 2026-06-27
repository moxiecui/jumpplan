import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { trainingPlan } from "@/data/plan";
import { trainingCycles } from "@/data/macrocycle";
import { usePlanProgress } from "@/context/PlanProgressContext";
import { RollingLoadSummaryCard } from "@/components/RollingLoadSummaryCard";
import {
  estimatedFatigueLabels,
  getTrainingDayTypeLabel,
  impactLevelLabels
} from "@/logic/trainingDisplay";
import type { TrainingDay, TrainingDayType } from "@/types/training";

type PlanFilter = TrainingDayType | "upper-body" | "core" | "isometric" | "all";
type PlanView = "cycle" | "macrocycle" | "tests" | "basketball" | "summary";

const filterOptions: { value: PlanFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "jump", label: "弹跳" },
  { value: "strength", label: "力量" },
  { value: "basketball", label: "篮球" },
  { value: "recovery", label: "恢复" },
  { value: "upper-body", label: "上肢" },
  { value: "core", label: "核心" },
  { value: "isometric", label: "等长" }
];

const viewOptions: { value: PlanView; label: string }[] = [
  { value: "cycle", label: "21天周期" },
  { value: "macrocycle", label: "12周宏周期" },
  { value: "tests", label: "测试日" },
  { value: "basketball", label: "篮球负荷" },
  { value: "summary", label: "周期总结" }
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
  const { currentDay } = usePlanProgress();
  const [activeFilter, setActiveFilter] = useState<PlanFilter>("all");
  const [activeView, setActiveView] = useState<PlanView>("cycle");
  const visiblePlan = useMemo(
    () =>
      trainingPlan.filter((day) => {
        const viewMatch =
          activeView === "cycle"
            ? day.cycleNumber === currentDay.cycleNumber
            : activeView === "tests"
              ? day.type === "test" || Boolean(day.assessmentProtocolId)
              : activeView === "basketball"
                ? day.type === "basketball" || day.type === "skill" || Boolean(day.basketballLoadDependency)
                : activeView === "summary"
                  ? false
                  : true;

        return viewMatch && matchesFilter(day, activeFilter);
      }),
    [activeFilter, activeView, currentDay.cycleNumber]
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>12周 JumpPlan</Text>
      <Text style={styles.subtitle}>
        当前：Week {currentDay.weekNumber} · Cycle {currentDay.cycleNumber} · Macro Day {currentDay.macrocycleDay}；21 天周期第 {currentDay.dayInCycle} 天。
      </Text>
      <RollingLoadSummaryCard />

      <View style={styles.viewRow}>
        {viewOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[styles.viewButton, activeView === option.value && styles.viewButtonActive]}
            onPress={() => setActiveView(option.value)}
          >
            <Text style={[styles.viewText, activeView === option.value && styles.viewTextActive]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

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

      {activeView === "summary" ? (
        <View>
          {trainingCycles.map((cycle) => (
            <View key={cycle.cycleNumber} style={styles.cycleCard}>
              <Text style={styles.cycleTitle}>
                Cycle {cycle.cycleNumber} · Day {cycle.startDay}-{cycle.endDay}
              </Text>
              <Text style={styles.cycleName}>{cycle.title}</Text>
              {cycle.goals.slice(0, 5).map((goal) => (
                <Text key={goal} style={styles.goal}>• {goal}</Text>
              ))}
              <Text style={styles.loadMeta}>测试 / 复盘日：{cycle.testDays.join("、")}</Text>
            </View>
          ))}
        </View>
      ) : null}

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
            <Text style={styles.dayNumber}>Day {day.macrocycleDay}</Text>
            <Text style={styles.dayType}>{getTrainingDayTypeLabel(day.type)}</Text>
          </View>
          <Text style={styles.phase}>
            Week {day.weekNumber} · Cycle {day.cycleNumber} · 21 天周期第 {day.dayInCycle} 天
          </Text>
          {day.phaseTitle ? (
            <Text style={styles.phase}>
              {day.cycleTitle} · {day.phaseTitle}
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
  viewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12
  },
  viewButton: {
    minHeight: 38,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff",
    justifyContent: "center"
  },
  viewButtonActive: {
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  viewText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#57606a"
  },
  viewTextActive: {
    color: "#0969da"
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
  },
  cycleCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 12
  },
  cycleTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0969da"
  },
  cycleName: {
    marginTop: 6,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "900",
    color: "#1f2328"
  }
});
