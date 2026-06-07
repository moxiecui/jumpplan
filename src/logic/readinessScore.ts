import type {
  DailyTrainingAdjustment,
  OuraDailyReadinessInput,
  SubjectiveReadinessInput,
  TrainingDayType
} from "@/types/training";

interface Baseline {
  restingHeartRate?: number;
  hrv?: number;
}

interface EvaluationParams {
  oura?: OuraDailyReadinessInput;
  subjective?: SubjectiveReadinessInput;
  dayType: TrainingDayType;
  baseline?: Baseline;
}

function defaultDate(oura?: OuraDailyReadinessInput, subjective?: SubjectiveReadinessInput) {
  return oura?.date ?? subjective?.date ?? new Date().toISOString().slice(0, 10);
}

function baseAdjustment(
  params: EvaluationParams,
  overrides: Partial<DailyTrainingAdjustment>
): DailyTrainingAdjustment {
  return {
    date: defaultDate(params.oura, params.subjective),
    level: "green",
    adjustmentType: "train-as-planned",
    headline: "可以按计划训练",
    explanation:
      "Oura 数据只能作为参考信号，今天仍然要结合主观疼痛、动作质量和落地控制判断。",
    modifications: ["按今天计划执行，训练中继续观察跟腱、髌腱和右膝轨迹。"],
    removeExerciseCategories: [],
    allowMaxJump: true,
    allowPogo: true,
    allowPAP: true,
    allowBasketball: true,
    cautionFlags: [],
    ...overrides
  };
}

function unique(items: string[]) {
  return [...new Set(items)];
}

function hasModerateSubjectiveWarning(subjective?: SubjectiveReadinessInput) {
  if (!subjective) {
    return false;
  }

  return (
    subjective.achillesStiffness >= 3 ||
    subjective.patellarPain >= 3 ||
    subjective.calfTightness >= 4 ||
    subjective.sleepQuality <= 2
  );
}

function hasRedSubjectivePain(subjective?: SubjectiveReadinessInput) {
  if (!subjective) {
    return false;
  }

  return subjective.achillesStiffness >= 4 || subjective.patellarPain >= 4;
}

function getWearableWarnings(
  oura?: OuraDailyReadinessInput,
  baseline?: Baseline
): {
  cautionFlags: string[];
  yellowSignals: number;
  redSignals: number;
  rhrElevated: boolean;
  hrvLow: boolean;
} {
  const cautionFlags: string[] = [];
  let yellowSignals = 0;
  let redSignals = 0;
  let rhrElevated = false;
  let hrvLow = false;

  if (!oura) {
    return { cautionFlags, yellowSignals, redSignals, rhrElevated, hrvLow };
  }

  if (typeof oura.readinessScore === "number") {
    if (oura.readinessScore < 60) {
      redSignals += 1;
      cautionFlags.push("Oura 恢复分低于 60，今天更适合恢复导向。");
    } else if (oura.readinessScore < 70) {
      yellowSignals += 1;
      cautionFlags.push("Oura 恢复分在 60–69，建议降低冲击和神经负荷。");
    }
  }

  if (
    typeof oura.restingHeartRate === "number" &&
    typeof baseline?.restingHeartRate === "number"
  ) {
    const difference = oura.restingHeartRate - baseline.restingHeartRate;
    if (difference >= 8) {
      yellowSignals += 2;
      rhrElevated = true;
      cautionFlags.push("静息心率明显高于基线，可能恢复不足或压力偏高。");
    } else if (difference >= 5) {
      yellowSignals += 1;
      rhrElevated = true;
      cautionFlags.push("静息心率高于基线，可能恢复不足或压力偏高。");
    }
  }

  if (typeof oura.hrv === "number" && typeof baseline?.hrv === "number") {
    if (oura.hrv <= baseline.hrv * 0.75) {
      redSignals += 1;
      hrvLow = true;
      cautionFlags.push("HRV 大幅低于基线，今天建议明显降低神经和冲击负荷。");
    } else if (oura.hrv <= baseline.hrv * 0.85) {
      yellowSignals += 1;
      hrvLow = true;
      cautionFlags.push("HRV 明显低于基线，建议降低神经和冲击负荷。");
    }
  }

  if (typeof oura.sleepScore === "number") {
    if (oura.sleepScore < 60) {
      yellowSignals += 2;
      cautionFlags.push("睡眠分低于 60，今天需要更保守地安排训练。");
    } else if (oura.sleepScore < 70) {
      yellowSignals += 1;
      cautionFlags.push("睡眠分低于 70，建议降低总量并观察主观感觉。");
    }
  }

  return {
    cautionFlags: unique(cautionFlags),
    yellowSignals,
    redSignals,
    rhrElevated,
    hrvLow
  };
}

