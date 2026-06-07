import { StyleSheet, Text, View } from "react-native";

import { getSupplementProductById } from "@/data/supplements";
import { getNutritionTimingLabel } from "@/logic/nutrition";
import type { NutritionItem } from "@/types/nutrition";

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {items.map((item, index) => (
        <Text key={`${title}-${index}`} style={styles.listItem}>
          {index + 1}. {item}
        </Text>
      ))}
    </View>
  );
}

export function NutritionDetailView({ item }: { item: NutritionItem }) {
  const product = item.productId ? getSupplementProductById(item.productId) : undefined;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.nameZh}</Text>
        <Text style={styles.priority}>{item.priority === "core" ? "核心" : item.priority === "useful" ? "有用" : "可选"}</Text>
      </View>
      {item.nameEn ? <Text style={styles.nameEn}>{item.nameEn}</Text> : null}
      <Text style={styles.meta}>{getNutritionTimingLabel(item.timing)}</Text>
      {item.dose ? <Text style={styles.dose}>推荐剂量：{item.dose}</Text> : null}

      {product ? (
        <View style={styles.productBox}>
          <Text style={styles.productTitle}>你的产品</Text>
          <Text style={styles.productText}>{product.name}</Text>
          {product.servingNote ? <Text style={styles.productNote}>{product.servingNote}</Text> : null}
        </View>
      ) : null}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>为什么吃</Text>
        <Text style={styles.paragraph}>{item.purpose}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>为什么适合你</Text>
        <Text style={styles.paragraph}>{item.whyForUser}</Text>
      </View>

      <DetailList title="什么时候吃 / 怎么吃" items={item.instructions} />
      <DetailList title="注意事项" items={item.cautions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: "900",
    color: "#1f2328"
  },
  priority: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#24292f",
    fontSize: 12,
    fontWeight: "900"
  },
  nameEn: {
    fontSize: 14,
    color: "#57606a"
  },
  meta: {
    fontSize: 14,
    color: "#0969da",
    fontWeight: "900"
  },
  dose: {
    fontSize: 15,
    lineHeight: 22,
    color: "#24292f",
    fontWeight: "700"
  },
  productBox: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  productTitle: {
    fontSize: 13,
    color: "#57606a",
    fontWeight: "900"
  },
  productText: {
    marginTop: 4,
    fontSize: 15,
    color: "#1f2328",
    fontWeight: "800"
  },
  productNote: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  },
  block: {
    marginTop: 2
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 6
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 23,
    color: "#24292f"
  },
  listItem: {
    fontSize: 15,
    lineHeight: 23,
    color: "#24292f",
    marginBottom: 4
  }
});
