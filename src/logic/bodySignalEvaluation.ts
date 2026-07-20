import type {
  BasketballLoadSignals,
  BodySignalBaseline,
  DailyBodySignals,
  DailyPainAndMovementSignals,
  DailyWearableSignals,
  ReadinessLevel,
  TrainingReminder
} from "@/types/bodySignals";

const highImpactBlockedExerciseIds = [
  "low-pogo",
  "single-leg-low-pogo",
  "cmj",
  "approach-jump",
  "max-single-leg-approach-jump",
  "trap-bar-deadlift",
  "depth-drop",
  "depth-jump-less-contact",
  "depth-jump-to-vertical-jump-with-weight",
  "concentric-jump-to-vertical-jump-with-weight",
  "lateral-stop-jump",
  "single-leg-depth-drop",
  "single-leg-hurdle-jump-to-squat-jump",
  "continuous-lunge-jump",
  "continuous-tuck-jump",
  "continuous-squat-jump",
  "single-leg-tuck-jump",
  "single-leg-double-tuck-jump"
];

const papBlockedExerciseIds = [
  "trap-bar-deadlift",
  "cmj",
  "approach-jump",
  "depth-jump-less-contact",
  "db-squat-jump",
  "clean-pull",
  "db-power-snatch"
];

const hamstringBlockedExerciseIds = [
  "nordic-curl",
  "rdl",
  "good-morning",
  "single-leg-good-morning",
  "hamstring-slider-curl",
  "single-leg-rdl-top-lock",
  "max-single-leg-approach-jump"
];

const highImpactAlternatives = [
  "calf-isometric-hold",
  "single-leg-calf-isometric-hold",
  "ankle-knee-wall",
  "spanish-squat-isometric",
  "step-down"
];

function minLevel(levels: ReadinessLevel[]): ReadinessLevel {
  if (levels.includes("red")) {
    return "red";
  }
  if (levels.includes("yellow")) {
    return "yellow";
  }
  return "green";
}

function scoreToLevel(score: number | undefined, yellowThreshold: number, redThreshold: number): ReadinessLevel | undefined {
  if (score === undefined) {
    return undefined;
  }
  if (score < redThreshold) {
    return "red";
  }
  if (score < yellowThreshold) {
    return "yellow";
  }
  return "green";
}

function hasWearableSleepWarning(signals: DailyWearableSignals) {
  return (
    (signals.ouraSleepScore !== undefined && signals.ouraSleepScore < 70) ||
    (signals.whoopSleepPerformance !== undefined && signals.whoopSleepPerformance < 70) ||
    (signals.ouraSleepDurationMinutes !== undefined && signals.ouraSleepDurationMinutes < 360) ||
    (signals.manualSleepQuality !== undefined && signals.manualSleepQuality <= 2)
  );
}

function hasBaselineWarning(signals: DailyWearableSignals, baseline?: BodySignalBaseline) {
  const hrv = signals.whoopHrvMs ?? signals.ouraHrvMs;
  const restingHr = signals.whoopRestingHr ?? signals.ouraRestingHr;
  const hrvDropPercent =
    hrv !== undefined && baseline?.hrvMsBaseline
      ? ((baseline.hrvMsBaseline - hrv) / baseline.hrvMsBaseline) * 100
      : 0;
  const rhrIncrease =
    restingHr !== undefined && baseline?.restingHrBaseline
      ? restingHr - baseline.restingHrBaseline
      : 0;

  return {
    hrvAndRhr: hrvDropPercent >= 15 && rhrIncrease > 5,
    rhrHigh: rhrIncrease > 8
  };
}

export function evaluateReadinessFromWearables(
  signals: DailyWearableSignals,
  baseline?: BodySignalBaseline
): ReadinessLevel {
  const levels = [
    scoreToLevel(signals.ouraReadiness, 65, 55),
    scoreToLevel(signals.whoopRecovery, 40, 30)
  ].filter((level): level is ReadinessLevel => Boolean(level));
  const baselineWarning = hasBaselineWarning(signals, baseline);

  if (baselineWarning.rhrHigh) {
    levels.push("red");
  } else if (baselineWarning.hrvAndRhr || hasWearableSleepWarning(signals)) {
    levels.push("yellow");
  }

  if (signals.manualEnergy !== undefined && signals.manualEnergy <= 2) {
    levels.push("yellow");
  }
  if (signals.manualLegHeaviness !== undefined && signals.manualLegHeaviness >= 4) {
    levels.push("yellow");
  }

  if (levels.length === 0) {
    return "green";
  }

  return minLevel(levels);
}

