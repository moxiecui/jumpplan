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
import { SingleLegStiffnessAssessmentCard } from "@/components/SingleLegStiffnessAssessmentCard";
import { TrainingLogPanel } from "@/components/TrainingLogPanel";
import { useReadiness } from "@/context/ReadinessContext";
import { usePerformance } from "@/context/PerformanceContext";
import { getRelatedGlossaryTermsForDay } from "@/data/glossary";
import { isSingleLegStiffnessItem } from "@/data/singleLegStiffness";
import { getPlanDate, getTrainingDay } from "@/logic/schedule";
import { applyDay11PapDowngrade } from "@/logic/trainingAdjustment";
import { getTrainingDayTypeLabel, normalizeTrainingCopy } from "@/logic/trainingDisplay";
import type { TrainingDay } from "@/types/training";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

const phaseLabels = {
  "control-capacity": "控制容量",
  "strength-conversion": "力量转化",
  "reactive-basketball-transfer": "篮球专项转化",
  "taper-test-review": "减量测试"
};

const priorityLabels: Record<NonNullable<TrainingDay["todayPriority"]>, string> = {
  "knee-calm": "膝部安静",
  "right-foot-control": "右脚控制",
  strength: "力量",
  elasticity: "弹性",
  "basketball-transfer": "篮球转化",
  test: "测试",
  recovery: "恢复"
};

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
        <Text style={styles.missingText}>请从 12 周计划选择第 1 天到第 84 天。</Text>
      </View>
    );
  }
  const previousBasketballLog = baseDay.day > 2 ? getBasketballLog(getPlanDate(baseDay.day - 2)) : undefined;
  const day =
    baseDay.dayInCycle === 11 &&
    (previousBasketballLog?.loadLevel === "moderate" || previousBasketballLog?.loadLevel === "high")
      ? applyDay11PapDowngrade(
          baseDay,
          `前 48 小时篮球负荷为${previousBasketballLog.loadLevel === "high" ? "高" : "中等"}`
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
  const hasSingleLegModule = day.blocks.some((block) =>
    block.items.some((item) => isSingleLegStiffnessItem(item))
  );
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
        Week {day.weekNumber} · Cycle {day.cycleNumber} · Day {day.macrocycleDay}
      </Text>
      <Text style={styles.cycleMeta}>21 天周期：第 {day.dayInCycle} 天 · {day.cycleTitle}</Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{getTrainingDayTypeLabel(day.type)}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
        <Text style={styles.phaseBadge}>{phaseLabels[day.macrocyclePhase]}</Text>
        {day.todayPriority ? <Text style={styles.priorityBadge}>{priorityLabels[day.todayPriority]}</Text> : null}
      </View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>今日定位</Text>
        <Text style={styles.goal}>{positioning}</Text>
      </View>
      <DayLoadCard day={day} />
      {day.kneeLoadNote ? <Text style={styles.metaNote}>膝部负荷：{day.kneeLoadNote}</Text> : null}
      {day.basketballLoadDependency ? (
        <Text style={styles.metaNote}>篮球负荷会决定今天是否需要删减健身房冲击。</Text>
      ) : null}

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
        <DaySection key={block.type} block={block} dayLabel={`第 ${day.macrocycleDay} 天`} />
      ))}

      {day.type === "basketball" ? <BasketballLoadLogger date={planDate} /> : null}
      {day.type === "test" ? <JumpTestCard date={planDate} /> : null}
      {hasSingleLegModule ? (
        <SingleLegStiffnessAssessmentCard date={planDate} dayNumber={day.day} />
      ) : null}
      {day.assessmentProtocolId ? (
        <RightSideAssessmentCard date={planDate} dayNumber={day.day as 1 | 21 | 42 | 63 | 84} />
      ) : null}
      {day.dayInCycle === 21 ? <CycleReviewCard /> : null}

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
  cycleMeta: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#57606a",
    fontWeight: "800"
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
  priorityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#fff8c5",
    color: "#6e5500",
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
  metaNote: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a",
    fontWeight: "700"
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
