import { StyleSheet, Text, View } from "react-native";

import { ExerciseVideoSection } from "@/components/ExerciseVideoSection";
import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { getExerciseById } from "@/data/exercises";
import { getSafeAlternativeExerciseIds } from "@/logic/advancedExerciseGates";
import { findGlossaryTermsInText, getGlossaryEntriesByIds } from "@/logic/glossary";
import type { Exercise } from "@/types/training";

interface ExerciseDetailViewProps {
  exercise: Exercise;
}

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
  power: "爆发力",
  hamstring: "腘绳肌",
  "basketball-skill": "篮球专项"
};

const riskTierLabels: NonNullable<Record<NonNullable<Exercise["riskTier"]>, string>> = {
  low: "基础 / 低风险",
  moderate: "中等进阶",
  high: "高冲击 / 需把关",
  "advanced-only": "Advanced-only / 可选"
};

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {items.map((item, index) => (
        <Text key={`${title}-${index}`} style={styles.listItem}>
          {index + 1}. {item}
        </Text>
      ))}
    </View>
  );
}

function getRelatedTermsForExercise(exercise: Exercise) {
  const text = [
    exercise.id,
    exercise.nameZh,
    exercise.nameEn,
    exercise.category,
    exercise.purpose,
    exercise.whyForUser,
    exercise.videoNote,
    exercise.youtubeSearchQuery,
    ...(exercise.instructions ?? []),
    ...(exercise.keyCues ?? []),
    ...(exercise.commonMistakes ?? []),
    ...(exercise.regressions ?? []),
    ...(exercise.progressions ?? []),
    ...(exercise.painRules ?? [])
  ]
    .filter(Boolean)
    .join(" ");
  const detected = findGlossaryTermsInText(text);
  const manualIds =
    exercise.id === "cmj"
      ? ["cmj", "ssc", "rfd", "plyometric"]
      : exercise.id === "approach-jump"
        ? ["cmj", "rfd", "ssc", "plyometric"]
        : exercise.id === "trap-bar-deadlift"
          ? ["rpe", "pap", "complex-training"]
          : [];
  const manual = getGlossaryEntriesByIds(manualIds);
  const byId = new Map([...manual, ...detected].map((entry) => [entry.id, entry]));
  return [...byId.values()];
}

export function ExerciseDetailView({ exercise }: ExerciseDetailViewProps) {
  const relatedTerms = getRelatedTermsForExercise(exercise);
  const alternatives = getSafeAlternativeExerciseIds(exercise)
    .map((id) => getExerciseById(id))
    .filter((item): item is Exercise => Boolean(item));

  return (
    <View style={styles.container}>
      <Text style={styles.nameZh}>{exercise.nameZh}</Text>
      {exercise.nameEn ? <Text style={styles.nameEn}>{exercise.nameEn}</Text> : null}
      <Text style={styles.category}>{categoryLabels[exercise.category]}</Text>
      {exercise.riskTier ? <Text style={styles.riskTier}>{riskTierLabels[exercise.riskTier]}</Text> : null}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>训练目的</Text>
        <Text style={styles.paragraph}>{exercise.purpose}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>为什么这对我重要</Text>
        <Text style={styles.paragraph}>{exercise.whyForUser}</Text>
      </View>

      <DetailList title="步骤" items={exercise.instructions} />
      <DetailList title="关键提示" items={exercise.keyCues} />
      <DetailList title="常见错误" items={exercise.commonMistakes} />
      <DetailList title="降低难度" items={exercise.regressions} />
      <DetailList title="提高难度" items={exercise.progressions} />
      <DetailList title="Readiness 使用条件" items={exercise.readinessGates} />
      {alternatives.length ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>安全替代动作</Text>
          <Text style={styles.paragraph}>{alternatives.map((item) => item.nameZh).join(" / ")}</Text>
        </View>
      ) : null}
      <DetailList title="疼痛 / 安全规则" items={exercise.painRules} />
      <RelatedTermsSection terms={relatedTerms} defaultExpanded />
      <ExerciseVideoSection exercise={exercise} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4
  },
  nameZh: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1f2328"
  },
  nameEn: {
    fontSize: 16,
    color: "#57606a",
    marginTop: 2
  },
  category: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "700"
  },
  riskTier: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#fff8c5",
    color: "#6e5500",
    fontSize: 12,
    fontWeight: "800"
  },
  block: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#d8dee4",
    borderRadius: 8,
    backgroundColor: "#ffffff"
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1f2328",
    marginBottom: 8
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: "#24292f"
  },
  listItem: {
    fontSize: 15,
    lineHeight: 23,
    color: "#24292f",
    marginBottom: 6
  }
});
