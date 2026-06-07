import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { NutritionDetailView } from "@/components/NutritionDetailView";
import { getNutritionItemById } from "@/logic/nutrition";

export default function NutritionDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const item = id ? getNutritionItemById(id) : undefined;

  if (!item) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>未知营养项目: {id ?? "missing-id"}</Text>
        <Text style={styles.missingText}>请从今日营养时间表重新选择。</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <NutritionDetailView item={item} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  center: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1f2328"
  },
  missingText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a",
    textAlign: "center"
  }
});
