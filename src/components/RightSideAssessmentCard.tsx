import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePerformance } from "@/context/PerformanceContext";
import { rightSideAssessmentProtocol } from "@/data/rightSideAssessment";
import type { RightSideAssessment } from "@/types/training";

type NumericField = Exclude<keyof RightSideAssessment, "date" | "dayNumber" | "holdTwoSeconds" | "notes">;

export function RightSideAssessmentCard({ date, dayNumber }: { date: string; dayNumber: 1 | 14 | 20 | 21 }) {
  const { saveAssessment } = usePerformance();
  const [values, setValues] = useState<Record<NumericField, number>>({
    rightFootExternalRotation: 0,
    rightKneeValgus: 0,
    pelvisStability: 3,
    landingQuietness: 3,
    shiftTowardLeft: 0
  });
  const [holdTwoSeconds, setHoldTwoSeconds] = useState(true);
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>右侧动作复评</Text>
      {rightSideAssessmentProtocol.tests.map((test) => <Text key={test} style={styles.line}>• {test}</Text>)}
      <Text style={styles.instructions}>{rightSideAssessmentProtocol.consistencyRules.join("；")}</Text>
      {(Object.keys(values) as NumericField[]).map((field) => {
        const labels: Record<NumericField, string> = {
          rightFootExternalRotation: "右脚外旋 0–3",
          rightKneeValgus: "右膝内扣 0–3",
          pelvisStability: "骨盆稳定 1–5",
          landingQuietness: "落地安静 1–5",
          shiftTowardLeft: "向左偏移 0–3"
        };
        return (
          <View key={field} style={styles.inputRow}>
            <Text style={styles.label}>{labels[field]}</Text>
            <TextInput
              style={styles.input}
              value={String(values[field])}
              keyboardType="numeric"
              onChangeText={(text) => setValues((current) => ({ ...current, [field]: Number(text) || 0 }))}
            />
          </View>
        );
      })}
      <Pressable style={[styles.toggle, holdTwoSeconds && styles.active]} onPress={() => setHoldTwoSeconds(!holdTwoSeconds)}>
        <Text style={[styles.toggleText, holdTwoSeconds && styles.activeText]}>落地保持 2 秒</Text>
      </Pressable>
      <TextInput style={styles.notes} value={notes} onChangeText={setNotes} multiline placeholder="复评备注，可选" />
      <Pressable
        style={styles.button}
        onPress={() => {
          saveAssessment({ date, dayNumber, ...values, holdTwoSeconds, notes: notes.trim() || undefined } as RightSideAssessment);
          setSaved(true);
        }}
      >
        <Text style={styles.buttonText}>{saved ? "已保存复评" : "保存复评"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff" },
  title: { fontSize: 17, fontWeight: "900", color: "#1f2328", marginBottom: 6 },
  line: { marginTop: 4, fontSize: 13, lineHeight: 19, color: "#24292f" },
  instructions: { marginTop: 9, padding: 9, borderRadius: 6, backgroundColor: "#f6f8fa", fontSize: 12, lineHeight: 18, color: "#57606a" },
  inputRow: { marginTop: 9, flexDirection: "row", alignItems: "center", gap: 10 },
  label: { flex: 1, fontSize: 13, color: "#24292f", fontWeight: "800" },
  input: { width: 64, minHeight: 40, textAlign: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de", backgroundColor: "#f6f8fa" },
  toggle: { minHeight: 44, marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  active: { borderColor: "#0969da", backgroundColor: "#ddf4ff" },
  toggleText: { color: "#57606a", fontWeight: "800" },
  activeText: { color: "#0969da" },
  notes: { minHeight: 58, marginTop: 10, padding: 10, textAlignVertical: "top", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  button: { minHeight: 44, marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "#0969da" },
  buttonText: { color: "#fff", fontWeight: "900" }
});
