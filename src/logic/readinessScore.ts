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
    (subjective.anteriorKneeSoreness ?? 0) >= 3 ||
    (subjective.painWithStairs ?? 0) >= 3 ||
    (subjective.painWithSquat ?? 0) >= 3 ||
    (subjective.painWithJumpLanding ?? 0) >= 3 ||
    subjective.kneeWarmupResponse === "worse" ||
    subjective.calfTightness >= 4 ||
    subjective.sleepQuality <= 2 ||
    subjective.hamstringSoreness >= 3 ||
    subjective.generalDoms >= 5 ||
    subjective.generalFatigue >= 4 ||
    subjective.movementQualityToday <= 2 ||
    (subjective.rightFootExternalRotation !== undefined && subjective.rightFootExternalRotation >= 2) ||
    (subjective.rightFootControl !== undefined && subjective.rightFootControl <= 2) ||
    (subjective.rightKneeTracking !== undefined && subjective.rightKneeTracking <= 2) ||
    subjective.legsFeelHeavy ||
    subjective.basketballLoadLast24h === "moderate" ||
    subjective.basketballLoadLast24h === "high"
  );
}

function hasRedSubjectivePain(subjective?: SubjectiveReadinessInput) {
  if (!subjective) {
    return false;
  }

  return (
    subjective.achillesStiffness >= 4 ||
    subjective.patellarPain >= 4 ||
    (subjective.anteriorKneeSoreness ?? 0) >= 4 ||
    (subjective.painWithJumpLanding ?? 0) >= 4
  );
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
  const singleLegControlOk =
    !subjective ||
    ((subjective.rightFootExternalRotation ?? 0) <= 1 &&
      (subjective.rightFootControl ?? 5) >= 4 &&
      (subjective.rightKneeTracking ?? 5) >= 4);

  return Boolean(
    upgradeDay &&
      oura?.readinessScore !== undefined &&
      oura.readinessScore >= 85 &&
      rhrOk &&
      hrvOk &&
      tendonsOk &&
      singleLegControlOk
  );
}

