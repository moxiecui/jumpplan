import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getExerciseById } from "@/data/exercises";
import { ExerciseVideoSection } from "@/components/ExerciseVideoSection";
import type { Exercise, Intensity, TrainingItem } from "@/types/training";

interface ExerciseRowProps {
  item: TrainingItem;
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
      <DetailList title="疼痛 / 安全规则" items={exercise.painRules} />
      <ExerciseVideoSection exercise={exercise} compact />
    </View>
  );
}

export function ExerciseRow({ item }: ExerciseRowProps) {
  const [completed, setCompleted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const exercise = getExerciseById(item.exerciseId);

  const toggleExpanded = () => {
    if (!exercise) {
      return;
    }

    setExpanded((value) => !value);
  };

  return (
    <View style={[styles.row, completed && styles.completedRow, !exercise && styles.warningRow]}>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: completed }}
        onPress={() => setCompleted((value) => !value)}
        style={[styles.checkbox, completed && styles.checkboxChecked]}
      >
        <Text style={styles.checkboxText}>{completed ? "✓" : ""}</Text>
      </Pressable>

      <Pressable
        accessibilityRole={exercise ? "button" : "text"}
        accessibilityState={exercise ? { expanded } : undefined}
        disabled={!exercise}
        onPress={toggleExpanded}
        style={styles.content}
      >
        <Text style={styles.name}>
          {exercise ? exercise.nameZh : `未知动作: ${item.exerciseId}`}
        </Text>
        {exercise?.nameEn ? <Text style={styles.nameEn}>{exercise.nameEn}</Text> : null}
        <Text style={styles.prescription}>{formatPrescription(item)}</Text>
        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
        {exercise ? (
          <Text style={styles.expandHint}>{expanded ? "收起动作细节" : "展开动作细节"}</Text>
        ) : null}
        {expanded && exercise ? <InlineExerciseDetails exercise={exercise} /> : null}
        {!exercise ? <Text style={styles.warningText}>请检查训练数据中的 exerciseId。</Text> : null}
      </Pressable>
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
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2328"
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
