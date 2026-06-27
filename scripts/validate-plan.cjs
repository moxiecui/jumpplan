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
assert(getTodayTrainingDay(new Date("2026-06-13T12:00:00")).day === 7, "June 13 must be Day 7");
assert(getTodayTrainingDay(new Date("2026-06-27T12:00:00")).day === 21, "June 27 must be Day 21");
assert(getTodayTrainingDay(new Date("2026-06-28T12:00:00")).day === 22, "June 28 must be Day 22");
assert(getTodayTrainingDay(new Date("2026-07-10T12:00:00")).day === 34, "July 10 must be Day 34");
assert(getTodayTrainingDay(new Date("2026-08-29T12:00:00")).day === 84, "August 29 must be Day 84");
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

const adjusted = applyAdjustmentToDay(trainingPlan[0], tendonAdjustment);
assert(adjusted !== trainingPlan[0], "adjustment returns a new day");
assert(trainingPlan[0].blocks[1].items.some((item) => item.exerciseId === "goblet-squat"), "original day remains unchanged");

const report = validateTrainingPlan();
assert(report.recoveryDayProblems.length === 0, "recovery-day duration and item limits");
assert(report.highImpactRollingWindowViolations.length === 0, "no rolling seven-day window may exceed two high-impact days");
assert(report.highImpactAfterBasketball.length === 0, "no high-impact gym day immediately after basketball");
assert(report.hardNordicWithin48hOfBasketballOrTest.length === 0, "no hard Nordic within 48 hours of basketball or test");
assert(report.depthDropsInCycleOne.length === 0, "Cycle 1 must not include depth drops");
assert(report.continuousJumpDrillsBeforeCycleThree.length === 0, "continuous jump drills must wait until Cycle 3");
assert(report.kneeSensitiveDaysWithHighImpactJumps.length === 0, "knee-sensitive days must not include high-impact jumps");
assert(report.missingExerciseIds.length === 0, "plan references missing exercise IDs");
assert(report.missingSingleLegExerciseIds.length === 0, "new single-leg exercise IDs must exist");
assert(report.missingScreenshotMenuExerciseIds.length === 0, "screenshot menu exercises must exist or map safely");
assert(report.singleLegExercisesMissingProgressionSets.length === 0, "new single-leg exercises need progression/regression criteria");
assert(report.singleLegExercisesMissingTrackingFields.length === 0, "new single-leg exercises need tracking fields");
assert(report.exercisesMissingYoutubeQuery.length === 0, "all exercises need YouTube search queries");
assert(report.duplicateExerciseIds.length === 0, "duplicate exercise IDs");

console.log(JSON.stringify({ checks: "passed", report }, null, 2));