export function evaluateBasketballLoad(load: BasketballLoadSignals): "none" | "light" | "moderate" | "high" {
  if (!load.playedBasketball) {
    return "none";
  }
  if (load.loadLevel) {
    return load.loadLevel;
  }

  const duration = load.durationMinutes ?? 0;
  const rpe = load.sessionRpe ?? 1;
  const contacts = load.estimatedJumpContacts ?? 0;
  const cod = load.changeOfDirectionLoad ?? 0;

  if (
    duration >= 75 ||
    rpe >= 8 ||
    contacts >= 35 ||
    load.fullCourt ||
    load.repeatedMaxJumps ||
    cod >= 3
  ) {
    return "high";
  }
  if (duration >= 45 || rpe >= 6 || contacts >= 15 || cod >= 2) {
    return "moderate";
  }
  return "light";
}

export function evaluatePainOverride(pain: DailyPainAndMovementSignals): ReadinessLevel {
  const worstPain = Math.max(
    pain.anteriorKneeSoreness ?? 0,
    pain.achillesStiffness ?? 0,
    pain.patellarPain ?? 0
  );

  if (worstPain >= 4) {
    return "red";
  }
  if (
    worstPain >= 3 ||
    (pain.hamstringSoreness ?? 0) >= 4 ||
    (pain.movementQualityToday ?? 5) <= 2 ||
    (pain.rightFootExternalRotation ?? 0) >= 2 ||
    (pain.rightKneeTracking ?? 5) <= 2
  ) {
    return "yellow";
  }
  return "green";
}

function hasAnyTendonOrKneeWarning(pain?: DailyPainAndMovementSignals) {
  if (!pain) {
    return false;
  }

  return (
    (pain.anteriorKneeSoreness ?? 0) >= 2 ||
    (pain.achillesStiffness ?? 0) >= 2 ||
    (pain.patellarPain ?? 0) >= 2
  );
}

function hasSleepWarning(signals?: DailyWearableSignals) {
  return signals ? hasWearableSleepWarning(signals) : false;
}

function hasRhrWarning(signals?: DailyWearableSignals, baseline?: BodySignalBaseline) {
  return signals ? hasBaselineWarning(signals, baseline).rhrHigh : false;
}

export function shouldUseRecoveryOnly(bodySignals: DailyBodySignals, baseline?: BodySignalBaseline): boolean {
  const pain = bodySignals.painAndMovement;
  const wearable = bodySignals.wearable;
  const basketballLoad = bodySignals.basketballLoad ? evaluateBasketballLoad(bodySignals.basketballLoad) : "none";
  const wearableLevel = wearable ? evaluateReadinessFromWearables(wearable, baseline) : "green";

  if (pain && evaluatePainOverride(pain) === "red") {
    return true;
  }
  if (basketballLoad === "high" && hasAnyTendonOrKneeWarning(pain)) {
    return true;
  }
  return wearableLevel === "red" && Boolean(pain && evaluatePainOverride(pain) !== "green");
}

export function shouldBlockHighImpact(bodySignals: DailyBodySignals, baseline?: BodySignalBaseline): boolean {
  if (shouldUseRecoveryOnly(bodySignals, baseline)) {
    return true;
  }

  const pain = bodySignals.painAndMovement;
  const wearable = bodySignals.wearable;
  const basketballLoad = bodySignals.basketballLoad ? evaluateBasketballLoad(bodySignals.basketballLoad) : "none";

  return (
    Boolean(pain && evaluatePainOverride(pain) !== "green") ||
    (wearable ? evaluateReadinessFromWearables(wearable, baseline) !== "green" : false) ||
    basketballLoad === "high"
  );
}

