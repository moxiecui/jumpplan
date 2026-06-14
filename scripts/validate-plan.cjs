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

assert(trainingPlan.length === 21, "plan must contain 21 days");
assert(getTodayTrainingDay(new Date("2026-06-13T12:00:00")).day === 7, "June 13 must be Day 7");
assert(getTodayTrainingDay(new Date("2026-07-10T12:00:00")).day === 21, "cycle must remain on Day 21 after completion");
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

const adjusted = applyAdjustmentToDay(trainingPlan[0], tendonAdjustment);
assert(adjusted !== trainingPlan[0], "adjustment returns a new day");
assert(trainingPlan[0].blocks[1].items.some((item) => item.exerciseId === "low-pogo"), "original day remains unchanged");

const report = validateTrainingPlan();
assert(report.recoveryDayProblems.length === 0, "recovery-day duration and item limits");

console.log(JSON.stringify({ checks: "passed", report }, null, 2));
