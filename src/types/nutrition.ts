import type { TrainingDayType } from "@/types/training";

export type NutritionTiming =
  | "morning"
  | "preTraining45To60"
  | "preTraining15To30"
  | "duringTraining"
  | "postTraining0To2h"
  | "dinner"
  | "evening"
  | "beforeBed"
  | "anytime"
  | "recoveryDay";

export type NutritionCategory =
  | "protein"
  | "carb"
  | "hydration"
  | "supplement"
  | "mineral"
  | "omega3"
  | "recovery"
  | "optional";

export type NutritionPriority = "core" | "useful" | "optional";

export interface SupplementProduct {
  id: string;
  name: string;
  shortNameZh: string;
  brand?: string;
  form: "powder" | "capsule" | "food" | "drink" | "other";
  defaultDose?: string;
  servingNote?: string;
  userOwns: boolean;
}

export interface NutritionItem {
  id: string;
  productId?: string;
  nameZh: string;
  nameEn?: string;
  category: NutritionCategory;
  priority: NutritionPriority;
  timing: NutritionTiming;
  dose?: string;
  purpose: string;
  whyForUser: string;
  instructions: string[];
  keyPoints?: string[];
  commonMistakes?: string[];
  cautions: string[];
  skipOrReduceWhen?: string[];
  optional?: boolean;
}

export interface DailyNutritionPlan {
  id: string;
  dayType: TrainingDayType;
  title: string;
  summary: string;
  items: NutritionItem[];
  notes: string[];
}

export interface NutritionScheduleEntry {
  time: string;
  label: string;
  itemIds: string[];
  notes?: string;
}
