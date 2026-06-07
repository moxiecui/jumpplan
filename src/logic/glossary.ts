import { glossaryEntries } from "@/data/glossary";
import type { GlossaryCategory, GlossaryEntry } from "@/types/glossary";

const categoryLabels: Record<GlossaryCategory, string> = {
  "jump-training": "弹跳训练",
  "strength-training": "力量训练",
  recovery: "恢复",
  readiness: "Readiness",
  nutrition: "营养补剂",
  wearable: "穿戴设备",
  "injury-risk": "伤病风险",
  general: "通用"
};

export function getGlossaryEntryById(id: string): GlossaryEntry | undefined {
  return glossaryEntries.find((entry) => entry.id === id);
}

export function getGlossaryEntryByTerm(term: string): GlossaryEntry | undefined {
  const normalized = term.trim().toLowerCase();
  return glossaryEntries.find(
    (entry) =>
      entry.term.toLowerCase() === normalized ||
      entry.fullName?.toLowerCase() === normalized ||
      entry.id.toLowerCase() === normalized
  );
}

export function getGlossaryEntriesByCategory(category: GlossaryCategory): GlossaryEntry[] {
  return glossaryEntries.filter((entry) => entry.category === category);
}

export function getGlossaryCategoryLabel(category: GlossaryCategory): string {
  return categoryLabels[category];
}

export function getAllGlossaryCategories(): GlossaryCategory[] {
  return Object.keys(categoryLabels) as GlossaryCategory[];
}

export function findGlossaryTermsInText(text: string): GlossaryEntry[] {
  if (!text.trim()) {
    return [];
  }

  const normalizedText = text.toLowerCase();
  const matches = glossaryEntries.filter((entry) => {
    const candidates = [entry.term, entry.fullName, entry.id].filter(Boolean) as string[];
    return candidates.some((candidate) => {
      const normalizedCandidate = candidate.toLowerCase();
      if (normalizedCandidate.length <= 2) {
        return normalizedText.split(/[^a-z0-9]+/i).includes(normalizedCandidate);
      }

      return normalizedText.includes(normalizedCandidate);
    });
  });

  return matches.sort((a, b) => a.term.localeCompare(b.term));
}

export function getGlossaryEntriesByIds(ids: string[]): GlossaryEntry[] {
  return ids
    .map((id) => getGlossaryEntryById(id))
    .filter(Boolean) as GlossaryEntry[];
}
