import type {
  AdaptiveTrainingBlock,
  SessionUnitType,
  TrainingBlock,
  TrainingItem,
  TrainingSessionUnit,
  WeeklySessionTarget
} from "@/types/training";

export const ADAPTIVE_MACROCYCLE_START_DATE = "2026-07-19";
export const ADAPTIVE_PLAN_VERSION = "cycle1-varied-session-schedule-v1";
export const LEGACY_FIXED_PLAN_LABEL = "Legacy Fixed Plan";

function item(exerciseId: string, params: Omit<TrainingItem, "exerciseId"> = {}): TrainingItem {
  return { exerciseId, ...params };
}

function block(type: TrainingBlock["type"], title: string, items: TrainingItem[]): TrainingBlock {
  return { type, title, items };
}

const warmup: TrainingBlock = block("warmup", "完整热身", [
  item("foot-ball-release", { duration: "45 秒/侧", intensity: "low" }),
  item("short-foot", { sets: 1, reps: "5 次，每次 5 秒", side: "each", intensity: "low" }),
  item("ankle-knee-wall", { sets: 1, reps: "8 次", side: "each", intensity: "low" }),
  item("band-lateral-walk", { sets: 2, reps: "8 步/方向", intensity: "low" })
]);

const recoveryFinish: TrainingBlock = block("activeRecovery", "主动恢复", [
  item("easy-walk", { duration: "8–12 分钟", intensity: "low" }),
  item("legs-up-breathing", { duration: "5 分钟", intensity: "low" })
]);

export const adaptiveTrainingBlocks: AdaptiveTrainingBlock[] = [
  {
    blockNumber: 1,
    weeks: [1, 2, 3],
    title: "力量基础与单腿支柱",
    goals: ["提升下肢力量", "建立右脚 tripod 和右膝轨迹", "建立腘绳肌、小腿和跟腱容量", "低量 CMJ baseline"],
    rules: ["无高容量 plyo", "无 full French Contrast", "Week 3 降低总量 35–50%"]
  },
  {
    blockNumber: 2,
    weeks: [4, 5, 6],
    title: "力量向爆发转化",
    goals: ["保持最大力量", "提高 strength-speed", "低剂量 loaded jump", "改善单脚起跳机制"],
    rules: ["每节只选一个 loaded jump", "每节只选一个高级单脚 plyo", "Week 6 降低跳跃量约 40%"]
  },
  {
    blockNumber: 3,
    weeks: [7, 8, 9],
    title: "反应力量与篮球起跳转化",
    goals: ["提高 RSI", "提高短触地刚性", "转换到助跑起跳", "保持低量力量"],
    rules: ["每 7 天最多 2 个高冲击日", "篮球中高负荷时删除第二反应课", "Week 9 不引入新高级动作"]
  },
  {
    blockNumber: 4,
    weeks: [10, 11, 12],
    title: "峰值、减量与测试",
    goals: ["保留强度", "降低疲劳", "峰值 CMJ / 助跑跳 / 单脚起跳", "测试并复盘"],
    rules: ["Week 11 taper", "Week 12 不做硬高级举重", "测试下降或动作变差就停止"]
  }
];

