import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { DaySection } from "@/components/DaySection";
import { DailyNutritionCard } from "@/components/DailyNutritionCard";
import { FrenchContrastGuidanceCard } from "@/components/FrenchContrastGuidanceCard";
import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { useReadiness } from "@/context/ReadinessContext";
import { getRelatedGlossaryTermsForDay } from "@/data/glossary";
import { getTrainingDay } from "@/logic/schedule";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

export default function DayDetailScreen() {
  const { day: dayParam } = useLocalSearchParams<{ day?: string }>();
  const { getReadinessEntry } = useReadiness();
  const dayNumber = Number(Array.isArray(dayParam) ? dayParam[0] : dayParam);
  const day = getTrainingDay(dayNumber);
  const readinessEntry = getReadinessEntry(todayDate());

  if (!day) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>找不到这个训练日</Text>
        <Text style={styles.missingText}>请从 21-Day Plan 选择 Day 1 到 Day 21。</Text>
      </View>
    );
  }

  const focusFlags = [
    day.upperBodyIncluded ? "上肢" : undefined,
    day.coreIncluded ? "核心" : undefined,
    day.isometricIncluded ? "等长" : undefined
  ].filter(Boolean) as string[];
  const relatedTerms = getRelatedGlossaryTermsForDay(day);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>
        Day {day.day} · Phase {day.phase}
      </Text>
      <Text style={styles.title}>{day.title}</Text>
      <View style={styles.badgeRow}>
        <Text style={styles.type}>{day.type}</Text>
        {day.phaseTitle ? <Text style={styles.phaseBadge}>{day.phaseTitle}</Text> : null}
      </View>
      <Text style={styles.goal}>{day.goal}</Text>

      {day.performanceFocus?.length ? (
        <View style={styles.focusCard}>
          <Text style={styles.focusTitle}>表现重点</Text>
          <View style={styles.chipRow}>
            {day.performanceFocus.map((focus) => (
              <Text key={focus} style={styles.focusChip}>
                {focus}
              </Text>
            ))}
          </View>
          <Text style={styles.focusText}>右侧再平衡：右脚外旋、右膝轨迹和落地声音都要记录。</Text>
          <Text style={styles.focusText}>腘绳肌重点：测试前不安排高疲劳离心。</Text>
          {focusFlags.length ? <Text style={styles.focusText}>支持模块：{focusFlags.join(" / ")}</Text> : null}
        </View>
      ) : null}

      {day.readinessRule ? (
        <View style={styles.warning}>
          <Text style={styles.warningTitle}>Readiness Warning</Text>
          <Text style={styles.warningText}>{day.readinessRule}</Text>
        </View>
      ) : null}

      <FrenchContrastGuidanceCard day={day} readinessEntry={readinessEntry} />
      <RelatedTermsSection terms={relatedTerms} />

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
