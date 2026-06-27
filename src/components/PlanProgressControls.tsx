import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePlanProgress } from "@/context/PlanProgressContext";

export function PlanProgressControls() {
  const {
    calendarDayNumber,
    currentDayNumber,
    currentDay,
    isAdjusted,
    canSkipToday,
    canGoBackOneDay,
    skipToday,
    goBackOneDay,
    resetToCalendarDay
  } = usePlanProgress();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>计划进度</Text>
          <Text style={styles.subtitle}>
            日历今天：第 {calendarDayNumber} 天 · 当前显示：第 {currentDayNumber} 天
          </Text>
          <Text style={styles.subtitle}>
            Cycle {currentDay.cycleNumber} · 21 天周期第 {currentDay.dayInCycle} 天
          </Text>
        </View>
        {isAdjusted ? <Text style={styles.adjustedPill}>已调整</Text> : null}
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          disabled={!canGoBackOneDay}
          style={[styles.button, !canGoBackOneDay && styles.buttonDisabled]}
          onPress={goBackOneDay}
        >
          <Text style={[styles.buttonText, !canGoBackOneDay && styles.buttonTextDisabled]}>
            回到昨天计划
          </Text>
        </Pressable>
        <Pressable
          disabled={!canSkipToday}
          style={[styles.button, styles.primaryButton, !canSkipToday && styles.buttonDisabled]}
          onPress={skipToday}
        >
          <Text style={[styles.primaryButtonText, !canSkipToday && styles.buttonTextDisabled]}>
            跳过今天
          </Text>
        </Pressable>
      </View>

      {isAdjusted ? (
        <Pressable style={styles.resetButton} onPress={resetToCalendarDay}>
          <Text style={styles.resetButtonText}>恢复日历进度</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: 15,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#57606a"
  },
  adjustedPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#fff8c5",
    color: "#6e5500",
    fontSize: 12,
    fontWeight: "900"
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 8
  },
  button: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ffffff"
  },
  primaryButton: {
    backgroundColor: "#0969da"
  },
  buttonDisabled: {
    borderColor: "#d0d7de",
    backgroundColor: "#f6f8fa"
  },
  buttonText: {
    color: "#0969da",
    fontWeight: "900",
    fontSize: 13
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 13
  },
  buttonTextDisabled: {
    color: "#8c959f"
  },
  resetButton: {
    minHeight: 40,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  resetButtonText: {
    color: "#57606a",
    fontWeight: "900",
    fontSize: 13
  }
});
