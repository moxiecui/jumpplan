import { StyleSheet, Text, View } from "react-native";

import { frenchContrastGuidance } from "@/data/frenchContrast";
import type { ReadinessEntry } from "@/context/ReadinessContext";
import type { TrainingDay } from "@/types/training";

interface FrenchContrastGuidanceCardProps {
  day: TrainingDay;
  readinessEntry?: ReadinessEntry;
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {items.map((item) => (
        <Text key={item} style={styles.item}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

function getStatus(readinessEntry?: ReadinessEntry) {
  const achilles = readinessEntry?.subjective?.achillesStiffness ?? 0;
  const patellar = readinessEntry?.subjective?.patellarPain ?? 0;
  const worstTendon = Math.max(achilles, patellar);

  if (!readinessEntry) {
    return {
      label: "先完成今日状态",
      tone: "neutral" as const,
      text: "没有今天的肌腱状态时，只把这个模块当成阅读参考，不要临时加高强度转化训练。"
    };
  }

  if (worstTendon >= 4 || readinessEntry.adjustment.adjustmentType === "recovery-only") {
    return {
      label: "今天不做",
      tone: "red" as const,
      text: "跟腱或髌腱已经进入恢复优先范围。今天改成恢复或肌腱安全训练。"
    };
  }

  if (worstTendon >= 3 || readinessEntry.adjustment.level !== "green") {
    return {
      label: "不建议",
      tone: "yellow" as const,
      text: "肌腱或 readiness 信号不够干净。取消 French Contrast、PAP 和最大跳，保留低量技术或力量控制。"
    };
  }

  return {
    label: "可选安全版本",
    tone: "green" as const,
    text: "今天仅可考虑低量安全版本。完整 French Contrast 仍然应很少使用，最多 2-3 周一次。"
  };
}

export function FrenchContrastGuidanceCard({ day, readinessEntry }: FrenchContrastGuidanceCardProps) {
  if (day.contrastModuleId !== frenchContrastGuidance.id) {
    return null;
  }

  const status = getStatus(readinessEntry);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{frenchContrastGuidance.title}</Text>
          <Text style={styles.subtitle}>{frenchContrastGuidance.subtitle}</Text>
        </View>
        <Text style={[styles.badge, styles[status.tone]]}>{status.label}</Text>
      </View>

      <Text style={styles.summary}>{frenchContrastGuidance.summary}</Text>
      <Text style={styles.statusText}>{status.text}</Text>

      <DetailList title="使用频率 / 放置规则" items={frenchContrastGuidance.frequencyRules} />
      <DetailList title="推荐安全版本" items={frenchContrastGuidance.safeVersion} />
      <DetailList title="肌腱与 readiness 规则" items={frenchContrastGuidance.tendonRules} />
      <DetailList title="立刻停止条件" items={frenchContrastGuidance.stopRules} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start"
  },
  titleWrap: {
    flex: 1
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "800",
    color: "#57606a"
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "900",
    overflow: "hidden"
  },
  green: {
    backgroundColor: "#dafbe1",
    color: "#116329"
  },
  yellow: {
    backgroundColor: "#fff8c5",
    color: "#6e5500"
  },
  red: {
    backgroundColor: "#ffebe9",
    color: "#cf222e"
  },
  neutral: {
    backgroundColor: "#eaeef2",
    color: "#24292f"
  },
  summary: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  },
  statusText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a",
    fontWeight: "800"
  },
  block: {
    marginTop: 14
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 6
  },
  item: {
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f",
    marginBottom: 4
  }
});
