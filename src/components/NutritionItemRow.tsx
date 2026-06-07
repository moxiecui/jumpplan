import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { getNutritionTimingLabel } from "@/logic/nutrition";
import type { NutritionItem } from "@/types/nutrition";

interface NutritionItemRowProps {
  item: NutritionItem;
  compact?: boolean;
}

export function NutritionItemRow({ item, compact = false }: NutritionItemRowProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.row}
      onPress={() =>
        router.push({
          pathname: "/nutrition/[id]",
          params: { id: item.id }
        } as never)
      }
    >
      <View style={styles.header}>
        <Text style={styles.name}>{item.nameZh}</Text>
        <Text style={styles.priority}>{item.priority === "core" ? "核心" : item.priority === "useful" ? "有用" : "可选"}</Text>
      </View>
      <Text style={styles.timing}>{getNutritionTimingLabel(item.timing)}</Text>
      {item.dose && !compact ? <Text style={styles.dose}>{item.dose}</Text> : null}
      <Text style={styles.purpose} numberOfLines={compact ? 2 : undefined}>
        {item.purpose}
      </Text>
      <Text style={styles.link}>查看细节</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  timing: {
    marginTop: 6,
    fontSize: 13,
    color: "#0969da",
    fontWeight: "800"
  },
  dose: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#24292f",
    fontWeight: "700"
  },
  purpose: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  },
  link: {
    marginTop: 8,
    fontSize: 13,
    color: "#0969da",
    fontWeight: "900"
  }
});
