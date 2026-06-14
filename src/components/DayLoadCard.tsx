import { StyleSheet, Text, View } from "react-native";

import {
  estimatedFatigueLabels,
  impactLevelLabels
} from "@/logic/trainingDisplay";
import type { TrainingDay } from "@/types/training";

export function DayLoadCard({ day }: { day: TrainingDay }) {
  const rows = [
    ["冲击等级", impactLevelLabels[day.impactLevel]],
    ["预计疲劳", estimatedFatigueLabels[day.estimatedFatigue]],
    [
      "预计时长",
      day.estimatedDurationMinutes
        ? `${day.estimatedDurationMinutes.min}–${day.estimatedDurationMinutes.max} 分钟`
        : "未设置"
    ],
    [
      "计划跳跃接触次数",
      day.plannedJumpContacts
        ? `${day.plannedJumpContacts.min}–${day.plannedJumpContacts.max} 次`
        : "无固定计划"
    ],
    [
      "最大意图跳跃次数",
      day.maxIntentJumpContacts
        ? `${day.maxIntentJumpContacts.min}–${day.maxIntentJumpContacts.max} 次`
        : "0 次"
    ]
  ];

  return (
    <View style={styles.card}>
      <View style={styles.grid}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.item}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
      {day.conditionalRules?.length ? (
        <View style={styles.rules}>
          <Text style={styles.rulesTitle}>条件调整</Text>
          {day.conditionalRules.map((rule) => (
            <Text key={rule} style={styles.rule}>• {rule}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  item: {
    width: "48%",
    padding: 9,
    borderRadius: 6,
    backgroundColor: "#f6f8fa"
  },
  label: {
    fontSize: 11,
    color: "#57606a",
    fontWeight: "800"
  },
  value: {
    marginTop: 3,
    fontSize: 14,
    color: "#1f2328",
    fontWeight: "900"
  },
  rules: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4"
  },
  rulesTitle: {
    fontSize: 13,
    color: "#1f2328",
    fontWeight: "900"
  },
  rule: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  }
});
