import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

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
import { getBasketballLoadWarning } from "@/logic/basketballLoad";
import { getPlanDate, getTodayTrainingDay } from "@/logic/schedule";
import { applyAdjustmentToDay, applyDay11PapDowngrade } from "@/logic/trainingAdjustment";
import { getTrainingDayTypeLabel, normalizeTrainingCopy } from "@/logic/trainingDisplay";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function TodayScreen() {
  const router = useRouter();
  const day = getTodayTrainingDay();
  const { getReadinessEntry } = useReadiness();
  const { getBasketballLog } = usePerformance();
  const readinessEntry = getReadinessEntry(todayDate());
  const planDate = getPlanDate(day.day);
  const day9BasketballLog = getBasketballLog(getPlanDate(9));
  const [showAdjustedPlan, setShowAdjustedPlan] = useState(false);
  const adjustedDay = useMemo(
    () => (readinessEntry ? applyAdjustmentToDay(day, readinessEntry.adjustment) : day),
    [day, readinessEntry]
  );
  const papDowngradeReason =
    day.day === 11 &&
    (day9BasketballLog?.loadLevel === "moderate" || day9BasketballLog?.loadLevel === "high")
      ? `第 9 天篮球负荷为${day9BasketballLog.loadLevel === "high" ? "高" : "中等"}`
      : undefined;
  const baseVisibleDay = showAdjustedPlan && readinessEntry ? adjustedDay : day;
  const visibleDay = papDowngradeReason
    ? applyDay11PapDowngrade(baseVisibleDay, papDowngradeReason)
    : baseVisibleDay;
  const basketballWarning = getBasketballLoadWarning(
    readinessEntry?.subjective?.basketballLoadLast24h ?? "none",
    readinessEntry?.subjective?.basketballLoadLast48h ?? "none"
  );
  const relatedTerms = useMemo(() => getRelatedGlossaryTermsForDay(visibleDay), [visibleDay]);
  const totalActions = visibleDay.blocks.reduce((count, block) => count + block.items.length, 0);
  const hasSingleLegModule = visibleDay.blocks.some((block) =>
    block.items.some((item) => isSingleLegStiffnessItem(item))
  );
  const focusFlags = [
    day.upperBodyIncluded ? "上肢" : undefined,
    day.coreIncluded ? "核心" : undefined,
    day.isometricIncluded ? "等长" : undefined
  ].filter(Boolean) as string[];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navRow}>
        <Pressable style={styles.navButton} onPress={() => router.push("/plan")}>
          <Text style={styles.navButtonText}>计划</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/checkin")}>
          <Text style={styles.navButtonText}>状态</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/nutrition" as never)}>
          <Text style={styles.navButtonText}>营养</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/glossary" as never)}>
          <Text style={styles.navButtonText}>术语</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionKicker}>今日概览</Text>
      <Text style={styles.eyebrow}>
        第 {day.day} 天 · 第 {day.phase} 阶段
      </Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{getTrainingDayTypeLabel(day.type)}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
      </View>
      <Text style={styles.goal}>{day.goal}</Text>
      <DayLoadCard day={visibleDay} />

      <View style={styles.readinessCard}>
        <Text style={styles.readinessTitle}>今日 Readiness 评估</Text>
        {readinessEntry ? (
          <>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryLevel}>{readinessEntry.adjustment.level.toUpperCase()}</Text>
              <Text style={styles.summaryHeadline}>{readinessEntry.adjustment.headline}</Text>
            </View>
            {readinessEntry.adjustment.modifications.slice(0, 3).map((modification) => (
              <Text key={modification} style={styles.summaryItem}>
                • {modification}
              </Text>
            ))}
            <Pressable
              style={[styles.overlayButton, showAdjustedPlan && styles.overlayButtonActive]}
              onPress={() => setShowAdjustedPlan((current) => !current)}
            >
              <Text style={[styles.overlayButtonText, showAdjustedPlan && styles.overlayButtonTextActive]}>
                {showAdjustedPlan ? "显示原计划" : "预览调整后计划"}
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.emptyText}>
              还没有今天的 Oura / readiness 数据。可以手动输入，之后再接 Oura API。
            </Text>
            <Pressable style={styles.fillButton} onPress={() => router.push("/checkin")}>
              <Text style={styles.fillButtonText}>填写今日状态</Text>
            </Pressable>
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>今日训练内容</Text>

      {showAdjustedPlan && readinessEntry ? (
        <View style={styles.adjustedBanner}>
          <Text style={styles.adjustedTitle}>正在预览 Readiness 调整版</Text>
          <Text style={styles.adjustedText}>这是临时 overlay，不会修改原始 21 天计划数据。</Text>
        </View>
      ) : null}

      {visibleDay.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>今日状态提醒</Text>
          <Text style={styles.warningText}>{normalizeTrainingCopy(visibleDay.readinessRule)}</Text>
        </View>
      ) : null}
      {basketballWarning ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>篮球负荷调整</Text>
          <Text style={styles.warningText}>{basketballWarning}</Text>
        </View>
      ) : null}

      {visibleDay.blocks.map((block, index) => (
        <DaySection key={`${block.type}-${index}`} block={block} dayLabel={`第 ${visibleDay.day} 天`} />
      ))}

      {day.type === "basketball" ? <BasketballLoadLogger date={planDate} /> : null}
      {day.day === 20 ? <JumpTestCard date={planDate} /> : null}
      {hasSingleLegModule ? (
        <SingleLegStiffnessAssessmentCard date={planDate} dayNumber={day.day} />
      ) : null}
      {day.assessmentProtocolId ? (
        <RightSideAssessmentCard
          date={planDate}
          dayNumber={day.day as 1 | 14 | 20 | 21}
        />
      ) : null}
      {day.day === 21 ? <CycleReviewCard /> : null}

      <DayCompletionPanel
        dayKey={`day-${visibleDay.day}`}
        dayLabel={`第 ${visibleDay.day} 天`}
        dayTitle={visibleDay.title}
        totalActions={totalActions}
      />
      <TrainingLogPanel />

      <DailyNutritionCard dayType={day.type} adjustment={readinessEntry?.adjustment} compact />

      {day.performanceFocus?.length ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>右侧发力 / 腘绳肌 / 核心重点</Text>
          <View style={styles.chipRow}>
            {day.performanceFocus.map((focus) => (
              <Text key={focus} style={styles.focusChip}>
                {focus}
              </Text>
            ))}
          </View>
          <Text style={styles.focusText}>右侧再平衡：右脚 tripod、右膝轨迹和安静落地优先。</Text>
          <Text style={styles.focusText}>腘绳肌重点：有酸痛时不做 Nordic、硬 RDL、冲刺或最大跳。</Text>
          {focusFlags.length ? (
            <Text style={styles.focusText}>支持模块：{focusFlags.join(" / ")}</Text>
          ) : null}
        </View>
      ) : null}

      <RelatedTermsSection terms={relatedTerms} />
      <FrenchContrastGuidanceCard day={day} readinessEntry={readinessEntry} />

      <Pressable style={styles.adaptiveLink} onPress={() => router.push("/adaptive-plan")}>
        <Text style={styles.adaptiveLinkText}>根据反馈调整计划</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 96
  },
  navRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
    alignItems: "center"
  },
  navButton: {
    minWidth: "23%",
    flexGrow: 1,
    minHeight: 40,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  navButtonText: {
    color: "#0969da",
    fontWeight: "800",
    fontSize: 13
  },
  sectionKicker: {
    marginTop: 2,
    fontSize: 14,
    color: "#57606a",
    fontWeight: "900"
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: "900",
    color: "#1f2328"
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
    backgroundColor: "#dbeafe",
    color: "#1d4ed8",
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
  goal: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#24292f"
  },
  focusCard: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  focusTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  chipRow: {
    marginTop: 10,
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
  readinessCard: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  readinessTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  summaryHeader: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  summaryLevel: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  summaryHeadline: {
    flex: 1,
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2328"
  },
  summaryItem: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  emptyText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  fillButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  fillButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  overlayButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center"
  },
  overlayButtonActive: {
    backgroundColor: "#0969da"
  },
  overlayButtonText: {
    color: "#0969da",
    fontWeight: "900"
  },
  overlayButtonTextActive: {
    color: "#ffffff"
  },
  adjustedBanner: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  adjustedTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  adjustedText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
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
  },
  adaptiveLink: {
    minHeight: 44,
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    alignItems: "center",
    backgroundColor: "#ffffff"
  },
  adaptiveLinkText: {
    color: "#0969da",
    fontSize: 14,
    fontWeight: "900"
  }
});
