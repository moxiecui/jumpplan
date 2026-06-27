import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getExerciseById } from "@/data/exercises";
import { ExerciseVideoSection } from "@/components/ExerciseVideoSection";
import { useTrainingLog } from "@/context/TrainingLogContext";
import { normalizeTrainingCopy } from "@/logic/trainingDisplay";
import type { Exercise, Intensity, TrainingItem, TrainingItemCompletionStatus } from "@/types/training";

interface ExerciseRowProps {
  item: TrainingItem;
  logKey?: string;
  dayLabel?: string;
  blockTitle?: string;
}

const sideLabels: Record<NonNullable<TrainingItem["side"]>, string> = {
  left: "左侧",
  right: "右侧",
  both: "双侧",
  each: "每侧"
};

const intensityLabels: Record<Intensity, string> = {
  low: "低",
  medium: "中",
  high: "高"
};

const categoryLabels: Record<Exercise["category"], string> = {
  "foot-ankle": "足踝控制",
  "knee-tendon": "膝腱控制",
  hip: "髋部控制",
  plyometric: "弹跳 / 增强式",
  strength: "力量",
  mobility: "活动度",
  recovery: "恢复",
  "upper-body": "上肢",
  core: "核心",
  isometric: "等长",
  "basketball-skill": "篮球专项"
};

const statusLabels: Record<TrainingItemCompletionStatus, string> = {
  "not-started": "未开始",
  completed: "完成",
  skipped: "跳过",
  regressed: "降级"
};

const regressionReasons = [
  "跟腱不适",
  "髌腱不适",
  "腘绳肌酸痛",
  "右膝轨迹不稳",
  "右脚外旋明显",
  "睡眠/状态差",
  "时间不够"
];

const trackingFieldLabels: Record<NonNullable<Exercise["trackingFields"]>[number], string> = {
  durationSec: "保持秒数",
  painScore: "疼痛分",
  rightFootControl: "右脚控制",
  rightKneeTracking: "右膝轨迹",
  rpe: "RPE",
  landingQuality: "落地质量",
  landingQuietness: "落地安静",
  rightFootExternalRotation: "右脚外旋",
  pelvisStability: "骨盆稳定",
  holdTwoSeconds: "定住 2 秒",
  weight: "重量",
  reps: "次数",
  topPositionStability: "顶部稳定",
  balanceQuality: "平衡质量",
  contactRhythm: "触地节奏",
  jumpContacts: "跳跃接触",
  takeoffLeg: "起跳腿",
  jumpHeightCm: "跳高 cm",
  reachHeightCm: "摸高 cm"
};

function formatPrescription(item: TrainingItem): string {
  const parts = [
    item.sets ? `${item.sets} 组` : undefined,
    item.reps,
    item.duration,
    item.side ? `侧别：${sideLabels[item.side]}` : undefined,
    item.intensity ? `强度：${intensityLabels[item.intensity]}` : undefined,
    item.rest ? `休息：${item.rest}` : undefined
  ].filter(Boolean);

  return parts.join(" · ");
}

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailTitle}>{title}</Text>
      {items.map((detail, index) => (
        <Text key={`${title}-${index}`} style={styles.detailItem}>
          {index + 1}. {detail}
        </Text>
      ))}
    </View>
  );
}

function InlineExerciseDetails({ exercise }: { exercise: Exercise }) {
  return (
    <View style={styles.details}>
      <Text style={styles.category}>{categoryLabels[exercise.category]}</Text>
      {exercise.sourceNote ? <Text style={styles.sourceNote}>{exercise.sourceNote}</Text> : null}

      <View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>训练目的</Text>
        <Text style={styles.detailParagraph}>{exercise.purpose}</Text>
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>为什么这对我重要</Text>
        <Text style={styles.detailParagraph}>{exercise.whyForUser}</Text>
      </View>

      <DetailList title="步骤" items={exercise.instructions} />
      <DetailList title="关键提示" items={exercise.keyCues} />
      <DetailList title="常见错误" items={exercise.commonMistakes} />
      <DetailList title="降低难度" items={exercise.regressions} />
      <DetailList title="提高难度" items={exercise.progressions} />
      <DetailList title="什么时候退阶" items={exercise.regressionCriteria} />
      <DetailList title="什么时候进阶" items={exercise.progressionCriteria} />
      {exercise.trackingFields?.length ? (
        <View style={styles.detailBlock}>
          <Text style={styles.detailTitle}>本次记录</Text>
          <Text style={styles.detailParagraph}>
            {exercise.trackingFields.map((field) => trackingFieldLabels[field]).join(" / ")}
          </Text>
        </View>
      ) : null}
      <DetailList title="疼痛 / 安全规则" items={exercise.painRules} />
      <ExerciseVideoSection exercise={exercise} compact />
    </View>
  );
}

