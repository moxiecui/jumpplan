import {
  analyzeFeedbackSeverity,
  detectMovementQualityRisk,
  detectTendonRisk,
  suggestPlanLength
} from "@/logic/feedbackAnalysis";
import type {
  GeneratedAdaptivePlan,
  PlanGenerationRequest,
  PlanLength,
  TrainingFeedback
} from "@/types/adaptivePlan";
import type { TrainingBlock, TrainingDay, TrainingItem } from "@/types/training";
import type { PlanGenerationService } from "@/services/planGeneration";

function todayStamp() {
  return new Date().toISOString();
}

function generatedPhase(day: number): 1 | 2 | 3 {
  if (day <= 7) {
    return 1;
  }

  if (day <= 14) {
    return 2;
  }

  return 3;
}

function generatedPhaseTitle(day: number) {
  const phase = generatedPhase(day);
  if (phase === 1) {
    return "控制与容量建立";
  }

  if (phase === 2) {
    return "力量转化与反应弹性";
  }

  return "整合、减量与测试";
}

function hasPainAtOrAbove(feedback: TrainingFeedback[], threshold: number) {
  return feedback.some(
    (item) => (item.achillesPain ?? 0) >= threshold || (item.patellarPain ?? 0) >= threshold
  );
}

function hasExtraBasketball(request: PlanGenerationRequest) {
  return (
    request.constraints.basketballSessionsPerWeek >= 3 ||
    request.recentFeedback.some((item) => item.extraBasketball || (item.basketballMinutes ?? 0) >= 60)
  );
}

function warmupItems(): TrainingItem[] {
  return [
    { exerciseId: "foot-ball-release", duration: "45 秒/侧", intensity: "low" },
    { exerciseId: "short-foot", sets: 2, reps: "5 次，每次保持 6 秒", side: "each", intensity: "low" },
    { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
    { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" }
  ];
}

function activeRecoveryItems(): TrainingItem[] {
  return [
    { exerciseId: "easy-walk", duration: "10–20 分钟", intensity: "low" },
    { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" },
    {
      exerciseId: "calf-foam-roll",
      duration: "30–45 秒/肌群",
      intensity: "low",
      notes: "可选；轻到中等压力，不压跟腱、髌腱或膝关节。"
    }
  ];
}

function eveningRecoveryBlock(): TrainingBlock {
  return {
    type: "eveningRecovery",
    title: "Optional Evening Recovery",
    items: [
      { exerciseId: "legs-up-breathing", duration: "4–6 分钟", intensity: "low" },
      {
        exerciseId: "calf-foam-roll",
        duration: "30–45 秒/肌群",
        intensity: "low",
        notes: "可选；轻到中等压力，第二天更僵就减半或跳过。"
      }
    ]
  };
}

function generatedLoad(
  impactLevel: TrainingDay["impactLevel"],
  estimatedFatigue: TrainingDay["estimatedFatigue"],
  minMinutes: number,
  maxMinutes: number
) {
  return {
    impactLevel,
    estimatedFatigue,
    estimatedDurationMinutes: { min: minMinutes, max: maxMinutes }
  };
}

function recoveryDay(day: number, title = "肌腱安全恢复日"): TrainingDay {
  return {
    day,
    title,
    type: "recovery",
    phase: generatedPhase(day),
    phaseTitle: generatedPhaseTitle(day),
    ...generatedLoad("none", "very-low", 20, 35),
    plannedJumpContacts: { min: 0, max: 0 },
    performanceFocus: ["肌腱安全", "Zone 2", "活动度", "呼吸恢复"],
    isometricIncluded: true,
    goal: "降低冲击负荷，观察跟腱和髌腱反应，保留温和循环和活动度。",
    readinessRule: "如果跟腱或髌腱疼痛 >= 4/10，今天只执行恢复和肌腱安全内容。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupItems() },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "15–25 分钟", intensity: "low", notes: "保持能完整说话。" },
          { exerciseId: "easy-bike", duration: "10–20 分钟", intensity: "low", notes: "可替代步行，不做冲刺。" },
          {
            exerciseId: "spanish-squat-isometric",
            sets: 2,
            duration: "20–30 秒",
            intensity: "low",
            notes: "仅在疼痛不超过 3/10 时做。"
          },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: activeRecoveryItems() },
      eveningRecoveryBlock()
    ]
  };
}

function movementQualityDay(day: number): TrainingDay {
  return {
    day,
    title: "足弓 + 右膝力线重建",
    type: "skill",
    phase: generatedPhase(day),
    phaseTitle: generatedPhaseTitle(day),
    ...generatedLoad("low", "low", 30, 45),
    plannedJumpContacts: { min: 0, max: 4 },
    performanceFocus: ["右脚 tripod", "右膝轨迹", "安静落地", "低速控制"],
    coreIncluded: true,
    goal: "用低速技术练习恢复足弓控制、髋膝踝对齐和安静落地。",
    readinessRule: "如果右膝内扣或落地变重，降低速度、减少幅度，取消跳跃。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupItems() },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "step-down", sets: 3, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "single-leg-rdl-contralateral", sets: 2, reps: "6 次", side: "each", intensity: "medium" },
          {
            exerciseId: "lateral-stop-jump",
            sets: 2,
            reps: "2 次/方向",
            intensity: "low",
            rest: "90 秒",
            notes: "低速停步为主；如果膝盖内扣，只做侧向急停不跳。"
          }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: activeRecoveryItems() },
      eveningRecoveryBlock()
    ]
  };
}