export function shouldBlockPAP(bodySignals: DailyBodySignals, baseline?: BodySignalBaseline): boolean {
  const basketballLoad = bodySignals.basketballLoad ? evaluateBasketballLoad(bodySignals.basketballLoad) : "none";
  const pain = bodySignals.painAndMovement;

  return (
    shouldBlockHighImpact(bodySignals, baseline) ||
    basketballLoad === "moderate" ||
    Boolean(pain && (pain.hamstringSoreness ?? 0) >= 4)
  );
}

export function shouldBlockMaxJumpTesting(bodySignals: DailyBodySignals, baseline?: BodySignalBaseline): boolean {
  const basketballLoad = bodySignals.basketballLoad ? evaluateBasketballLoad(bodySignals.basketballLoad) : "none";

  return (
    shouldBlockHighImpact(bodySignals, baseline) ||
    basketballLoad === "moderate" ||
    hasSleepWarning(bodySignals.wearable) ||
    hasRhrWarning(bodySignals.wearable, baseline)
  );
}

function buildReminder(params: Omit<TrainingReminder, "id">): TrainingReminder {
  return {
    ...params,
    id: `${params.date}-${params.recommendedAction}-${params.triggeredBy.join("-")}`.replace(/[^a-zA-Z0-9-]/g, "-")
  };
}

