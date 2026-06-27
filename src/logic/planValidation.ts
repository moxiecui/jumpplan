import { exercises } from "@/data/exercises";
import { glossaryEntries } from "@/data/glossary";
import { dailyNutritionPlans, nutritionItems } from "@/data/nutrition";
import { trainingPlan } from "@/data/plan";
import { trainingCycles } from "@/data/macrocycle";
import {
  singleLegProgressionLadder,
  singleLegStiffnessExerciseIds
} from "@/data/singleLegStiffness";
import { buildRollingSevenDaySummaries } from "@/logic/jumpContacts";
import { isHighImpactExercise } from "@/logic/trainingAdjustment";

const hardHamstringIds = new Set([
  "nordic-curl",
  "rdl",
  "trap-bar-deadlift",
  "single-leg-good-morning",
  "single-leg-rdl-top-lock",
  "bulgarian-split-squat-eccentric",
  "hamstring-slider-curl"
]);
const hardNordicIds = new Set(["nordic-curl"]);

const depthDropIds = new Set(["depth-drop", "single-leg-depth-drop"]);
const continuousJumpIds = new Set([
  "continuous-tuck-jump",
  "continuous-lunge-jump",
  "continuous-squat-jump"
]);
const screenshotMenuExerciseIds = [
  "tuck-jump",
  "continuous-tuck-jump",
  "lunge-jump",
  "continuous-lunge-jump",
  "box-jump",
  "squat-jump",
  "continuous-squat-jump",
  "depth-drop",
  "single-leg-depth-drop",
  "single-leg-hurdle-jump-to-squat-jump",
  "bulgarian-split-squat",
  "bulgarian-split-squat-with-heel-up",
  "reverse-lunge",
  "reverse-lunge-with-height",
  "lunge-with-heel-up",
  "front-squat",
  "goblet-squat",
  "side-lunge",
  "single-leg-good-morning",
  "eccentric-single-leg-squat",
  "calf-raise-with-plate-under-front-foot",
  "single-leg-calf-raise-with-plate-under-front-foot",
  "tibialis-raise",
  "cable-core-exercises",
  "plank",
  "side-plank-with-knee-drive-hold",
  "hip-90-90-seated-rotation",
  "hip-90-90-standing-rotation",
  "single-leg-weight-exchange",
  "single-leg-weight-exchange-with-row",
  "lunge-hold",
  "bulgarian-squat-hold",
  "single-leg-bridge",
  "bridge"
];

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
  const highImpactRollingWindowViolations = rollingWindows
    .filter((window) => window.highImpactDays > 2)
    .map((window) => `${window.startDay}-${window.endDay}: ${window.highImpactDays} high-impact days`);
  const weeklyJumpContacts = Array.from({ length: 12 }, (_, index) => {
    const weekNumber = index + 1;
    const weekDays = trainingPlan.filter((day) => day.weekNumber === weekNumber);
    return {
      weekNumber,
      plannedJumpContacts: {
        min: weekDays.reduce((sum, day) => sum + (day.plannedJumpContacts?.min ?? 0), 0),
        max: weekDays.reduce((sum, day) => sum + (day.plannedJumpContacts?.max ?? 0), 0)
      },
      maxIntentContacts: {
        min: weekDays.reduce((sum, day) => sum + (day.maxIntentJumpContacts?.min ?? 0), 0),
        max: weekDays.reduce((sum, day) => sum + (day.maxIntentJumpContacts?.max ?? 0), 0)
      }
    };
  });
  const consecutiveModerateHighLowerBodyDays: string[] = [];
  const duplicateExerciseIds = unique(
    exercises
      .map((exercise) => exercise.id)
      .filter((id, index, allIds) => allIds.indexOf(id) !== index)
  );
  const requestedSingleLegContactDays = [1, 8, 11, 13, 19, 20];
  const highImpactDays = trainingPlan
    .filter((day) => day.impactLevel === "high")
    .map((day) => day.day);

  for (let index = 1; index < trainingPlan.length; index += 1) {
    const previous = trainingPlan[index - 1];
    const current = trainingPlan[index];
    const previousHard = previous.impactLevel === "moderate" || previous.impactLevel === "high";
    const currentHard = current.impactLevel === "moderate" || current.impactLevel === "high";
    if (previousHard && currentHard) {
      consecutiveModerateHighLowerBodyDays.push(`Day ${previous.day} → Day ${current.day}`);
    }
  }

  const testDays = trainingPlan.filter((day) => day.type === "test").map((day) => day.day);
  const hardHamstringWithin48hOfTest = unique(
    testDays.flatMap((testDay) =>
      trainingPlan
        .filter((day) => day.day >= testDay - 2 && day.day < testDay)
        .filter((day) =>
          day.blocks.some((block) =>
            block.items.some(
              (item) => hardHamstringIds.has(item.exerciseId) && item.intensity !== "low"
            )
          )
        )
        .map((day) => `Day ${day.day} before test Day ${testDay}`)
    )
  );
  const hardNordicWithin48hOfBasketballOrTest = unique(
    trainingPlan
      .filter((day) =>
        day.blocks.some((block) =>
          block.items.some(
            (item) => hardNordicIds.has(item.exerciseId) && item.intensity !== "low"
          )
        )
      )
      .flatMap((day) => {
        const nextTwoDays = trainingPlan.filter(
          (nextDay) => nextDay.day > day.day && nextDay.day <= day.day + 2
        );
        return nextTwoDays.some(
          (nextDay) => nextDay.type === "basketball" || nextDay.type === "skill" || nextDay.type === "test"
        )
          ? [`Day ${day.day} before basketball/skill/test`]
          : [];
      })
  );

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
  const highImpactAfterBasketball = trainingPlan
    .filter((day, index) => {
      const previous = trainingPlan[index - 1];
      return Boolean(previous?.type === "basketball" && day.impactLevel === "high");
    })
    .map((day) => day.day);
  const depthDropsInCycleOne = trainingPlan
    .filter((day) => day.cycleNumber === 1)
    .filter((day) =>
      day.blocks.some((block) => block.items.some((item) => depthDropIds.has(item.exerciseId)))
    )
    .map((day) => day.day);
  const continuousJumpDrillsBeforeCycleThree = trainingPlan
    .filter((day) => day.cycleNumber < 3)
    .filter((day) =>
      day.blocks.some((block) => block.items.some((item) => continuousJumpIds.has(item.exerciseId)))
    )
    .map((day) => day.day);
  const kneeSensitiveDaysWithHighImpactJumps = trainingPlan
    .filter((day) => day.todayPriority === "knee-calm")
    .filter((day) =>
      day.blocks.some((block) =>
        block.items.some((item) => isHighImpactExercise(item.exerciseId, item.notes))
      )
    )
    .map((day) => day.day);

  return {
    planDays: trainingPlan.length,
    cycles: trainingCycles.map((cycle) => ({
      cycleNumber: cycle.cycleNumber,
      days: `${cycle.startDay}-${cycle.endDay}`,
      title: cycle.title,
      phase: cycle.phase,
      testDays: cycle.testDays
    })),
    phases: unique(trainingPlan.map((day) => String(day.phase))),
    macrocyclePhases: unique(trainingPlan.map((day) => day.macrocyclePhase)),
    rollingSevenDayWindows: rollingWindows.map((window) => ({
      days: `${window.startDay}-${window.endDay}`,
      highImpactDays: window.highImpactDays,
      plannedJumpContacts: `${window.plannedGymContacts.min}-${window.plannedGymContacts.max}`,
      maxIntentContacts: window.maxIntentContacts
    })),
    highImpactRollingWindowViolations,
    weeklyJumpContacts,
    unresolvedVariableBasketballLoadDays: trainingPlan
      .filter((day) => day.impactLevel === "variable")
      .map((day) => day.day),
    consecutiveModerateHighLowerBodyDays,
    hardHamstringWithin48hOfTest,
    hardNordicWithin48hOfBasketballOrTest,
    highImpactAfterBasketball,
    depthDropsInCycleOne,
    continuousJumpDrillsBeforeCycleThree,
    kneeSensitiveDaysWithHighImpactJumps,
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
    recoveryDaysUnder35Minutes: trainingPlan
      .filter((day) => day.type === "recovery" || day.type === "rest")
      .every((day) => (day.estimatedDurationMinutes?.max ?? 0) <= 35),
    highImpactDays,
    highImpactDayCountByCycle: trainingCycles.map((cycle) => ({
      cycleNumber: cycle.cycleNumber,
      highImpactDays: highImpactDays.filter((day) => day >= cycle.startDay && day <= cycle.endDay)
    })),
    updatedPlannedJumpContacts: requestedSingleLegContactDays.map((dayNumber) => {
      const day = trainingPlan.find((item) => item.day === dayNumber);
      return {
        day: dayNumber,
        plannedJumpContacts: day?.plannedJumpContacts
          ? `${day.plannedJumpContacts.min}-${day.plannedJumpContacts.max}`
          : "none",
        maxIntentJumpContacts: day?.maxIntentJumpContacts
          ? `${day.maxIntentJumpContacts.min}-${day.maxIntentJumpContacts.max}`
          : "none"
      };
    }),
    newSingleLegExerciseIds: singleLegStiffnessExerciseIds,
    missingSingleLegExerciseIds: singleLegStiffnessExerciseIds.filter((id) => !exerciseIds.has(id)),
    screenshotMenuExerciseIds,
    missingScreenshotMenuExerciseIds: screenshotMenuExerciseIds.filter((id) => !exerciseIds.has(id)),
    singleLegExercisesMissingProgressionSets: singleLegStiffnessExerciseIds.filter((id) => {
      const exercise = exercises.find((item) => item.id === id);
      return !exercise?.progressions?.length || !exercise.regressions?.length || !exercise.progressionCriteria?.length || !exercise.regressionCriteria?.length;
    }),
    singleLegExercisesMissingTrackingFields: singleLegStiffnessExerciseIds.filter((id) => {
      const exercise = exercises.find((item) => item.id === id);
      return !exercise?.trackingFields?.length;
    }),
    missingProgressionLadderExerciseIds: unique(
      singleLegProgressionLadder.flatMap((step) => step.exercises).filter((id) => !exerciseIds.has(id))
    ),
    duplicateExerciseIds,
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
