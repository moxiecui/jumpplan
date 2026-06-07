import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { GlossaryList } from "@/components/GlossaryList";
import { glossaryEntries } from "@/data/glossary";
import { getAllGlossaryCategories, getGlossaryCategoryLabel } from "@/logic/glossary";
import type { GlossaryCategory } from "@/types/glossary";

type CategoryFilter = GlossaryCategory | "all";

export default function GlossaryScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const categories = getAllGlossaryCategories();
  const filteredEntries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return glossaryEntries
      .filter((entry) => category === "all" || entry.category === category)
      .filter((entry) => {
        if (!normalizedQuery) {
          return true;
        }

        return [entry.term, entry.fullName, entry.shortDefinition, entry.detailedExplanation]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedQuery));
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [category, query]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>术语词典</Text>
      <Text style={styles.subtitle}>训练、恢复、营养和 readiness 缩写的中文解释。</Text>

      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="搜索 CMJ、HRV、鱼油、等长..."
      />

      <View style={styles.filterRow}>
        <Pressable
          style={[styles.filterButton, category === "all" && styles.filterButtonActive]}
          onPress={() => setCategory("all")}
        >
          <Text style={[styles.filterText, category === "all" && styles.filterTextActive]}>全部</Text>
        </Pressable>
        {categories.map((item) => (
          <Pressable
            key={item}
            style={[styles.filterButton, category === item && styles.filterButtonActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.filterText, category === item && styles.filterTextActive]}>
              {getGlossaryCategoryLabel(item)}
            </Text>
          </Pressable>
        ))}
      </View>

      <GlossaryList entries={filteredEntries} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 36
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1f2328"
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: "#57606a"
  },
  search: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#d0d7de",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 15,
    color: "#1f2328",
    backgroundColor: "#ffffff"
  },
  filterRow: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0d7de",
    backgroundColor: "#ffffff"
  },
  filterButtonActive: {
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  filterText: {
    color: "#57606a",
    fontSize: 12,
    fontWeight: "800"
  },
  filterTextActive: {
    color: "#0969da"
  }
});
