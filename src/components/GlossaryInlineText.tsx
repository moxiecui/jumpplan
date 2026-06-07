import { StyleSheet, Text, View } from "react-native";

import { GlossaryTerm } from "@/components/GlossaryTerm";
import { findGlossaryTermsInText } from "@/logic/glossary";

interface GlossaryInlineTextProps {
  text: string;
}

const safeInlineTerms = new Set([
  "CMJ",
  "DOMS",
  "RPE",
  "RIR",
  "HRV",
  "RHR",
  "PAP",
  "PAPE",
  "RFD",
  "RSI",
  "ROM",
  "EPA",
  "DHA",
  "ZMA"
]);

export function GlossaryInlineText({ text }: GlossaryInlineTextProps) {
  const entries = findGlossaryTermsInText(text).filter((entry) => safeInlineTerms.has(entry.term));

  if (entries.length === 0) {
    return <Text style={styles.text}>{text}</Text>;
  }

  return (
    <View>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.termRow}>
        {entries.map((entry) => (
          <GlossaryTerm key={entry.id} entry={entry} compact />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    lineHeight: 23,
    color: "#24292f"
  },
  termRow: {
    marginTop: 8,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  }
});