export function ExerciseRow({ item, logKey, dayLabel, blockTitle }: ExerciseRowProps) {
  const { clearTrainingLogEntry, getTrainingLogEntry, upsertTrainingLogEntry } = useTrainingLog();
  const logId = logKey ?? item.exerciseId;
  const existingLogEntry = getTrainingLogEntry(logId);
  const [status, setStatus] = useState<TrainingItemCompletionStatus>(existingLogEntry?.status ?? "not-started");
  const [expanded, setExpanded] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>(existingLogEntry?.reasons ?? []);
  const [skipNote, setSkipNote] = useState(existingLogEntry?.note ?? "");
  const [actualJumpContacts, setActualJumpContacts] = useState(
    existingLogEntry?.actualJumpContacts !== undefined ? String(existingLogEntry.actualJumpContacts) : ""
  );
  const exercise = getExerciseById(item.exerciseId);
  const completed = status === "completed";

  const toggleExpanded = () => {
    if (!exercise) {
      return;
    }

    setExpanded((value) => !value);
  };

  const writeLogEntry = (nextStatus: TrainingItemCompletionStatus, reasons = selectedReasons, note = skipNote) => {
    if (nextStatus === "not-started") {
      clearTrainingLogEntry(logId);
      return;
    }

    upsertTrainingLogEntry({
      id: logId,
      exerciseId: item.exerciseId,
      exerciseName: exercise?.nameZh ?? `未知动作: ${item.exerciseId}`,
      status: nextStatus,
      dayLabel,
      blockTitle,
      reasons: nextStatus === "regressed" && reasons.length ? reasons : undefined,
      note: nextStatus === "skipped" && note.trim() ? note.trim() : undefined,
      actualJumpContacts: actualJumpContacts.trim() ? Math.max(0, Number(actualJumpContacts) || 0) : undefined,
      maxIntentContacts: item.jumpContacts?.maxIntent && actualJumpContacts.trim()
        ? Math.max(0, Number(actualJumpContacts) || 0)
        : undefined,
      landingOnlyContacts: item.jumpContacts?.landingOnly && actualJumpContacts.trim()
        ? Math.max(0, Number(actualJumpContacts) || 0)
        : undefined
    });
  };

  const setNextStatus = (nextStatus: TrainingItemCompletionStatus) => {
    const resolvedStatus = status === nextStatus ? "not-started" : nextStatus;
    setStatus(resolvedStatus);
    writeLogEntry(resolvedStatus);
    if (resolvedStatus !== "regressed") {
      setSelectedReasons([]);
    }
    if (resolvedStatus !== "skipped") {
      setSkipNote("");
    }
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((current) => {
      const nextReasons = current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason];
      if (status === "regressed") {
        writeLogEntry("regressed", nextReasons, skipNote);
      }
      return nextReasons;
    });
  };

  const updateSkipNote = (note: string) => {
    setSkipNote(note);
    if (status === "skipped") {
      writeLogEntry("skipped", selectedReasons, note);
    }
  };

  const updateActualContacts = (value: string) => {
    const nextValue = value.replace(/[^\d]/g, "");
    setActualJumpContacts(nextValue);
    const nextStatus = status === "not-started" ? "completed" : status;
    if (nextStatus !== status) {
      setStatus(nextStatus);
    }
    const numericValue = nextValue.trim() ? Math.max(0, Number(nextValue) || 0) : undefined;
    upsertTrainingLogEntry({
      id: logId,
      exerciseId: item.exerciseId,
      exerciseName: exercise?.nameZh ?? `未知动作: ${item.exerciseId}`,
      status: nextStatus,
      dayLabel,
      blockTitle,
      reasons: nextStatus === "regressed" && selectedReasons.length ? selectedReasons : undefined,
      note: nextStatus === "skipped" && skipNote.trim() ? skipNote.trim() : undefined,
      actualJumpContacts: numericValue,
      maxIntentContacts: item.jumpContacts?.maxIntent ? numericValue : undefined,
      landingOnlyContacts: item.jumpContacts?.landingOnly ? numericValue : undefined
    });
  };

  return (
    <View
      style={[
        styles.row,
        status === "completed" && styles.completedRow,
        status === "skipped" && styles.skippedRow,
        status === "regressed" && styles.regressedRow,
        !exercise && styles.warningRow
      ]}
    >
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        onPress={() => setNextStatus(completed ? "not-started" : "completed")}
        style={[styles.checkbox, completed && styles.checkboxChecked]}
      >
        <Text style={styles.checkboxText}>{completed ? "✓" : ""}</Text>
      </Pressable>

      <View style={styles.content}>
        <Pressable
          accessibilityRole={exercise ? "button" : "text"}
          accessibilityState={exercise ? { expanded } : undefined}
          disabled={!exercise}
          onPress={toggleExpanded}
          style={styles.summaryTapZone}
        >
          <View style={styles.titleRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.name}>
                {exercise ? exercise.nameZh : `未知动作: ${item.exerciseId}`}
              </Text>
              {exercise?.nameEn ? <Text style={styles.nameEn}>{exercise.nameEn}</Text> : null}
            </View>
            {exercise ? <Text style={styles.chevron}>{expanded ? "⌃" : "›"}</Text> : null}
          </View>
          <Text style={styles.prescription}>{formatPrescription(item)}</Text>
          {item.notes ? <Text style={styles.notes}>{normalizeTrainingCopy(item.notes)}</Text> : null}
          {item.jumpContacts ? (
            <Text style={styles.contactPlan}>
              计入跳跃接触：{item.jumpContacts.min}–{item.jumpContacts.max} 次
              {item.jumpContacts.estimated ? "（未输入时为估算）" : ""}
              {item.jumpContacts.landingOnly ? " · 落地接触" : ""}
              {item.jumpContacts.maxIntent ? " · 最大意图" : ""}
            </Text>
          ) : null}
          <View style={styles.statusRow}>
            <Text style={[styles.statusPill, styles[`status-${status}`]]}>{statusLabels[status]}</Text>
            {exercise ? (
              <Text style={styles.tapHint}>
                {expanded ? "点击收起动作原因、指导和注意事项" : "查看指导 ›"}
              </Text>
            ) : null}
          </View>
          {exercise && expanded ? <Text style={styles.expandHint}>收起动作细节</Text> : null}
        </Pressable>
        <View style={styles.actionRow}>
          {(["completed", "regressed", "skipped"] as TrainingItemCompletionStatus[]).map((nextStatus) => (
            <Pressable
              key={nextStatus}
              style={[styles.statusButton, status === nextStatus && styles.statusButtonActive]}
              onPress={() => setNextStatus(nextStatus)}
            >
              <Text style={[styles.statusButtonText, status === nextStatus && styles.statusButtonTextActive]}>
                {statusLabels[nextStatus]}
              </Text>
            </Pressable>
          ))}
        </View>
        {item.jumpContacts ? (
          <View style={styles.contactInputRow}>
            <Text style={styles.contactInputLabel}>实际完成接触次数</Text>
            <TextInput
              style={styles.contactInput}
              value={actualJumpContacts}
              onChangeText={updateActualContacts}
              keyboardType="numeric"
              placeholder="输入次数"
            />
          </View>
        ) : null}
        {status === "regressed" ? (
          <View style={styles.reasonWrap}>
            {regressionReasons.map((reason) => (
              <Pressable
                key={reason}
                style={[styles.reasonChip, selectedReasons.includes(reason) && styles.reasonChipActive]}
                onPress={() => toggleReason(reason)}
              >
                <Text style={[styles.reasonText, selectedReasons.includes(reason) && styles.reasonTextActive]}>
                  {reason}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        {status === "skipped" ? (
          <TextInput
            style={styles.skipInput}
            value={skipNote}
            onChangeText={updateSkipNote}
            placeholder="跳过原因，可选"
            multiline
          />
        ) : null}
        {expanded && exercise ? <InlineExerciseDetails exercise={exercise} /> : null}
        {!exercise ? <Text style={styles.warningText}>请检查训练数据中的 exerciseId。</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 10
  },
  completedRow: {
    opacity: 0.72
  },
  skippedRow: {
    borderColor: "#d0d7de",
    backgroundColor: "#f6f8fa"
  },
  regressedRow: {
    borderColor: "#d29922",
    backgroundColor: "#fff8c5"
  },
  warningRow: {
    borderColor: "#f0a500",
    backgroundColor: "#fff8e6"
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#8c99a8",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2
  },
  checkboxChecked: {
    backgroundColor: "#116329",
    borderColor: "#116329"
  },
  checkboxText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700"
  },
  content: {
    flex: 1
  },
  summaryTapZone: {
    minHeight: 44
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8
  },
  titleWrap: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2328"
  },
  chevron: {
    fontSize: 24,
    lineHeight: 26,
    color: "#0969da",
    fontWeight: "900"
  },
  nameEn: {
    marginTop: 2,
    fontSize: 13,
    color: "#57606a"
  },
  prescription: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#24292f"
  },
  notes: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 18,
    color: "#6e7781"
  },
  contactPlan: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 17,
    color: "#6e5500",
    fontWeight: "800"
  },
  statusRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden"
  },
  "status-not-started": {
    backgroundColor: "#eaeef2",
    color: "#57606a"
  },
  "status-completed": {
    backgroundColor: "#dafbe1",
    color: "#116329"
  },
  "status-skipped": {
    backgroundColor: "#eaeef2",
    color: "#57606a"
  },
  "status-regressed": {
    backgroundColor: "#fff8c5",
    color: "#6e5500"
  },
  tapHint: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 17,
    color: "#0969da",
    fontWeight: "900"
  },
  actionRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap"
  },
  contactInputRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  contactInputLabel: {
    flex: 1,
    fontSize: 13,
    color: "#24292f",
    fontWeight: "800"
  },
  contactInput: {
    width: 104,
    minHeight: 44,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff",
    textAlign: "center"
  },
  statusButton: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center"
  },
  statusButtonActive: {
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  statusButtonText: {
    color: "#57606a",
    fontSize: 13,
    fontWeight: "900"
  },
  statusButtonTextActive: {
    color: "#0969da"
  },
  reasonWrap: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  reasonChip: {
    minHeight: 36,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff"
  },
  reasonChipActive: {
    borderColor: "#d29922",
    backgroundColor: "#fff1a7"
  },
  reasonText: {
    fontSize: 12,
    color: "#57606a",
    fontWeight: "800"
  },
  reasonTextActive: {
    color: "#6e5500"
  },
  skipInput: {
    marginTop: 10,
    minHeight: 44,
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
  expandHint: {
    marginTop: 8,
    fontSize: 13,
    color: "#0969da",
    fontWeight: "800"
  },
  details: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d8dee4"
  },
  category: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 8
  },
  sourceNote: {
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#fff8c5",
    color: "#6e5500",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8
  },
  detailBlock: {
    marginTop: 10
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 5
  },
  detailParagraph: {
    fontSize: 14,
    lineHeight: 21,
    color: "#24292f"
  },
  detailItem: {
    fontSize: 14,
    lineHeight: 21,
    color: "#24292f",
    marginBottom: 4
  },
  warningText: {
    marginTop: 6,
    fontSize: 13,
    color: "#9a6700"
  }
});
