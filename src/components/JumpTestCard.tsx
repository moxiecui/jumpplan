import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePerformance } from "@/context/PerformanceContext";

export function JumpTestCard({ date }: { date: string }) {
  const { saveJumpTest } = usePerformance();
  const [cmjAttempts, setCmjAttempts] = useState(0);
  const [approachAttempts, setApproachAttempts] = useState(0);
  const [cmjBest, setCmjBest] = useState("");
  const [approachBest, setApproachBest] = useState("");
  const [quality, setQuality] = useState("4");
  const [decline, setDecline] = useState(false);
  const [saved, setSaved] = useState(false);

  const Counter = ({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (value: number) => void }) => (
    <View style={styles.counter}>
      <Text style={styles.counterLabel}>{label}</Text>
      <View style={styles.counterControls}>
        <Pressable style={styles.counterButton} onPress={() => onChange(Math.max(0, value - 1))}><Text style={styles.counterButtonText}>−</Text></Pressable>
        <Text style={styles.counterValue}>{value}/{max}</Text>
        <Pressable style={styles.counterButton} onPress={() => onChange(Math.min(max, value + 1))}><Text style={styles.counterButtonText}>+</Text></Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>测试记录</Text>
      <Text style={styles.warning}>连续两次成绩下降或动作质量变差时立即停止。测试后不追加训练。</Text>
      <Counter label="CMJ 正式尝试" value={cmjAttempts} max={3} onChange={setCmjAttempts} />
      <Counter label="助跑跳正式尝试" value={approachAttempts} max={6} onChange={setApproachAttempts} />
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={cmjBest} onChangeText={setCmjBest} keyboardType="numeric" placeholder="CMJ 最佳" />
        <TextInput style={styles.input} value={approachBest} onChangeText={setApproachBest} keyboardType="numeric" placeholder="助跑跳最佳" />
        <TextInput style={styles.input} value={quality} onChangeText={setQuality} keyboardType="numeric" placeholder="动作质量 1–5" />
      </View>
      <Pressable style={[styles.toggle, decline && styles.stop]} onPress={() => setDecline(!decline)}>
        <Text style={[styles.toggleText, decline && styles.stopText]}>已出现连续下降 / 动作变差</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          saveJumpTest({
            date,
            cmjBest: cmjBest.trim() ? Number(cmjBest) : undefined,
            approachJumpBest: approachBest.trim() ? Number(approachBest) : undefined,
            unit: "cm",
            cmjAttempts,
            approachJumpAttempts: approachAttempts,
            movementQuality: Math.min(5, Math.max(1, Number(quality) || 1)) as 1 | 2 | 3 | 4 | 5,
            stoppedForDecline: decline
          });
          setSaved(true);
        }}
      >
        <Text style={styles.buttonText}>{saved ? "已保存测试结果" : "保存测试结果"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff" },
  title: { fontSize: 17, fontWeight: "900", color: "#1f2328" },
  warning: { marginTop: 6, padding: 9, borderRadius: 6, backgroundColor: "#fff8c5", fontSize: 13, lineHeight: 19, color: "#6e5500", fontWeight: "800" },
  counter: { marginTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  counterLabel: { flex: 1, fontSize: 14, color: "#24292f", fontWeight: "800" },
  counterControls: { flexDirection: "row", alignItems: "center", gap: 8 },
  counterButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  counterButtonText: { fontSize: 22, color: "#0969da", fontWeight: "900" },
  counterValue: { minWidth: 48, textAlign: "center", fontWeight: "900" },
  inputRow: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: { minWidth: 100, flexGrow: 1, minHeight: 44, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  toggle: { minHeight: 44, marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d29922" },
  stop: { backgroundColor: "#ffebe9", borderColor: "#cf222e" },
  toggleText: { color: "#9a6700", fontWeight: "900" },
  stopText: { color: "#cf222e" },
  button: { minHeight: 44, marginTop: 10, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "#0969da" },
  buttonText: { color: "#fff", fontWeight: "900" }
});
