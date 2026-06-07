import { StyleSheet, Text, View } from "react-native";

import { RelatedTermsSection } from "@/components/RelatedTermsSection";
import { getSupplementProductById } from "@/data/supplements";
import { findGlossaryTermsInText, getGlossaryEntriesByIds } from "@/logic/glossary";
import {
  getNutritionCategoryLabel,
  getNutritionPriorityLabel,
  getNutritionTimingLabel
} from "@/logic/nutrition";
import type { NutritionItem } from "@/types/nutrition";

function DetailList({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) {
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
  const text = [
    item.id,
    item.nameZh,
    item.nameEn,
    item.purpose,
    item.whyForUser,
    item.dose,
    product?.name,
    product?.shortNameZh,
    product?.servingNote,
    ...(item.instructions ?? []),
    ...(item.keyPoints ?? []),
    ...(item.commonMistakes ?? []),
    ...(item.cautions ?? []),
    ...(item.skipOrReduceWhen ?? [])
  ]
    .filter(Boolean)
    .join(" ");
  const manualIdsByNutritionId: Record<string, string[]> = {
    "fish-oil-epa-dha": ["epa", "dha"],
    creatine: ["creatine"],
    "whey-isolate": ["whey"],
    "collagen-vitamin-c": ["collagen"],
    zinc: ["zma"],
    "magnesium-glycinate": ["zma"],
    "l-citrulline": ["l-citrulline"]
  };
  const detectedTerms = findGlossaryTermsInText(text);
  const manualTerms = getGlossaryEntriesByIds(manualIdsByNutritionId[item.id] ?? []);
  const relatedTerms = [...new Map([...manualTerms, ...detectedTerms].map((entry) => [entry.id, entry])).values()];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.name}>{item.nameZh}</Text>
        <Text style={styles.priority}>{getNutritionPriorityLabel(item.priority)}</Text>
      </View>
      {item.nameEn ? <Text style={styles.nameEn}>{item.nameEn}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{getNutritionCategoryLabel(item.category)}</Text>
        <Text style={styles.meta}>{getNutritionTimingLabel(item.timing)}</Text>
      </View>
      {item.dose ? <Text style={styles.dose}>推荐剂量：{item.dose}</Text> : null}

      {product ? (
        <View style={styles.productBox}>
          <Text style={styles.productTitle}>你的产品</Text>
          <Text style={styles.productText}>{product.name}</Text>
          {product.brand ? <Text style={styles.productNote}>品牌：{product.brand}</Text> : null}
          <Text style={styles.productNote}>形式：{product.form}</Text>
          {product.defaultDose ? <Text style={styles.productNote}>默认剂量：{product.defaultDose}</Text> : null}
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
      <DetailList title="关键要点" items={item.keyPoints} />
      <DetailList title="常见错误" items={item.commonMistakes} />
      <DetailList title="注意事项" items={item.cautions} />
      <DetailList title="什么时候减少、跳过或咨询医生" items={item.skipOrReduceWhen} />
      <RelatedTermsSection terms={relatedTerms} />
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
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  meta: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#ddf4ff",
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
