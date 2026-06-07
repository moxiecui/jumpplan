import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { GlossaryTerm } from "@/components/GlossaryTerm";
import { getGlossaryCategoryLabel, getGlossaryEntriesByIds, getGlossaryEntryById } from "@/logic/glossary";

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

export default function GlossaryDetailScreen() {
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const entry = id ? getGlossaryEntryById(id) : undefined;

  if (!entry) {
    return (
      <View style={styles.center}>
        <Text style={styles.missingTitle}>找不到这个术语</Text>
        <Text style={styles.missingText}>术语 ID：{id ?? "未提供"}</Text>
      </View>
    );
  }

  const related = getGlossaryEntriesByIds(entry.relatedTerms ?? []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.term}>{entry.term}</Text>
      {entry.fullName ? <Text style={styles.fullName}>{entry.fullName}</Text> : null}
      <Text style={styles.category}>{getGlossaryCategoryLabel(entry.category)}</Text>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>简单解释</Text>
        <Text style={styles.paragraph}>{entry.shortDefinition}</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.blockTitle}>详细说明</Text>
        <Text style={styles.paragraph}>{entry.detailedExplanation}</Text>
      </View>

      {entry.whyItMattersForUser ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>为什么对你重要</Text>
          <Text style={styles.paragraph}>{entry.whyItMattersForUser}</Text>
        </View>
      ) : null}

      <DetailList title="实际怎么用" items={entry.practicalUse} />
      <DetailList title="注意事项" items={entry.watchOut} />

      {related.length ? (
        <View style={styles.block}>
          <Text style={styles.blockTitle}>相关术语</Text>
          <View style={styles.relatedRow}>
            {related.map((item) => (
              <GlossaryTerm key={item.id} entry={item} />
            ))}
          </View>
        </View>
      ) : null}
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
    color: "#57606a"
  },
  term: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  fullName: {
    marginTop: 4,
    fontSize: 16,
    color: "#57606a",
    fontWeight: "700"
  },
  category: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#57606a",
    fontSize: 12,
    fontWeight: "900"
  },
  block: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  blockTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328",
    marginBottom: 8
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
    marginBottom: 5
  },
  relatedRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
