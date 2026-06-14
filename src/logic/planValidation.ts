import { exercises } from "@/data/exercises";
import { glossaryEntries } from "@/data/glossary";
import { dailyNutritionPlans, nutritionItems } from "@/data/nutrition";
import { trainingPlan } from "@/data/plan";
import { buildRollingSevenDaySummaries } from "@/logic/jumpContacts";

const hardHamstringIds = new Set([
  "nordic-curl",
  "rdl",
  "trap-bar-deadlift",
  "bulgarian-split-squat-eccentric",
  "hamstring-slider-curl"
]);

function unique(values: string[]) {
  return [...new Set(values)];
}

export function validateTrainingPlan() {
  const exerciseIds = new Set(exercises.map((exercise) => exercise.id));
  const nutritionIds = new Set(nutritionItems.map((item) => item.id));
  const nutritionPlanIds = new Set(dailyNutritionPlans.map((plan) => plan.id));
  const glossaryIds = new Set(glossaryEntries.map((entry) => entry.id));
  const referencedExerciseIds = trainingPlan.flatMap((day) =>
    day.blocks.flatMap((block) => block.items.map((item) => item.exerciseId))
  );
  const referencedNutritionIds = dailyNutritionPlans.flatMap((plan) =>
    plan.items.map((item) => item.id)
  );
  const referencedGlossaryIds = glossaryEntries.flatMap((entry) => entry.relatedTerms ?? []);
  const rollingWindows = buildRollingSevenDaySummaries(trainingPlan);
  const consecutiveModerateHighLowerBodyDays: string[] = [];

  for (let index = 1; index < trainingPlan.length; index += 1) {
    const previous = trainingPlan[index - 1];
    const current = trainingPlan[index];
    const previousHard = previous.impactLevel === "moderate" || previous.impactLevel === "high";
    const currentHard = current.impactLevel === "moderate" || current.impactLevel === "high";
    if (previousHard && currentHard) {
      consecutiveModerateHighLowerBodyDays.push(`Day ${previous.day} → Day ${current.day}`);
    }
  }

  const testIndex = trainingPlan.findIndex((day) => day.type === "test");
  const hardHamstringWithin48h =
    testIndex < 0
      ? []
      : trainingPlan
          .slice(Math.max(0, testIndex - 2), testIndex)
          .filter((day) =>
            day.blocks.some((block) =>
              block.items.some(
                (item) => hardHamstringIds.has(item.exerciseId) && item.intensity !== "low"
              )
            )
          )
          .map((day) => day.day);

  const recoveryDayProblems = trainingPlan
    .filter((day) => day.type === "recovery" || day.type === "rest")
    .flatMap((day) => {
      const mainItems = day.blocks.find((block) => block.type === "main")?.items.length ?? 0;
      const problems: string[] = [];
      if ((day.estimatedDurationMinutes?.max ?? 0) > 35) {
        problems.push(`Day ${day.day}: recovery duration exceeds 35 minutes`);
      }
      if (mainItems > 5) {
        problems.push(`Day ${day.day}: recovery main block has ${mainItems} items`);
      }
      return problems;
    });

  return {
    planDays: trainingPlan.length,
    phases: unique(trainingPlan.map((day) => String(day.phase))),
    rollingSevenDayWindows: rollingWindows.map((window) => ({
      days: `${window.startDay}-${window.endDay}`,
      highImpactDays: window.highImpactDays,
      plannedJumpContacts: `${window.plannedGymContacts.min}-${window.plannedGymContacts.max}`,
      maxIntentContacts: window.maxIntentContacts
    })),
    unresolvedVariableBasketballLoadDays: trainingPlan
      .filter((day) => day.impactLevel === "variable")
      .map((day) => day.day),
    consecutiveModerateHighLowerBodyDays,
    hardHamstringWithin48hOfTest: hardHamstringWithin48h,
    possibleMaximumJumpsAfterVariableBasketball: trainingPlan
      .filter((day, index) => {
        const previous = trainingPlan[index - 1];
        return Boolean(
          previous?.impactLevel === "variable" &&
            (day.maxIntentJumpContacts?.max ?? 0) > 0
        );
      })
      .map((day) => day.day),
    recoveryDayProblems,
    missingExerciseIds: unique(referencedExerciseIds.filter((id) => !exerciseIds.has(id))),
    missingNutritionItemIds: unique(referencedNutritionIds.filter((id) => !nutritionIds.has(id))),
    missingNutritionPlanIds: unique(
      trainingPlan
        .map((day) => day.nutritionPlanId)
        .filter(
          (id): id is string =>
            typeof id === "string" && !nutritionPlanIds.has(id)
        )
    ),
    missingGlossaryIds: unique(referencedGlossaryIds.filter((id) => !glossaryIds.has(id))),
    exercisesMissingYoutubeQuery: exercises
      .filter((exercise) => !exercise.youtubeSearchQuery)
      .map((exercise) => exercise.id),
    exercisesMissingProgressions: exercises
      .filter((exercise) => !exercise.progressions?.length)
      .map((exercise) => exercise.id),
    exercisesMissingRegressions: exercises
      .filter((exercise) => !exercise.regressions?.length)
      .map((exercise) => exercise.id)
  };
}
