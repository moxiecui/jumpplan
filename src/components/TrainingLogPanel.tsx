import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTrainingLog } from "@/context/TrainingLogContext";
import type { TrainingItemCompletionStatus } from "@/types/training";

const statusLabels: Record<Exclude<TrainingItemCompletionStatus, "not-started">, string> = {
  completed: "完成",
  skipped: "跳过",
  regressed: "降级"
};

const statusStyles = {
  completed: {
    backgroundColor: "#dafbe1",
    color: "#116329"
  },
  skipped: {
    backgroundColor: "#eaeef2",
    color: "#57606a"
  },
  regressed: {
    backgroundColor: "#fff8c5",
    color: "#6e5500"
  }
};

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function TrainingLogPanel() {
  const { entries } = useTrainingLog();
  const [expanded, setExpanded] = useState(false);
  const recentEntries = entries.slice(0, 8);

  return (
    <View style={styles.card}>
      <Pressable style={styles.header} onPress={() => setExpanded((current) => !current)}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>最近训练记录</Text>
          <Text style={styles.subtitle}>本次打开期间保存，刷新后会清空。</Text>
        </View>
        <Text style={styles.badge}>{entries.length}</Text>
        <Text style={styles.chevron}>{expanded ? "⌃" : "›"}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          {recentEntries.length ? (
            recentEntries.map((entry) => (
              <View key={entry.id} style={styles.entry}>
                <View style={styles.entryHeader}>
                  <Text style={styles.exerciseName}>{entry.exerciseName}</Text>
                  <Text style={[styles.status, statusStyles[entry.status]]}>{statusLabels[entry.status]}</Text>
                </View>
                <Text style={styles.meta}>
                  {[entry.dayLabel, entry.blockTitle, formatUpdatedAt(entry.updatedAt)].filter(Boolean).join(" · ")}
                </Text>
                {entry.reasons?.length ? <Text style={styles.detail}>原因：{entry.reasons.join(" / ")}</Text> : null}
                {entry.note ? <Text style={styles.detail}>备注：{entry.note}</Text> : null}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>还没有记录。训练时点“完成 / 降级 / 跳过”后会出现在这里。</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    overflow: "hidden"
  },
  header: {
    minHeight: 54,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  titleWrap: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    lineHeight: 17,
    color: "#57606a"
  },
  badge: {
    minWidth: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    textAlign: "center",
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  chevron: {
    fontSize: 24,
    lineHeight: 26,
    color: "#0969da",
    fontWeight: "900"
  },
  body: {
    paddingHorizontal: 14,
    paddingBottom: 14
  },
  entry: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4"
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  exerciseName: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#1f2328",
    fontWeight: "900"
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontWeight: "900"
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
    color: "#57606a"
  },
  detail: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 18,
    color: "#24292f"
  },
  emptyText: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4",
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  }
});
