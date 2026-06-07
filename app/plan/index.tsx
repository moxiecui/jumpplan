import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { trainingPlan } from "@/data/plan";

export default function PlanScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>14-Day Plan</Text>
      <Text style={styles.subtitle}>每天点进去查看完整训练块和动作细节。</Text>

      <Pressable style={styles.generateButton} onPress={() => router.push("/adaptive-plan")}>
        <Text style={styles.generateButtonText}>周期结束后生成下一阶段计划</Text>
      </Pressable>

      {trainingPlan.map((day) => (
        <Pressable
          key={day.day}
          style={styles.dayCard}
          onPress={() =>
            router.push({
              pathname: "/plan/[day]",
              params: { day: String(day.day) }
            })
          }
        >
          <View style={styles.dayHeader}>
            <Text style={styles.dayNumber}>Day {day.day}</Text>
            <Text style={styles.dayType}>{day.type}</Text>
          </View>
          <Text style={styles.dayTitle}>{day.title}</Text>
          <Text style={styles.goal}>{day.goal}</Text>
        </Pressable>
      ))}
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
  generateButton: {
    marginBottom: 18,
    paddingVertical: 13,
    borderRadius: 8,
    backgroundColor: "#0969da",
    alignItems: "center"
  },
  generateButtonText: {
    color: "#ffffff",
    fontWeight: "900"
  },
  dayCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 12
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0969da"
  },
  dayType: {
    fontSize: 12,
    fontWeight: "800",
    color: "#57606a"
  },
  dayTitle: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2328"
  },
  goal: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  }
});