const trainingSessionTemplates: TrainingSessionUnit[] = [
  {
    id: "b1-strength-a",
    type: "strength-a",
    title: "Strength A：最大力量 + 后侧链",
    blockNumber: 1,
    priority: 100,
    impactLevel: "low",
    estimatedFatigue: "moderate",
    estimatedDurationMinutes: { min: 50, max: 70 },
    plannedJumpContacts: { min: 0, max: 0 },
    minimumRecoveryHours: 36,
    downgradeSessionUnitId: "b1-recovery",
    blockReasons: ["下肢力量基础", "腘绳肌和小腿容量", "右侧支柱"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("trap-bar-deadlift", { sets: 3, reps: "3–4 次", intensity: "medium", notes: "RPE 6–8，不磨重量。" }),
        item("bulgarian-split-squat", { sets: 3, reps: "5 次", side: "each", intensity: "medium" }),
        item("rdl", { sets: 2, reps: "5 次", intensity: "medium" }),
        item("hamstring-slider-curl", { sets: 2, reps: "5 次", intensity: "medium" }),
        item("bent-knee-calf-raise", { sets: 3, reps: "8 次", intensity: "low" }),
        item("suitcase-carry", { sets: 2, duration: "20–30 米", side: "each", intensity: "medium" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b1-strength-b",
    type: "strength-b",
    title: "Strength B：单腿力量 + 肌腱容量",
    blockNumber: 1,
    priority: 90,
    impactLevel: "low",
    estimatedFatigue: "moderate",
    estimatedDurationMinutes: { min: 45, max: 65 },
    plannedJumpContacts: { min: 0, max: 0 },
    minimumRecoveryHours: 36,
    downgradeSessionUnitId: "b1-recovery",
    blockReasons: ["右脚 tripod", "右膝轨迹", "小腿/胫骨前肌容量"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("front-squat", { sets: 3, reps: "4 次", intensity: "medium", notes: "可用 goblet squat 替代。" }),
        item("front-bulgarian-squat", { sets: 2, reps: "5 次", side: "each", intensity: "medium" }),
        item("step-down", { sets: 2, reps: "5 次", side: "each", intensity: "low" }),
        item("single-leg-rdl-top-lock", { sets: 2, reps: "5 次", side: "each", intensity: "low" }),
        item("spanish-squat-isometric", { sets: 2, duration: "20–30 秒", intensity: "low" }),
        item("tibialis-raise", { sets: 2, reps: "12 次", intensity: "low" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b1-power-a",
    type: "power-a",
    title: "Power A：低量力量速度",
    blockNumber: 1,
    priority: 70,
    impactLevel: "moderate",
    estimatedFatigue: "moderate",
    estimatedDurationMinutes: { min: 35, max: 55 },
    plannedJumpContacts: { min: 6, max: 14 },
    maxIntentContacts: { min: 0, max: 4 },
    minimumRecoveryHours: 48,
    downgradeSessionUnitId: "b1-strength-b",
    upgradeSessionUnitId: "b2-power-a",
    blockReasons: ["低量 CMJ baseline", "不自动加量"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("kettlebell-swing", { sets: 3, reps: "8 次", intensity: "medium", optional: true }),
        item("cmj", { sets: 3, reps: "1 次", intensity: "medium", notes: "70–85%，不是最大测试。", jumpContacts: { min: 3, max: 3 } }),
        item("low-pogo", { sets: 2, reps: "6–8 次", intensity: "low", jumpContacts: { min: 12, max: 16 } }),
        item("single-leg-snap-down-stick", { sets: 2, reps: "2 次", side: "each", intensity: "low", jumpContacts: { min: 0, max: 4, landingOnly: true } }),
        item("pallof-press", { sets: 2, reps: "8 次", side: "each", intensity: "low" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b1-upper-core",
    type: "upper-body-core",
    title: "上肢 + 核心：推拉平衡",
    blockNumber: 1,
    priority: 60,
    impactLevel: "none",
    estimatedFatigue: "low",
    estimatedDurationMinutes: { min: 35, max: 50 },
    plannedJumpContacts: { min: 0, max: 0 },
    blockReasons: ["摆臂", "对抗稳定", "核心传力"],
    exerciseBlocks: [
      block("warmup", "完整热身", [
        item("scapular-push-up", { sets: 2, reps: "8 次", intensity: "low" }),
        item("band-pull-apart", { sets: 2, reps: "12 次", intensity: "low" })
      ]),
      block("main", "主训练", [
        item("landmine-press", { sets: 3, reps: "6 次", side: "each", intensity: "medium" }),
        item("one-arm-dumbbell-row", { sets: 3, reps: "8 次", side: "each", intensity: "medium" }),
        item("pull-up-or-lat-pulldown", { sets: 3, reps: "5–8 次", intensity: "medium" }),
        item("pallof-press", { sets: 3, reps: "8 次", side: "each", intensity: "low" }),
        item("side-plank", { sets: 2, duration: "20 秒", side: "each", intensity: "low" }),
        item("farmer-carry", { sets: 2, duration: "20–30 米", intensity: "medium" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b1-recovery",
    type: "recovery",
    title: "Recovery：20–35 分钟恢复",
    blockNumber: 1,
    priority: 40,
    impactLevel: "none",
    estimatedFatigue: "very-low",
    estimatedDurationMinutes: { min: 20, max: 35 },
    plannedJumpContacts: { min: 0, max: 0 },
    blockReasons: ["恢复可随时插入，不会破坏周目标"],
    exerciseBlocks: [
      block("warmup", "完整热身", [item("easy-walk", { duration: "3–5 分钟", intensity: "low" })]),
      block("main", "主训练", [
        item("easy-bike", { duration: "10–18 分钟", intensity: "low" }),
        item("ankle-knee-wall", { sets: 1, reps: "8 次", side: "each", intensity: "low" }),
        item("hip-90-90-seated-rotation", { sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }),
        item("calf-isometric-hold", { sets: 1, duration: "20 秒", intensity: "low", optional: true })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b2-power-a",
    type: "power-a",
    title: "Power A：力量向爆发转化",
    blockNumber: 2,
    priority: 95,
    impactLevel: "high",
    estimatedFatigue: "moderate-high",
    estimatedDurationMinutes: { min: 40, max: 60 },
    plannedJumpContacts: { min: 12, max: 24 },
    maxIntentContacts: { min: 0, max: 6 },
    minimumRecoveryHours: 48,
    prerequisites: ["b1-power-a"],
    downgradeSessionUnitId: "b1-power-a",
    upgradeSessionUnitId: "b3-reactive-a",
    blockReasons: ["每节只选一个 loaded jump", "完整休息，不做 conditioning"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("clean-pull", { sets: 3, reps: "3 次", intensity: "medium", optional: true, notes: "可替换为 jump shrug / DB power snatch。" }),
        item("db-power-snatch", { sets: 3, reps: "3 次/侧", side: "each", intensity: "medium", optional: true }),
        item("db-squat-jump", { sets: 2, reps: "3 次", intensity: "medium", jumpContacts: { min: 0, max: 6 } }),
        item("cmj", { sets: 3, reps: "1 次", intensity: "medium", jumpContacts: { min: 3, max: 3 } }),
        item("box-jump", { sets: 3, reps: "2 次", intensity: "medium", jumpContacts: { min: 6, max: 6 } })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b2-single-leg-takeoff",
    type: "single-leg-takeoff",
    title: "Single-Leg Takeoff：倒数第二步 + 单脚起跳",
    blockNumber: 2,
    priority: 85,
    impactLevel: "moderate",
    estimatedFatigue: "moderate",
    estimatedDurationMinutes: { min: 35, max: 55 },
    plannedJumpContacts: { min: 8, max: 18 },
    maxIntentContacts: { min: 0, max: 4 },
    minimumRecoveryHours: 48,
    downgradeSessionUnitId: "b1-strength-b",
    upgradeSessionUnitId: "b3-single-leg-takeoff",
    blockReasons: ["单脚起跳效率", "右脚角度", "摆动腿提膝"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("band-hip-flexor", { sets: 2, reps: "5 次", side: "each", intensity: "low" }),
        item("penultimate-step-drill", { sets: 3, reps: "2 次", intensity: "low" }),
        item("two-step-single-leg-approach-jump", { sets: 3, reps: "1–2 次/侧", side: "each", intensity: "medium", jumpContacts: { min: 6, max: 12 } }),
        item("low-box-step-up-jump", { sets: 2, reps: "2 次/侧", side: "each", intensity: "medium", optional: true, jumpContacts: { min: 0, max: 8 } }),
        item("step-up-knee-drive-hold", { sets: 2, reps: "4 次", side: "each", intensity: "low" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b2-basketball-skill",
    type: "basketball-skill",
    title: "Basketball Skill：可选低强度技术",
    blockNumber: 2,
    priority: 30,
    impactLevel: "low",
    estimatedFatigue: "low",
    estimatedDurationMinutes: { min: 30, max: 60 },
    plannedJumpContacts: { min: 0, max: 12 },
    optional: true,
    postponeAllowed: true,
    blockReasons: ["篮球现在是辅助刺激，默认每周 0–1 次"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("easy-walk", { duration: "30–60 分钟技能/投篮", intensity: "low", notes: "半场、投篮、脚步为主；不做反复最大跳。" }),
        item("penultimate-step-drill", { sets: 2, reps: "2 次", intensity: "low", optional: true })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b3-reactive-a",
    type: "reactive-a",
    title: "Reactive A：短触地反应力量",
    blockNumber: 3,
    priority: 100,
    impactLevel: "high",
    estimatedFatigue: "moderate-high",
    estimatedDurationMinutes: { min: 40, max: 60 },
    plannedJumpContacts: { min: 18, max: 34 },
    maxIntentContacts: { min: 0, max: 10 },
    minimumRecoveryHours: 48,
    prerequisites: ["b2-power-a"],
    downgradeSessionUnitId: "b2-power-a",
    blockReasons: ["RSI", "短触地刚性", "助跑转化"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("low-pogo", { sets: 2, reps: "8 次", intensity: "low", jumpContacts: { min: 16, max: 16 } }),
        item("single-leg-low-pogo", { sets: 2, reps: "4–6 次/侧", side: "each", intensity: "medium", jumpContacts: { min: 8, max: 12 } }),
        item("depth-jump-less-contact", { sets: 2, reps: "2 次", intensity: "medium", optional: true, jumpContacts: { min: 0, max: 4, maxIntent: true } }),
        item("reactive-box-jump", { sets: 2, reps: "2 次", intensity: "medium", optional: true, jumpContacts: { min: 0, max: 4, maxIntent: true } }),
        item("single-leg-snap-down-stick", { sets: 2, reps: "2 次", side: "each", intensity: "low", jumpContacts: { min: 0, max: 4, landingOnly: true } })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b3-single-leg-takeoff",
    type: "single-leg-takeoff",
    title: "Single-Leg Takeoff：篮球起跳转化",
    blockNumber: 3,
    priority: 90,
    impactLevel: "high",
    estimatedFatigue: "moderate-high",
    estimatedDurationMinutes: { min: 40, max: 60 },
    plannedJumpContacts: { min: 14, max: 28 },
    maxIntentContacts: { min: 0, max: 8 },
    minimumRecoveryHours: 48,
    prerequisites: ["b2-single-leg-takeoff"],
    downgradeSessionUnitId: "b2-single-leg-takeoff",
    blockReasons: ["one-foot takeoff", "approach jump", "lateral stop"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("penultimate-jump", { sets: 3, reps: "1 次/侧", side: "each", intensity: "medium", jumpContacts: { min: 4, max: 6 } }),
        item("approach-jump", { sets: 4, reps: "1 次", intensity: "high", jumpContacts: { min: 4, max: 6, maxIntent: true } }),
        item("lateral-stop-jump", { sets: 2, reps: "2 次/方向", intensity: "medium", jumpContacts: { min: 8, max: 8 } }),
        item("single-leg-bound", { sets: 1, reps: "2 次/侧", side: "each", intensity: "medium", optional: true, jumpContacts: { min: 0, max: 4 } }),
        item("hip-airplane", { sets: 2, reps: "3 次", side: "each", intensity: "low" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b4-pre-test-activation",
    type: "pre-test-activation",
    title: "Pre-Test Activation：测试前激活",
    blockNumber: 4,
    priority: 80,
    impactLevel: "low",
    estimatedFatigue: "very-low",
    estimatedDurationMinutes: { min: 20, max: 35 },
    plannedJumpContacts: { min: 6, max: 14 },
    maxIntentContacts: { min: 0, max: 2 },
    downgradeSessionUnitId: "b1-recovery",
    blockReasons: ["感觉弹，不制造疲劳"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("low-pogo", { sets: 1, reps: "8–10 次", intensity: "low", jumpContacts: { min: 8, max: 10 } }),
        item("cmj", { sets: 2, reps: "1 次", intensity: "medium", notes: "75–85%，停在新鲜感。", jumpContacts: { min: 2, max: 2 } }),
        item("penultimate-step-drill", { sets: 2, reps: "2 次", intensity: "low" })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b4-test",
    type: "test",
    title: "Test：CMJ / 助跑跳 / 可选单脚起跳",
    blockNumber: 4,
    priority: 100,
    impactLevel: "high",
    estimatedFatigue: "moderate",
    estimatedDurationMinutes: { min: 35, max: 55 },
    plannedJumpContacts: { min: 7, max: 18 },
    maxIntentContacts: { min: 7, max: 18 },
    minimumRecoveryHours: 72,
    downgradeSessionUnitId: "b4-pre-test-activation",
    blockReasons: ["Week 12 测试", "下降或动作变差立即停止"],
    exerciseBlocks: [
      warmup,
      block("main", "主训练", [
        item("cmj", { sets: 3, reps: "1 次", intensity: "high", rest: "2–3 分钟", jumpContacts: { min: 3, max: 3, maxIntent: true } }),
        item("approach-jump", { sets: 4, reps: "1 次", intensity: "high", rest: "2–3 分钟", jumpContacts: { min: 4, max: 6, maxIntent: true } }),
        item("max-single-leg-approach-jump", { sets: 3, reps: "每侧最多 3 次", side: "each", intensity: "high", optional: true, jumpContacts: { min: 0, max: 6, maxIntent: true } })
      ]),
      recoveryFinish
    ]
  },
  {
    id: "b4-review",
    type: "review",
    title: "Review：复盘并生成下一阶段",
    blockNumber: 4,
    priority: 50,
    impactLevel: "none",
    estimatedFatigue: "very-low",
    estimatedDurationMinutes: { min: 20, max: 35 },
    plannedJumpContacts: { min: 0, max: 0 },
    blockReasons: ["保留日志", "复盘右侧趋势", "准备 GPT 调整"],
    exerciseBlocks: [
      block("main", "主训练", [
        item("easy-walk", { duration: "10–15 分钟", intensity: "low" }),
        item("legs-up-breathing", { duration: "5 分钟", intensity: "low" })
      ])
    ]
  }
];

function cloneTrainingItem(itemValue: TrainingItem): TrainingItem {
  return {
    ...itemValue,
    jumpContacts: itemValue.jumpContacts ? { ...itemValue.jumpContacts } : undefined
  };
}

function cloneTrainingBlock(blockValue: TrainingBlock): TrainingBlock {
  return {
    ...blockValue,
    items: blockValue.items.map(cloneTrainingItem)
  };
}

function clonedBlocks(blocks: TrainingBlock[]) {
  return blocks.map(cloneTrainingBlock);
}

function contacts(min: number, max: number, flags: Partial<NonNullable<TrainingItem["jumpContacts"]>> = {}) {
  return { min, max, ...flags };
}

function cycleWarmup(extraItems: TrainingItem[] = []): TrainingBlock {
  return block("warmup", "完整热身", [
    item("foot-ball-release", { duration: "45 秒/侧", intensity: "low" }),
    item("short-foot", { sets: 1, reps: "5 次，每次 5 秒", side: "each", intensity: "low" }),
    item("ankle-knee-wall", { sets: 1, reps: "8 次", side: "each", intensity: "low" }),
    item("band-lateral-walk", { sets: 2, reps: "8 步/方向", intensity: "low" }),
    ...extraItems
  ]);
}

function cycleRecoveryFinish(): TrainingBlock {
  return block("activeRecovery", "主动恢复", [
    item("easy-walk", { duration: "6–12 分钟", intensity: "low" }),
    item("legs-up-breathing", { duration: "4–6 分钟", intensity: "low" })
  ]);
}

function createGeneratedSession(params: {
  id: string;
  type: SessionUnitType;
  title: string;
  purpose: string;
  macrocycleDay: number;
  weekNumber: number;
  stage: NonNullable<TrainingSessionUnit["progressionMetadata"]>["stage"];
  plannedIntensity: NonNullable<TrainingSessionUnit["plannedIntensity"]>;
  impactLevel: TrainingSessionUnit["impactLevel"];
  estimatedFatigue: TrainingSessionUnit["estimatedFatigue"];
  duration: { min: number; max: number };
  plannedJumpContacts: { min: number; max: number };
  maxIntentContacts?: { min: number; max: number };
  priority: number;
  exerciseBlocks: TrainingBlock[];
  recoverySubstitutionUnitId?: string;
  optional?: boolean;
  volumeMultiplier: number;
  notes: string[];
}): TrainingSessionUnit {
  return {
    id: params.id,
    sessionUnitId: params.id,
    type: params.type,
    title: params.title,
    purpose: params.purpose,
    blockNumber: 1,
    priority: params.priority,
    impactLevel: params.impactLevel,
    plannedIntensity: params.plannedIntensity,
    estimatedFatigue: params.estimatedFatigue,
    estimatedDurationMinutes: params.duration,
    plannedJumpContacts: params.plannedJumpContacts,
    maxIntentContacts: params.maxIntentContacts,
    exerciseBlocks: clonedBlocks(params.exerciseBlocks),
    recoverySubstitutionUnitId: params.recoverySubstitutionUnitId,
    optional: params.optional,
    source: "generated",
    progressionMetadata: {
      macrocycleDay: params.macrocycleDay,
      weekNumber: params.weekNumber,
      dayInCycle: params.macrocycleDay,
      stage: params.stage,
      volumeMultiplier: params.volumeMultiplier,
      intensityNote: params.plannedIntensity,
      notes: params.notes
    }
  };
}

function strengthABlocks(stage: "base" | "progression" | "deload"): TrainingBlock[] {
  const isProgression = stage === "progression";
  const isDeload = stage === "deload";
  return [
    cycleWarmup(),
    block("main", "主训练", [
      item("trap-bar-deadlift", {
        sets: isDeload ? 2 : isProgression ? 4 : 3,
        reps: isDeload ? "3 次" : "3–4 次",
        intensity: isDeload ? "low" : "medium",
        notes: isDeload ? "RPE 6，速度干净，不制造酸痛。" : "RPE 6–8，不磨重量。"
      }),
      item("bulgarian-split-squat", {
        sets: isDeload ? 2 : 3,
        reps: isDeload ? "4 次" : "5 次",
        side: "each",
        intensity: isDeload ? "low" : "medium"
      }),
      item(isProgression ? "single-leg-rdl-top-lock" : "rdl", {
        sets: isDeload ? 1 : isProgression ? 3 : 2,
        reps: isDeload ? "5 次" : "5 次",
        side: isProgression ? "each" : undefined,
        intensity: isDeload ? "low" : "medium"
      }),
      item("hamstring-slider-curl", {
        sets: isDeload ? 1 : 2,
        reps: isDeload ? "4–5 次" : "5 次",
        intensity: isDeload ? "low" : "medium"
      }),
      item("calf-raise-with-plate-under-front-foot", {
        sets: isDeload ? 2 : 3,
        reps: isDeload ? "8 次" : "8–10 次",
        intensity: isDeload ? "low" : "medium",
        notes: "直膝小腿容量；跟腱晨僵 >=3/10 时改等长。"
      }),
      item("suitcase-carry", {
        sets: isDeload ? 1 : 2,
        duration: "20–30 米",
        side: "each",
        intensity: isDeload ? "low" : "medium"
      })
    ]),
    cycleRecoveryFinish()
  ];
}

function strengthBBlocks(stage: "base" | "progression" | "deload"): TrainingBlock[] {
  const isProgression = stage === "progression";
  const isDeload = stage === "deload";
  return [
    cycleWarmup(),
    block("main", "主训练", [
      item(isDeload ? "goblet-squat" : "front-squat", {
        sets: isDeload ? 2 : isProgression ? 4 : 3,
        reps: isDeload ? "5 次" : "4 次",
        intensity: isDeload ? "low" : "medium"
      }),
      item("front-bulgarian-squat", {
        sets: isDeload ? 2 : 3,
        reps: isDeload ? "4 次" : "5 次",
        side: "each",
        intensity: isDeload ? "low" : "medium"
      }),
      item("step-down", {
        sets: isDeload ? 1 : 2,
        reps: "5 次",
        side: "each",
        intensity: "low"
      }),
      item("band-hamstring-curl", {
        sets: isDeload ? 1 : 2,
        reps: isDeload ? "8 次" : "10 次",
        intensity: "low"
      }),
      item("spanish-squat-isometric", {
        sets: isDeload ? 1 : 2,
        duration: isDeload ? "15–20 秒" : "20–30 秒",
        intensity: "low"
      }),
      item("bent-knee-calf-raise", {
        sets: isDeload ? 2 : 3,
        reps: isDeload ? "8 次" : "8–10 次",
        intensity: isDeload ? "low" : "medium"
      }),
      item("tibialis-raise", {
        sets: isDeload ? 1 : 2,
        reps: isDeload ? "10 次" : "12 次",
        intensity: "low"
      }),
      item("pallof-press", {
        sets: isDeload ? 1 : 2,
        reps: "8 次",
        side: "each",
        intensity: "low"
      })
    ]),
    cycleRecoveryFinish()
  ];
}

function lowPlyoBlocks(stage: "base" | "progression" | "deload" | "assessment"): TrainingBlock[] {
  const isProgression = stage === "progression";
  const isDeload = stage === "deload" || stage === "assessment";
  return [
    cycleWarmup([item("single-leg-calf-isometric-hold", { sets: 1, duration: "15–20 秒", side: "each", intensity: "low", optional: true })]),
    block("main", stage === "assessment" ? "主训练（动作质量与 submax CMJ 评估）" : "主训练", [
      item("short-foot", { sets: 1, reps: "5 次", side: "each", intensity: "low", notes: "脚三点支撑和足弓先稳定。" }),
      item("single-leg-snap-down-stick", {
        sets: isDeload ? 1 : 2,
        reps: "2 次/侧",
        side: "each",
        intensity: "low",
        jumpContacts: contacts(0, isDeload ? 2 : 4, { landingOnly: true })
      }),
      item("low-pogo", {
        sets: isDeload ? 1 : 2,
        reps: isDeload ? "6–8 次" : isProgression ? "8–10 次" : "6–8 次",
        intensity: "low",
        jumpContacts: isDeload ? contacts(6, 8) : contacts(12, isProgression ? 20 : 16)
      }),
      item("single-leg-landing-stick", {
        sets: isDeload ? 1 : 2,
        reps: "2 次/侧",
        side: "each",
        intensity: "low",
        jumpContacts: contacts(0, isDeload ? 2 : 4, { landingOnly: true })
      }),
      item("cmj", {
        sets: stage === "assessment" ? 3 : isDeload ? 1 : 2,
        reps: stage === "assessment" ? "1 次" : "1–2 次",
        intensity: isDeload ? "low" : "medium",
        notes: stage === "assessment" ? "70–85%，记录感觉和落地，不做最大测试。" : "70–85%，不是最大测试。",
        jumpContacts: stage === "assessment" ? contacts(3, 3) : isDeload ? contacts(0, 2) : contacts(2, 4)
      }),
      item("box-jump", {
        sets: isProgression ? 2 : 1,
        reps: "2 次",
        intensity: "low",
        optional: true,
        notes: "低箱、安静落地；膝前侧或肌腱提示时跳过。",
        jumpContacts: contacts(0, isProgression ? 4 : 2)
      })
    ]),
    cycleRecoveryFinish()
  ];
}

function recoveryBlocks(review = false): TrainingBlock[] {
  return [
    block("warmup", "完整热身", [item("easy-walk", { duration: "3–5 分钟", intensity: "low" })]),
    block("main", review ? "主训练（恢复 + 周复盘）" : "主训练", [
      item("easy-bike", { duration: "10–18 分钟", intensity: "low" }),
      item("ankle-knee-wall", { sets: 1, reps: "8 次", side: "each", intensity: "low" }),
      item("hip-90-90-seated-rotation", { sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }),
      item("short-foot", { sets: 1, reps: "5 次", side: "each", intensity: "low" }),
      item("calf-isometric-hold", { sets: 1, duration: "20 秒", intensity: "low", optional: true }),
      ...(review ? [item("legs-up-breathing", { duration: "5 分钟", intensity: "low", notes: "复盘本周膝部、跟腱、右脚外旋和右膝轨迹。" })] : [])
    ]),
    cycleRecoveryFinish()
  ];
}

function upperCoreBlocks(stage: "base" | "progression" | "deload"): TrainingBlock[] {
  const isDeload = stage === "deload";
  return [
    block("warmup", "完整热身", [
      item("scapular-push-up", { sets: 2, reps: "8 次", intensity: "low" }),
      item("band-pull-apart", { sets: 2, reps: "12 次", intensity: "low" })
    ]),
    block("main", "主训练", [
      item(stage === "progression" ? "dumbbell-bench-press" : "push-up", { sets: isDeload ? 2 : 3, reps: isDeload ? "6 次" : "6–8 次", intensity: isDeload ? "low" : "medium" }),
      item("one-arm-dumbbell-row", { sets: isDeload ? 2 : 3, reps: isDeload ? "6 次" : "8 次", side: "each", intensity: isDeload ? "low" : "medium" }),
      item(stage === "base" ? "landmine-press" : "pull-up-or-lat-pulldown", { sets: isDeload ? 2 : 3, reps: isDeload ? "5 次" : "5–8 次", intensity: isDeload ? "low" : "medium" }),
      item("pallof-press", { sets: isDeload ? 2 : 3, reps: "8 次", side: "each", intensity: "low" }),
      item("side-plank", { sets: isDeload ? 1 : 2, duration: isDeload ? "15 秒" : "20 秒", side: "each", intensity: "low" }),
      item(isDeload ? "suitcase-carry" : "farmer-carry", { sets: isDeload ? 1 : 2, duration: "20–30 米", intensity: isDeload ? "low" : "medium" }),
      item("hanging-abs-curl", { sets: isDeload ? 1 : 2, reps: "5–8 次", intensity: "low", optional: true })
    ]),
    cycleRecoveryFinish()
  ];
}

function basketballOrRecoveryBlocks(): TrainingBlock[] {
  return [
    cycleWarmup([item("band-hip-flexor", { sets: 1, reps: "5 次", side: "each", intensity: "low", optional: true })]),
    block("main", "主训练（可选篮球技术）", [
      item("easy-walk", { duration: "30–60 分钟技能/投篮", intensity: "low", notes: "半场、投篮、脚步为主；不做反复最大跳。" }),
      item("penultimate-step-drill", { sets: 2, reps: "2 次", intensity: "low", optional: true }),
      item("defensive-slide-stop", { sets: 2, reps: "2 次/方向", intensity: "low", optional: true })
    ]),
    block("optionalRecovery", "如果不打篮球，改做恢复替代", [
      item("easy-bike", { duration: "12–18 分钟", intensity: "low" }),
      item("ankle-knee-wall", { sets: 1, reps: "8 次", side: "each", intensity: "low" }),
      item("legs-up-breathing", { duration: "5 分钟", intensity: "low" })
    ]),
    cycleRecoveryFinish()
  ];
}

const generatedCycleOneSupportSessions: TrainingSessionUnit[] = [
  createGeneratedSession({
    id: "c1d06-recovery-sub",
    type: "recovery",
    title: "Day 6 Recovery Substitution：不打篮球时的恢复替代",
    purpose: "当可选篮球取消或身体状态不适合篮球时，保留低冲击恢复和足踝控制。",
    macrocycleDay: 6,
    weekNumber: 1,
    stage: "base",
    plannedIntensity: "low",
    impactLevel: "none",
    estimatedFatigue: "very-low",
    duration: { min: 20, max: 35 },
    plannedJumpContacts: { min: 0, max: 0 },
    priority: 35,
    exerciseBlocks: recoveryBlocks(),
    volumeMultiplier: 1,
    notes: ["篮球为可选；恢复替代不补跳跃量。"]
  }),
  createGeneratedSession({
    id: "c1d13-recovery-sub",
    type: "recovery",
    title: "Day 13 Recovery Substitution：不打篮球时的恢复替代",
    purpose: "第 2 周可选篮球取消时，维持恢复和足踝控制，不追加跳跃量。",
    macrocycleDay: 13,
    weekNumber: 2,
    stage: "progression",
    plannedIntensity: "low",
    impactLevel: "none",
    estimatedFatigue: "very-low",
    duration: { min: 20, max: 35 },
    plannedJumpContacts: { min: 0, max: 0 },
    priority: 35,
    exerciseBlocks: recoveryBlocks(),
    volumeMultiplier: 1,
    notes: ["篮球为可选；恢复替代不补跳跃量。"]
  })
];

export const cycleOneScheduledSessions: TrainingSessionUnit[] = [
  createGeneratedSession({
    id: "c1d01-strength-a",
    type: "strength-a",
    title: "Day 1 Strength A：后侧链与基础力量",
    purpose: "建立 trap-bar/髋铰链力量、腘绳肌容量、直膝小腿容量和右侧支柱。",
    macrocycleDay: 1,
    weekNumber: 1,
    stage: "base",
    plannedIntensity: "moderate",
    impactLevel: "low",
    estimatedFatigue: "moderate",
    duration: { min: 50, max: 70 },
    plannedJumpContacts: { min: 0, max: 0 },
    priority: 100,
    exerciseBlocks: strengthABlocks("base"),
    volumeMultiplier: 1,
    notes: ["Cycle 1 base Strength A。"]
  }),
  createGeneratedSession({ id: "c1d02-recovery", type: "recovery", title: "Day 2 Recovery：足踝活动 + 轻有氧", purpose: "恢复、膝部观察、足弓和髋活动控制。", macrocycleDay: 2, weekNumber: 1, stage: "base", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 40, exerciseBlocks: recoveryBlocks(), volumeMultiplier: 1, notes: ["恢复日不能继承力量或 plyo 内容。"] }),
  createGeneratedSession({ id: "c1d03-low-plyo-landing", type: "power-a", title: "Day 3 Low Plyometric / Landing：低 Pogo + 落地", purpose: "用低冲击弹性和落地定住建立跳跃质量，不做最大跳。", macrocycleDay: 3, weekNumber: 1, stage: "base", plannedIntensity: "low-moderate", impactLevel: "low", estimatedFatigue: "low", duration: { min: 35, max: 50 }, plannedJumpContacts: { min: 14, max: 26 }, maxIntentContacts: { min: 0, max: 0 }, priority: 75, exerciseBlocks: lowPlyoBlocks("base"), volumeMultiplier: 1, notes: ["低 pogo、snap-down、submax CMJ。"] }),
  createGeneratedSession({ id: "c1d04-upper-core", type: "upper-body-core", title: "Day 4 Upper Body + Core：推拉与传力", purpose: "上肢推拉、核心抗旋转和 carries 支持篮球对抗和摆臂。", macrocycleDay: 4, weekNumber: 1, stage: "base", plannedIntensity: "moderate", impactLevel: "none", estimatedFatigue: "low", duration: { min: 35, max: 50 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 65, exerciseBlocks: upperCoreBlocks("base"), volumeMultiplier: 1, notes: ["不制造影响下肢训练的酸痛。"] }),
  createGeneratedSession({ id: "c1d05-strength-b", type: "strength-b", title: "Day 5 Strength B：单腿力量与肌腱容量", purpose: "训练前蹲/高脚杯、分腿蹲、step-down、膝部等长、小腿和胫骨前肌容量。", macrocycleDay: 5, weekNumber: 1, stage: "base", plannedIntensity: "moderate", impactLevel: "low", estimatedFatigue: "moderate", duration: { min: 45, max: 65 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 90, exerciseBlocks: strengthBBlocks("base"), volumeMultiplier: 1, notes: ["右脚 tripod 和右膝轨迹优先。"] }),
  createGeneratedSession({ id: "c1d06-optional-basketball", type: "basketball-skill", title: "Day 6 Optional Basketball Skill 或 Recovery", purpose: "可选低强度篮球技术；如果篮球负荷会偏中高，直接改恢复替代。", macrocycleDay: 6, weekNumber: 1, stage: "base", plannedIntensity: "low", impactLevel: "low", estimatedFatigue: "low", duration: { min: 25, max: 60 }, plannedJumpContacts: { min: 0, max: 8 }, priority: 30, exerciseBlocks: basketballOrRecoveryBlocks(), recoverySubstitutionUnitId: "c1d06-recovery-sub", optional: true, volumeMultiplier: 1, notes: ["篮球是可选刺激，不做反复最大跳。"] }),
  createGeneratedSession({ id: "c1d07-full-recovery-review", type: "review", title: "Day 7 Full Recovery + Weekly Review", purpose: "完整恢复并复盘膝部、跟腱、右脚外旋、右膝轨迹和完成情况。", macrocycleDay: 7, weekNumber: 1, stage: "review", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 35, exerciseBlocks: recoveryBlocks(true), volumeMultiplier: 0.8, notes: ["周复盘，不添加训练压力。"] }),
  createGeneratedSession({ id: "c1d08-strength-a-progression", type: "strength-a", title: "Day 8 Strength A Progression：后侧链推进", purpose: "在动作稳定前提下小幅推进 Strength A 的 selected volume/intensity。", macrocycleDay: 8, weekNumber: 2, stage: "progression", plannedIntensity: "moderate", impactLevel: "low", estimatedFatigue: "moderate", duration: { min: 55, max: 75 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 100, exerciseBlocks: strengthABlocks("progression"), volumeMultiplier: 1.15, notes: ["Week 2 比 Week 1 小幅推进，不磨重量。"] }),
  createGeneratedSession({ id: "c1d09-recovery", type: "recovery", title: "Day 9 Recovery：轻有氧 + 足髋控制", purpose: "给 Week 2 progression 留恢复空间。", macrocycleDay: 9, weekNumber: 2, stage: "base", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 40, exerciseBlocks: recoveryBlocks(), volumeMultiplier: 1, notes: ["恢复日不继承力量或 plyo。"] }),
  createGeneratedSession({ id: "c1d10-low-plyo-single-leg-control", type: "power-a", title: "Day 10 Low Plyometric + Single-Leg Control Progression", purpose: "从 Week 1 低弹跳推进到更稳定的单腿控制和低箱选项。", macrocycleDay: 10, weekNumber: 2, stage: "progression", plannedIntensity: "low-moderate", impactLevel: "moderate", estimatedFatigue: "moderate", duration: { min: 40, max: 55 }, plannedJumpContacts: { min: 20, max: 34 }, maxIntentContacts: { min: 0, max: 0 }, priority: 78, exerciseBlocks: lowPlyoBlocks("progression"), volumeMultiplier: 1.2, notes: ["Week 2 比 Week 1 增加低量接触或控制难度。"] }),
  createGeneratedSession({ id: "c1d11-upper-core-progression", type: "upper-body-core", title: "Day 11 Upper Body + Core Progression", purpose: "保持上肢推拉平衡和核心传力，小幅推进但不影响下肢恢复。", macrocycleDay: 11, weekNumber: 2, stage: "progression", plannedIntensity: "moderate", impactLevel: "none", estimatedFatigue: "low", duration: { min: 35, max: 55 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 65, exerciseBlocks: upperCoreBlocks("progression"), volumeMultiplier: 1.1, notes: ["选用哑铃卧推或下拉推进，上肢不过度酸痛。"] }),
  createGeneratedSession({ id: "c1d12-strength-b-progression", type: "strength-b", title: "Day 12 Strength B Progression：单腿与肌腱容量推进", purpose: "小幅推进单腿力量、膝部等长、小腿和胫骨前肌容量。", macrocycleDay: 12, weekNumber: 2, stage: "progression", plannedIntensity: "moderate", impactLevel: "low", estimatedFatigue: "moderate", duration: { min: 50, max: 70 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 92, exerciseBlocks: strengthBBlocks("progression"), volumeMultiplier: 1.15, notes: ["右膝轨迹不稳时不加重量。"] }),
  createGeneratedSession({ id: "c1d13-optional-basketball", type: "basketball-skill", title: "Day 13 Optional Basketball Skill 或 Recovery", purpose: "可选低强度篮球技术；如篮球会偏强，选择恢复替代。", macrocycleDay: 13, weekNumber: 2, stage: "progression", plannedIntensity: "low", impactLevel: "low", estimatedFatigue: "low", duration: { min: 25, max: 60 }, plannedJumpContacts: { min: 0, max: 10 }, priority: 30, exerciseBlocks: basketballOrRecoveryBlocks(), recoverySubstitutionUnitId: "c1d13-recovery-sub", optional: true, volumeMultiplier: 1, notes: ["不因为没打篮球而补跳跃量。"] }),
  createGeneratedSession({ id: "c1d14-full-recovery-review", type: "review", title: "Day 14 Full Recovery + Weekly Review", purpose: "恢复并复盘 Week 2 progression 对膝、肌腱和跳跃质量的影响。", macrocycleDay: 14, weekNumber: 2, stage: "review", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 35, exerciseBlocks: recoveryBlocks(true), volumeMultiplier: 0.8, notes: ["如果 Week 2 反应不好，Week 3 更保守。"] }),
  createGeneratedSession({ id: "c1d15-deload-strength-a", type: "strength-a", title: "Day 15 Deload Strength A", purpose: "保留后侧链模式和小腿容量，降低约 35–50% 总量。", macrocycleDay: 15, weekNumber: 3, stage: "deload", plannedIntensity: "low-moderate", impactLevel: "low", estimatedFatigue: "low", duration: { min: 35, max: 55 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 80, exerciseBlocks: strengthABlocks("deload"), volumeMultiplier: 0.55, notes: ["Week 3 deload，不制造酸痛。"] }),
  createGeneratedSession({ id: "c1d16-recovery", type: "recovery", title: "Day 16 Recovery：轻有氧 + 活动度", purpose: "继续卸载，保持足踝和髋活动。", macrocycleDay: 16, weekNumber: 3, stage: "deload", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 40, exerciseBlocks: recoveryBlocks(), volumeMultiplier: 0.8, notes: ["恢复日不继承训练内容。"] }),
  createGeneratedSession({ id: "c1d17-low-volume-landing-technique", type: "power-a", title: "Day 17 Low-Volume Landing + Jump Technique", purpose: "低量落地和技术跳，保持弹性但不累积疲劳。", macrocycleDay: 17, weekNumber: 3, stage: "deload", plannedIntensity: "low", impactLevel: "low", estimatedFatigue: "very-low", duration: { min: 25, max: 40 }, plannedJumpContacts: { min: 8, max: 16 }, maxIntentContacts: { min: 0, max: 0 }, priority: 60, exerciseBlocks: lowPlyoBlocks("deload"), volumeMultiplier: 0.55, notes: ["Week 3 比 Week 2 明显降量。"] }),
  createGeneratedSession({ id: "c1d18-upper-core-deload", type: "upper-body-core", title: "Day 18 Upper Body + Core Reduced Volume", purpose: "保留上肢和核心刺激，降低总量。", macrocycleDay: 18, weekNumber: 3, stage: "deload", plannedIntensity: "low-moderate", impactLevel: "none", estimatedFatigue: "low", duration: { min: 25, max: 40 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 55, exerciseBlocks: upperCoreBlocks("deload"), volumeMultiplier: 0.6, notes: ["上肢不做到酸痛。"] }),
  createGeneratedSession({ id: "c1d19-deload-strength-b", type: "strength-b", title: "Day 19 Deload Strength B", purpose: "保留单腿、膝部等长和小腿容量，降低 35–50% 总量。", macrocycleDay: 19, weekNumber: 3, stage: "deload", plannedIntensity: "low-moderate", impactLevel: "low", estimatedFatigue: "low", duration: { min: 35, max: 50 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 75, exerciseBlocks: strengthBBlocks("deload"), volumeMultiplier: 0.55, notes: ["膝前侧或髌腱敏感时只保留浅等长和恢复。"] }),
  createGeneratedSession({ id: "c1d20-movement-quality-submax-cmj", type: "test", title: "Day 20 Movement Quality + Submax CMJ Assessment", purpose: "检查右脚外旋、右膝轨迹、落地安静和 70–85% CMJ 感觉。", macrocycleDay: 20, weekNumber: 3, stage: "assessment", plannedIntensity: "low", impactLevel: "low", estimatedFatigue: "very-low", duration: { min: 25, max: 40 }, plannedJumpContacts: { min: 8, max: 16 }, maxIntentContacts: { min: 0, max: 0 }, priority: 70, exerciseBlocks: lowPlyoBlocks("assessment"), volumeMultiplier: 0.5, notes: ["不是最大测试；疼痛或动作质量差则改恢复。"] }),
  createGeneratedSession({ id: "c1d21-review-transition-cycle2", type: "review", title: "Day 21 Review + Transition to Cycle 2", purpose: "复盘 Cycle 1，决定 Cycle 2 是否继续、deload、修改或生成下一阶段。", macrocycleDay: 21, weekNumber: 3, stage: "review", plannedIntensity: "low", impactLevel: "none", estimatedFatigue: "very-low", duration: { min: 20, max: 35 }, plannedJumpContacts: { min: 0, max: 0 }, priority: 45, exerciseBlocks: recoveryBlocks(true), volumeMultiplier: 0.5, notes: ["过渡到 Cycle 2，不添加训练压力。"] })
];

export const cycleOneSessionAssignments = cycleOneScheduledSessions.map((session) => ({
  macrocycleDay: session.progressionMetadata?.macrocycleDay ?? 1,
  sessionUnitId: session.id
}));

export const trainingSessionUnits: TrainingSessionUnit[] = [
  ...cycleOneScheduledSessions,
  ...generatedCycleOneSupportSessions,
  ...trainingSessionTemplates.map((session) => ({
    ...session,
    sessionUnitId: session.id,
    source: session.source ?? ("template" as const),
    exerciseBlocks: clonedBlocks(session.exerciseBlocks)
  }))
];

const commonTargets: WeeklySessionTarget["unitTargets"] = {
  "strength-a": { min: 1, max: 1 },
  "strength-b": { min: 0, max: 1 },
  "power-a": { min: 1, max: 1 },
  "upper-body-core": { min: 1, max: 1 },
  recovery: { min: 2, max: 3 },
  "basketball-skill": { min: 0, max: 1, optional: true }
};

export const weeklySessionTargets: WeeklySessionTarget[] = Array.from({ length: 12 }, (_, index) => {
  const weekNumber = index + 1;
  const blockNumber = Math.ceil(weekNumber / 3) as 1 | 2 | 3 | 4;
  const deload = weekNumber % 3 === 0;
  const unitTargets: WeeklySessionTarget["unitTargets"] = {
    ...commonTargets,
    "single-leg-takeoff": blockNumber >= 2 ? { min: 1, max: 1 } : { min: 0, max: 1 },
    "reactive-a": blockNumber >= 3 ? { min: 1, max: 1 } : { min: 0, max: 0, optional: true },
    "pre-test-activation": blockNumber === 4 && weekNumber >= 11 ? { min: 1, max: 1 } : { min: 0, max: 0, optional: true },
    test: weekNumber === 12 ? { min: 1, max: 1 } : { min: 0, max: 0, optional: true },
    review: deload ? { min: 1, max: 1 } : { min: 0, max: 0, optional: true }
  };

  if (deload) {
    unitTargets["power-a"] = { min: 0, max: 1 };
    unitTargets["reactive-a"] = blockNumber >= 3
      ? { min: 0, max: 1, optional: true }
      : { min: 0, max: 0, optional: true };
  }

  if (blockNumber === 1) {
    unitTargets["strength-b"] = { min: 1, max: 1 };
  }

  if (blockNumber === 3) {
    unitTargets["power-a"] = { min: 0, max: 0, optional: true };
  }

  if (blockNumber === 4) {
    unitTargets["power-a"] = { min: 0, max: 0, optional: true };
    unitTargets["strength-a"] = weekNumber === 12 ? { min: 0, max: 0, optional: true } : { min: 1, max: 1 };
    unitTargets["single-leg-takeoff"] = { min: 0, max: 1, optional: true };
    unitTargets["reactive-a"] = { min: 0, max: 0, optional: true };
  }

  return {
    weekNumber,
    blockNumber,
    title: adaptiveTrainingBlocks.find((blockItem) => blockItem.blockNumber === blockNumber)?.title ?? "",
    unitTargets,
    deload
  };
});

export function getAdaptiveBlock(blockNumber: 1 | 2 | 3 | 4) {
  return adaptiveTrainingBlocks.find((block) => block.blockNumber === blockNumber) ?? adaptiveTrainingBlocks[0];
}

export function getSessionUnit(id: string) {
  return trainingSessionUnits.find((unit) => unit.id === id);
}

export function getSessionUnitsForBlock(blockNumber: 1 | 2 | 3 | 4) {
  return trainingSessionUnits.filter((unit) => unit.blockNumber === blockNumber || unit.blockNumber === 1);
}

export function getPreferredSessionUnit(type: SessionUnitType, blockNumber: 1 | 2 | 3 | 4) {
  return (
    trainingSessionUnits.find((unit) => unit.type === type && unit.blockNumber === blockNumber) ??
    trainingSessionUnits.find((unit) => unit.type === type && unit.blockNumber === 1) ??
    trainingSessionUnits.find((unit) => unit.type === type)
  );
}

export const adaptiveMigrationSummary = {
  previousActivePlan: LEGACY_FIXED_PLAN_LABEL,
  newStartDate: ADAPTIVE_MACROCYCLE_START_DATE,
  logsPreserved: true,
  currentBlock: adaptiveTrainingBlocks[0].title,
  initialWeeklyTargets: weeklySessionTargets[0].unitTargets,
  note: "旧 21/84 天固定计划和日志保留；新的 12 周系统从当前本地日期开始，以训练单元完成目标推进。"
};
