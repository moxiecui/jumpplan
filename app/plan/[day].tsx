import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { DayCompletionPanel } from "@/components/DayCompletionPanel";
import { BasketballLoadLogger } from "@/components/BasketballLoadLogger";
import { CycleReviewCard } from "@/components/CycleReviewCard";
import { DayLoadCard } from "@/components/DayLoadCard";
import { DaySection } from "@/components/DaySection";
import { DailyNutritionCard } from "@/components/DailyNutritionCard";
import { FrenchContrastGuidanceCard } from "@/components/FrenchContrastGuidanceCard";
import { JumpTestCard } from "@/components/JumpTestCard";
import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { RightSideAssessmentCard } from "@/components/RightSideAssessmentCard";
import { TrainingLogPanel } from "@/components/TrainingLogPanel";
import { useReadiness } from "@/context/ReadinessContext";
import { usePerformance } from "@/context/PerformanceContext";
import { getRelatedGlossaryTermsForDay } from "@/data/glossary";
import { getPlanDate, getTrainingDay } from "@/logic/schedule";
import { applyDay11PapDowngrade } from "@/logic/trainingAdjustment";
import { getTrainingDayTypeLabel, normalizeTrainingCopy } from "@/logic/trainingDisplay";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function DayDetailScreen() {
  const { day: dayParam } = useLocalSearchParams<{ day?: string }>();
  const { getReadinessEntry } = useReadiness();
  const { getBasketballLog } = usePerformance();
  const dayNumber = Number(Array.isArray(dayParam) ? dayParam[0] : dayParam);
  const baseDay = getTrainingDay(dayNumber);
  const readinessEntry = getReadinessEntry(todayDate());

  if (!baseDay) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>找不到这个训练日</Text>
        <Text style={styles.missingText}>请从 21天计划选择第 1 天到第 21 天。</Text>
      </View>
    );
  }
  const day9BasketballLog = getBasketballLog(getPlanDate(9));
  const day =
    baseDay.day === 11 &&
    (day9BasketballLog?.loadLevel === "moderate" || day9BasketballLog?.loadLevel === "high")
      ? applyDay11PapDowngrade(
          baseDay,
          `第 9 天篮球负荷为${day9BasketballLog.loadLevel === "high" ? "高" : "中等"}`
        )
      : baseDay;
  const planDate = getPlanDate(day.day);

  const focusFlags = [
    day.upperBodyIncluded ? "上肢" : undefined,
    day.coreIncluded ? "核心" : undefined,
    day.isometricIncluded ? "等长" : undefined
  ].filter(Boolean) as string[];
  const relatedTerms = getRelatedGlossaryTermsForDay(day);
  const totalActions = day.blocks.reduce((count, block) => count + block.items.length, 0);
  const positioning = [
    day.goal,
    day.upperBodyIncluded ? "包含上肢支持" : undefined,
    day.coreIncluded ? "包含核心" : undefined,
    day.isometricIncluded ? "包含等长" : undefined,
    day.type === "recovery" || day.type === "rest" ? "不做最大跳、不做 PAP" : undefined
  ]
    .filter(Boolean)
    .join("；");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>
        第 {day.day} 天 · 第 {day.phase} 阶段
      </Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{getTrainingDayTypeLabel(day.type)}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>今日定位</Text>
        <Text style={styles.goal}>{positioning}</Text>
      </View>
      <DayLoadCard day={day} />

      {day.performanceFocus?.length ? (
        <View style={styles.focusCompact}>
          <View style={styles.chipRow}>
            {day.performanceFocus.map((focus) => (
              <Text key={focus} style={styles.focusChip}>
                {focus}
              </Text>
            ))}
          </View>
          {focusFlags.length ? <Text style={styles.focusText}>支持模块：{focusFlags.join(" / ")}</Text> : null}
        </View>
      ) : null}

      {day.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>今日状态提醒</Text>
          <Text style={styles.warningText}>{normalizeTrainingCopy(day.readinessRule)}</Text>
        </View>
      ) : null}

      {day.blocks.map((block) => (
        <DaySection key={block.type} block={block} dayLabel={`第 ${day.day} 天`} />
      ))}

      {day.type === "basketball" ? <BasketballLoadLogger date={planDate} /> : null}
      {day.day === 20 ? <JumpTestCard date={planDate} /> : null}
      {day.assessmentProtocolId ? (
        <RightSideAssessmentCard date={planDate} dayNumber={day.day as 1 | 14 | 20 | 21} />
      ) : null}
      {day.day === 21 ? <CycleReviewCard /> : null}

      <DayCompletionPanel
        dayKey={`day-${day.day}`}
        dayLabel={`第 ${day.day} 天`}
        dayTitle={day.title}
        totalActions={totalActions}
      />
      <TrainingLogPanel />

      <DailyNutritionCard dayType={day.type} compact />
      <RelatedTermsSection terms={relatedTerms} />
      <FrenchContrastGuidanceCard day={day} readinessEntry={readinessEntry} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 96
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
    color: "#1f2328"
  },
  type: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "800"
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10
  },
  phaseBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#dafbe1",
    color: "#116329",
    fontSize: 12,
    fontWeight: "800"
  },
  summaryCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#57606a"
  },
  goal: {
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24,
    color: "#24292f"
  },
  focusCompact: {
    marginTop: 10
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  focusChip: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#f6f8fa",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "800"
  },
  focusText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  warning: {
    marginTop: 12,
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
