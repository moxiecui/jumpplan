export type GlossaryCategory =
  | "jump-training"
  | "strength-training"
  | "recovery"
  | "readiness"
  | "nutrition"
  | "wearable"
  | "injury-risk"
  | "general";

export interface GlossaryEntry {
  id: string;
  term: string;
  fullName?: string;
  category: GlossaryCategory;
  shortDefinition: string;
  detailedExplanation: string;
  whyItMattersForUser?: string;
  practicalUse?: string[];
  watchOut?: string[];
  relatedTerms?: string[];
}
