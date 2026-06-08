import { StyleSheet, Text, View } from "react-native";

import { getTrainingBlockTitle } from "@/logic/trainingDisplay";
import type { GeneratedAdaptivePlan } from "@/types/adaptivePlan";

interface AdaptivePlanPreviewProps {
  plan: GeneratedAdaptivePlan;
}

export function AdaptivePlanPreview({ plan }: AdaptivePlanPreviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{plan.metadata.title}</Text>
      <Text style={styles.meta}>长度：{plan.metadata.length}</Text>
      <Text style={styles.meta}>重点：{plan.metadata.focus}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>生成理由</Text>
        <Text style={styles.text}>{plan.metadata.rationale}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>安全总结</Text>
        <Text style={styles.text}>{plan.metadata.safetySummary}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>全局规则</Text>
        {plan.globalRules.map((rule) => (
          <Text key={rule} style={styles.listItem}>
            • {rule}
          </Text>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>计划预览</Text>
        {plan.days.map((day) => (
          <View key={day.day} style={styles.dayRow}>
            <Text style={styles.dayTitle}>
              Day {day.day}: {day.title}
            </Text>
            {day.phaseTitle ? (
              <Text style={styles.dayPhase}>
                Phase {day.phase} · {day.phaseTitle}
              </Text>
            ) : null}
            <Text style={styles.dayText}>{day.goal}</Text>
            {day.performanceFocus?.length ? (
              <Text style={styles.dayText}>重点：{day.performanceFocus.slice(0, 4).join(" / ")}</Text>
            ) : null}
            <Text style={styles.dayText}>
              训练块：{day.blocks.map((block) => getTrainingBlockTitle(block)).join(" / ")}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>红旗</Text>
        {plan.redFlags.map((flag) => (
          <Text key={flag} style={styles.listItem}>
            • {flag}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1f2328"
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a",
    fontWeight: "700"
  },
  block: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 8
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    color: "#24292f"
  },
  listItem: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  dayRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4"
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1f2328"
  },
  dayPhase: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "900",
    color: "#116329"
  },
  dayText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#57606a"
  }
});
