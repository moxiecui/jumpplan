import { StyleSheet, Text, View } from "react-native";

import type {
  DailyTrainingAdjustment,
  OuraDailyReadinessInput,
  SubjectiveReadinessInput
} from "@/types/training";

interface ReadinessIntelligenceCardProps {
  adjustment: DailyTrainingAdjustment;
  oura?: OuraDailyReadinessInput;
  subjective?: SubjectiveReadinessInput;
}

const levelStyles = {
  green: {
    label: "Green",
    backgroundColor: "#dafbe1",
    borderColor: "#2da44e"
  },
  yellow: {
    label: "Yellow",
    backgroundColor: "#fff8c5",
    borderColor: "#bf8700"
  },
  red: {
    label: "Red",
    backgroundColor: "#ffebe9",
    borderColor: "#cf222e"
  }
};

function metricValue(value?: number, suffix = "") {
  return typeof value === "number" ? `${value}${suffix}` : "未填写";
}

function getSubjectiveFlags(subjective?: SubjectiveReadinessInput) {
  if (!subjective) {
    return ["未填写主观肌腱输入。"];
  }

  const flags = [
    subjective.achillesStiffness >= 3 ? `跟腱晨僵 ${subjective.achillesStiffness}/10` : undefined,
    subjective.patellarPain >= 3 ? `髌腱疼痛 ${subjective.patellarPain}/10` : undefined,
    subjective.calfTightness >= 4 ? `小腿紧张 ${subjective.calfTightness}/10` : undefined,
    subjective.sleepQuality <= 2 ? `睡眠主观质量 ${subjective.sleepQuality}/5` : undefined
  ].filter(Boolean);

  return flags.length > 0 ? flags : ["主观肌腱输入没有明显预警。"];
}

export function ReadinessIntelligenceCard({
  adjustment,
  oura,
  subjective
}: ReadinessIntelligenceCardProps) {
  const meta = levelStyles[adjustment.level];
  const subjectiveFlags = getSubjectiveFlags(subjective);

  return (
    <View style={[styles.card, { backgroundColor: meta.backgroundColor, borderColor: meta.borderColor }]}>
      <View style={styles.header}>
        <Text style={styles.title}>今日训练建议</Text>
        <Text style={styles.level}>{meta.label}</Text>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>Oura 恢复分</Text>
          <Text style={styles.metricValue}>{metricValue(oura?.readinessScore)}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>静息心率</Text>
          <Text style={styles.metricValue}>{metricValue(oura?.restingHeartRate, " bpm")}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>HRV</Text>
          <Text style={styles.metricValue}>{metricValue(oura?.hrv, " ms")}</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>睡眠分</Text>
          <Text style={styles.metricValue}>{metricValue(oura?.sleepScore)}</Text>
        </View>
      </View>

      <Text style={styles.headline}>{adjustment.headline}</Text>
      <Text style={styles.explanation}>{adjustment.explanation}</Text>

      <Text style={styles.sectionTitle}>需要调整的地方</Text>
      {adjustment.modifications.map((modification) => (
        <Text key={modification} style={styles.listItem}>
          • {modification}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>主观肌腱信号</Text>
      {subjectiveFlags.map((flag) => (
        <Text key={flag} style={styles.listItem}>
          • {flag}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>注意信号</Text>
      {(adjustment.cautionFlags.length > 0
        ? adjustment.cautionFlags
        : ["没有额外注意信号；训练中仍然以疼痛和动作质量为准。"]
      ).map((flag) => (
        <Text key={flag} style={styles.listItem}>
          • {flag}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginTop: 18
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  level: {
    fontSize: 13,
    fontWeight: "900",
    color: "#1f2328"
  },
  metricsGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  metric: {
    width: "47%",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(31,35,40,0.12)"
  },
  metricLabel: {
    fontSize: 12,
    color: "#57606a",
    fontWeight: "700"
  },
  metricValue: {
    marginTop: 4,
    fontSize: 16,
    color: "#1f2328",
    fontWeight: "900"
  },
  headline: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  explanation: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: "#24292f"
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "900",
    color: "#1f2328"
  },
  listItem: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  }
});
