import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ReadinessIntelligenceCard } from "@/components/ReadinessIntelligenceCard";
import { BasketballLoadLogger } from "@/components/BasketballLoadLogger";
import { useReadiness } from "@/context/ReadinessContext";
import { evaluateDailyReadiness } from "@/logic/readinessScore";
import { getTodayTrainingDay } from "@/logic/schedule";
import type {
  BasketballLoadLevel,
  OuraDailyReadinessInput,
  SubjectiveReadinessInput
} from "@/types/training";

type SubjectiveField =
  | "achillesStiffness"
  | "patellarPain"
  | "calfTightness"
  | "sleepQuality"
  | "hamstringSoreness"
  | "upperBodySoreness"
  | "generalDoms"
  | "generalFatigue"
  | "movementQualityToday"
  | "rightFootExternalRotation"
  | "rightFootControl"
  | "rightKneeTracking";
type OuraField = "readinessScore" | "restingHeartRate" | "hrv" | "sleepScore";
type BaselineField = "restingHeartRate" | "hrv";

const subjectiveLabels: Record<SubjectiveField, { label: string; min: number; max: number }> = {
  achillesStiffness: { label: "跟腱晨僵", min: 0, max: 10 },
  patellarPain: { label: "髌腱疼痛", min: 0, max: 10 },
  calfTightness: { label: "小腿紧绷", min: 0, max: 10 },
  sleepQuality: { label: "睡眠质量", min: 1, max: 5 },
  hamstringSoreness: { label: "腘绳肌酸痛", min: 0, max: 10 },
  upperBodySoreness: { label: "上肢酸痛", min: 0, max: 10 },
  generalDoms: { label: "全身 DOMS", min: 0, max: 10 },
  generalFatigue: { label: "整体疲劳", min: 1, max: 5 },
  movementQualityToday: { label: "今日动作质量", min: 1, max: 5 },
  rightFootExternalRotation: { label: "右脚外旋", min: 0, max: 3 },
  rightFootControl: { label: "右脚控制", min: 1, max: 5 },
  rightKneeTracking: { label: "右膝轨迹", min: 1, max: 5 }
};

const loadOptions: BasketballLoadLevel[] = ["none", "light", "moderate", "high"];
const loadLabels: Record<BasketballLoadLevel, string> = {
  none: "无",
  light: "轻",
  moderate: "中等",
  high: "高"
};

const ouraLabels: Record<OuraField, { label: string; min: number; max: number; suffix?: string }> = {
  readinessScore: { label: "Oura readiness score", min: 0, max: 100 },
  restingHeartRate: { label: "Resting heart rate", min: 30, max: 120, suffix: "bpm" },
  hrv: { label: "HRV", min: 5, max: 250, suffix: "ms" },
  sleepScore: { label: "Sleep score", min: 0, max: 100 }
};

const baselineLabels: Record<BaselineField, { label: string; min: number; max: number; suffix?: string }> = {
  restingHeartRate: { label: "Baseline resting HR", min: 30, max: 120, suffix: "bpm" },
  hrv: { label: "Baseline HRV", min: 5, max: 250, suffix: "ms" }
};

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

function parseOptional(rawValue: string, min: number, max: number): number | undefined {
  if (rawValue.trim() === "") {
    return undefined;
  }

  return clamp(Number(rawValue.replace(/[^\d.]/g, "")), min, max);
}

