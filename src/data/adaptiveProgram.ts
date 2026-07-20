import type {
  AdaptiveTrainingBlock,
  SessionUnitType,
  TrainingBlock,
  TrainingItem,
  TrainingSessionUnit,
  WeeklySessionTarget
} from "@/types/training";

export const ADAPTIVE_MACROCYCLE_START_DATE = "2026-07-19";
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

export const trainingSessionUnits: TrainingSessionUnit[] = [
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
