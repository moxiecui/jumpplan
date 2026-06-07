import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { getGlossaryCategoryLabel } from "@/logic/glossary";
import type { GlossaryEntry } from "@/types/glossary";

interface GlossaryCardProps {
  entry: GlossaryEntry;
}

export function GlossaryCard({ entry }: GlossaryCardProps) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/glossary/[id]",
          params: { id: entry.id }
        } as never)
      }
    >
      <View style={styles.header}>
        <Text style={styles.term}>{entry.term}</Text>
        <Text style={styles.category}>{getGlossaryCategoryLabel(entry.category)}</Text>
      </View>
      {entry.fullName ? <Text style={styles.fullName}>{entry.fullName}</Text> : null}
      <Text style={styles.definition}>{entry.shortDefinition}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8dee4",
    backgroundColor: "#ffffff",
    marginBottom: 10
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10
  },
  term: {
    flex: 1,
    fontSize: 18,
    fontWeight: "900",
    color: "#1f2328"
  },
  category: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eaeef2",
    color: "#57606a",
    fontSize: 12,
    fontWeight: "800"
  },
  fullName: {
    marginTop: 4,
    fontSize: 13,
    color: "#57606a",
    fontWeight: "700"
  },
  definition: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: "#24292f"
  }
});