function strengthControlDay(day: number, highBasketballLoad: boolean): TrainingDay {
  return {
    day,
    title: "力量维持 + 低冲击控制",
    type: "strength",
    phase: generatedPhase(day),
    phaseTitle: generatedPhaseTitle(day),
    ...generatedLoad("low", "moderate", 40, 55),
    plannedJumpContacts: { min: 0, max: 0 },
    performanceFocus: ["力量维持", "右膝控制", "肌腱负荷", "核心支撑"],
    coreIncluded: true,
    isometricIncluded: true,
    goal: "保留可控力量刺激，不做磨重量，不增加球场外冲击量。",
    readinessRule: highBasketballLoad
      ? "篮球频率偏高，本日不加跳跃，力量保持 RPE 6–7。"
      : "力量保持 RPE 6–7；任何肌腱痛升高就降级。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupItems() },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "3 次", intensity: "medium", rest: "2 分钟", notes: "RPE 6–7，不做 grind。" },
          { exerciseId: "bulgarian-split-squat-eccentric", sets: 2, reps: "5 次", side: "each", intensity: "medium", notes: "3 秒离心，膝盖对第二、三脚趾。" },
          { exerciseId: "single-leg-calf-raise", sets: 2, reps: "8 次", side: "each", intensity: "medium", notes: "慢上慢下，不弹震。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: activeRecoveryItems() },
      eveningRecoveryBlock()
    ]
  };
}

function lowImpactJumpDay(day: number): TrainingDay {
  return {
    day,
    title: "低量弹跳技术日",
    type: "jump",
    phase: generatedPhase(day),
    phaseTitle: generatedPhaseTitle(day),
    ...generatedLoad("moderate", "moderate", 35, 50),
    plannedJumpContacts: { min: 19, max: 25 },
    performanceFocus: ["低量弹跳", "起跳节奏", "落地质量", "右膝轨迹"],
    coreIncluded: true,
    goal: "保持起跳节奏和落地质量，不做高容量增强式训练。",
    readinessRule: "只在无痛、落地安静、右膝轨迹稳定时执行；不做最大跳测试。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupItems() },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 2, reps: "8–10 次", intensity: "low", rest: "60 秒", notes: "低幅、安静；跟腱晨僵则取消。", jumpContacts: { min: 16, max: 20 } },
          { exerciseId: "cmj", sets: 3, reps: "1 次", intensity: "medium", rest: "90 秒", notes: "70–85% 技术跳，不做最大努力。", jumpContacts: { min: 3, max: 3 } },
          { exerciseId: "approach-jump", sets: 2, reps: "1 次", intensity: "medium", rest: "90 秒", notes: "只练倒数两步和垂直投射。", jumpContacts: { min: 0, max: 2 } }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: activeRecoveryItems() },
      eveningRecoveryBlock()
    ]
  };
}

