import type { TrainingDay, TrainingDayType } from "@/types/training";

const phaseTitles: Record<1 | 2 | 3, string> = {
  1: "控制与容量建立",
  2: "力量转化与反应弹性",
  3: "整合、减量与测试"
};

function day(params: {
  day: number;
  title: string;
  type: TrainingDayType;
  goal: string;
  phase: 1 | 2 | 3;
  performanceFocus: string[];
  upperBodyIncluded?: boolean;
  coreIncluded?: boolean;
  isometricIncluded?: boolean;
  contrastModuleId?: "french-contrast";
  readinessRule?: string;
  blocks: TrainingDay["blocks"];
}): TrainingDay {
  return {
    ...params,
    phaseTitle: phaseTitles[params.phase],
    readinessRule:
      params.readinessRule ??
      "如果跟腱晨僵或髌腱疼痛 >= 3/10，取消高冲击内容，改低冲击技术、等长或恢复。"
  };
}

const warmupBase = [
  { exerciseId: "foot-ball-release", duration: "45–60 秒/侧", intensity: "low" as const },
  { exerciseId: "short-foot", sets: 2, reps: "5 次，每次保持 5–6 秒", side: "each" as const, intensity: "low" as const },
  { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each" as const, intensity: "low" as const },
  { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" as const }
];

const recoveryFinish = [
  { exerciseId: "easy-walk", duration: "8–15 分钟", intensity: "low" as const, notes: "保持能完整说话。" },
  { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each" as const, intensity: "low" as const }
];

const eveningDownshift = [
  { exerciseId: "legs-up-breathing", duration: "5–6 分钟", intensity: "low" as const },
  { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low" as const, notes: "可选；轻到中等压力，不压跟腱、髌腱或膝关节。" }
];

export const trainingPlan: TrainingDay[] = [
  day({
    day: 1,
    title: "再校准 + 轻量弹性 + 核心抗旋转",
    type: "jump",
    phase: 1,
    goal: "建立右脚三点支撑、右膝轨迹和低冲击弹性，不做最大跳。",
    performanceFocus: ["右脚 tripod", "右膝轨迹", "低冲击弹性", "腘绳肌激活", "核心抗旋转"],
    coreIncluded: true,
    readinessRule: "不做最大跳；跟腱或髌腱 >= 3/10 时取消 Pogo 和 CMJ。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 2, reps: "10 次", intensity: "low", rest: "60 秒", notes: "低幅、安静，非疲劳。" },
          { exerciseId: "cmj", sets: 3, reps: "2 次", intensity: "medium", rest: "90 秒", notes: "70–80%，落地定住。" },
          { exerciseId: "step-down", sets: 3, reps: "5 次", side: "each", intensity: "low", notes: "右膝轨迹优先。" },
          { exerciseId: "single-leg-hamstring-bridge", sets: 2, reps: "6 次", side: "each", intensity: "low" },
          { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "side-plank", sets: 2, duration: "20–30 秒", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 2,
    title: "篮球技术日 + 右脚/右膝观察",
    type: "basketball",
    phase: 1,
    goal: "保留篮球手感，观察右脚外旋和右膝轨迹，不额外加健身房跳跃。",
    performanceFocus: ["篮球热身", "右脚外旋观察", "右膝轨迹", "赛后恢复"],
    upperBodyIncluded: true,
    readinessRule: "篮球强度高时，不加额外力量或跳跃；黄色状态只做投篮和脚步。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "3 次/方向", intensity: "low", notes: "只做低速观察右脚角度。" },
          { exerciseId: "approach-jump", sets: 2, reps: "1 次", intensity: "low", rest: "90 秒", notes: "可选；只在完全无痛时做 60–70%。" },
          { exerciseId: "band-pull-apart", sets: 2, reps: "12 次", intensity: "low" },
          { exerciseId: "scapular-push-up", sets: 2, reps: "8 次", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "backward-walk", duration: "5–8 分钟", intensity: "low" }, { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 3,
    title: "下肢力量 + 腘绳肌 + 等长髌腱",
    type: "strength",
    phase: 1,
    goal: "建立基础力量、腘绳肌容量和髌腱可控等长负荷。",
    performanceFocus: ["基础力量", "腘绳肌", "髌腱等长", "右台阶控制", "核心抗伸展"],
    coreIncluded: true,
    isometricIncluded: true,
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "easy-walk", duration: "5–8 分钟", intensity: "low" }, ...warmupBase.slice(1)] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 4, reps: "3 次", intensity: "medium", rest: "2 分钟", notes: "RPE 7，速度干净。" },
          { exerciseId: "bulgarian-split-squat-eccentric", sets: 3, reps: "5 次", side: "each", intensity: "medium" },
          { exerciseId: "hamstring-slider-curl", sets: 2, reps: "5 次", intensity: "medium", notes: "不做到腘绳肌抽筋。" },
          { exerciseId: "spanish-squat-isometric", sets: 3, duration: "30 秒", intensity: "low" },
          { exerciseId: "step-down", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "dead-bug", sets: 2, reps: "6 次/侧", intensity: "low" },
          { exerciseId: "farmer-carry", sets: 3, duration: "20–30 米", intensity: "medium" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 4,
    title: "恢复 / Zone 2 / 足踝与髋控制",
    type: "recovery",
    phase: 1,
    goal: "降低冲击，维持循环，练右脚和右膝低强度控制。",
    performanceFocus: ["Zone 2", "右踝背屈线", "右脚 tripod", "轻腘绳肌激活", "呼吸恢复"],
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [warmupBase[0], warmupBase[1], warmupBase[2]] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-bike", duration: "20–30 分钟", intensity: "low", notes: "可替代轻松步行。" },
          { exerciseId: "backward-walk", duration: "6–8 分钟", intensity: "low" },
          { exerciseId: "single-leg-balance-reach", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "hamstring-walkout", sets: 2, reps: "4 次", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "hip-90-90", sets: 2, reps: "4 次/方向", side: "each", intensity: "low" }, { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 5,
    title: "上肢力量 + 核心 + 低冲击弹性",
    type: "strength",
    phase: 1,
    goal: "加入上肢推拉和核心，不把这天做成高冲击日。",
    performanceFocus: ["上肢推拉", "肩胛控制", "核心抗旋转", "低冲击弹性"],
    upperBodyIncluded: true,
    coreIncluded: true,
    readinessRule: "这不是高冲击日；Pogo 只有 tendon status green 才做。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [warmupBase[0], warmupBase[1], warmupBase[2], { exerciseId: "scapular-push-up", sets: 2, reps: "8 次", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 2, reps: "8 次", intensity: "low", rest: "60 秒", notes: "完全无痛才做；不是高冲击训练。" },
          { exerciseId: "landmine-press", sets: 3, reps: "6 次", side: "each", intensity: "medium" },
          { exerciseId: "one-arm-dumbbell-row", sets: 3, reps: "8 次", side: "each", intensity: "medium" },
          { exerciseId: "pull-up-or-lat-pulldown", sets: 3, reps: "5–8 次", intensity: "medium" },
          { exerciseId: "pallof-press", sets: 3, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "suitcase-carry", sets: 2, duration: "20 米/侧", intensity: "medium" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 6,
    title: "篮球日 + 主动恢复",
    type: "basketball",
    phase: 1,
    goal: "完成篮球训练并控制额外冲击，赛后主动恢复。",
    performanceFocus: ["篮球热身", "水分和营养", "右脚角度观察", "赛后恢复"],
    readinessRule: "如果篮球很激烈，今天不加力量；落地变重就停止额外跳跃。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low", notes: "作为篮球前质量检查。" },
          { exerciseId: "approach-jump", sets: 2, reps: "1 次", intensity: "low", notes: "只在绿色状态做低强度技术跳，可跳过。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "easy-walk", duration: "10–15 分钟", intensity: "low" }, { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 7,
    title: "完全恢复 + 等长维护",
    type: "recovery",
    phase: 1,
    goal: "恢复组织状态，保留无痛等长维护，不制造训练压力。",
    performanceFocus: ["完全恢复", "髌腱等长", "跟腱等长", "呼吸"],
    isometricIncluded: true,
    readinessRule: "无高冲击；等长也必须无尖锐痛。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" }, { exerciseId: "short-foot", sets: 1, reps: "5 次", side: "each", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "15–25 分钟，可选", intensity: "low" },
          { exerciseId: "spanish-squat-isometric", sets: 2, duration: "20–30 秒", intensity: "low", notes: "髌腱感觉安静才做。" },
          { exerciseId: "calf-isometric-hold", sets: 2, duration: "20–30 秒", intensity: "low", notes: "跟腱感觉安静才做。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "hip-90-90", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }, { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 8,
    title: "反应弹性 + 单腿落地 + 核心刚性",
    type: "jump",
    phase: 2,
    goal: "在中等总量内训练反应弹性、单腿落地和核心刚性。",
    performanceFocus: ["反应弹性", "单腿落地", "侧向控制", "核心刚性"],
    coreIncluded: true,
    readinessRule: "保持中等总量；肌腱 >= 3/10 时取消跨栏跳和单腿落地。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 3, reps: "10 次", intensity: "low", rest: "60 秒" },
          { exerciseId: "hurdle-hop-forward-back", sets: 3, reps: "4 次", intensity: "medium", rest: "90 秒" },
          { exerciseId: "lateral-hurdle-hop", sets: 2, reps: "4 次/方向", intensity: "medium", rest: "90 秒" },
          { exerciseId: "single-leg-landing-stick", sets: 2, reps: "2 次", side: "each", intensity: "low" },
          { exerciseId: "copenhagen-plank", sets: 2, duration: "15–20 秒", side: "each", intensity: "low" },
          { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 9,
    title: "篮球或恢复调整日",
    type: "basketball",
    phase: 2,
    goal: "根据篮球安排选择低冲击技术或恢复，不做硬健身房跳。",
    performanceFocus: ["篮球或恢复选择", "右侧再平衡", "Zone 2", "赛后恢复"],
    readinessRule: "有篮球就只打球和恢复；无篮球则做 Zone 2 和右侧控制。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-bike", duration: "20–30 分钟", intensity: "low", notes: "无篮球时执行；有篮球可跳过。" },
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low", notes: "只做低速控制。" },
          { exerciseId: "single-leg-balance-reach", sets: 2, reps: "5 次", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "backward-walk", duration: "5–8 分钟", intensity: "low" }, { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 10,
    title: "力量维持 + 髋主导 + 腘绳肌",
    type: "strength",
    phase: 2,
    goal: "维持髋主导力量和腘绳肌能力，但不制造测试前疲劳。",
    performanceFocus: ["RDL", "右侧单腿 RDL", "腘绳肌离心", "分腿蹲等长", "抗侧屈"],
    coreIncluded: true,
    isometricIncluded: true,
    readinessRule: "腘绳肌 soreness 高时取消 Nordic、重 RDL、冲刺和最大跳。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "easy-walk", duration: "5 分钟", intensity: "low" }, ...warmupBase.slice(1)] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "rdl", sets: 3, reps: "5 次", intensity: "medium", rest: "2 分钟", notes: "RPE 7，不做硬拉酸痛赛。" },
          { exerciseId: "single-leg-rdl-contralateral", sets: 3, reps: "6 次", side: "each", intensity: "medium" },
          { exerciseId: "hamstring-slider-curl", sets: 2, reps: "5 次", intensity: "medium" },
          { exerciseId: "nordic-curl", sets: 1, reps: "3 次", intensity: "medium", notes: "可选；只有 readiness green 且无腘绳肌酸痛时做。" },
          { exerciseId: "split-squat-isometric", sets: 2, duration: "25–35 秒", side: "each", intensity: "low" },
          { exerciseId: "suitcase-carry", sets: 3, duration: "20 米/侧", intensity: "medium" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 11,
    title: "PAP / 低剂量对比训练 + 助跑起跳",
    type: "jump",
    phase: 2,
    goal: "在新鲜状态下做低剂量力量到起跳转化，不做高容量 French Contrast。",
    performanceFocus: ["低剂量 PAP", "助跑起跳质量", "侧向停跳", "停止规则"],
    contrastModuleId: "french-contrast",
    readinessRule: "只有绿色状态且跟腱/髌腱 < 3/10 才做；不做高容量 French Contrast。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [...warmupBase, { exerciseId: "low-pogo", sets: 2, reps: "8 次", intensity: "low", notes: "热身弹性，不累积疲劳。" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "2 次", intensity: "medium", rest: "2.5–4 分钟", notes: "RPE 7–8，速度干净。" },
          { exerciseId: "cmj", sets: 3, reps: "2 次", intensity: "high", rest: "2–3 分钟", notes: "可与 approach jump 二选一；高度下降就停。" },
          { exerciseId: "approach-jump", sets: 3, reps: "2 次", intensity: "high", rest: "2–3 分钟", notes: "如果已做 CMJ，本项跳过；保留最佳质量。" },
          { exerciseId: "lateral-stop-jump", sets: 2, reps: "1–2 次/方向", intensity: "medium", rest: "90 秒", notes: "低量，落地安静。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 12,
    title: "恢复 + 上肢轻量 + 肩胛控制",
    type: "recovery",
    phase: 2,
    goal: "恢复下肢，同时用轻量上肢和肩胛控制维持姿势。",
    performanceFocus: ["Zone 2", "肩胛控制", "上肢轻量", "髋活动度", "呼吸"],
    upperBodyIncluded: true,
    readinessRule: "不制造下肢疲劳；上肢也不做到酸痛。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "easy-bike", duration: "8–10 分钟", intensity: "low" }, { exerciseId: "hip-90-90", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-bike", duration: "15–25 分钟", intensity: "low" },
          { exerciseId: "band-pull-apart", sets: 2, reps: "12 次", intensity: "low" },
          { exerciseId: "scapular-push-up", sets: 2, reps: "8 次", intensity: "low" },
          { exerciseId: "one-arm-dumbbell-row", sets: 2, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }, { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 13,
    title: "篮球专项转化",
    type: "skill",
    phase: 2,
    goal: "把起跳质量放回篮球场景，控制总跳跃接触次数。",
    performanceFocus: ["侧向停跳", "接球起跳", "二次起跳", "防守滑步急停", "核心抗旋转"],
    coreIncluded: true,
    readinessRule: "总跳跃接触受控；右膝内扣、落地变重或肌腱不适就停止。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "lateral-stop-jump", sets: 2, reps: "1–2 次/方向", intensity: "low", rest: "90 秒", notes: "低冲击技术日，只看脚步和膝线。" },
          { exerciseId: "catch-and-jump", sets: 2, reps: "2 次", intensity: "low", rest: "90 秒", notes: "轻到中等，不追高度。" },
          { exerciseId: "second-jump-rebound-drill", sets: 2, reps: "1–2 次", intensity: "low", rest: "90–120 秒", notes: "只练节奏，不做连续疲劳跳。" },
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low" },
          { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "backward-walk", duration: "6 分钟", intensity: "low" }, { exerciseId: "step-down", sets: 2, reps: "5 次", side: "each", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 14,
    title: "恢复 / Deload 微卸载",
    type: "recovery",
    phase: 2,
    goal: "降低不必要训练压力，保留低强度循环和右侧控制。",
    performanceFocus: ["Deload", "Zone 2", "右脚 tripod", "踝背屈", "轻腘绳肌桥", "低强度等长"],
    isometricIncluded: true,
    readinessRule: "不做最大跳，不做高冲击，不做重离心。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [warmupBase[0], warmupBase[1], warmupBase[2]] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "20–35 分钟", intensity: "low" },
          { exerciseId: "single-leg-hamstring-bridge", sets: 2, reps: "5 次", side: "each", intensity: "low" },
          { exerciseId: "calf-isometric-hold", sets: 2, duration: "20 秒", intensity: "low", notes: "可选；跟腱不敏感才做。" },
          { exerciseId: "hip-90-90", sets: 2, reps: "4 次/方向", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", notes: "可选轻压力。" }, { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 15,
    title: "力量 + 等长重点 + 上肢基础",
    type: "strength",
    phase: 3,
    goal: "维持力量和等长耐受，不制造明显酸痛。",
    performanceFocus: ["力量维持", "髌腱等长", "跟腱等长", "上肢基础", "农夫走"],
    upperBodyIncluded: true,
    isometricIncluded: true,
    readinessRule: "不制造 major soreness；肌腱 >= 3/10 时动态下肢改等长或恢复。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "easy-walk", duration: "5–8 分钟", intensity: "low" }, ...warmupBase.slice(1)] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "trap-bar-deadlift", sets: 3, reps: "3 次", intensity: "medium", rest: "2 分钟", notes: "RPE 6–7。" },
          { exerciseId: "spanish-squat-isometric", sets: 3, duration: "30 秒", intensity: "low" },
          { exerciseId: "calf-isometric-hold", sets: 3, duration: "25–35 秒", intensity: "low" },
          { exerciseId: "push-up", sets: 3, reps: "6–10 次", intensity: "medium" },
          { exerciseId: "one-arm-dumbbell-row", sets: 3, reps: "8 次", side: "each", intensity: "medium" },
          { exerciseId: "farmer-carry", sets: 3, duration: "20–30 米", intensity: "medium" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 16,
    title: "低量弹跳技术 + CMJ 质量",
    type: "jump",
    phase: 3,
    goal: "保留弹跳质量，记录左右感觉，不做正式最大测试。",
    performanceFocus: ["低量 Pogo", "CMJ 质量", "助跑起跳", "左右比较", "单腿落地"],
    readinessRule: "不做正式 max testing；跟腱/髌腱 >= 3/10 时取消弹跳。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 2, reps: "10 次", intensity: "low", rest: "60 秒" },
          { exerciseId: "cmj", sets: 4, reps: "2 次", intensity: "medium", rest: "90–120 秒", notes: "85–90%，记录左右感觉。" },
          { exerciseId: "approach-jump", sets: 3, reps: "2 次", intensity: "medium", rest: "90–120 秒" },
          { exerciseId: "single-leg-landing-stick", sets: 2, reps: "2 次", side: "each", intensity: "low", notes: "只有 tendon status green 才做。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: recoveryFinish },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 17,
    title: "篮球日 / 技术日",
    type: "basketball",
    phase: 3,
    goal: "保留轻到中等篮球节奏，避免重复最大跳。",
    performanceFocus: ["篮球技术", "避免重复最大跳", "赛后恢复", "水分和营养"],
    readinessRule: "不要为了测试前状态而打到疲劳；肌腱反应升高就只投篮。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: warmupBase },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low" },
          { exerciseId: "catch-and-jump", sets: 2, reps: "2 次", intensity: "low", notes: "可选，轻到中等。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "easy-walk", duration: "10–15 分钟", intensity: "low" }, { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: eveningDownshift }
    ]
  }),
  day({
    day: 18,
    title: "恢复 + 核心 + 腘绳肌轻激活",
    type: "recovery",
    phase: 3,
    goal: "保持身体新鲜，只做轻核心和腘绳肌激活。",
    performanceFocus: ["恢复", "核心", "轻腘绳肌激活", "低强度等长", "髋 90/90", "呼吸"],
    coreIncluded: true,
    isometricIncluded: true,
    readinessRule: "不做硬腘绳肌离心，不做跳跃。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "easy-bike", duration: "8–10 分钟", intensity: "low" }, { exerciseId: "hip-90-90", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "15–25 分钟", intensity: "low" },
          { exerciseId: "hamstring-walkout", sets: 2, reps: "3 次", intensity: "low" },
          { exerciseId: "split-squat-isometric", sets: 1, duration: "20 秒/侧", side: "each", intensity: "low", notes: "浅幅、无痛、只做位置感。" },
          { exerciseId: "side-plank", sets: 2, duration: "20 秒", side: "each", intensity: "low" },
          { exerciseId: "dead-bug", sets: 2, reps: "5 次/侧", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }, { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 19,
    title: "测试前激活 + 上肢轻量",
    type: "skill",
    phase: 3,
    goal: "让身体感觉弹，不制造疲劳；不做重力量和 Nordic。",
    performanceFocus: ["测试前激活", "右脚 tripod", "轻 CMJ", "上肢活动", "无疲劳"],
    upperBodyIncluded: true,
    readinessRule: "目的是 springy，不是累；不做重力量、不做 Nordic、不做完整 French Contrast。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [warmupBase[0], warmupBase[1], warmupBase[2], { exerciseId: "band-pull-apart", sets: 2, reps: "10 次", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "low-pogo", sets: 2, duration: "10 秒", intensity: "low", notes: "低幅，感觉弹即可。" },
          { exerciseId: "cmj", sets: 2, reps: "2 次", intensity: "low", rest: "90 秒", notes: "75–80% 激活，绝不追最大。" },
          { exerciseId: "scapular-push-up", sets: 2, reps: "6 次", intensity: "low" },
          { exerciseId: "pallof-press", sets: 2, reps: "6 次", side: "each", intensity: "low" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "easy-walk", duration: "8–10 分钟", intensity: "low" }, { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 20,
    title: "低量冲顶测试日",
    type: "test",
    phase: 3,
    goal: "低量记录 CMJ 和助跑起跳最佳结果，疲劳前停止。",
    performanceFocus: ["CMJ 测试", "助跑起跳测试", "右脚外旋记录", "右膝轨迹记录", "疲劳前停止"],
    readinessRule: "只有绿色状态测试；黄色改 70–85% 技术跳，红色只恢复。测试日不做完整 French Contrast。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [...warmupBase, { exerciseId: "low-pogo", sets: 2, reps: "8 次", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "cmj", sets: 3, reps: "1 次", intensity: "high", rest: "2–3 分钟", notes: "3 次尝试，记录最佳和左右感觉。" },
          { exerciseId: "approach-jump", sets: 5, reps: "1 次", intensity: "high", rest: "2–3 分钟", notes: "5–6 次以内，记录右脚外旋和右膝轨迹。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "easy-walk", duration: "10–15 分钟", intensity: "low" }, { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] }
    ]
  }),
  day({
    day: 21,
    title: "总结恢复 + 下一阶段准备",
    type: "rest",
    phase: 3,
    goal: "恢复、复盘右侧质量和腘绳肌状态，准备生成下一阶段计划。",
    performanceFocus: ["恢复", "readiness review", "左右不平衡 check-in", "腘绳肌 soreness", "生成下一阶段计划"],
    readinessRule: "不加训练压力；今天只复盘和恢复。",
    blocks: [
      { type: "warmup", title: "Complete Warmup", items: [{ exerciseId: "toe-yoga", sets: 1, reps: "8 次", side: "each", intensity: "low" }, { exerciseId: "short-foot", sets: 1, reps: "5 次", side: "each", intensity: "low" }] },
      {
        type: "main",
        title: "Main Training",
        items: [
          { exerciseId: "easy-walk", duration: "10–20 分钟，可选", intensity: "low" },
          { exerciseId: "single-leg-balance-reach", sets: 1, reps: "4 次", side: "each", intensity: "low", notes: "只做质量复盘。" },
          { exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low", notes: "结束后生成下一阶段计划。" }
        ]
      },
      { type: "activeRecovery", title: "Active Recovery", items: [{ exerciseId: "hip-90-90", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }, { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" }] },
      { type: "eveningRecovery", title: "Evening Recovery", items: [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }] }
    ]
  })
];
