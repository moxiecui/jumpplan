import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePerformance } from "@/context/PerformanceContext";
import { classifyBasketballLoad } from "@/logic/basketballLoad";
import { basketballLoadLabels } from "@/logic/trainingDisplay";

export function BasketballLoadLogger({ date }: { date: string }) {
  const { getBasketballLog, saveBasketballLog } = usePerformance();
  const existing = getBasketballLog(date);
  const [duration, setDuration] = useState(String(existing?.durationMinutes ?? ""));
  const [rpe, setRpe] = useState(String(existing?.sessionRpe ?? ""));
  const [contacts, setContacts] = useState(String(existing?.estimatedJumpContacts ?? ""));
  const [fullCourt, setFullCourt] = useState(existing?.fullCourt ?? false);
  const [repeatedMaxJumps, setRepeatedMaxJumps] = useState(existing?.repeatedMaxJumps ?? false);
  const [saved, setSaved] = useState(Boolean(existing));
  const loadLevel = useMemo(
    () =>
      classifyBasketballLoad({
        durationMinutes: Number(duration) || 0,
        sessionRpe: Number(rpe) || 0,
        fullCourt,
        repeatedMaxJumps
      }),
    [duration, fullCourt, repeatedMaxJumps, rpe]
  );

  const save = () => {
    saveBasketballLog({
      date,
      durationMinutes: Math.max(0, Number(duration) || 0),
      sessionRpe: Math.min(10, Math.max(0, Number(rpe) || 0)),
      loadLevel,
      fullCourt,
      repeatedMaxJumps,
      estimatedJumpContacts: contacts.trim() ? Math.max(0, Number(contacts) || 0) : undefined
    });
    setSaved(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>记录篮球负荷</Text>
      <Text style={styles.subtitle}>篮球接触次数是估算值，不当作精确测量。</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} value={duration} onChangeText={(v) => { setDuration(v); setSaved(false); }} keyboardType="numeric" placeholder="分钟" />
        <TextInput style={styles.input} value={rpe} onChangeText={(v) => { setRpe(v); setSaved(false); }} keyboardType="numeric" placeholder="RPE 0–10" />
        <TextInput style={styles.input} value={contacts} onChangeText={(v) => { setContacts(v); setSaved(false); }} keyboardType="numeric" placeholder="估算跳跃" />
      </View>
      <View style={styles.row}>
        <Pressable style={[styles.toggle, fullCourt && styles.active]} onPress={() => { setFullCourt(!fullCourt); setSaved(false); }}>
          <Text style={[styles.toggleText, fullCourt && styles.activeText]}>全场 / 强对抗</Text>
        </Pressable>
        <Pressable style={[styles.toggle, repeatedMaxJumps && styles.active]} onPress={() => { setRepeatedMaxJumps(!repeatedMaxJumps); setSaved(false); }}>
          <Text style={[styles.toggleText, repeatedMaxJumps && styles.activeText]}>重复最大跳</Text>
        </Pressable>
      </View>
      <Text style={styles.level}>自动分级：{basketballLoadLabels[loadLevel]}</Text>
      <Pressable style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>{saved ? "已保存篮球负荷" : "保存篮球负荷"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff" },
  title: { fontSize: 17, fontWeight: "900", color: "#1f2328" },
  subtitle: { marginTop: 4, fontSize: 12, lineHeight: 17, color: "#57606a" },
  row: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: { minWidth: 92, flexGrow: 1, minHeight: 44, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de", backgroundColor: "#f6f8fa" },
  toggle: { minHeight: 44, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  active: { borderColor: "#0969da", backgroundColor: "#ddf4ff" },
  toggleText: { color: "#57606a", fontWeight: "800" },
  activeText: { color: "#0969da" },
  level: { marginTop: 12, fontSize: 14, color: "#1f2328", fontWeight: "900" },
  button: { minHeight: 44, marginTop: 12, alignItems: "center", justifyContent: "center", borderRadius: 8, backgroundColor: "#0969da" },
  buttonText: { color: "#fff", fontWeight: "900" }
});
