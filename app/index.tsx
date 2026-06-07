import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { DaySection } from "@/components/DaySection";
import { DailyNutritionCard } from "@/components/DailyNutritionCard";
import { FrenchContrastGuidanceCard } from "@/components/FrenchContrastGuidanceCard";
import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { useReadiness } from "@/context/ReadinessContext";
import { getRelatedGlossaryTermsForDay } from "@/data/glossary";
import { getTodayTrainingDay } from "@/logic/schedule";
import { applyAdjustmentToDay } from "@/logic/trainingAdjustment";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function TodayScreen() {
  const router = useRouter();
  const day = getTodayTrainingDay();
  const { getReadinessEntry } = useReadiness();
  const readinessEntry = getReadinessEntry(todayDate());
  const [showAdjustedPlan, setShowAdjustedPlan] = useState(false);
  const adjustedDay = useMemo(
    () => (readinessEntry ? applyAdjustmentToDay(day, readinessEntry.adjustment) : day),
    [day, readinessEntry]
  );
  const visibleDay = showAdjustedPlan && readinessEntry ? adjustedDay : day;
  const relatedTerms = useMemo(() => getRelatedGlossaryTermsForDay(visibleDay), [visibleDay]);
  const focusFlags = [
    day.upperBodyIncluded ? "上肢" : undefined,
    day.coreIncluded ? "核心" : undefined,
    day.isometricIncluded ? "等长" : undefined
  ].filter(Boolean) as string[];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.navRow}>
        <Pressable style={styles.navButton} onPress={() => router.push("/plan")}>
          <Text style={styles.navButtonText}>21-Day Plan</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/checkin")}>
          <Text style={styles.navButtonText}>Check-in</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/nutrition" as never)}>
          <Text style={styles.navButtonText}>Nutrition</Text>
        </Pressable>
        <Pressable style={styles.navButton} onPress={() => router.push("/glossary" as never)}>
          <Text style={styles.navButtonText}>术语</Text>
        </Pressable>
      </View>

      <Pressable style={styles.adaptiveButton} onPress={() => router.push("/adaptive-plan")}>
        <Text style={styles.adaptiveButtonText}>根据反馈调整计划</Text>
      </Pressable>

      <Text style={styles.eyebrow}>
        Today · Day {day.day} · Phase {day.phase}
      </Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{day.type}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
      </View>
      <Text style={styles.goal}>{day.goal}</Text>

      {day.performanceFocus?.length ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>今日表现重点</Text>
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

      {showAdjustedPlan && readinessEntry ? (
        <View style={styles.adjustedBanner}>
          <Text style={styles.adjustedTitle}>正在预览 Readiness 调整版</Text>
          <Text style={styles.adjustedText}>这是临时 overlay，不会修改原始 21 天计划数据。</Text>
        </View>
      ) : null}

      <FrenchContrastGuidanceCard day={day} readinessEntry={readinessEntry} />
      <RelatedTermsSection terms={relatedTerms} />

      <DailyNutritionCard dayType={day.type} adjustment={readinessEntry?.adjustment} compact />

      {visibleDay.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Readiness Warning</Text>
          <Text style={styles.warningText}>{visibleDay.readinessRule}</Text>
        </View>
      ) : null}

      {visibleDay.blocks.map((block, index) => (
        <DaySection key={`${block.type}-${index}`} block={block} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  navRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22
  },
  navButton: {
    minWidth: "22%",
    flexGrow: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff",
    alignItems: "center"
  },
  navButtonText: {
    color: "#0969da",
    fontWeight: "800"
  },
  adaptiveButton: {
    marginBottom: 22,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  adaptiveButtonText: {
    color: "#ffffff",
    fontWeight: "900"
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
    marginTop: 18,
    padding: 16,
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