export default function CheckInScreen() {
  const day = getTodayTrainingDay();
  const { saveReadinessEntry } = useReadiness();
  const [savedMessage, setSavedMessage] = useState("");
  const [subjective, setSubjective] = useState<SubjectiveReadinessInput>({
    date: todayDate(),
    achillesStiffness: 0,
    patellarPain: 0,
    calfTightness: 0,
    sleepQuality: 4,
    hamstringSoreness: 0,
    upperBodySoreness: 0,
    generalDoms: 0,
    generalFatigue: 2,
    movementQualityToday: 4,
    rightFootExternalRotation: 0,
    rightFootControl: 4,
    rightKneeTracking: 4,
    legsFeelHeavy: false,
    basketballLoadLast24h: "none",
    basketballLoadLast48h: "none"
  });
  const [ouraValues, setOuraValues] = useState<Record<OuraField, string>>({
    readinessScore: "",
    restingHeartRate: "",
    hrv: "",
    sleepScore: ""
  });
  const [baselineValues, setBaselineValues] = useState<Record<BaselineField, string>>({
    restingHeartRate: "",
    hrv: ""
  });

  const oura = useMemo<OuraDailyReadinessInput>(() => {
    const readinessScore = parseOptional(ouraValues.readinessScore, 0, 100);
    const restingHeartRate = parseOptional(ouraValues.restingHeartRate, 30, 120);
    const hrv = parseOptional(ouraValues.hrv, 5, 250);
    const sleepScore = parseOptional(ouraValues.sleepScore, 0, 100);

    return {
      date: subjective.date,
      readinessScore,
      restingHeartRate,
      hrv,
      sleepScore,
      source: "manual"
    };
  }, [ouraValues, subjective.date]);

  const baseline = useMemo(
    () => ({
      restingHeartRate: parseOptional(baselineValues.restingHeartRate, 30, 120),
      hrv: parseOptional(baselineValues.hrv, 5, 250)
    }),
    [baselineValues]
  );

  const adjustment = useMemo(
    () =>
      evaluateDailyReadiness({
        oura,
        subjective,
        dayType: day.type,
        baseline
      }),
    [baseline, day.type, oura, subjective]
  );

  const updateSubjectiveValue = (field: SubjectiveField, rawValue: string) => {
    const config = subjectiveLabels[field];
    const nextValue = clamp(Number(rawValue.replace(/[^\d.]/g, "")), config.min, config.max);

    setSubjective((current) => ({
      ...current,
      [field]:
        field === "sleepQuality" || field === "generalFatigue" || field === "movementQualityToday"
          || field === "rightFootExternalRotation" || field === "rightFootControl" || field === "rightKneeTracking"
          ? Math.round(nextValue)
          : nextValue
    }));
    setSavedMessage("");
  };

  const saveEntry = () => {
    saveReadinessEntry({
      date: subjective.date,
      oura,
      subjective,
      baseline,
      adjustment
    });
    setSavedMessage("已保存今天的 Readiness 评估。");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>今日状态</Text>
      <Text style={styles.subtitle}>
        手动输入 Oura 风格数据和肌腱状态。Oura 只是参考信号，疼痛和动作质量优先。
      </Text>

      <Text style={styles.sectionTitle}>Oura / readiness 手动输入</Text>
      {(Object.keys(ouraLabels) as OuraField[]).map((field) => {
        const config = ouraLabels[field];

        return (
          <View key={field} style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>{config.label}</Text>
              <Text style={styles.range}>
                {config.min}–{config.max} {config.suffix ?? ""}
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              value={ouraValues[field]}
              onChangeText={(text) => {
                setOuraValues((current) => ({ ...current, [field]: text }));
                setSavedMessage("");
              }}
              placeholder="可留空"
              style={styles.input}
            />
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>个人基线（可选）</Text>
      {(Object.keys(baselineLabels) as BaselineField[]).map((field) => {
        const config = baselineLabels[field];

        return (
          <View key={field} style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>{config.label}</Text>
              <Text style={styles.range}>
                {config.min}–{config.max} {config.suffix ?? ""}
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              value={baselineValues[field]}
              onChangeText={(text) => {
                setBaselineValues((current) => ({ ...current, [field]: text }));
                setSavedMessage("");
              }}
              placeholder="用于比较今天偏离程度"
              style={styles.input}
            />
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>主观肌腱 / 疲劳输入</Text>
      {(Object.keys(subjectiveLabels) as SubjectiveField[]).map((field) => {
        const config = subjectiveLabels[field];

        return (
          <View key={field} style={styles.inputCard}>
            <View style={styles.inputHeader}>
              <Text style={styles.label}>{config.label}</Text>
              <Text style={styles.range}>
                {config.min}–{config.max}
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              value={String(subjective[field])}
              onChangeText={(text) => updateSubjectiveValue(field, text)}
              style={styles.input}
            />
          </View>
        );
      })}

      <Pressable
        style={[styles.binaryButton, subjective.legsFeelHeavy && styles.binaryButtonActive]}
        onPress={() => setSubjective((current) => ({ ...current, legsFeelHeavy: !current.legsFeelHeavy }))}
      >
        <Text style={[styles.binaryText, subjective.legsFeelHeavy && styles.binaryTextActive]}>
          今天双腿感觉沉重
        </Text>
      </Pressable>

      {(["basketballLoadLast24h", "basketballLoadLast48h"] as const).map((field) => (
        <View key={field} style={styles.loadCard}>
          <Text style={styles.label}>{field === "basketballLoadLast24h" ? "过去 24 小时篮球负荷" : "过去 48 小时篮球负荷"}</Text>
          <View style={styles.loadRow}>
            {loadOptions.map((option) => (
              <Pressable
                key={option}
                style={[styles.loadButton, subjective[field] === option && styles.loadButtonActive]}
                onPress={() => setSubjective((current) => ({ ...current, [field]: option }))}
              >
                <Text style={[styles.loadText, subjective[field] === option && styles.loadTextActive]}>{loadLabels[option]}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <BasketballLoadLogger date={subjective.date} />

      <ReadinessIntelligenceCard adjustment={adjustment} oura={oura} subjective={subjective} />

      <Pressable style={styles.saveButton} onPress={saveEntry}>
        <Text style={styles.saveButtonText}>保存今日评估</Text>
      </Pressable>
      {savedMessage ? <Text style={styles.savedMessage}>{savedMessage}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a"
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  inputCard: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 12
  },
  inputHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center"
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: "#1f2328"
  },
  range: {
    fontSize: 13,
    color: "#57606a",
    fontWeight: "700"
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: "#1f2328",
    backgroundColor: "#f6f8fa"
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900"
  },
  savedMessage: {
    marginTop: 10,
    color: "#116329",
    fontSize: 14,
    fontWeight: "800"
  },
  binaryButton: {
    minHeight: 44,
    marginTop: 4,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff"
  },
  binaryButtonActive: {
    borderColor: "#d29922",
    backgroundColor: "#fff8c5"
  },
  binaryText: {
    color: "#57606a",
    fontWeight: "900"
  },
  binaryTextActive: {
    color: "#6e5500"
  },
  loadCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  loadRow: {
    marginTop: 9,
    flexDirection: "row",
    gap: 7
  },
  loadButton: {
    minHeight: 44,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de"
  },
  loadButtonActive: {
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  loadText: {
    color: "#57606a",
    fontWeight: "800"
  },
  loadTextActive: {
    color: "#0969da"
  }
});
