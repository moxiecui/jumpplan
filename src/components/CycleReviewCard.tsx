import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { usePerformance } from "@/context/PerformanceContext";
import { useReadiness } from "@/context/ReadinessContext";
import { useTrainingLog } from "@/context/TrainingLogContext";

export function CycleReviewCard() {
  const router = useRouter();
  const { basketballLogs, assessments, jumpTests } = usePerformance();
  const { entriesByDate } = useReadiness();
  const { dayCompletions, entries } = useTrainingLog();
  const completedContacts = entries.reduce((total, entry) => total + (entry.actualJumpContacts ?? 0), 0);
  const regressed = entries.filter((entry) => entry.status === "regressed").length;
  const skipped = entries.filter((entry) => entry.status === "skipped").length;

  const options = [
    "重复当前计划",
    "带修改重复",
    "生成新自适应计划",
    "先延后并加入恢复日"
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>周期总结与下一步</Text>
      <View style={styles.grid}>
        <Text style={styles.item}>结束训练日 {dayCompletions.length}</Text>
        <Text style={styles.item}>实际健身房跳跃 {completedContacts}</Text>
        <Text style={styles.item}>篮球记录 {basketballLogs.length}</Text>
        <Text style={styles.item}>Readiness 记录 {Object.keys(entriesByDate).length}</Text>
        <Text style={styles.item}>右侧复评 {assessments.length}</Text>
        <Text style={styles.item}>跳跃测试 {jumpTests.length}</Text>
        <Text style={styles.item}>降级 {regressed}</Text>
        <Text style={styles.item}>跳过 {skipped}</Text>
      </View>
      <Text style={styles.help}>第 21 天后计划会停在复盘页，不会静默开始同一个周期。</Text>
      {options.map((option, index) => (
        <Pressable
          key={option}
          style={[styles.option, index === 2 && styles.primary]}
          onPress={() => index === 2 && router.push("/adaptive-plan")}
        >
          <Text style={[styles.optionText, index === 2 && styles.primaryText]}>{option}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: "#d8dee4", backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "900", color: "#1f2328" },
  grid: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 8 },
  item: { paddingHorizontal: 9, paddingVertical: 7, borderRadius: 6, backgroundColor: "#f6f8fa", fontSize: 12, color: "#24292f", fontWeight: "800" },
  help: { marginTop: 12, fontSize: 13, lineHeight: 19, color: "#57606a" },
  option: { minHeight: 44, marginTop: 8, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#d0d7de" },
  primary: { borderColor: "#0969da", backgroundColor: "#0969da" },
  optionText: { color: "#24292f", fontWeight: "900" },
  primaryText: { color: "#fff" }
});
