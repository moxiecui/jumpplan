import { exercises } from "@/data/exercises";
import { glossaryEntries } from "@/data/glossary";
import { dailyNutritionPlans, nutritionItems } from "@/data/nutrition";
import { trainingPlan } from "@/data/plan";
import { trainingCycles } from "@/data/macrocycle";
import {
  ADAPTIVE_MACROCYCLE_START_DATE,
  adaptiveMigrationSummary,
  trainingSessionUnits,
  weeklySessionTargets
} from "@/data/adaptiveProgram";
import {
  singleLegProgressionLadder,
  singleLegStiffnessExerciseIds
} from "@/data/singleLegStiffness";
import { canUseAdvancedExercise, getSafeAlternativeExerciseIds } from "@/logic/advancedExerciseGates";
import { validateCycleVariation } from "@/logic/cycleVariationValidation";
import { buildRollingSevenDaySummaries } from "@/logic/jumpContacts";
import { isHighImpactExercise } from "@/logic/trainingAdjustment";
import type { SessionUnitType } from "@/types/training";

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
const advancedExerciseIds = [
  "kettlebell-swing",
  "kettlebell-swing-with-band",
  "clean-pull",
  "power-clean",
  "clean-pull-to-power-clean",
  "db-power-snatch",
  "squat-jerk",
  "assist-squat-jump",
  "depth-jump-less-contact",
  "depth-jump-to-vertical-jump-with-weight",
  "concentric-jump-to-vertical-jump-with-weight",
  "back-squat-on-bench",
  "db-squat-jump",
  "front-bulgarian-squat",
  "full-range-lunge",
  "hanging-abs-curl",
  "band-hip-flexor",
  "band-hamstring-curl",
  "penultimate-jump",
  "single-leg-snatch-with-body-control",
  "russian-twist",
  "good-morning",
  "single-leg-tuck-jump",
  "single-leg-double-tuck-jump"
];
const olympicLiftIds = new Set(["power-clean", "squat-jerk", "clean-pull-to-power-clean"]);
const weightedDepthJumpId = "depth-jump-to-vertical-jump-with-weight";
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
  "bridge",
  ...advancedExerciseIds
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
  const scheduledExerciseEntries = trainingPlan.flatMap((day) =>
    day.blocks.flatMap((block) =>
      block.items.map((item) => ({
        day,
        block,
        item,
        exercise: exercises.find((exercise) => exercise.id === item.exerciseId)
      }))
    )
  );
  const sessionUnitExerciseEntries = trainingSessionUnits.flatMap((unit) =>
    unit.exerciseBlocks.flatMap((block) =>
      block.items.map((item) => ({
        unit,
        block,
        item,
        exercise: exercises.find((exercise) => exercise.id === item.exerciseId)
      }))
    )
  );
  const referencedSessionUnitExerciseIds = sessionUnitExerciseEntries.map(({ item }) => item.exerciseId);
  const highImpactSessionTypes = new Set(
    trainingSessionUnits.filter((unit) => unit.impactLevel === "high").map((unit) => unit.type)
  );

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
  const continuousPlyometricAboveAllowedContacts = scheduledExerciseEntries
    .filter(({ item }) => continuousJumpIds.has(item.exerciseId))
    .filter(({ item }) => (item.jumpContacts?.max ?? 0) > 12)
    .map(({ day, item }) => `Day ${day.day}: ${item.exerciseId} ${item.jumpContacts?.max ?? 0} contacts`);
  const weightedDepthJumpInCycleOneOrTestWeek = scheduledExerciseEntries
    .filter(({ item }) => item.exerciseId === weightedDepthJumpId)
    .filter(({ day }) => day.cycleNumber === 1 || day.weekNumber === 12 || day.type === "test")
    .map(({ day }) => `Day ${day.day}`);
  const mandatoryAdvancedOnlyExercises = scheduledExerciseEntries
    .filter(({ exercise }) => exercise?.riskTier === "advanced-only" || exercise?.advancedOnly)
    .filter(({ item }) => !item.optional)
    .map(({ day, item }) => `Day ${day.day}: ${item.exerciseId}`);
  const olympicLiftWithoutSafeAlternative = exercises
    .filter((exercise) => olympicLiftIds.has(exercise.id))
    .filter((exercise) => getSafeAlternativeExerciseIds(exercise).length === 0)
    .map((exercise) => exercise.id);
  const advancedExercisesIncludedByCycle = trainingCycles.map((cycle) => ({
    cycleNumber: cycle.cycleNumber,
    exerciseIds: unique(
      scheduledExerciseEntries
        .filter(({ day }) => day.cycleNumber === cycle.cycleNumber)
        .filter(({ exercise }) => exercise?.riskTier === "high" || exercise?.riskTier === "advanced-only" || exercise?.category === "power")
        .map(({ item }) => item.exerciseId)
    )
  }));
  const advancedOnlyExercisesIncludedByCycle = trainingCycles.map((cycle) => ({
    cycleNumber: cycle.cycleNumber,
    exerciseIds: unique(
      scheduledExerciseEntries
        .filter(({ day }) => day.cycleNumber === cycle.cycleNumber)
        .filter(({ exercise }) => exercise?.riskTier === "advanced-only" || exercise?.advancedOnly)
        .map(({ item }) => item.exerciseId)
    )
  }));
  const advancedExercisesBlockedByReadinessGates = unique(
    scheduledExerciseEntries
      .filter(({ exercise }) => exercise?.riskTier === "high" || exercise?.riskTier === "advanced-only" || exercise?.category === "power")
      .flatMap(({ day, item, exercise }) => {
        if (!exercise) {
          return [];
        }
        const result = canUseAdvancedExercise({
          readinessLevel: "yellow",
          anteriorKneeSoreness: 3,
          achillesStiffness: 0,
          patellarPain: 0,
          hamstringSoreness: 0,
          rightFootExternalRotation: 1,
          rightKneeTracking: 3,
          landingQuality: 3,
          movementQualityToday: 3,
          basketballLoadLast24h: "moderate",
          basketballLoadLast48h: "high",
          isAdvancedOnly: exercise.riskTier === "advanced-only" || exercise.advancedOnly,
          userEnabledAdvancedExercise: false
        });
        return result.allowed ? [] : [`Day ${day.day}: ${item.exerciseId} blocked (${result.reasons[0]})`];
      })
  );
  const kneeSensitiveDaysWithHighImpactJumps = trainingPlan
    .filter((day) => day.todayPriority === "knee-calm")
    .filter((day) =>
      day.blocks.some((block) =>
        block.items.some((item) => isHighImpactExercise(item.exerciseId, item.notes))
      )
    )
    .map((day) => day.day);
  const highImpactSessionTargetViolations = weeklySessionTargets
    .map((target) => ({
      weekNumber: target.weekNumber,
      highImpactMax: Object.entries(target.unitTargets).reduce(
        (count, [type, value]) => count + (highImpactSessionTypes.has(type as SessionUnitType) ? value?.max ?? 0 : 0),
        0
      )
    }))
    .filter((target) => target.highImpactMax > 2)
    .map((target) => `Week ${target.weekNumber}: ${target.highImpactMax} high-impact session targets`);
  const basketballTargetViolations = weeklySessionTargets
    .filter((target) => (target.unitTargets["basketball-skill"]?.max ?? 0) > 1)
    .map((target) => `Week ${target.weekNumber}: basketball target max ${target.unitTargets["basketball-skill"]?.max}`);
  const recoverySessionDurationProblems = trainingSessionUnits
    .filter((unit) => unit.type === "recovery" || unit.type === "review")
    .filter((unit) => (unit.estimatedDurationMinutes?.max ?? 0) > 35)
    .map((unit) => `${unit.id}: ${unit.estimatedDurationMinutes?.max} min`);
  const sessionUnitsMissingExerciseIds = unique(
    referencedSessionUnitExerciseIds.filter((id) => !exerciseIds.has(id))
  );
  const sessionUnitsMissingYoutubeQuery = unique(
    sessionUnitExerciseEntries
      .filter(({ exercise }) => exercise && !exercise.youtubeSearchQuery)
      .map(({ item }) => item.exerciseId)
  );
  const sessionUnitsMissingProgressionOrRegression = unique(
    sessionUnitExerciseEntries
      .filter(({ exercise }) => exercise && (!exercise.progressions?.length || !exercise.regressions?.length))
      .map(({ item }) => item.exerciseId)
  );
  const sessionUnitAdvancedOnlyMandatory = sessionUnitExerciseEntries
    .filter(({ exercise }) => exercise?.riskTier === "advanced-only" || exercise?.advancedOnly)
    .filter(({ item }) => !item.optional)
    .map(({ unit, item }) => `${unit.id}: ${item.exerciseId}`);

  const cycleVariationReport = validateCycleVariation();

  return {
    migrationSummary: adaptiveMigrationSummary,
    cycleVariationReport,
    adaptiveMacrocycleStartDate: ADAPTIVE_MACROCYCLE_START_DATE,
    sessionUnitCount: trainingSessionUnits.length,
    weeklySessionTargets: weeklySessionTargets.map((target) => ({
      weekNumber: target.weekNumber,
      blockNumber: target.blockNumber,
      deload: Boolean(target.deload),
      unitTargets: target.unitTargets
    })),
    highImpactSessionTargetViolations,
    basketballTargetViolations,
    recoverySessionDurationProblems,
    sessionUnitsMissingExerciseIds,
    sessionUnitsMissingYoutubeQuery,
    sessionUnitsMissingProgressionOrRegression,
    sessionUnitAdvancedOnlyMandatory,
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
    continuousPlyometricAboveAllowedContacts,
    weightedDepthJumpInCycleOneOrTestWeek,
    mandatoryAdvancedOnlyExercises,
    olympicLiftWithoutSafeAlternative,
    advancedExercisesIncludedByCycle,
    advancedOnlyExercisesIncludedByCycle,
    advancedExercisesBlockedByReadinessGates,
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
    advancedExerciseIds,
    missingAdvancedExerciseIds: advancedExerciseIds.filter((id) => !exerciseIds.has(id)),
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
