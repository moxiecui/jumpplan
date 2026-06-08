import { Stack } from "expo-router";

import { ReadinessProvider } from "@/context/ReadinessContext";
import { TrainingLogProvider } from "@/context/TrainingLogContext";

export default function RootLayout() {
  return (
    <ReadinessProvider>
      <TrainingLogProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#f6f8fa" },
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: "#f6f8fa" }
          }}
        >
          <Stack.Screen name="index" options={{ title: "JumpPlan" }} />
          <Stack.Screen name="today" options={{ title: "今日" }} />
          <Stack.Screen name="checkin" options={{ title: "今日状态" }} />
          <Stack.Screen name="adaptive-plan" options={{ title: "调整计划" }} />
          <Stack.Screen name="glossary/index" options={{ title: "术语词典" }} />
          <Stack.Screen name="glossary/[id]" options={{ title: "术语详情" }} />
          <Stack.Screen name="nutrition" options={{ title: "营养" }} />
          <Stack.Screen name="nutrition/[id]" options={{ title: "营养详情" }} />
          <Stack.Screen name="plan/index" options={{ title: "21天计划" }} />
          <Stack.Screen name="plan/[day]" options={{ title: "训练日" }} />
          <Stack.Screen name="exercise/[id]" options={{ title: "动作详情" }} />
        </Stack>
      </TrainingLogProvider>
    </ReadinessProvider>
  );
}
