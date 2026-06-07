import { StyleSheet, Text, View } from "react-native";

import { NutritionItemRow } from "@/components/NutritionItemRow";
import type { NutritionItem } from "@/types/nutrition";

interface NutritionSectionProps {
  title: string;
  items: NutritionItem[];
}

export function NutritionSection({ title, items }: NutritionSectionProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      {items.map((item) => (
        <NutritionItemRow key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 22
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 10
  }
});
