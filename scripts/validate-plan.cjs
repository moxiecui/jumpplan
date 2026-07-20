const fs = require("fs");
const Module = require("module");
const path = require("path");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    request = path.join(repoRoot, "src", request.slice(2));
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function transpileTypeScript(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true
    },
    fileName: filename
  });
  module._compile(output.outputText, filename);
};

const { trainingPlan } = require("../src/data/plan.ts");
const { evaluateDailyReadiness } = require("../src/logic/readinessScore.ts");
const { applyAdjustmentToDay, applyDay11PapDowngrade } = require("../src/logic/trainingAdjustment.ts");
const { classifyBasketballLoad, shouldDowngradePap } = require("../src/logic/basketballLoad.ts");
const { getTodayTrainingDay } = require("../src/logic/schedule.ts");
const { validateTrainingPlan } = require("../src/logic/planValidation.ts");
const { evaluateJumpReadiness } = require("../src/logic/jumpReadiness.ts");
const { recommendNextSession } = require("../src/logic/nextSessionRecommendation.ts");
const { getRightSideVolumeGuidance } = require("../src/logic/rightSideVolume.ts");
const { cycleOneScheduledSessions } = require("../src/data/adaptiveProgram.ts");
const {
  getAdaptiveDateForMacrocycleDay,
  resolveTrainingSessionForDate
} = require("../src/logic/sessionSchedule.ts");
const {
  getCycleOneDaySummary,
  validateCycleVariation
} = require("../src/logic/cycleVariationValidation.ts");

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Validation failed: ${message}`);
  }
}

const calm = {
  date: "2026-06-13",
  achillesStiffness: 0,
  patellarPain: 0,
  anteriorKneeSoreness: 0,
  painWithStairs: 0,
  painWithSquat: 0,
  painWithJumpLanding: 0,
  kneeWarmupResponse: "same",
  calfTightness: 0,
  sleepQuality: 4,
  hamstringSoreness: 0,
  upperBodySoreness: 0,
  generalDoms: 1,
  generalFatigue: 2,
  movementQualityToday: 4,
  legsFeelHeavy: false,
  basketballLoadLast24h: "none",
  basketballLoadLast48h: "none"
};

assert(trainingPlan.length === 84, "plan must contain 84 macrocycle days");
assert(getTodayTrainingDay(new Date("2026-07-19T12:00:00")).day === 1, "July 19 must be Day 1");
assert(getTodayTrainingDay(new Date("2026-07-25T12:00:00")).day === 7, "July 25 must be Day 7");
assert(getTodayTrainingDay(new Date("2026-08-08T12:00:00")).day === 21, "August 8 must be Day 21");
assert(getTodayTrainingDay(new Date("2026-08-09T12:00:00")).day === 22, "August 9 must be Day 22");
assert(getTodayTrainingDay(new Date("2026-10-10T12:00:00")).day === 84, "October 10 must be Day 84");
assert(classifyBasketballLoad({ durationMinutes: 80, sessionRpe: 8, fullCourt: true, repeatedMaxJumps: false }) === "high", "basketball high-load classification");
assert(shouldDowngradePap({ previousBasketballLoad: "moderate" }), "Day 11 PAP must downgrade after moderate basketball");
assert(applyDay11PapDowngrade(trainingPlan[10], "test").maxIntentJumpContacts.max === 0, "Day 11 downgrade removes max intent");

const tendonAdjustment = evaluateDailyReadiness({
  subjective: { ...calm, achillesStiffness: 4 },
  dayType: "jump"
});
assert(tendonAdjustment.adjustmentType === "recovery-only", "tendon pain override");

const hamstringAdjustment = evaluateDailyReadiness({
  subjective: { ...calm, hamstringSoreness: 4 },
  dayType: "jump"
});
assert(!hamstringAdjustment.allowMaxJump && !hamstringAdjustment.allowPAP, "hamstring soreness override");

const testAdjustment = evaluateDailyReadiness({
  subjective: { ...calm, basketballLoadLast24h: "high" },
  dayType: "test"
});
assert(testAdjustment.adjustmentType === "test-not-recommended", "Day 20 test downgrade");

const anteriorKneeAdjustment = evaluateDailyReadiness({
  subjective: { ...calm, anteriorKneeSoreness: 4 },
  dayType: "jump"
});
assert(anteriorKneeAdjustment.adjustmentType === "recovery-only", "anterior knee soreness override");

const jumpReadinessDrop = evaluateJumpReadiness(
  {
    date: "2026-07-19",
    attempts: [42, 43, 42],
    measurementType: "jump-height-cm",
    bestValue: 43,
    baselineValue: 46
  },
  {
    baseline: 46,
    movementQualityToday: 4,
    basketballLoadLast24h: "none"
  }
);
assert(jumpReadinessDrop.level === "red" && jumpReadinessDrop.recommendation === "technical-only", "CMJ drop greater than 5% blocks hard jumping");

const jumpReadinessPainOverride = evaluateJumpReadiness(
  {
    date: "2026-07-19",
    attempts: [49, 50, 50],
    measurementType: "jump-height-cm",
    bestValue: 50,
    baselineValue: 46
  },
  {
    baseline: 46,
    anteriorKneeSoreness: 4,
    movementQualityToday: 4,
    basketballLoadLast24h: "none"
  }
);
assert(jumpReadinessPainOverride.recommendation === "recovery-only", "good CMJ cannot override knee pain");

const painRecommendation = recommendNextSession({
  date: "2026-07-19",
  currentBlock: 1,
  completedSessionUnitsLast14Days: [],
  painAndMovement: { date: "2026-07-19", patellarPain: 4, movementQualityToday: 4, rightKneeTracking: 4 },
  basketballLoadLast24h: "none",
  basketballLoadLast48h: "none"
});
assert(painRecommendation.level === "recovery-only", "pain >=4 recommends recovery-only");

const basketballRecommendation = recommendNextSession({
  date: "2026-07-19",
  currentBlock: 3,
  completedSessionUnitsLast14Days: ["b1-strength-a", "b1-upper-core"],
  painAndMovement: { date: "2026-07-19", movementQualityToday: 4, rightKneeTracking: 4 },
  basketballLoadLast24h: "moderate",
  basketballLoadLast48h: "none"
});
assert(
  !basketballRecommendation.recommendedSessionUnitId.includes("reactive") &&
    !basketballRecommendation.recommendedSessionUnitId.includes("takeoff"),
  "moderate basketball load downgrades next high-impact recommendation"
);

const normalRecommendation = recommendNextSession({
  date: "2026-07-19",
  currentBlock: 1,
  completedSessionUnitsLast14Days: [],
  painAndMovement: { date: "2026-07-19", movementQualityToday: 4, rightKneeTracking: 4 },
  basketballLoadLast24h: "none",
  basketballLoadLast48h: "none"
});
assert(normalRecommendation.recommendedSessionUnitId.includes("strength-a"), "first adaptive recommendation should be Strength A");

function sessionExerciseSignature(session) {
  return session.exerciseBlocks
    .flatMap((block) => block.items.map((item) => item.exerciseId))
    .join("|");
}

function sessionVolume(session) {
  const multiplier = session.progressionMetadata?.volumeMultiplier ?? 1;
  return multiplier * session.exerciseBlocks.reduce(
    (sum, block) => sum + block.items.reduce((blockSum, item) => blockSum + (item.sets ?? 1), 0),
    0
  );
}

const cycleOneTypes = new Set(cycleOneScheduledSessions.map((session) => session.type));
assert(cycleOneTypes.size >= 5, "Cycle 1 must contain at least five distinct session-unit types");

for (let index = 1; index < cycleOneScheduledSessions.length; index += 1) {
  assert(
    sessionExerciseSignature(cycleOneScheduledSessions[index - 1]) !== sessionExerciseSignature(cycleOneScheduledSessions[index]),
    `Cycle 1 consecutive days ${index} and ${index + 1} must not have identical exercise lists`
  );
}

const day1 = cycleOneScheduledSessions.find((session) => session.id === "c1d01-strength-a");
const day8 = cycleOneScheduledSessions.find((session) => session.id === "c1d08-strength-a-progression");
const day3 = cycleOneScheduledSessions.find((session) => session.id === "c1d03-low-plyo-landing");
const day10 = cycleOneScheduledSessions.find((session) => session.id === "c1d10-low-plyo-single-leg-control");
const week2Volume = cycleOneScheduledSessions
  .filter((session) => session.progressionMetadata?.weekNumber === 2)
  .reduce((sum, session) => sum + sessionVolume(session), 0);
const week3Volume = cycleOneScheduledSessions
  .filter((session) => session.progressionMetadata?.weekNumber === 3)
  .reduce((sum, session) => sum + sessionVolume(session), 0);
assert(day8.progressionMetadata.volumeMultiplier > day1.progressionMetadata.volumeMultiplier, "Week 2 Strength A progresses Week 1");
assert((day10.plannedJumpContacts?.max ?? 0) > (day3.plannedJumpContacts?.max ?? 0), "Week 2 low plyo progresses Week 1 contacts");
assert(week3Volume < week2Volume * 0.75, "Week 3 volume must be lower than Week 2");

const mutationTarget = cycleOneScheduledSessions[0].exerciseBlocks[0].items[0];
const originalMutationValue = mutationTarget.exerciseId;
const neighborExerciseId = cycleOneScheduledSessions[1].exerciseBlocks[0].items[0].exerciseId;
mutationTarget.exerciseId = "__mutation-test__";
assert(
  cycleOneScheduledSessions[1].exerciseBlocks[0].items[0].exerciseId === neighborExerciseId,
  "modifying one generated day must not mutate another day"
);
mutationTarget.exerciseId = originalMutationValue;

const july20Session = resolveTrainingSessionForDate(new Date("2026-07-20T12:00:00"));
const planViewDayTwoSession = cycleOneScheduledSessions.find((session) => session.progressionMetadata?.macrocycleDay === 2);
assert(july20Session.session.id === planViewDayTwoSession.id, "Today and Plan resolve the same session for July 20");

const resolvedCycleOneIds = Array.from({ length: 21 }, (_, index) =>
  resolveTrainingSessionForDate(new Date(`${getAdaptiveDateForMacrocycleDay(index + 1)}T12:00:00`))
);
assert(new Set(resolvedCycleOneIds.map((resolved) => resolved.session.id)).size >= 5, "missing readiness data must not collapse Cycle 1 to one fallback");
assert(resolvedCycleOneIds.every((resolved) => !resolved.fallbackUsed), "Cycle 1 dates must resolve to generated sessions without fallback");

assert(
  getRightSideVolumeGuidance({ impactLevel: "high", rightKneeTracking: 5 }).maxExtraTechnicalSets === 0,
  "right side never gets extra high-impact volume"
);
assert(
  getRightSideVolumeGuidance({ impactLevel: "low", rightKneeTracking: 4, rightFootExternalRotation: 1 }).maxExtraTechnicalSets === 1,
  "right side can receive one low-intensity technical set when quality is stable"
);

const adjusted = applyAdjustmentToDay(trainingPlan[0], tendonAdjustment);
assert(adjusted !== trainingPlan[0], "adjustment returns a new day");
assert(trainingPlan[0].blocks[1].items.some((item) => item.exerciseId === "back-squat-on-bench"), "original day remains unchanged");

const report = validateTrainingPlan();
const variationReport = validateCycleVariation();
assert(report.adaptiveMacrocycleStartDate === "2026-07-19", "adaptive macrocycle starts July 19");
assert(variationReport.consecutiveIdenticalExerciseIds.length === 0, "Cycle 1 must not have identical consecutive exercise lists");
assert(variationReport.daysSharingSameObjectReference.length === 0, "Cycle 1 generated days must not share mutable object references");
assert(variationReport.duplicateSessionIds.length === 0, "Cycle 1 must not have duplicate session IDs");
assert(variationReport.weeksWithFewerThanThreeDistinctSessionTypes.length === 0, "Cycle 1 weeks need at least three session-unit types");
assert(variationReport.recoveryDaysContainingHighImpactExercises.length === 0, "Cycle 1 recovery days must not contain high-impact exercises");
assert(variationReport.deloadWeekVolumeNotLowerThanWeekTwo.length === 0, "Cycle 1 deload week must be lower than Week 2");
assert(variationReport.everyDateResolvingToSameFallbackSession.length === 0, "Cycle 1 dates must not all resolve to one fallback session");
assert(variationReport.fallbackResolvedDates.length === 0, "Cycle 1 generated schedule must not use fallback sessions");
assert(report.highImpactSessionTargetViolations.length === 0, "session-unit targets must cap high-impact days at two weekly");
assert(report.basketballTargetViolations.length === 0, "basketball target max must stay 0-1 weekly");
assert(report.recoverySessionDurationProblems.length === 0, "recovery session units must stay under 35 minutes");
assert(report.sessionUnitsMissingExerciseIds.length === 0, "session units reference missing exercise IDs");
assert(report.sessionUnitsMissingYoutubeQuery.length === 0, "session unit exercises need YouTube queries");
assert(report.sessionUnitsMissingProgressionOrRegression.length === 0, "session unit exercises need progression/regression");
assert(report.sessionUnitAdvancedOnlyMandatory.length === 0, "advanced-only session unit items must not be mandatory");
assert(report.recoveryDayProblems.length === 0, "recovery-day duration and item limits");
assert(report.highImpactRollingWindowViolations.length === 0, "no rolling seven-day window may exceed two high-impact days");
assert(report.highImpactAfterBasketball.length === 0, "no high-impact gym day immediately after basketball");
assert(report.hardNordicWithin48hOfBasketballOrTest.length === 0, "no hard Nordic within 48 hours of basketball or test");
assert(report.depthDropsInCycleOne.length === 0, "Cycle 1 must not include depth drops");
assert(report.continuousJumpDrillsBeforeCycleThree.length === 0, "continuous jump drills must wait until Cycle 3");
assert(report.continuousPlyometricAboveAllowedContacts.length === 0, "continuous jump drills must stay low-dose");
assert(report.weightedDepthJumpInCycleOneOrTestWeek.length === 0, "weighted depth jumps must not appear in Cycle 1 or test week");
assert(report.mandatoryAdvancedOnlyExercises.length === 0, "advanced-only exercises must never be mandatory");
assert(report.olympicLiftWithoutSafeAlternative.length === 0, "Olympic-lift-derived actions need safe alternatives");
assert(report.kneeSensitiveDaysWithHighImpactJumps.length === 0, "knee-sensitive days must not include high-impact jumps");
assert(report.missingExerciseIds.length === 0, "plan references missing exercise IDs");
assert(report.missingSingleLegExerciseIds.length === 0, "new single-leg exercise IDs must exist");
assert(report.missingAdvancedExerciseIds.length === 0, "advanced Month 3/4 exercises must exist");
assert(report.missingScreenshotMenuExerciseIds.length === 0, "screenshot menu exercises must exist or map safely");
assert(report.singleLegExercisesMissingProgressionSets.length === 0, "new single-leg exercises need progression/regression criteria");
assert(report.singleLegExercisesMissingTrackingFields.length === 0, "new single-leg exercises need tracking fields");
assert(report.exercisesMissingYoutubeQuery.length === 0, "all exercises need YouTube search queries");
assert(report.duplicateExerciseIds.length === 0, "duplicate exercise IDs");

console.log(JSON.stringify({ checks: "passed", cycleOneDaySummary: getCycleOneDaySummary(), variationReport, report }, null, 2));