function basketballSkillDay(day: number): TrainingDay {
  return {
    day,
    title: "篮球低冲击技术日",
    type: "basketball",
    phase: generatedPhase(day),
    phaseTitle: generatedPhaseTitle(day),
    ...generatedLoad("variable", "variable", 30, 75),
    performanceFocus: ["篮球手感", "脚步控制", "右膝轨迹", "赛后恢复"],
    goal: "保留投篮和脚步感觉，避免连续最大跳和高强度急停。",
    readinessRule: "篮球频率高时，本日只做技术和轻松投篮。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupItems() },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "8–10 分钟", intensity: "low", notes: "球场热身或轻松走动。" },
          { exerciseId: "lateral-stop-jump", sets: 2, reps: "2 次/方向", intensity: "low", optional: true, notes: "仅轻篮球日可选；低速急停，不追高度。", jumpContacts: { min: 0, max: 8 } }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: activeRecoveryItems() },
      eveningRecoveryBlock()
    ]
  };
}

function buildDays(request: PlanGenerationRequest, length: PlanLength): TrainingDay[] {
  const tendonRisk = detectTendonRisk(request.recentFeedback);
  const movementRisk = detectMovementQualityRisk(request.recentFeedback);
  const highBasketballLoad = hasExtraBasketball(request);
  const painHigh = hasPainAtOrAbove(request.recentFeedback, 4);
  const completionLow = Boolean(request.cycleSummary && request.cycleSummary.completionRate < 0.7);
  const painWorse =
    request.cycleSummary?.achillesPainTrend === "worse" ||
    request.cycleSummary?.patellarPainTrend === "worse";
  const count =
    length === "3-days"
      ? 3
      : length === "7-days"
        ? 7
        : length === "10-days"
          ? 10
          : length === "21-days"
            ? 21
            : 28;

  if (tendonRisk || painHigh || painWorse) {
    return Array.from({ length: Math.min(count, 7) }, (_, index) => {
      if (index === 2 && !painHigh) {
        return movementQualityDay(index + 1);
      }

      return recoveryDay(index + 1, index === 0 ? "肌腱安全恢复日" : "低冲击恢复日");
    });
  }

  const pattern: Array<"jump" | "movement" | "strength" | "recovery" | "basketball"> =
    completionLow || highBasketballLoad
      ? ["movement", "strength", "recovery", "basketball", "recovery", "movement", "recovery"]
      : ["jump", "recovery", "strength", "movement", "recovery", "basketball", "recovery"];

  return Array.from({ length: count }, (_, index) => {
    const dayKind = pattern[index % pattern.length];

    if (movementRisk && dayKind === "jump") {
      return movementQualityDay(index + 1);
    }

    switch (dayKind) {
      case "jump":
        return lowImpactJumpDay(index + 1);
      case "movement":
        return movementQualityDay(index + 1);
      case "strength":
        return strengthControlDay(index + 1, highBasketballLoad);
      case "basketball":
        return basketballSkillDay(index + 1);
      case "recovery":
      default:
        return recoveryDay(index + 1, "低冲击恢复日");
    }
  });
}

function metadataFocus(request: PlanGenerationRequest) {
  if (detectTendonRisk(request.recentFeedback)) {
    return "肌腱安全、恢复负荷、低冲击活动";
  }

  if (detectMovementQualityRisk(request.recentFeedback)) {
    return "右脚足弓、右膝力线、落地控制";
  }

  if (hasExtraBasketball(request)) {
    return "减少健身房冲击量，保留篮球专项感觉";
  }

  return "低量高质量弹跳、力量维持、篮球转化";
}