export function generateTrainingReminders(
  bodySignals: DailyBodySignals,
  baseline?: BodySignalBaseline
): TrainingReminder[] {
  const reminders: TrainingReminder[] = [];
  const date = bodySignals.date;
  const pain = bodySignals.painAndMovement;
  const wearable = bodySignals.wearable;
  const basketballLoad = bodySignals.basketballLoad ? evaluateBasketballLoad(bodySignals.basketballLoad) : "none";
  const wearableLevel = wearable ? evaluateReadinessFromWearables(wearable, baseline) : "green";
  const painLevel = pain ? evaluatePainOverride(pain) : "green";

  if (shouldUseRecoveryOnly(bodySignals, baseline)) {
    reminders.push(
      buildReminder({
        date,
        level: "stop",
        title: "今天改恢复-only",
        message: "疼痛、肌腱或身体数据提示不适合高冲击。只做轻活动、呼吸和无痛等长。",
        recommendedAction: "recovery-only",
        triggeredBy: ["pain/movement override", "wearable/basketball context"],
        blockedExerciseIds: [...highImpactBlockedExerciseIds, ...papBlockedExerciseIds],
        suggestedAlternativeIds: highImpactAlternatives
      })
    );
    return reminders;
  }

  if (painLevel === "yellow") {
    reminders.push(
      buildReminder({
        date,
        level: "warning",
        title: "移除高冲击和最大努力",
        message: "膝前侧、跟腱/髌腱、腘绳肌或动作质量已有提示。保留可控力量和等长，跳跃只做技术版或跳过。",
        recommendedAction: "remove-high-impact",
        triggeredBy: ["pain >=3 or movement quality warning"],
        blockedExerciseIds: highImpactBlockedExerciseIds,
        suggestedAlternativeIds: highImpactAlternatives
      })
    );
  }

  if (wearableLevel === "red") {
    reminders.push(
      buildReminder({
        date,
        level: "warning",
        title: "可穿戴恢复偏低",
        message: "WHOOP / Oura 或 HRV/RHR 信号偏低。今天不要做最大测试、PAP、depth jump 或 advanced plyo。",
        recommendedAction: "remove-high-impact",
        triggeredBy: ["wearable recovery red"],
        blockedExerciseIds: [...papBlockedExerciseIds, ...highImpactBlockedExerciseIds],
        suggestedAlternativeIds: ["easy-bike", "spanish-squat-isometric", "band-hamstring-curl"]
      })
    );
  } else if (wearableLevel === "yellow") {
    reminders.push(
      buildReminder({
        date,
        level: "caution",
        title: "降低强度一档",
        message: "恢复信号一般。力量 RPE 降低 1–2，跳跃只做技术质量，不做最大尝试。",
        recommendedAction: "reduce-intensity",
        triggeredBy: ["wearable recovery yellow"],
        blockedExerciseIds: papBlockedExerciseIds,
        suggestedAlternativeIds: ["cmj", "step-down", "calf-isometric-hold"]
      })
    );
  }

  if (basketballLoad === "high") {
    reminders.push(
      buildReminder({
        date,
        level: "warning",
        title: "篮球负荷高，别叠加冲击",
        message: "过去 24 小时篮球负荷高时，取消 PAP、最大跳、depth jump 和 advanced plyo。",
        recommendedAction: "remove-high-impact",
        triggeredBy: ["high basketball load"],
        blockedExerciseIds: [...papBlockedExerciseIds, "depth-jump-less-contact", "max-single-leg-approach-jump"],
        suggestedAlternativeIds: ["easy-walk", "ankle-knee-wall", "single-leg-forward-lean-isometric"]
      })
    );
  } else if (basketballLoad === "moderate") {
    reminders.push(
      buildReminder({
        date,
        level: "caution",
        title: "篮球负荷中等，减少可选弹跳",
        message: "保留热身和主训练质量，删掉可选 plyo，不做最大测试。",
        recommendedAction: "reduce-intensity",
        triggeredBy: ["moderate basketball load"],
        blockedExerciseIds: ["depth-jump-less-contact", "lunge-jump", "db-squat-jump"],
        suggestedAlternativeIds: ["step-up-knee-drive-hold", "pallof-press"]
      })
    );
  }

  if (pain && (pain.hamstringSoreness ?? 0) >= 4) {
    reminders.push(
      buildReminder({
        date,
        level: "warning",
        title: "腘绳肌酸痛高",
        message: "今天不做 Nordic、硬 RDL、冲刺、最大跳或高级单脚弹跳。",
        recommendedAction: "remove-high-impact",
        triggeredBy: ["hamstring soreness >=4"],
        blockedExerciseIds: hamstringBlockedExerciseIds,
        suggestedAlternativeIds: ["band-hamstring-curl", "bridge", "easy-bike"]
      })
    );
  }

  if (bodySignals.withings) {
    const weightDropPercent =
      bodySignals.withings.weightKg !== undefined && baseline?.weightKgBaseline
        ? ((baseline.weightKgBaseline - bodySignals.withings.weightKg) / baseline.weightKgBaseline) * 100
        : 0;
    const muscleDrop =
      bodySignals.withings.muscleMassKg !== undefined && baseline?.muscleMassKgBaseline
        ? baseline.muscleMassKgBaseline - bodySignals.withings.muscleMassKg
        : 0;

    if (weightDropPercent > 1 && wearableLevel !== "green") {
      reminders.push(
        buildReminder({
          date,
          level: "caution",
          title: "体重下降 + 恢复走低",
          message: "Withings 只用于趋势判断：如果 7–14 天体重下降超过 1% 且恢复/表现下降，检查碳水、蛋白和总热量。",
          recommendedAction: "nutrition-review",
          triggeredBy: ["withings trend", "wearable trend"]
        })
      );
    }

    if (muscleDrop > 0.5 && wearableLevel !== "green") {
      reminders.push(
        buildReminder({
          date,
          level: "info",
          title: "肌肉量趋势需要复盘",
          message: "如果肌肉量趋势下降且训练表现下降，优先复盘恢复、蛋白和力量训练质量，而不是增加跳跃量。",
          recommendedAction: "nutrition-review",
          triggeredBy: ["withings muscle trend"]
        })
      );
    }

    if (
      (bodySignals.withings.leftRightLegMuscleDifferencePercent ?? 0) >= 3 &&
      pain &&
      ((pain.rightFootExternalRotation ?? 0) >= 2 || (pain.rightKneeTracking ?? 5) <= 3)
    ) {
      reminders.push(
        buildReminder({
          date,
          level: "info",
          title: "左右腿趋势需要观察",
          message: "Withings 左右腿差异只用于长期复盘。保留右侧控制训练，但不要额外增加右侧高冲击跳跃量。",
          recommendedAction: "manual-review",
          triggeredBy: ["withings left/right trend", "right-side movement quality"]
        })
      );
    }
  }

  if (reminders.length === 0) {
    reminders.push(
      buildReminder({
        date,
        level: "info",
        title: "可以按计划训练",
        message: "今天没有明显疼痛、篮球负荷或恢复警讯。继续按计划执行，仍然以落地质量和肌腱反应为准。",
        recommendedAction: "follow-plan",
        triggeredBy: ["no major warning"]
      })
    );
  }

  return reminders;
}
