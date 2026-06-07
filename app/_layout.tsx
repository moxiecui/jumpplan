import { Stack } from "expo-router";

import { ReadinessProvider } from "@/context/ReadinessContext";

export default function RootLayout() {
  return (
    <ReadinessProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#f6f8fa" },
          headerTitleStyle: { fontWeight: "800" },
          contentStyle: { backgroundColor: "#f6f8fa" }
        }}
      >
        <Stack.Screen name="index" options={{ title: "JumpPlan" }} />
        <Stack.Screen name="today" options={{ title: "Today" }} />
        <Stack.Screen name="checkin" options={{ title: "Daily Check-in" }} />
        <Stack.Screen name="adaptive-plan" options={{ title: "Adaptive Plan" }} />
        <Stack.Screen name="plan/index" options={{ title: "14-Day Plan" }} />
        <Stack.Screen name="plan/[day]" options={{ title: "Day Detail" }} />
        <Stack.Screen name="exercise/[id]" options={{ title: "Exercise" }} />
      </Stack>
    </ReadinessProvider>
  );
}
