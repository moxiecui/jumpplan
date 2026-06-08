import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useTrainingLog } from "@/context/TrainingLogContext";

interface DayCompletionPanelProps {
  dayKey: string;
  dayLabel: string;
  dayTitle: string;
  totalActions: number;
}

function formatCompletedAt(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function DayCompletionPanel({ dayKey, dayLabel, dayTitle, totalActions }: DayCompletionPanelProps) {
  const { completeTrainingDay, entries, getDayCompletion } = useTrainingLog();
  const [expanded, setExpanded] = useState(true);
  const [note, setNote] = useState("");
  const dayCompletion = getDayCompletion(dayKey);
  const dayEntries = useMemo(() => entries.filter((entry) => entry.dayLabel === dayLabel), [dayLabel, entries]);
  const counts = useMemo(
    () => ({
      completed: dayEntries.filter((entry) => entry.status === "completed").length,
      regressed: dayEntries.filter((entry) => entry.status === "regressed").length,
      skipped: dayEntries.filter((entry) => entry.status === "skipped").length
    }),
    [dayEntries]
  );
  const loggedCount = counts.completed + counts.regressed + counts.skipped;
  const unloggedCount = Math.max(totalActions - loggedCount, 0);
  const doneCount = counts.completed + counts.regressed + counts.skipped;

  const finishDay = () => {
    completeTrainingDay({
      id: dayKey,
      dayLabel,
      dayTitle,
      totalCount: totalActions,
      completedCount: counts.completed,
      regressedCount: counts.regressed,
      skippedCount: counts.skipped,
      unloggedCount,
      note: note.trim() ? note.trim() : undefined
    });
    setExpanded(true);
  };

  return (
    <View style={[styles.card, dayCompletion && styles.completedCard]}>
      <Pressable style={styles.header} onPress={() => setExpanded((current) => !current)}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>今日训练总结</Text>
          <Text style={styles.subtitle}>
            {doneCount}/{totalActions} 个动作已有记录，跳过或降级也可以作为安全完成。
          </Text>
        </View>
        <Text style={[styles.stateBadge, dayCompletion && styles.stateBadgeDone]}>
          {dayCompletion ? "已结束" : "未结束"}
        </Text>
        <Text style={styles.chevron}>{expanded ? "⌃" : "›"}</Text>
      </Pressable>

      {expanded ? (
        <View style={styles.body}>
          <View style={styles.countGrid}>
            <Text style={styles.countItem}>完成 {counts.completed}</Text>
            <Text style={styles.countItem}>降级 {counts.regressed}</Text>
            <Text style={styles.countItem}>跳过 {counts.skipped}</Text>
            <Text style={styles.countItem}>未记录 {unloggedCount}</Text>
          </View>

          <Text style={styles.helpText}>
            不需要为了“完成一天”强行勾满所有动作。因为疼痛、疲劳或时间原因做了降级/跳过，只要记录清楚，也算今天执行了计划。
          </Text>

          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="今日备注，可选：状态、疼痛、跳跃感觉、时间限制..."
            multiline
          />

          <Pressable style={styles.finishButton} onPress={finishDay}>
            <Text style={styles.finishButtonText}>{dayCompletion ? "更新今日总结" : "结束今日训练"}</Text>
          </Pressable>

          {dayCompletion ? (
            <View style={styles.savedBox}>
              <Text style={styles.savedTitle}>已记录：{formatCompletedAt(dayCompletion.completedAt)}</Text>
              <Text style={styles.savedText}>
                完成 {dayCompletion.completedCount} · 降级 {dayCompletion.regressedCount} · 跳过{" "}
                {dayCompletion.skippedCount} · 未记录 {dayCompletion.unloggedCount}
              </Text>
              {dayCompletion.note ? <Text style={styles.savedText}>备注：{dayCompletion.note}</Text> : null}
            </View>
          ) : null}
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
  completedCard: {
    borderColor: "#2da44e"
  },
  header: {
    minHeight: 56,
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
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#eaeef2",
    color: "#57606a",
    fontSize: 12,
    fontWeight: "900"
  },
  stateBadgeDone: {
    backgroundColor: "#dafbe1",
    color: "#116329"
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
  countGrid: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  countItem: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "#f6f8fa",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  helpText: {
    marginTop: 12,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  },
  noteInput: {
    marginTop: 12,
    minHeight: 68,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 9,
    fontSize: 14,
    color: "#1f2328",
    textAlignVertical: "top"
  },
  finishButton: {
    minHeight: 44,
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center",
    justifyContent: "center"
  },
  finishButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900"
  },
  savedBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#dafbe1"
  },
  savedTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#116329",
    fontWeight: "900"
  },
  savedText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#116329"
  }
});
