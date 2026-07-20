import {
  ADAPTIVE_MACROCYCLE_START_DATE,
  getPreferredSessionUnit,
  getSessionUnit,
  trainingSessionUnits,
  weeklySessionTargets
} from "@/data/adaptiveProgram";
import { evaluateReadinessFromWearables } from "@/logic/bodySignalEvaluation";
import type {
  BasketballLoadLevel,
  ExerciseSessionLog,
  JumpReadinessResult,
  SessionUnitType,
  TrainingSessionUnit
} from "@/types/training";
import type {
  BodySignalBaseline,
  DailyPainAndMovementSignals,
  DailyWearableSignals
} from "@/types/bodySignals";

export interface SessionRecommendationInput {
  date: string;
  currentBlock: 1 | 2 | 3 | 4;
  completedSessionUnitsLast14Days: string[];
  latestSessionUnit?: TrainingSessionUnit;
  hoursSinceLastHighImpact?: number;
  hoursSinceLastLowerBodyStrength?: number;

  cmjReadiness?: JumpReadinessResult;
  wearableSignals?: DailyWearableSignals;
  wearableBaseline?: BodySignalBaseline;
  painAndMovement?: DailyPainAndMovementSignals;
  basketballLoadLast24h?: BasketballLoadLevel;
  basketballLoadLast48h?: BasketballLoadLevel;

  recentExerciseLogs?: ExerciseSessionLog[];
  scheduledConstraints?: {
    availableMinutes?: number;
    equipmentAvailable?: string[];
    basketballPlannedToday?: boolean;
  };
}

export interface SessionRecommendation {
  recommendedSessionUnitId: string;
  level: "normal" | "modified" | "recovery-only";
  title: string;
  rationale: string[];
  blockedSessionUnitIds: string[];
  alternativeSessionUnitIds: string[];
  modifications: string[];
  confidence: "low" | "medium" | "high";
}

export interface WeeklySessionProgressItem {
  type: SessionUnitType;
  completed: number;
  targetMin: number;
  targetMax: number;
  optional?: boolean;
}

const highImpactTypes = new Set<SessionUnitType>([
  "power-a",
  "reactive-a",
  "single-leg-takeoff",
  "test"
]);
const lowerBodyStrengthTypes = new Set<SessionUnitType>(["strength-a", "strength-b"]);

function getUnit(id: string | undefined) {
  return id ? getSessionUnit(id) : undefined;
}

function getCurrentWeekNumber(date: string) {
  const start = new Date(`${ADAPTIVE_MACROCYCLE_START_DATE}T00:00:00`);
  const current = new Date(`${date}T00:00:00`);
  const diff = Math.max(0, Math.floor((current.getTime() - start.getTime()) / 86400000));
  return Math.min(12, Math.floor(diff / 7) + 1);
}

function summarizeCompletion(
  completedIds: string[],
  currentBlock: 1 | 2 | 3 | 4,
  weekNumber: number
): WeeklySessionProgressItem[] {
  const weeklyTarget =
    weeklySessionTargets.find((target) => target.weekNumber === weekNumber) ??
    weeklySessionTargets.find((target) => target.blockNumber === currentBlock) ??
    weeklySessionTargets[0];
  const completedTypes = completedIds
    .map((id) => getUnit(id)?.type)
    .filter((type): type is SessionUnitType => Boolean(type));

  return Object.entries(weeklyTarget.unitTargets).map(([type, target]) => ({
    type: type as SessionUnitType,
    completed: completedTypes.filter((item) => item === type).length,
    targetMin: target?.min ?? 0,
    targetMax: target?.max ?? 0,
    optional: target?.optional
  }));
}

function pickOverdueType(progress: WeeklySessionProgressItem[], currentBlock: 1 | 2 | 3 | 4) {
  const priorityOrder: SessionUnitType[] =
    currentBlock === 1
      ? ["strength-a", "strength-b", "power-a", "upper-body-core", "recovery", "basketball-skill"]
      : currentBlock === 2
        ? ["strength-a", "power-a", "single-leg-takeoff", "upper-body-core", "recovery", "basketball-skill"]
        : currentBlock === 3
          ? ["reactive-a", "single-leg-takeoff", "strength-a", "upper-body-core", "recovery", "basketball-skill"]
          : ["pre-test-activation", "power-a", "strength-a", "test", "upper-body-core", "recovery"];

  return priorityOrder.find((type) => {
    const item = progress.find((entry) => entry.type === type);
    return item && item.completed < item.targetMin;
  });
}

