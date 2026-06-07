import { dailyNutritionPlans, getNutritionItemById, getNutritionPlanById } from "@/data/nutrition";
import type { DailyNutritionPlan, NutritionItem, NutritionTiming } from "@/types/nutrition";
import type { DailyTrainingAdjustment, TrainingDayType } from "@/types/training";

const preTrainingOnlyIds = new Set(["l-citrulline", "pre-training-light-carb"]);

const timingLabels: Record<NutritionTiming, string> = {
  morning: "早上",
  preTraining45To60: "训练前 45-60 分钟",
  preTraining15To30: "训练前 15-30 分钟",
  duringTraining: "训练中",
  postTraining0To2h: "训练后 0-2 小时",
  dinner: "晚餐",
  evening: "晚间",
  beforeBed: "睡前",
  anytime: "任意时间",
  recoveryDay: "恢复日"
};

const nutritionPlanByDayType: Record<TrainingDayType, string> = {
  jump: "jump-day-nutrition",
  strength: "strength-day-nutrition",
  basketball: "basketball-day-nutrition",
  recovery: "recovery-day-nutrition",
  test: "test-day-nutrition",
  skill: "basketball-day-nutrition",
  rest: "rest-day-nutrition"
};

export function isTrainingDayType(dayType: TrainingDayType): boolean {
  return dayType !== "recovery" && dayType !== "rest";
}

export function isTrainingActiveForNutrition(
  dayType: TrainingDayType,
  adjustment?: DailyTrainingAdjustment
): boolean {
  if (!isTrainingDayType(dayType)) {
    return false;
  }

  return adjustment?.adjustmentType !== "recovery-only";
}

export function getNutritionTimingLabel(timing: NutritionTiming): string {
  return timingLabels[timing];
}

export function getNutritionPlanForDayType(dayType: TrainingDayType): DailyNutritionPlan {
  const planId = nutritionPlanByDayType[dayType];
  return getNutritionPlanById(planId) ?? dailyNutritionPlans[0];
}

export { getNutritionItemById, getNutritionPlanById };

export function getVisibleNutritionItems(
  items: NutritionItem[],
  options: { trainingActive: boolean }
): NutritionItem[] {
  return items.filter((item) => {
    if (!options.trainingActive && preTrainingOnlyIds.has(item.id)) {
      return false;
    }

    return true;
  });
}

export function groupNutritionItemsByTiming(items: NutritionItem[]): Array<{
  timing: NutritionTiming;
  label: string;
  items: NutritionItem[];
}> {
  const timingOrder: NutritionTiming[] = [
    "morning",
    "anytime",
    "preTraining45To60",
    "preTraining15To30",
    "duringTraining",
    "postTraining0To2h",
    "dinner",
    "evening",
    "beforeBed",
    "recoveryDay"
  ];

  return timingOrder
    .map((timing) => ({
      timing,
      label: getNutritionTimingLabel(timing),
      items: items.filter((item) => item.timing === timing)
    }))
    .filter((group) => group.items.length > 0);
}

export function getTopNutritionItemsForToday(
  dayType: TrainingDayType,
  options?: { trainingActive?: boolean; adjustment?: DailyTrainingAdjustment }
): NutritionItem[] {
  const trainingActive =
    options?.trainingActive ?? isTrainingActiveForNutrition(dayType, options?.adjustment);
  const plan = getNutritionPlanForDayType(dayType);
  const visibleItems = getVisibleNutritionItems(plan.items, { trainingActive });
  const preferredIds = trainingActive
    ? ["collagen-vitamin-c", "l-citrulline", "creatine", "whey-isolate", "magnesium-glycinate"]
    : ["creatine", "whey-isolate", "magnesium-glycinate", "zinc", "glutamine"];
  const preferredItems = preferredIds
    .map((id) => visibleItems.find((item) => item.id === id))
    .filter(Boolean) as NutritionItem[];

  return preferredItems.length > 0 ? preferredItems.slice(0, 5) : visibleItems.slice(0, 5);
}
