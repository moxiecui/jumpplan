import { StyleSheet, Text, View } from "react-native";

import { getExerciseById } from "@/data/exercises";
import type { TrainingReminder } from "@/types/bodySignals";

interface TrainingReminderCardProps {
  reminder: TrainingReminder;
  compact?: boolean;
}

const levelLabels: Record<TrainingReminder["level"], string> = {
  info: "提示",
  caution: "注意",
  warning: "警告",
  stop: "停止"
};

const actionLabels: Record<TrainingReminder["recommendedAction"], string> = {
  "follow-plan": "按计划训练",
  "reduce-intensity": "降低强度",
  "remove-high-impact": "移除高冲击",
  "recovery-only": "只做恢复",
  "manual-review": "手动复盘",
  "nutrition-review": "营养复盘"
};

const levelStyles = {
  info: { backgroundColor: "#ddf4ff", color: "#0969da" },
  caution: { backgroundColor: "#fff8c5", color: "#6e5500" },
  warning: { backgroundColor: "#ffebe9", color: "#cf222e" },
  stop: { backgroundColor: "#cf222e", color: "#ffffff" }
};

function formatExerciseNames(ids?: string[]) {
  if (!ids?.length) {
    return undefined;
  }

  return ids
    .slice(0, 6)
    .map((id) => getExerciseById(id)?.nameZh ?? id)
    .join(" / ");
}

export function TrainingReminderCard({ reminder, compact }: TrainingReminderCardProps) {
  const blocked = formatExerciseNames(reminder.blockedExerciseIds);
  const alternatives = formatExerciseNames(reminder.suggestedAlternativeIds);
  const tone = levelStyles[reminder.level];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={[styles.level, tone]}>{levelLabels[reminder.level]}</Text>
        <Text style={styles.action}>{actionLabels[reminder.recommendedAction]}</Text>
      </View>
      <Text style={styles.title}>{reminder.title}</Text>
      <Text style={styles.message}>{reminder.message}</Text>
      {!compact && blocked ? <Text style={styles.meta}>建议跳过：{blocked}</Text> : null}
      {!compact && alternatives ? <Text style={styles.meta}>替代动作：{alternatives}</Text> : null}
      {!compact ? <Text style={styles.trigger}>触发：{reminder.triggeredBy.join(" / ")}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  level: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "900"
  },
  action: {
    fontSize: 13,
    fontWeight: "900",
    color: "#57606a"
  },
  title: {
    marginTop: 9,
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  message: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a",
    fontWeight: "700"
  },
  trigger: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: "#6e7781"
  }
});
