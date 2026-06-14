import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePerformance } from "@/context/PerformanceContext";
import { useTrainingLog } from "@/context/TrainingLogContext";
import { trainingPlan } from "@/data/plan";
import { buildRollingSevenDaySummaries } from "@/logic/jumpContacts";

export function RollingLoadSummaryCard() {
  const [expanded, setExpanded] = useState(false);
  const { basketballLogs } = usePerformance();
  const { entries } = useTrainingLog();
  const windows = buildRollingSevenDaySummaries(trainingPlan, basketballLogs);
  const completedGymContacts = entries.reduce(
    (total, entry) => total + (entry.actualJumpContacts ?? 0),
    0
  );
  const maxIntentContacts = entries.reduce(
    (total, entry) => total + (entry.maxIntentContacts ?? 0),
    0
  );
  const estimatedBasketballContacts = basketballLogs.reduce(
    (total, log) => total + (log.estimatedJumpContacts ?? 0),
    0
  );

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded(!expanded)}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>滚动 7 天负荷</Text>
          <Text style={styles.subtitle}>
            已记录健身房跳跃 {completedGymContacts} · 最大意图 {maxIntentContacts} · 篮球估算 {estimatedBasketballContacts}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? "⌃" : "›"}</Text>
      </Pressable>
      {expanded ? (
        <View style={styles.body}>
          <Text style={styles.note}>篮球接触为估算值，不与健身房精确次数混为一谈。</Text>
          {windows.map((window) => (
            <Text key={window.startDay} style={styles.window}>
              第 {window.startDay}–{window.endDay} 天：计划 {window.plannedGymContacts.min}–{window.plannedGymContacts.max} 次 · 高冲击 {window.highImpactDays} 天 · 最大意图 {window.maxIntentContacts}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 16, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff", overflow: "hidden" },
  header: { minHeight: 54, padding: 12, flexDirection: "row", alignItems: "center", gap: 8 },
  titleWrap: { flex: 1 },
  title: { fontSize: 16, color: "#1f2328", fontWeight: "900" },
  subtitle: { marginTop: 3, fontSize: 12, lineHeight: 17, color: "#57606a" },
  chevron: { fontSize: 24, color: "#0969da", fontWeight: "900" },
  body: { paddingHorizontal: 12, paddingBottom: 12 },
  note: { paddingTop: 10, borderTopWidth: 1, borderTopColor: "#d8dee4", fontSize: 12, lineHeight: 18, color: "#57606a" },
  window: { marginTop: 7, fontSize: 12, lineHeight: 18, color: "#24292f" }
});
