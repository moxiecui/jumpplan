import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useBodySignals } from "@/context/BodySignalsContext";
import { useSessionProgress } from "@/context/SessionProgressContext";
import { calculateRollingJumpBaseline, evaluateJumpReadiness } from "@/logic/jumpReadiness";
import type { JumpReadinessTest } from "@/types/training";

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function parseNumber(value: string) {
  const next = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(next) ? next : 0;
}

function parseScore(value: string, min: number, max: number) {
  return Math.min(Math.max(Math.round(parseNumber(value)), min), max);
}

export default function JumpReadinessScreen() {
  const { jumpReadinessTests, saveJumpReadinessTest } = useSessionProgress();
  const { getBodySignals } = useBodySignals();
  const [attempts, setAttempts] = useState(["", "", ""]);
  const [measurementType, setMeasurementType] = useState<JumpReadinessTest["measurementType"]>("jump-height-cm");
  const [perceivedExplosiveness, setPerceivedExplosiveness] = useState("4");
  const [landingQuality, setLandingQuality] = useState("4");
  const [invalid, setInvalid] = useState(false);
  const [painful, setPainful] = useState(false);
  const [afterHardTraining, setAfterHardTraining] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const date = todayDate();
  const bodySignals = getBodySignals(date);
  const baseline = useMemo(() => calculateRollingJumpBaseline(jumpReadinessTests), [jumpReadinessTests]);
  const bestValue = Math.max(...attempts.map(parseNumber));
  const test = useMemo<JumpReadinessTest>(
    () => ({
      date,
      attempts: attempts.map(parseNumber).filter((value) => value > 0),
      measurementType,
      bestValue,
      baselineValue: baseline,
      percentChangeFromBaseline: baseline && baseline > 0 ? ((bestValue - baseline) / baseline) * 100 : undefined,
      perceivedExplosiveness: parseScore(perceivedExplosiveness, 1, 5) as 1 | 2 | 3 | 4 | 5,
      landingQuality: parseScore(landingQuality, 1, 5) as 1 | 2 | 3 | 4 | 5,
      invalid,
      painful,
      afterHardTraining,
      notes
    }),
    [afterHardTraining, attempts, baseline, bestValue, date, invalid, landingQuality, measurementType, notes, painful, perceivedExplosiveness]
  );
  const result = useMemo(
    () =>
      evaluateJumpReadiness(test, {
        anteriorKneeSoreness: bodySignals?.painAndMovement?.anteriorKneeSoreness,
        achillesStiffness: bodySignals?.painAndMovement?.achillesStiffness,
        patellarPain: bodySignals?.painAndMovement?.patellarPain,
        hamstringSoreness: bodySignals?.painAndMovement?.hamstringSoreness,
        basketballLoadLast24h: bodySignals?.basketballLoad?.loadLevel,
        movementQualityToday: bodySignals?.painAndMovement?.movementQualityToday
      }),
    [bodySignals, test]
  );

  const save = () => {
    saveJumpReadinessTest(test, result);
    setSavedMessage("已保存 Jump Readiness。3 次 readiness jumps 已计入今天的跳跃接触观察。");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Jump Readiness</Text>
      <Text style={styles.subtitle}>
        记录 3 次低疲劳 CMJ。它只是神经肌肉 readiness 信号，不是诊断；疼痛、落地和动作质量永远优先。
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>测量方式</Text>
        <View style={styles.toggleRow}>
          {(["jump-height-cm", "touch-height-cm"] as const).map((type) => (
            <Pressable
              key={type}
              style={[styles.toggle, measurementType === type && styles.toggleActive]}
              onPress={() => setMeasurementType(type)}
            >
              <Text style={[styles.toggleText, measurementType === type && styles.toggleTextActive]}>
                {type === "jump-height-cm" ? "跳高 cm" : "摸高 cm"}
              </Text>
            </Pressable>
          ))}
        </View>

        {attempts.map((value, index) => (
          <View key={index} style={styles.inputRow}>
            <Text style={styles.label}>第 {index + 1} 次</Text>
            <TextInput
              keyboardType="numeric"
              value={value}
              onChangeText={(next) => setAttempts((current) => current.map((item, itemIndex) => (itemIndex === index ? next : item)))}
              placeholder="cm"
              style={styles.input}
            />
          </View>
        ))}

        <View style={styles.inputRow}>
          <Text style={styles.label}>爆发感觉 1–5</Text>
          <TextInput keyboardType="numeric" value={perceivedExplosiveness} onChangeText={setPerceivedExplosiveness} style={styles.input} />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>落地质量 1–5</Text>
          <TextInput keyboardType="numeric" value={landingQuality} onChangeText={setLandingQuality} style={styles.input} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>有效性标记</Text>
        {[
          { label: "这次测试无效", value: invalid, setter: setInvalid },
          { label: "测试中疼痛", value: painful, setter: setPainful },
          { label: "硬训练后测试", value: afterHardTraining, setter: setAfterHardTraining }
        ].map((option) => (
          <Pressable key={option.label} style={[styles.toggle, option.value && styles.toggleActive]} onPress={() => option.setter(!option.value)}>
            <Text style={[styles.toggleText, option.value && styles.toggleTextActive]}>{option.label}</Text>
          </Pressable>
        ))}
        <TextInput value={notes} onChangeText={setNotes} placeholder="备注，可选" multiline style={[styles.input, styles.notes]} />
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.cardTitle}>结果</Text>
        <Text style={styles.resultLevel}>{result.level.toUpperCase()} · {result.recommendation}</Text>
        <Text style={styles.resultText}>Best: {bestValue || "未填"} cm</Text>
        <Text style={styles.resultText}>Rolling baseline: {baseline ? baseline.toFixed(1) : "有效测试不足"}</Text>
        <Text style={styles.resultText}>
          Change: {result.percentChange !== undefined ? `${result.percentChange.toFixed(1)}%` : "未知"}
        </Text>
        {result.reasons.map((reason) => (
          <Text key={reason} style={styles.reason}>• {reason}</Text>
        ))}
      </View>

      <Pressable style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>保存 Jump Readiness</Text>
      </Pressable>
      {savedMessage ? <Text style={styles.saved}>{savedMessage}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, paddingBottom: 96 },
  title: { fontSize: 30, fontWeight: "900", color: "#1f2328" },
  subtitle: { marginTop: 8, fontSize: 15, lineHeight: 22, color: "#57606a" },
  card: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff" },
  resultCard: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#0969da", backgroundColor: "#ddf4ff" },
  cardTitle: { fontSize: 17, fontWeight: "900", color: "#1f2328" },
  toggleRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  toggle: { minHeight: 44, marginTop: 10, paddingVertical: 12, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#0969da", alignItems: "center" },
  toggleActive: { backgroundColor: "#0969da" },
  toggleText: { color: "#0969da", fontWeight: "900" },
  toggleTextActive: { color: "#fff" },
  inputRow: { marginTop: 12 },
  label: { fontSize: 14, fontWeight: "800", color: "#24292f" },
  input: { minHeight: 44, marginTop: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#f6f8fa", fontSize: 16 },
  notes: { minHeight: 80, textAlignVertical: "top", paddingTop: 10 },
  resultLevel: { marginTop: 10, fontSize: 15, fontWeight: "900", color: "#0969da" },
  resultText: { marginTop: 6, fontSize: 14, color: "#24292f", fontWeight: "700" },
  reason: { marginTop: 6, fontSize: 14, lineHeight: 20, color: "#24292f" },
  saveButton: { minHeight: 44, marginTop: 20, paddingVertical: 12, borderRadius: 8, backgroundColor: "#0969da", alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "900" },
  saved: { marginTop: 10, fontSize: 14, color: "#116329", fontWeight: "800", textAlign: "center" }
});
