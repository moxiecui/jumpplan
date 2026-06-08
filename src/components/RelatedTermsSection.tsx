import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { GlossaryTerm } from "@/components/GlossaryTerm";
import { getGlossaryCategoryLabel } from "@/logic/glossary";
import type { GlossaryEntry } from "@/types/glossary";

interface RelatedTermsSectionProps {
  terms: GlossaryEntry[];
  defaultExpanded?: boolean;
}

export function RelatedTermsSection({ terms, defaultExpanded = false }: RelatedTermsSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (terms.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={() => setExpanded((value) => !value)}>
        <Text style={styles.title}>相关术语，可选阅读</Text>
        <Text style={styles.toggle}>{expanded ? "收起" : `展开 ${Math.min(terms.length, 5)} 项`}</Text>
      </Pressable>
      {expanded ? (
        <>
          {terms.slice(0, 5).map((term) => (
            <View key={term.id} style={styles.termRow}>
              <View style={styles.termHeader}>
                <GlossaryTerm entry={term} compact />
                <Text style={styles.category}>{getGlossaryCategoryLabel(term.category)}</Text>
              </View>
              {term.fullName ? <Text style={styles.termEn}>{term.fullName}</Text> : null}
              <Text style={styles.summary}>{term.shortDefinition}</Text>
            </View>
          ))}
        </>
      ) : (
        <Text style={styles.collapsedText}>训练时可以先跳过；需要解释 CMJ、PAP、HRV 等术语时再展开。</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff"
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1f2328"
  },
  header: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  toggle: {
    color: "#0969da",
    fontSize: 13,
    fontWeight: "900"
  },
  collapsedText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: "#57606a"
  },
  termRow: {
    marginTop: 12
  },
  termHeader: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8
  },
  category: {
    fontSize: 12,
    color: "#57606a",
    fontWeight: "800"
  },
  termEn: {
    marginTop: 5,
    color: "#57606a",
    fontSize: 13,
    fontWeight: "700"
  },
  summary: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#57606a"
  }
});