export function evaluateDailyReadiness(params: EvaluationParams): DailyTrainingAdjustment {
  const { oura, subjective, dayType, baseline } = params;
  const wearable = getWearableWarnings(oura, baseline);
  const hamstringHigh = Boolean(subjective && subjective.hamstringSoreness >= 4);
  const movementQualityLow = Boolean(subjective && subjective.movementQualityToday <= 2);
  const rightFootDynamicBlock = Boolean(subjective?.rightFootExternalRotation !== undefined && subjective.rightFootExternalRotation >= 2);
  const rightFootControlLow = Boolean(subjective?.rightFootControl !== undefined && subjective.rightFootControl <= 2);
  const rightKneeTrackingLow = Boolean(subjective?.rightKneeTracking !== undefined && subjective.rightKneeTracking <= 2);
  const highBasketball24h = subjective?.basketballLoadLast24h === "high";
  const highBasketball48h = subjective?.basketballLoadLast48h === "high";
  const anteriorKneeRed = Boolean(
    (subjective?.anteriorKneeSoreness ?? 0) >= 4 ||
      (subjective?.painWithJumpLanding ?? 0) >= 4
  );
  const anteriorKneeYellow = Boolean(
    (subjective?.anteriorKneeSoreness ?? 0) >= 3 ||
      (subjective?.painWithStairs ?? 0) >= 3 ||
      (subjective?.painWithSquat ?? 0) >= 3 ||
      (subjective?.painWithJumpLanding ?? 0) >= 3 ||
      subjective?.kneeWarmupResponse === "worse"
  );

  if (hasRedSubjectivePain(subjective)) {
    const tendonFlags = [
      subjective?.achillesStiffness !== undefined && subjective.achillesStiffness >= 4
        ? "跟腱晨僵达到 4/10 或以上。"
        : undefined,
      subjective?.patellarPain !== undefined && subjective.patellarPain >= 4
        ? "髌腱疼痛达到 4/10 或以上。"
        : undefined,
      subjective?.anteriorKneeSoreness !== undefined && subjective.anteriorKneeSoreness >= 4
        ? "膝前侧或髌骨上方酸痛达到 4/10 或以上。"
        : undefined,
      subjective?.painWithJumpLanding !== undefined && subjective.painWithJumpLanding >= 4
        ? "起跳或落地疼痛达到 4/10 或以上。"
        : undefined
    ].filter(Boolean) as string[];

    return baseAdjustment(params, {
      level: "red",
      adjustmentType: anteriorKneeRed && dayType === "strength" ? "strength-only" : "recovery-only",
      headline: anteriorKneeRed ? "今天先保护膝前侧负荷" : "今天不适合下肢冲击训练",
      explanation:
        "跟腱、髌腱或膝前侧疼痛已经进入需要保护的范围。即使 Oura 分数看起来不错，疼痛和动作质量仍然优先于穿戴设备信号。",
      modifications: [
        "取消 Pogo、单脚 Pogo、单脚助跑跳、最大跳、PAP、French Contrast、深度跳、弓步跳和冲刺。",
        anteriorKneeRed
          ? "只保留受控浅幅力量、髋主导练习、核心、上肢或无痛低强度等长；不做深膝角高量训练。"
          : "只做热身、Zone 2、活动度、呼吸恢复，以及无痛低强度等长。",
        "膝敏感热身替代：轻走或单车 3–5 分钟、踝膝墙 8 次/侧、浅 Spanish squat 或 wall sit 2 x 15–20 秒、弹力带侧走 2 x 8、自重单腿 RDL 1 x 5/侧。",
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
        "主观膝部/肌腱疼痛优先级高于 Oura 恢复分。",
        "篮球仅建议轻松投篮或完全取消下肢冲击。"
      ])
    });
  }

  if (
    subjective &&
    highBasketball48h &&
    (subjective.achillesStiffness >= 3 || subjective.patellarPain >= 3)
  ) {
    return baseAdjustment(params, {
      level: "red",
      adjustmentType: dayType === "strength" ? "strength-only" : "recovery-only",
      headline: "高篮球负荷后先保护肌腱",
      explanation:
        "过去 48 小时篮球负荷高，同时肌腱已有预警。今天不做 PAP、最大跳、冲刺或重复变向，动作质量和肌腱反应优先于 Oura。",
      modifications: [
        "取消最大跳、单脚助跑跳、PAP、French Contrast、冲刺和高冲击篮球。",
        "只保留恢复或 RPE 6–7 的受控力量、核心和无痛等长。",
        "如果腿仍沉重或落地质量差，改为短恢复日。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 60,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: unique([
        ...wearable.cautionFlags,
        "过去 48 小时篮球负荷高且肌腱有预警。"
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
    ((typeof score === "number" && score < 75) ||
      wearable.hrvLow ||
      wearable.rhrElevated ||
      hamstringHigh ||
      movementQualityLow ||
      highBasketball24h)
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

  if (hamstringHigh) {
    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: dayType === "strength" ? "strength-only" : "reduce-impact",
      headline: "腘绳肌酸痛，取消高速和重离心",
      explanation:
        "腘绳肌酸痛达到 4/10 或以上。今天可以保留不受影响的上肢、核心和轻量控制，但不做 Nordic、硬 RDL、冲刺或最大跳。",
      modifications: [
        "取消 Nordic、硬 RDL、冲刺和最大跳。",
        "单腿 RDL 顶部锁定改轻量技术或跳过。",
        "下肢总量减少约 40%，避免长肌长位重离心。",
        "上肢和核心可以保留，但不要影响呼吸、支撑和整体恢复。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 40,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: unique([...wearable.cautionFlags, "腘绳肌酸痛达到 4/10 或以上。"])
    });
  }

  if (rightFootDynamicBlock || rightFootControlLow || rightKneeTrackingLow) {
    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: dayType === "strength" ? "strength-only" : "reduce-impact",
      headline: "右侧控制不足，今天不进阶单脚动态",
      explanation:
        "右脚外旋、右脚控制或右膝轨迹提示今天不适合单脚 Pogo、单脚助跑跳或最大单脚起跳。先用三点支撑、单脚前倾等长、上步提膝保持和受控 RDL 找回位置。",
      modifications: [
        "取消单脚 Pogo、两步单脚助跑跳和最大单脚起跳。",
        "保留脚三点支撑、单脚前倾等长、上步提膝保持、轻量单腿 RDL 顶部锁定。",
        "如果右膝轨迹 <=2/5，落地和起跳练习全部退阶。",
        "不要用增加右侧次数来弥补动作质量。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 40,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: dayType === "basketball",
      cautionFlags: unique([
        ...wearable.cautionFlags,
        rightFootDynamicBlock ? "右脚外旋达到 2/3 或以上，禁止动态进阶。" : "",
        rightFootControlLow ? "右脚控制为 2/5 或以下。" : "",
        rightKneeTrackingLow ? "右膝轨迹为 2/5 或以下，不做最大单脚跳。" : ""
      ].filter(Boolean))
    });
  }

  if (anteriorKneeYellow) {
    const kneeFlags = [
      subjective?.anteriorKneeSoreness !== undefined && subjective.anteriorKneeSoreness >= 3
        ? `膝前侧酸痛 ${subjective.anteriorKneeSoreness}/10。`
        : undefined,
      subjective?.painWithStairs !== undefined && subjective.painWithStairs >= 3
        ? `上下楼疼痛 ${subjective.painWithStairs}/10。`
        : undefined,
      subjective?.painWithSquat !== undefined && subjective.painWithSquat >= 3
        ? `下蹲疼痛 ${subjective.painWithSquat}/10。`
        : undefined,
      subjective?.painWithJumpLanding !== undefined && subjective.painWithJumpLanding >= 3
        ? `起跳或落地疼痛 ${subjective.painWithJumpLanding}/10。`
        : undefined,
      subjective?.kneeWarmupResponse === "worse" ? "膝前侧热身后变差。" : undefined
    ].filter(Boolean) as string[];

    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: dayType === "strength" ? "strength-only" : "reduce-impact",
      headline: "膝前侧有预警，今天移除高冲击",
      explanation:
        "膝前侧、上下楼、下蹲或落地疼痛提示今天不能追求最大跳和深膝角高量。热身后变差时必须立即降级。",
      modifications: [
        "取消最大跳、PAP、深度跳、弓步跳、连续蹲跳、连续屈膝跳和高强度篮球。",
        "如果热身后仍 >2/10，不做最大跳、不做硬篮球、不做深膝角高量。",
        "使用浅 Spanish squat、wall sit、受控 step-down、髋主导力量、核心和恢复替代。",
        "低幅 Pogo 或 Snap-down 只有疼痛 0–1/10 且热身不变差时才可选。"
      ],
      removeExerciseCategories: ["plyometric", "basketball-skill"],
      reduceVolumePercent: 50,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: unique([...wearable.cautionFlags, ...kneeFlags])
    });
  }

  if (movementQualityLow || highBasketball24h) {
    return baseAdjustment(params, {
      level: "yellow",
      adjustmentType: dayType === "strength" ? "strength-only" : "reduce-impact",
      headline: movementQualityLow ? "动作质量偏低，今天只做降级版本" : "高篮球负荷后取消最大输出",
      explanation: movementQualityLow
        ? "今天动作质量评分较低，不做进阶、高速或单腿高难度内容。"
        : "过去 24 小时篮球负荷高，今天不安排 PAP、最大跳或额外高冲击健身房训练。",
      modifications: [
        "取消 PAP、最大跳、单脚 Pogo、单脚助跑跳和高速度单腿动作。",
        "可保留受控力量、核心、上肢和低幅技术练习。",
        "动作质量下降时直接停止，不用完成预定总量。"
      ],
      removeExerciseCategories: ["plyometric"],
      reduceVolumePercent: 50,
      intensityCap: "RPE 7",
      allowMaxJump: false,
      allowPogo: false,
      allowPAP: false,
      allowBasketball: false,
      cautionFlags: unique([
        ...wearable.cautionFlags,
        movementQualityLow ? "今日动作质量为 2/5 或以下。" : "过去 24 小时篮球负荷高。"
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
        "取消最大跳、PAP 和 French Contrast。",
        achillesIssue ? "取消 Pogo 和单脚 Pogo。" : "Pogo 组数减少 50%，只保留安静低幅版本。",
        "取消单脚助跑跳；落地会疼时也取消 Snap Down。",
        "把动态跳跃替换为 Spanish squat、提踵等长或分腿蹲等长等疼痛友好选项。",
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
        "取消最大跳、PAP、French Contrast、冲刺和重复高强度变向。",
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
          "取消任何跳跃、PAP、French Contrast 或速度明显下降的组。",
          "保留疼痛友好的等长、核心和上肢支持训练。"
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
        "取消 PAP、French Contrast 和最大跳。",
        "如果腘绳肌酸痛明显，不做 Nordic、硬 RDL、冲刺或最大跳。",
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
