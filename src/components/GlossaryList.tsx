import { StyleSheet, Text, View } from "react-native";

import { GlossaryCard } from "@/components/GlossaryCard";
import type { GlossaryEntry } from "@/types/glossary";

interface GlossaryListProps {
  entries: GlossaryEntry[];
}

export function GlossaryList({ entries }: GlossaryListProps) {
  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>没有匹配的术语。</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {entries.map((entry) => (
        <GlossaryCard key={entry.id} entry={entry} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 14
  },
  empty: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  emptyText: {
    fontSize: 14,
    color: "#57606a"
  }
});