export const mockPlanGenerationService: PlanGenerationService = {
  async generateAdaptivePlan(request: PlanGenerationRequest): Promise<GeneratedAdaptivePlan> {
    const severity = analyzeFeedbackSeverity(request.recentFeedback);
    const length = suggestPlanLength(request);
    const days = buildDays(request, length);
    const tendonRisk = detectTendonRisk(request.recentFeedback);
    const highBasketballLoad = hasExtraBasketball(request);

    return {
      metadata: {
        title: tendonRisk ? "JumpPlan 肌腱安全调整计划" : "JumpPlan 自适应调整计划",
        length,
        focus: metadataFocus(request),
        rationale:
          severity === "high"
            ? "近期反馈出现高肌腱风险，计划转为恢复和肌腱安全导向。"
            : "根据完成情况、疼痛反馈、篮球频率和动作质量，生成保守调整版本。",
        safetySummary:
          "本计划不包含高容量增强式训练，不在恢复日添加最大跳；肌腱疼痛和动作质量优先于穿戴设备状态。",
        generatedAt: todayStamp(),
        model: "mock-rule-engine",
        source: "mock"
      },
      days,
      globalRules: [
        "Do not generate high-volume plyometrics.",
        "Do not add max jumps on recovery days.",
        "Do not override tendon pain with wearable readiness.",
        "If Achilles or patellar pain >= 4/10, generate recovery-only or tendon-safety plan.",
        "If Achilles stiffness or patellar tendon pain >= 3/10, do not generate French Contrast, PAP, or max jump work.",
        "If basketball frequency is high, reduce gym impact volume.",
        `No more than ${Math.min(request.constraints.maxHighImpactDaysPerWeek, 2)} high-impact days per week.`,
        "Upper-body work supports basketball contact, posture, arm swing, and force transfer; it is not bodybuilding.",
        "Core work should be small-dose anti-rotation, anti-extension, anti-lateral-flexion, and carries.",
        "Use isometrics 2-4 times per week as tendon-friendly loading or a pain-friendly substitute.",
        "If tendon pain is moderate, replace dynamic jumps with Spanish squat isometric, calf isometric hold, or split-squat isometric.",
        "If hamstring soreness is high, remove Nordic, hard RDL, sprinting, and max jumping.",
        "French Contrast / Complex Training is optional conversion work, not conditioning.",
        "With multiple weekly basketball sessions, use French Contrast no more than once per week; prefer once every 7-10 days.",
        "Full French Contrast is rare: at most once every 2-3 weeks, only with high readiness and good tendon status.",
        "Every training day must include warmup and active recovery.",
        "Generated plan must be structured JSON only."
      ],
      progressionRules: [
        "只有肌腱症状 <=1–2/10、动作质量 >=4/5、过去 24–48 小时无高篮球负荷，并且完成接触量后质量没有下降，才进阶跳跃。",
        "相似跳跃课之间接触次数最多增加约 10–20%，或在接触数稳定时提高强度；不能同时自动增加强度和总量。",
        "力量动作全部按目标技术完成、RPE <=7 且症状未增加时，下次可增加 2.5–5% 重量或每组增加 1 次。",
        "RPE >=9、杠速明显下降、右脚/右膝控制变差或肌腱/腘绳肌症状增加时不加重量。",
        "Nordic 先增加控制和活动范围，再增加次数；不自动超过 2–3 个低次数组。",
        "篮球频率高的一周，不额外增加健身房冲击量。",
        "French Contrast 只放在专门转化日，不放在恢复日、休息日或高冲击篮球后的第二天。"
      ],
      deloadRules: [
        "跟腱或髌腱疼痛达到 3/10，取消最大跳、PAP 和 French Contrast。",
        "跟腱或髌腱疼痛达到 4/10，改恢复或肌腱安全计划。",
        "右膝内扣、落地变重或触地变慢时，降低速度和幅度。"
      ],
      redFlags: [
        "尖锐疼痛、疼痛加重或改变步态时停止训练。",
        "第二天跟腱晨僵或髌腱敏感增加时，减少冲击和泡沫轴压力。",
        "穿戴设备状态好也不能覆盖肌腱疼痛。"
      ]
    };
  }
};
