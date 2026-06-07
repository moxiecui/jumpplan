import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

import type { GlossaryEntry } from "@/types/glossary";

interface GlossaryTermProps {
  entry: GlossaryEntry;
  compact?: boolean;
}

export function GlossaryTerm({ entry, compact = false }: GlossaryTermProps) {
  const router = useRouter();

  return (
    <Pressable
      style={[styles.chip, compact && styles.compactChip]}
      onPress={() =>
        router.push({
          pathname: "/glossary/[id]",
          params: { id: entry.id }
        } as never)
      }
    >
      <Text style={[styles.text, compact && styles.compactText]}>{entry.term}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#0969da",
    backgroundColor: "#ddf4ff"
  },
  compactChip: {
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  text: {
    color: "#0969da",
    fontSize: 13,
    fontWeight: "900"
  },
  compactText: {
    fontSize: 12
  }
});
