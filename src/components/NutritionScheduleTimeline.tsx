import { StyleSheet, Text, View } from "react-native";

import { NutritionItemRow } from "@/components/NutritionItemRow";
import { getNutritionItemById, getVisibleNutritionItems } from "@/logic/nutrition";
import type { NutritionItem, NutritionScheduleEntry } from "@/types/nutrition";

interface NutritionScheduleTimelineProps {
  entries: NutritionScheduleEntry[];
  trainingActive: boolean;
}

export function NutritionScheduleTimeline({ entries, trainingActive }: NutritionScheduleTimelineProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>今日时间表</Text>
      {entries.map((entry) => {
        const items = getVisibleNutritionItems(
          entry.itemIds.map((id) => getNutritionItemById(id) ?? buildMissingNutritionItem(id)),
          { trainingActive }
        );

        if (items.length === 0) {
          return null;
        }

        return (
          <View key={`${entry.time}-${entry.label}`} style={styles.entry}>
            <View style={styles.timeColumn}>
              <Text style={styles.time}>{entry.time}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>{entry.label}</Text>
              {entry.notes ? <Text style={styles.notes}>{entry.notes}</Text> : null}
              {items.map((item) => (
                <NutritionItemRow key={item.id} item={item} compact />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function buildMissingNutritionItem(id: string): NutritionItem {
  return {
    id,
    nameZh: `未知营养项目: ${id}`,
    category: "optional",
    priority: "optional",
    timing: "anytime",
    purpose: "请检查营养时间表中的 itemId。",
    whyForUser: "这个营养项目没有在 src/data/nutrition.ts 中定义。",
    instructions: ["检查 itemId 是否拼写正确。"],
    cautions: ["数据修正前不要按这个占位项目执行。"]
  };
}

const styles = StyleSheet.create({
  container: {
    marginTop: 22
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 12
  },
  entry: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  timeColumn: {
    width: 64,
    alignItems: "flex-start"
  },
  time: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0969da"
  },
  content: {
    flex: 1
  },
  label: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 4
  },
  notes: {
    marginBottom: 8,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  }
});