function getPainLevel(pain?: DailyPainAndMovementSignals) {
  if (!pain) {
    return 0;
  }

  return Math.max(
    pain.anteriorKneeSoreness ?? 0,
    pain.achillesStiffness ?? 0,
    pain.patellarPain ?? 0
  );
}

function isPoorMovement(pain?: DailyPainAndMovementSignals) {
  return (
    (pain?.movementQualityToday ?? 5) <= 2 ||
    (pain?.rightKneeTracking ?? 5) <= 2 ||
    (pain?.rightFootExternalRotation ?? 0) >= 2
  );
}

function buildRecommendation(
  unit: TrainingSessionUnit,
  params: Omit<SessionRecommendation, "recommendedSessionUnitId" | "title">
): SessionRecommendation {
  return {
    recommendedSessionUnitId: unit.id,
    title: unit.title,
    ...params
  };
}

export function getWeeklySessionProgress(
  completedSessionUnitIds: string[],
  currentBlock: 1 | 2 | 3 | 4,
  date: string
): WeeklySessionProgressItem[] {
  return summarizeCompletion(completedSessionUnitIds, currentBlock, getCurrentWeekNumber(date));
}

export function recommendNextSession(input: SessionRecommendationInput): SessionRecommendation {
  const recovery = getPreferredSessionUnit("recovery", input.currentBlock) ?? trainingSessionUnits[0];
  const painLevel = getPainLevel(input.painAndMovement);
  const poorMovement = isPoorMovement(input.painAndMovement);
  const basketball24 = input.basketballLoadLast24h ?? "none";
  const basketball48 = input.basketballLoadLast48h ?? "none";
  const wearableLevel = input.wearableSignals
    ? evaluateReadinessFromWearables(input.wearableSignals, input.wearableBaseline)
    : "green";
  const blockedSessionUnitIds: string[] = [];
  const modifications: string[] = [];
  const rationale: string[] = [];

  if (painLevel >= 4) {
    rationale.push("疼痛 >=4/10，立即 recovery-only；可穿戴绿色也不能覆盖疼痛。");
    return buildRecommendation(recovery, {
      level: "recovery-only",
      rationale,
      blockedSessionUnitIds: trainingSessionUnits.filter((unit) => unit.impactLevel !== "none").map((unit) => unit.id),
      alternativeSessionUnitIds: [],
      modifications: ["只做轻有氧、呼吸、无痛等长；出现肿胀、卡住、打软腿或尖锐伤痛时需要人工/医疗复查。"],
      confidence: "high"
    });
  }

  if (poorMovement || painLevel >= 3) {
    rationale.push("疼痛 >=3/10 或动作质量 <=2/5，移除高冲击和最大努力。");
    trainingSessionUnits.forEach((unit) => {
      if (unit.impactLevel === "high" || highImpactTypes.has(unit.type)) {
        blockedSessionUnitIds.push(unit.id);
      }
    });
    modifications.push("保留可控力量、等长或恢复；不做 PAP、depth jump、max jump。");
    const controlled = getPreferredSessionUnit("strength-b", input.currentBlock) ?? recovery;
    return buildRecommendation(controlled, {
      level: "modified",
      rationale,
      blockedSessionUnitIds,
      alternativeSessionUnitIds: [recovery.id],
      modifications,
      confidence: "high"
    });
  }

  if (basketball24 === "high" || (basketball48 === "high" && painLevel > 0)) {
    rationale.push("篮球负荷中高不再作为主刺激；硬篮球后不叠加反应、PAP、depth jump 或最大跳。");
    trainingSessionUnits.forEach((unit) => {
      if (unit.impactLevel === "high" || highImpactTypes.has(unit.type)) {
        blockedSessionUnitIds.push(unit.id);
      }
    });
    return buildRecommendation(recovery, {
      level: basketball24 === "high" ? "recovery-only" : "modified",
      rationale,
      blockedSessionUnitIds,
      alternativeSessionUnitIds: [getPreferredSessionUnit("upper-body-core", input.currentBlock)?.id ?? recovery.id],
      modifications: ["不要在本周晚些时候补做错过的跳跃量。"],
      confidence: "high"
    });
  }

  if (basketball24 === "moderate") {
    rationale.push("过去 24 小时有中等篮球负荷；篮球已经算冲击刺激，下一节不补跳跃量。");
    trainingSessionUnits.forEach((unit) => {
      if (unit.impactLevel === "high" || highImpactTypes.has(unit.type)) {
        blockedSessionUnitIds.push(unit.id);
      }
    });
    modifications.push("删除 PAP、depth jump、最大跳和可选反应跳；优先上肢/核心、受控力量或恢复。");
  }

  if (input.cmjReadiness?.level === "red") {
    rationale.push(...input.cmjReadiness.reasons);
    blockedSessionUnitIds.push(...trainingSessionUnits.filter((unit) => unit.impactLevel === "high").map((unit) => unit.id));
    return buildRecommendation(getPreferredSessionUnit("strength-b", input.currentBlock) ?? recovery, {
      level: "modified",
      rationale,
      blockedSessionUnitIds,
      alternativeSessionUnitIds: [recovery.id],
      modifications: ["CMJ 下降 >5% 时不做最大跳、PAP 或高级反应跳。"],
      confidence: "high"
    });
  }

  if (wearableLevel === "red") {
    rationale.push("WHOOP/Oura 恢复偏红，作为支持信号降低强度。");
    modifications.push("力量 RPE 降 1–2；只做技术跳或恢复。");
    blockedSessionUnitIds.push(...trainingSessionUnits.filter((unit) => unit.impactLevel === "high").map((unit) => unit.id));
  } else if (wearableLevel === "yellow" || input.cmjReadiness?.level === "yellow") {
    rationale.push("恢复或 CMJ readiness 黄色，不自动进阶。");
    modifications.push("删掉可选 plyo，保留主训练质量。");
  }

  if ((input.hoursSinceLastHighImpact ?? 999) < 48) {
    rationale.push("距离上一次高冲击不足 48 小时。");
    blockedSessionUnitIds.push(...trainingSessionUnits.filter((unit) => unit.impactLevel === "high").map((unit) => unit.id));
  }
  if ((input.hoursSinceLastLowerBodyStrength ?? 999) < 36) {
    rationale.push("距离主要下肢力量不足 36 小时。");
    trainingSessionUnits.forEach((unit) => {
      if (lowerBodyStrengthTypes.has(unit.type)) {
        blockedSessionUnitIds.push(unit.id);
      }
    });
  }

  const progress = summarizeCompletion(
    input.completedSessionUnitsLast14Days,
    input.currentBlock,
    getCurrentWeekNumber(input.date)
  );
  const overdueType = pickOverdueType(progress, input.currentBlock) ?? "recovery";
  let recommended = getPreferredSessionUnit(overdueType, input.currentBlock) ?? recovery;
  const blockedSet = new Set(blockedSessionUnitIds);

  if (blockedSet.has(recommended.id)) {
    recommended = getUnit(recommended.downgradeSessionUnitId) ?? getPreferredSessionUnit("upper-body-core", input.currentBlock) ?? recovery;
    modifications.push(`原推荐单元被阻挡，降级为：${recommended.title}`);
  } else if (rationale.length === 0) {
    rationale.push("恢复、疼痛和篮球负荷允许；优先补齐当前 block 的关键训练单元。");
  }

  if (
    input.cmjReadiness?.recommendation === "allow-high-intensity" &&
    input.currentBlock >= 2 &&
    !blockedSet.has(recommended.upgradeSessionUnitId ?? "")
  ) {
    rationale.push("CMJ readiness 绿色偏高，只允许计划内进阶，不额外加量。");
  }

  if (input.scheduledConstraints?.availableMinutes && recommended.estimatedDurationMinutes?.min) {
    if (input.scheduledConstraints.availableMinutes < recommended.estimatedDurationMinutes.min) {
      modifications.push("可用时间不足，缩短配件或改 recovery；不要压缩爆发组休息。");
    }
  }

  return buildRecommendation(recommended, {
    level: modifications.length || blockedSessionUnitIds.length ? "modified" : "normal",
    rationale,
    blockedSessionUnitIds: [...new Set(blockedSessionUnitIds)],
    alternativeSessionUnitIds: [
      recommended.downgradeSessionUnitId,
      recovery.id,
      getPreferredSessionUnit("upper-body-core", input.currentBlock)?.id
    ].filter((id): id is string => Boolean(id && id !== recommended.id)),
    modifications,
    confidence: input.wearableSignals || input.cmjReadiness || input.painAndMovement ? "high" : "medium"
  });
}
