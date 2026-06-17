import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePerformance } from "@/context/PerformanceContext";
import { singleLegStiffnessModule } from "@/data/singleLegStiffness";
import type { SingleLegStiffnessAssessment } from "@/types/training";

type NumericField = Exclude<
  keyof SingleLegStiffnessAssessment,
  "date" | "dayNumber" | "notes" | "takeoffLeg" | "holdDurationSec" | "jumpContacts" | "jumpHeightCm" | "reachHeightCm" | "painScore"
>;

const fieldLabels: Record<NumericField, string> = {
  singleLegStiffnessQuality: "单腿刚性质量 1–5",
  rightFootExternalRotation: "右脚外旋 0–3",
  rightFootControl: "右脚控制 1–5",
  rightKneeTracking: "右膝轨迹 1–5",
  pelvisStability: "骨盆稳定 1–5",
  topPositionStability: "顶部稳定 1–5",
  landingQuietness: "落地安静 1–5",
  contactRhythm: "单脚 Pogo 节奏 1–5"
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseOptionalNumber(value: string) {
  if (!value.trim()) {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export function SingleLegStiffnessAssessmentCard({ date, dayNumber }: { date: string; dayNumber: number }) {
  const { saveSingleLegAssessment, singleLegAssessments } = usePerformance();
  const recent = useMemo(
    () => singleLegAssessments.slice(-3).reverse(),
    [singleLegAssessments]
  );
  const [values, setValues] = useState<Record<NumericField, number>>({
    singleLegStiffnessQuality: 3,
    rightFootExternalRotation: 0,
    rightFootControl: 3,
    rightKneeTracking: 3,
    pelvisStability: 3,
    topPositionStability: 3,
    landingQuietness: 3,
    contactRhythm: 3
  });
  const [holdDurationSec, setHoldDurationSec] = useState("");
  const [jumpContacts, setJumpContacts] = useState("");
  const [jumpHeightCm, setJumpHeightCm] = useState("");
  const [reachHeightCm, setReachHeightCm] = useState("");
  const [painScore, setPainScore] = useState("");
  const [takeoffLeg, setTakeoffLeg] = useState<"left" | "right">("right");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const updateField = (field: NumericField, rawValue: string) => {
    const rawNumber = Number(rawValue);
    const max = field === "rightFootExternalRotation" ? 3 : 5;
    const min = field === "rightFootExternalRotation" ? 0 : 1;
    setValues((current) => ({
      ...current,
      [field]: clamp(Number.isFinite(rawNumber) ? rawNumber : min, min, max)
    }));
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{singleLegStiffnessModule.titleZh}</Text>
      <Text style={styles.subtitle}>{singleLegStiffnessModule.titleEn}</Text>
      <Text style={styles.definition}>
        单腿刚性不是把关节锁死。目标是在触地和发力时快速稳定，同时保留正常落地缓冲。
      </Text>

      {(Object.keys(values) as NumericField[]).map((field) => (
        <View key={field} style={styles.inputRow}>
          <Text style={styles.label}>{fieldLabels[field]}</Text>
          <TextInput
            style={styles.input}
            value={String(values[field])}
            keyboardType="numeric"
            onChangeText={(text) => updateField(field, text)}
          />
        </View>
      ))}

      <View style={styles.compactGrid}>
        <TextInput
          style={styles.compactInput}
          value={holdDurationSec}
          onChangeText={(text) => setHoldDurationSec(text.replace(/[^\d.]/g, ""))}
          placeholder="保持秒数"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.compactInput}
          value={jumpContacts}
          onChangeText={(text) => setJumpContacts(text.replace(/[^\d.]/g, ""))}
          placeholder="跳跃接触"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.compactInput}
          value={jumpHeightCm}
          onChangeText={(text) => setJumpHeightCm(text.replace(/[^\d.]/g, ""))}
          placeholder="跳高 cm"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.compactInput}
          value={reachHeightCm}
          onChangeText={(text) => setReachHeightCm(text.replace(/[^\d.]/g, ""))}
          placeholder="摸高 cm"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.compactInput}
          value={painScore}
          onChangeText={(text) => setPainScore(text.replace(/[^\d.]/g, ""))}
          placeholder="疼痛 0–10"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.toggleRow}>
        {(["right", "left"] as const).map((leg) => (
          <Pressable
            key={leg}
            style={[styles.toggle, takeoffLeg === leg && styles.toggleActive]}
            onPress={() => setTakeoffLeg(leg)}
          >
            <Text style={[styles.toggleText, takeoffLeg === leg && styles.toggleTextActive]}>
              {leg === "right" ? "右脚起跳" : "左脚起跳"}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        style={styles.notes}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="本次记录：右脚外旋、右膝轨迹、左右差异，可选"
      />

      <Pressable
        style={styles.button}
        onPress={() => {
          saveSingleLegAssessment({
            date,
            dayNumber,
            ...values,
            holdDurationSec: parseOptionalNumber(holdDurationSec),
            jumpContacts: parseOptionalNumber(jumpContacts),
            jumpHeightCm: parseOptionalNumber(jumpHeightCm),
            reachHeightCm: parseOptionalNumber(reachHeightCm),
            painScore: parseOptionalNumber(painScore),
            takeoffLeg,
            notes: notes.trim() || undefined
          } as SingleLegStiffnessAssessment);
          setSaved(true);
        }}
      >
        <Text style={styles.buttonText}>{saved ? "已保存单腿记录" : "保存单腿记录"}</Text>
      </Pressable>

      {recent.length ? (
        <View style={styles.recent}>
          <Text style={styles.recentTitle}>最近记录</Text>
          {recent.map((entry) => (
            <Text key={`${entry.date}-${entry.dayNumber}`} style={styles.recentLine}>
              第 {entry.dayNumber} 天 · 右脚 {entry.rightFootControl}/5 · 右膝 {entry.rightKneeTracking}/5 ·
              Pogo 节奏 {entry.contactRhythm}/5
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  title: { fontSize: 17, fontWeight: "900", color: "#1f2328" },
  subtitle: { marginTop: 2, fontSize: 12, color: "#57606a", fontWeight: "800" },
  definition: { marginTop: 8, fontSize: 13, lineHeight: 19, color: "#57606a" },
  inputRow: { marginTop: 9, flexDirection: "row", alignItems: "center", gap: 10 },
  label: { flex: 1, fontSize: 13, color: "#24292f", fontWeight: "800" },
  input: {
    width: 62,
    minHeight: 40,
    textAlign: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#f6f8fa"
  },
  compactGrid: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  compactInput: {
    minWidth: "30%",
    flexGrow: 1,
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#f6f8fa"
  },
  toggleRow: { marginTop: 10, flexDirection: "row", gap: 8 },
  toggle: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de"
  },
  toggleActive: { borderColor: "#0969da", backgroundColor: "#ddf4ff" },
  toggleText: { color: "#57606a", fontWeight: "800" },
  toggleTextActive: { color: "#0969da" },
  notes: {
    minHeight: 58,
    marginTop: 10,
    padding: 10,
    textAlignVertical: "top",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de"
  },
  button: {
    minHeight: 44,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#0969da"
  },
  buttonText: { color: "#ffffff", fontWeight: "900" },
  recent: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#d8dee4" },
  recentTitle: { fontSize: 13, color: "#57606a", fontWeight: "900" },
  recentLine: { marginTop: 5, fontSize: 12, lineHeight: 18, color: "#57606a" }
});