function getPositiveUpgradeSignal(
  oura?: OuraDailyReadinessInput,
  subjective?: SubjectiveReadinessInput,
  baseline?: Baseline,
  dayType?: TrainingDayType
) {
  const upgradeDay = dayType === "jump" || dayType === "strength" || dayType === "skill";
  const rhrOk =
    typeof oura?.restingHeartRate !== "number" ||
    typeof baseline?.restingHeartRate !== "number" ||
    oura.restingHeartRate < baseline.restingHeartRate + 5;
  const hrvOk =
    typeof oura?.hrv !== "number" ||
    typeof baseline?.hrv !== "number" ||
    oura.hrv >= baseline.hrv;
  const tendonsOk =
    !subjective ||
    (subjective.achillesStiffness <= 1 &&
      subjective.patellarPain <= 1 &&
      subjective.calfTightness <= 1);

  return Boolean(
    upgradeDay &&
      oura?.readinessScore !== undefined &&
      oura.readinessScore >= 85 &&
      rhrOk &&
      hrvOk &&
      tendonsOk
  );
}

export function evaluateDailyReadiness(params: EvaluationParams): DailyTrainingAdjustment {
  const { oura, subjective, dayType, baseline } = params;
  const wearable = getWearableWarnings(oura, baseline);

  if (hasRedSubjectivePain(subjective)) {
    const tendonFlags = [
      subjective?.achillesStiffness !== undefined && subjective.achillesStiffness >= 4
        ? "跟腱晨僵达到 4/10 或以上。"
        : undefined,
      subjective?.patellarPain !== undefined && subjective.patellarPain >= 4
        ? "髌腱疼痛达到 4/10 或以上。"
        : undefined
    ].filter(Boolean) as string[];

    return baseAdjustment(params, {
      level: "red",
      adjustmentType: "recovery-only",
      headline: "今天不适合下肢冲击训练",
      explanation:
        "跟腱晨僵或髌腱疼痛已经进入需要保护的范围。即使 Oura 分数看起来不错，疼痛和动作质量仍然优先于穿戴设备信号。",
      modifications: [
        "取消 Pogo、最大跳、PAP、深度跳和冲刺。",
        "只做热身、Zone 2、活动度、等长止痛和主动恢复。",
        "如果疼痛持续或加重，考虑暂停下肢冲击训练。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 100,
      intensityCap: "RPE 6",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: unique([
        ...wearable.cautionFlags,
        ...tendonFlags,
        "主观肌腱疼痛优先级高于 Oura 恢复分。",
        "篮球仅建议轻松投篮或完全取消下肢冲击。"
      ])
    });
  }

  const tendonWarning =
    subjective?.achillesStiffness !== undefined &&
    (subjective.achillesStiffness >= 3 || subjective.patellarPain >= 3);
  const moderateSubjectiveWarning = hasModerateSubjectiveWarning(subjective);
  const score = oura?.readinessScore;
  const lowReadiness = typeof score === "number" && score < 60;
  const cautionReadiness = typeof score === "number" && score >= 60 && score < 70;
  const yellowByWearable = wearable.yellowSignals >= 1 || wearable.redSignals >= 1;
  const redByWearable = wearable.redSignals >= 2 || (lowReadiness && wearable.yellowSignals >= 2);

  if (
    dayType === "test" &&
    ((typeof score === "number" && score < 75) || wearable.hrvLow || wearable.rhrElevated)
  ) {
    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: "test-not-recommended",
      headline: "今天不建议做正式摸高测试",
      explanation:
        "测试日需要身体和神经状态都比较稳定。今天的 Oura 或基线信号提示恢复可能不足，建议把测试改成技术练习。",
      modifications: [
        "今天不建议做正式摸高测试。",
        "改成 70–85% 技术跳和主动恢复。",
        "保留热身和落地质量检查，不用测试结果判断真实能力。"
      ],
      removeExerciseCategories: ["plyometric"],
      reduceVolumePercent: 50,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: !tendonWarning,
      allowPAP: false,
      allowBasketball: true,
      cautionFlags: unique([
        ...wearable.cautionFlags,
        "测试日对恢复状态更敏感，今天不适合用最大跳判断水平。"
      ])
    });
  }

  if (tendonWarning) {
    const achillesIssue = Boolean(subjective && subjective.achillesStiffness >= 3);
    const tendonFlags = [
      subjective?.achillesStiffness !== undefined && subjective.achillesStiffness >= 3
        ? "跟腱晨僵达到 3/10 或以上。"
        : undefined,
      subjective?.patellarPain !== undefined && subjective.patellarPain >= 3
        ? "髌腱疼痛达到 3/10 或以上。"
        : undefined
    ].filter(Boolean) as string[];

    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: dayType === "strength" ? "strength-only" : "reduce-impact",
      headline: "今天需要降低冲击训练",
      explanation:
        "肌腱已经有中等预警，今天可以训练，但需要取消最大努力和高冲击内容。Oura 只能辅助判断，不能覆盖疼痛信号。",
      modifications: [
        "取消最大跳和 PAP。",
        achillesIssue ? "取消 Pogo 或至少减少 50% 组数。" : "Pogo 组数减少 50%，只保留安静低幅版本。",
        "篮球只做低强度技术和轻松投篮，避免连续冲跳。"
      ],
      removeExerciseCategories: ["plyometric"],
      reduceVolumePercent: 50,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: !achillesIssue,
      allowPAP: false,
      allowBasketball: true,
      cautionFlags: unique([
        ...wearable.cautionFlags,
        ...tendonFlags,
        "跟腱或髌腱达到 3/10 时，动作质量和疼痛反应优先。"
      ])
    });
  }

  if (redByWearable && (dayType === "jump" || dayType === "basketball" || dayType === "skill")) {
    return baseAdjustment(params, {
      level: "red",
      adjustmentType: "recovery-only",
      headline: "今天更适合恢复导向",
      explanation:
        "Oura 和基线指标提示恢复可能不足。没有明显疼痛也不代表可以硬做高冲击训练，建议保守处理。",
      modifications: [
        "取消最大跳、PAP、冲刺和重复高强度变向。",
        "只做热身、Zone 2、活动度和主动恢复。",
        "如果训练中动作变慢或落地变重，直接结束下肢冲击内容。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 100,
      intensityCap: "RPE 6",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: wearable.cautionFlags
    });
  }

  if (moderateSubjectiveWarning || yellowByWearable || cautionReadiness) {
    if (dayType === "strength") {
      return baseAdjustment(params, {
        level: "yellow",
        adjustmentType: "strength-only",
        headline: "力量日保留，但强度封顶",
        explanation:
          "今天可以保留受控力量训练，但不适合磨重量或做失败次数。结合主观感觉判断，动作一旦变形就降级。",
        modifications: [
          "力量动作保持 RPE 6–7，不做力竭。",
          "取消任何跳跃、PAP 或速度明显下降的组。",
          "保留等长止痛和主动恢复。"
        ],
        removeExerciseCategories: ["plyometric", "basketball-skill"],
        reduceVolumePercent: 30,
        intensityCap: "RPE 7",
        allowMaxJump: false,
        allowPogo: false,
        allowPAP: false,
        allowBasketball: false,
        cautionFlags: wearable.cautionFlags
      });
    }

    if (dayType === "basketball") {
      return baseAdjustment(params, {
        level: "yellow",
        adjustmentType: "reduce-impact",
        headline: "篮球日改成低强度技术",
        explanation:
          "今天可以保留投篮和技术手感，但不建议重复最大跳、强对抗或高强度急停。",
        modifications: [
          "只做低强度技术、轻松投篮和可控脚步。",
          "避免连续冲抢、重复最大跳和疲劳后的急停起跳。",
          "如果右膝内扣或落地变重，马上停止跳跃内容。"
        ],
        removeExerciseCategories: ["plyometric"],
        reduceVolumePercent: 50,
        intensityCap: "RPE 7",
        allowMaxJump: false,
        allowPogo: false,
        allowPAP: false,
        allowBasketball: true,
        cautionFlags: wearable.cautionFlags
      });
    }

    if (dayType === "recovery" || dayType === "rest") {
      return baseAdjustment(params, {
        level: "yellow",
        adjustmentType: "train-as-planned",
        headline: "按恢复日安排执行",
        explanation:
          "今天的信号提示恢复一般。恢复日和休息日不需要因为状态变好或变差而加硬训练，保持温和活动即可。",
        modifications: [
          "按恢复或休息计划执行。",
          "保持低强度步行、活动度和呼吸恢复。",
          "不要因为 Oura 单日信号而临时加入高冲击训练。"
        ],
        allowMaxJump: false,
        allowPogo: false,
        allowPAP: false,
        allowBasketball: false,
        cautionFlags: wearable.cautionFlags
      });
    }

    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: "reduce-impact",
      headline: "今天需要降低冲击和总量",
      explanation:
        "恢复信号或主观状态提示今天不适合追求最大输出。建议保留技术质量，减少冲击和疲劳堆积。",
      modifications: [
        "跳跃和变向内容减少 30–50%。",
        "取消 PAP 和最大跳。",
        dayType === "skill"
          ? "保留低强度技术，不做硬急停起跳。"
          : "每组都以安静落地和右膝轨迹为优先。"
      ],
      removeExerciseCategories: ["plyometric"],
      reduceVolumePercent: 40,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: true,
      allowPAP: false,
      allowBasketball: dayType === "skill",
      cautionFlags: wearable.cautionFlags
    });
  }

  if (getPositiveUpgradeSignal(oura, subjective, baseline, dayType)) {
    return baseAdjustment(params, {
      level: "green",
      adjustmentType: "optional-upgrade",
      headline: "状态较好，但只做保守升级",
      explanation:
        "今天 Oura 和主观信号都比较积极，但这不代表可以堆高冲击量。升级只限低量高质量技术内容，并且动作质量优先。",
      modifications: [
        "可以多做 1–2 组低量高质量技术跳，不能加到疲劳。",
        "不要增加高容量 Pogo、深度跳或冲刺。",
        "如果触地变重、右膝内扣或肌腱不适，立即回到原计划。"
      ],
      reduceVolumePercent: undefined,
      intensityCap: "RPE 8",
      allowMaxJump: dayType === "jump",
      allowPogo: true,
      allowPAP: dayType === "jump" || dayType === "strength",
      allowBasketball: dayType === "skill",
      cautionFlags: ["Oura 是积极信号，不是必须加量的理由。"]
    });
  }

  if (dayType === "recovery" || dayType === "rest") {
    return baseAdjustment(params, {
      headline: "恢复日按计划执行",
      explanation:
        "今天没有明显降级信号。恢复日和休息日仍然保持温和安排，不因为单日状态好就加高强度。",
      modifications: [
        "按恢复或休息计划执行。",
        "保持低强度活动、活动度和呼吸恢复。",
        "不额外加入高冲击弹跳。"
      ],
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: wearable.cautionFlags
    });
  }

  return baseAdjustment(params, {
    cautionFlags: wearable.cautionFlags
  });
}
