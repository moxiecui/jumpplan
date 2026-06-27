import { getTrainingCycle } from "@/data/macrocycle";
import type {
  EstimatedFatigue,
  ImpactLevel,
  TrainingBlock,
  TrainingDay,
  TrainingDayType,
  TrainingItem
} from "@/types/training";

type CycleNumber = 1 | 2 | 3 | 4;
type IntraCyclePhase = 1 | 2 | 3;
type DayPriority = NonNullable<TrainingDay["todayPriority"]>;

interface WeekConfig {
  weekNumber: number;
  cycleNumber: CycleNumber;
  title: string;
  theme: string;
  strengthTitle: string;
  jumpTitle: string;
  transferTitle: string;
  lowerStrengthItems: TrainingItem[];
  jumpItems: TrainingItem[];
  transferItems: TrainingItem[];
  strengthContacts: { min: number; max: number };
  jumpContacts: { min: number; max: number };
  transferContacts: { min: number; max: number };
  jumpImpact: ImpactLevel;
  transferImpact: ImpactLevel;
  jumpFatigue: EstimatedFatigue;
  transferFatigue: EstimatedFatigue;
}

const phaseTitles: Record<IntraCyclePhase, string> = {
  1: "第 1 周建立",
  2: "第 2 周推进",
  3: "第 3 周卸载 / 复盘"
};

const warmupBase: TrainingItem[] = [
  { exerciseId: "foot-ball-release", duration: "45–60 秒/侧", intensity: "low" },
  { exerciseId: "short-foot", sets: 2, reps: "5 次，每次保持 5–6 秒", side: "each", intensity: "low" },
  { exerciseId: "ankle-knee-wall", sets: 2, reps: "8 次", side: "each", intensity: "low" },
  { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" }
];

const kneeSensitiveWarmup: TrainingItem[] = [
  { exerciseId: "easy-bike", duration: "3–5 分钟", intensity: "low", notes: "膝前侧敏感时先用轻车或步行升温。" },
  { exerciseId: "ankle-knee-wall", sets: 1, reps: "8 次", side: "each", intensity: "low" },
  { exerciseId: "wall-sit", sets: 2, duration: "15–20 秒", intensity: "low", isometricPurpose: "symptom-management", notes: "浅角度；如果疼痛升高，立刻停止。" },
  { exerciseId: "band-lateral-walk", sets: 2, reps: "8 步/方向", intensity: "low" },
  { exerciseId: "single-leg-rdl-top-lock", sets: 1, reps: "5 次", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" }
];

const recoveryFinish: TrainingItem[] = [
  { exerciseId: "easy-walk", duration: "8–15 分钟", intensity: "low", notes: "保持能完整说话。" },
  { exerciseId: "worlds-greatest-stretch", sets: 1, reps: "4 次", side: "each", intensity: "low" }
];

const eveningDownshift: TrainingItem[] = [
  { exerciseId: "legs-up-breathing", duration: "5–6 分钟", intensity: "low" },
  { exerciseId: "calf-foam-roll", duration: "30–45 秒/肌群", intensity: "low", optional: true, notes: "可选；轻到中等压力，不压跟腱、髌腱、膝关节或疼痛点。" }
];

function cloneItem(item: TrainingItem): TrainingItem {
  return {
    ...item,
    jumpContacts: item.jumpContacts ? { ...item.jumpContacts } : undefined
  };
}

function block(type: TrainingBlock["type"], title: string, items: TrainingItem[]): TrainingBlock {
  return {
    type,
    title,
    items: items.map(cloneItem)
  };
}

function contacts(min: number, max: number, flags: Partial<NonNullable<TrainingItem["jumpContacts"]>> = {}) {
  return { min, max, ...flags };
}

function withCycleMetadata(
  macrocycleDay: number,
  type: TrainingDayType,
  title: string,
  goal: string,
  params: {
    week: WeekConfig;
    dayOfWeek: number;
    impactLevel: ImpactLevel;
    estimatedFatigue: EstimatedFatigue;
    estimatedDurationMinutes: { min: number; max: number };
    plannedJumpContacts?: { min: number; max: number };
    maxIntentJumpContacts?: { min: number; max: number };
    performanceFocus: string[];
    blocks: TrainingBlock[];
    priority: DayPriority;
    readinessRule?: string;
    basketballLoadDependency?: boolean;
    kneeLoadNote?: string;
    conditionalRules?: string[];
    assessmentProtocolId?: "right-side-reassessment";
    upperBodyIncluded?: boolean;
    coreIncluded?: boolean;
    isometricIncluded?: boolean;
    contrastModuleId?: "french-contrast";
  }
): TrainingDay {
  const { week, dayOfWeek } = params;
  const cycle = getTrainingCycle(week.cycleNumber);
  const dayInCycle = ((week.weekNumber - 1) % 3) * 7 + dayOfWeek;
  const phase = Math.ceil(dayInCycle / 7) as IntraCyclePhase;

  return {
    day: macrocycleDay,
    macrocycleDay,
    cycleNumber: week.cycleNumber,
    dayInCycle,
    weekNumber: week.weekNumber,
    cycleTitle: cycle.title,
    macrocyclePhase: cycle.phase,
    title,
    type,
    goal,
    phase,
    phaseTitle: phaseTitles[phase],
    performanceFocus: params.performanceFocus,
    upperBodyIncluded: params.upperBodyIncluded,
    coreIncluded: params.coreIncluded,
    isometricIncluded: params.isometricIncluded,
    contrastModuleId: params.contrastModuleId,
    readinessRule:
      params.readinessRule ??
      "如果跟腱、髌腱或膝前侧疼痛 >= 3/10，取消高冲击内容，改低冲击技术、等长或恢复。",
    impactLevel: params.impactLevel,
    estimatedFatigue: params.estimatedFatigue,
    estimatedDurationMinutes: params.estimatedDurationMinutes,
    plannedJumpContacts: params.plannedJumpContacts,
    maxIntentJumpContacts: params.maxIntentJumpContacts,
    conditionalRules: params.conditionalRules,
    assessmentProtocolId: params.assessmentProtocolId,
    basketballLoadDependency: params.basketballLoadDependency,
    kneeLoadNote: params.kneeLoadNote,
    todayPriority: params.priority,
    rightSideFocus: ["右脚 tripod", "减少右脚外旋", "右膝对准第二/三脚趾"],
    hamstringFocus: ["腘绳肌不过度酸痛", "测试或篮球前 48 小时避免硬 Nordic"],
    singleLegStiffnessFocus: ["单脚提踵等长质量", "单脚 Pogo 节奏", "安静落地"],
    upperBodyFocus: params.upperBodyIncluded ? ["推拉平衡", "肩胛控制", "不过度酸痛"] : undefined,
    coreFocus: params.coreIncluded ? ["抗旋转", "抗伸展", "抗侧屈"] : undefined,
    isometricFocus: params.isometricIncluded ? ["浅角度膝部等长", "小腿等长", "疼痛友好负荷"] : undefined,
    blocks: params.blocks
  };
}

function makeLowerStrengthDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  return withCycleMetadata(
    macrocycleDay,
    "strength",
    week.strengthTitle,
    `${week.theme}：下肢力量、腘绳肌、膝部等长和右侧控制。`,
    {
      week,
      dayOfWeek,
      impactLevel: "low",
      estimatedFatigue: week.weekNumber % 3 === 0 ? "low" : "moderate",
      estimatedDurationMinutes: { min: 45, max: week.weekNumber % 3 === 0 ? 55 : 70 },
      plannedJumpContacts: week.strengthContacts,
      performanceFocus: ["力量", "腘绳肌", "膝部负荷管理", "右侧控制"],
      priority: "strength",
      basketballLoadDependency: true,
      kneeLoadNote: "膝前侧 >=3/10 时取消跳跃和深膝角分腿蹲，使用浅等长和髋主导动作。",
      upperBodyIncluded: false,
      coreIncluded: true,
      isometricIncluded: true,
      blocks: [
        block("warmup", "完整热身", kneeSensitiveWarmup),
        block("main", "主训练", week.lowerStrengthItems),
        block("activeRecovery", "主动恢复", recoveryFinish),
        block("eveningRecovery", "晚间恢复", eveningDownshift)
      ]
    }
  );
}

function makeBasketballDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  return withCycleMetadata(
    macrocycleDay,
    "basketball",
    "篮球日 + 膝脚质量观察",
    "篮球负荷算作外部冲击；今天重点记录强度、右脚外旋、右膝轨迹和膝前侧反应。",
    {
      week,
      dayOfWeek,
      impactLevel: "variable",
      estimatedFatigue: "variable",
      estimatedDurationMinutes: { min: 30, max: 90 },
      performanceFocus: ["篮球负荷记录", "膝前侧反应", "右脚角度", "赛后恢复"],
      priority: "right-foot-control",
      basketballLoadDependency: true,
      kneeLoadNote: "篮球后如果膝盖上方或膝前侧更酸，下一次 gym 跳跃自动减少或取消。",
      conditionalRules: ["中高篮球负荷后 24 小时内不加额外单脚 Pogo、PAP 或最大跳。"],
      upperBodyIncluded: true,
      blocks: [
        block("warmup", "完整热身", [
          ...warmupBase,
          { exerciseId: "step-up-knee-drive-hold", sets: 1, reps: "4 次", side: "each", intensity: "low", moduleTag: "single-leg-stiffness", notes: "篮球前支撑腿检查，不做疲劳。" }
        ]),
        block("main", "主训练", [
          { exerciseId: "easy-walk", duration: "按篮球安排", intensity: "low", notes: "本项代表篮球训练本身；记录 session RPE、跳跃和急停负荷。" },
          { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low", optional: true, notes: "只做低速质量检查，不是额外体能。" }
        ]),
        block("activeRecovery", "主动恢复", [
          { exerciseId: "easy-walk", duration: "8–12 分钟", intensity: "low" },
          { exerciseId: "foot-ball-release", duration: "45–60 秒/侧", intensity: "low" }
        ]),
        block("eveningRecovery", "晚间恢复", eveningDownshift)
      ]
    }
  );
}

function makeRecoveryDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  return withCycleMetadata(
    macrocycleDay,
    "recovery",
    dayOfWeek === 7 ? "恢复 / 周复盘" : "恢复 / Zone 2 / 足踝与髋控制",
    "保持恢复日短、轻、可执行；不把恢复日变成隐藏训练。",
    {
      week,
      dayOfWeek,
      impactLevel: "none",
      estimatedFatigue: "very-low",
      estimatedDurationMinutes: { min: 18, max: 35 },
      plannedJumpContacts: { min: 0, max: 0 },
      performanceFocus: ["恢复", "膝部观察", "足踝控制", "呼吸"],
      priority: dayOfWeek === 7 ? "recovery" : "knee-calm",
      kneeLoadNote: "膝前侧敏感时只做轻车、步行、浅等长和髋控制；不做 Pogo 或 Snap-down。",
      isometricIncluded: true,
      blocks: [
        block("warmup", "完整热身", [{ exerciseId: "easy-walk", duration: "3–5 分钟", intensity: "low" }]),
        block("main", "主训练", [
          { exerciseId: dayOfWeek === 7 ? "easy-walk" : "easy-bike", duration: "12–20 分钟", intensity: "low" },
          { exerciseId: "tibialis-raise", sets: 2, reps: "10–12 次", intensity: "low", notes: "轻量容量，不做到胫骨前肌抽筋。" },
          { exerciseId: "single-leg-forward-lean-isometric", sets: 1, duration: "15–20 秒", side: "each", intensity: "low", optional: true, moduleTag: "single-leg-stiffness" },
          { exerciseId: "hip-90-90-seated-rotation", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }
        ]),
        block("activeRecovery", "主动恢复", [{ exerciseId: "legs-up-breathing", duration: "5–6 分钟", intensity: "low" }]),
        block("optionalRecovery", "可选恢复工具", [eveningDownshift[1]])
      ]
    }
  );
}

function makeJumpDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  const maxIntent = week.cycleNumber >= 2 && week.weekNumber % 3 !== 0 ? { min: 0, max: week.cycleNumber >= 3 ? 8 : 6 } : { min: 0, max: 0 };

  return withCycleMetadata(
    macrocycleDay,
    "jump",
    week.jumpTitle,
    `${week.theme}：低量高质量弹跳，膝前侧和肌腱反应优先。`,
    {
      week,
      dayOfWeek,
      impactLevel: week.jumpImpact,
      estimatedFatigue: week.jumpFatigue,
      estimatedDurationMinutes: { min: 35, max: 60 },
      plannedJumpContacts: week.jumpContacts,
      maxIntentJumpContacts: maxIntent,
      performanceFocus: ["弹性", "起跳技术", "安静落地", "右侧质量"],
      priority: week.cycleNumber >= 3 ? "basketball-transfer" : "elasticity",
      readinessRule: "膝前侧、跟腱或髌腱 >=3/10 时取消跳跃；热身疼痛变差时直接降级。",
      basketballLoadDependency: true,
      kneeLoadNote: "不把连续跳当体能。膝前侧 >2/10 时不做最大跳、失重落地或深膝角跳。",
      conditionalRules: ["前 24 小时篮球负荷高时，今天改 70–85% 技术跳或恢复。"],
      blocks: [
        block("warmup", "完整热身", kneeSensitiveWarmup),
        block("main", "主训练", week.jumpItems),
        block("activeRecovery", "主动恢复", recoveryFinish),
        block("eveningRecovery", "晚间恢复", eveningDownshift)
      ]
    }
  );
}

function makeUpperCoreDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  return withCycleMetadata(
    macrocycleDay,
    "strength",
    "上肢 + 核心 + 低负荷控制",
    "上肢和核心服务篮球对抗、摆臂、姿势和传力，不制造 bodybuilding 式疲劳。",
    {
      week,
      dayOfWeek,
      impactLevel: "none",
      estimatedFatigue: "moderate",
      estimatedDurationMinutes: { min: 35, max: 55 },
      plannedJumpContacts: { min: 0, max: 0 },
      performanceFocus: ["上肢推拉", "核心抗旋转", "肩胛控制", "低负荷足踝"],
      priority: "right-foot-control",
      kneeLoadNote: "今天不做跳跃；如果膝前侧敏感，只保留轻足踝和核心。",
      upperBodyIncluded: true,
      coreIncluded: true,
      isometricIncluded: true,
      blocks: [
        block("warmup", "完整热身", [
          { exerciseId: "scapular-push-up", sets: 2, reps: "8 次", intensity: "low" },
          { exerciseId: "band-pull-apart", sets: 2, reps: "12 次", intensity: "low" },
          { exerciseId: "short-foot", sets: 1, reps: "5 次", side: "each", intensity: "low" }
        ]),
        block("main", "主训练", [
          { exerciseId: "landmine-press", sets: 3, reps: "6 次", side: "each", intensity: "medium" },
          { exerciseId: "one-arm-dumbbell-row", sets: 3, reps: "8 次", side: "each", intensity: "medium" },
          { exerciseId: "pull-up-or-lat-pulldown", sets: 3, reps: "5–8 次", intensity: "medium" },
          { exerciseId: "pallof-press", sets: 3, reps: "8 次", side: "each", intensity: "low" },
          { exerciseId: "side-plank-with-knee-drive-hold", sets: 2, duration: "15–20 秒", side: "each", intensity: "low" },
          { exerciseId: "single-leg-weight-exchange", sets: 2, reps: "5 次", side: "each", intensity: "low", optional: true }
        ]),
        block("activeRecovery", "主动恢复", recoveryFinish),
        block("eveningRecovery", "晚间恢复", [{ exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }])
      ]
    }
  );
}

function makeTransferDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  return withCycleMetadata(
    macrocycleDay,
    week.cycleNumber >= 3 ? "skill" : "basketball",
    week.transferTitle,
    week.cycleNumber >= 3
      ? "把弹跳质量转回篮球专项动作，控制总接触次数。"
      : "篮球或技术日；中高篮球负荷时不追加 gym 跳跃。",
    {
      week,
      dayOfWeek,
      impactLevel: week.transferImpact,
      estimatedFatigue: week.transferFatigue,
      estimatedDurationMinutes: { min: 30, max: week.cycleNumber >= 3 ? 60 : 90 },
      plannedJumpContacts: week.transferContacts,
      maxIntentJumpContacts: week.cycleNumber >= 3 ? { min: 0, max: 6 } : undefined,
      performanceFocus: ["篮球转化", "右脚角度", "右膝轨迹", "落地质量"],
      priority: week.cycleNumber >= 3 ? "basketball-transfer" : "right-foot-control",
      basketballLoadDependency: true,
      kneeLoadNote: "篮球专项日不是体能跳。膝前侧 >=3/10 或前 48 小时篮球高负荷时，删除高冲击转化。",
      conditionalRules: ["只选 1–2 个主要跳跃练习；不把所有菜单动作都做成高量。"],
      coreIncluded: week.cycleNumber >= 3,
      blocks: [
        block("warmup", "完整热身", warmupBase),
        block("main", "主训练", week.transferItems),
        block("activeRecovery", "主动恢复", [
          { exerciseId: "backward-walk", duration: "5–8 分钟", intensity: "low" },
          { exerciseId: "legs-up-breathing", duration: "5 分钟", intensity: "low" }
        ]),
        block("eveningRecovery", "晚间恢复", eveningDownshift)
      ]
    }
  );
}

function makeCycleReviewDay(week: WeekConfig, dayOfWeek: number): TrainingDay {
  const macrocycleDay = (week.weekNumber - 1) * 7 + dayOfWeek;
  const isMacroTest = macrocycleDay === 84;
  return withCycleMetadata(
    macrocycleDay,
    "test",
    isMacroTest ? "主测试 + 宏周期复盘" : "周期复盘 + 低量测试检查",
    isMacroTest
      ? "低量测试 CMJ、助跑跳和可选单脚起跳，随后生成下一阶段计划。"
      : "复盘本周期动作质量、膝部反应、肌腱状态和篮球负荷，必要时只做 70–85% 技术跳。",
    {
      week,
      dayOfWeek,
      impactLevel: isMacroTest ? "high" : "low",
      estimatedFatigue: isMacroTest ? "moderate" : "very-low",
      estimatedDurationMinutes: { min: 25, max: isMacroTest ? 50 : 35 },
      plannedJumpContacts: isMacroTest ? { min: 7, max: 15 } : { min: 0, max: 12 },
      maxIntentJumpContacts: isMacroTest ? { min: 7, max: 15 } : { min: 0, max: 6 },
      performanceFocus: ["测试", "右侧复评", "膝部趋势", "下一阶段决策"],
      priority: "test",
      readinessRule: "膝前侧、跟腱或髌腱 >=3/10，腘绳肌 >=4/10，或前 48 小时篮球负荷高时，不做最大测试。",
      basketballLoadDependency: true,
      kneeLoadNote: "黄色 readiness 或膝前侧 >2/10：把正式测试改成 70–85% 技术跳。",
      assessmentProtocolId: "right-side-reassessment",
      conditionalRules: ["选择继续、deload、修改或生成下一阶段计划。"],
      blocks: [
        block("warmup", "完整热身", kneeSensitiveWarmup),
        block("main", "主训练", isMacroTest
          ? [
              { exerciseId: "cmj", sets: 3, reps: "1 次", intensity: "high", rest: "2–3 分钟", notes: "最多 3 次正式尝试。", jumpContacts: contacts(3, 3, { maxIntent: true }) },
              { exerciseId: "approach-jump", sets: 4, reps: "1 次", intensity: "high", rest: "2–3 分钟", notes: "最多 4–6 次正式尝试，连续下降就停。", jumpContacts: contacts(4, 6, { maxIntent: true }) },
              { exerciseId: "max-single-leg-approach-jump", sets: 3, reps: "每侧最多 3 次", side: "each", intensity: "high", optional: true, rest: "2–3 分钟", notes: "只在疼痛 <=1/10、右脚/右膝控制 >=4/5 时做。", jumpContacts: contacts(0, 6, { maxIntent: true }), moduleTag: "single-leg-stiffness" }
            ]
          : [
              { exerciseId: "single-leg-landing-stick", sets: 1, reps: "3 次", side: "right", intensity: "low", notes: "质量复评，不追高度。", jumpContacts: contacts(0, 3, { landingOnly: true }) },
              { exerciseId: "cmj", sets: 2, reps: "1 次", intensity: "medium", optional: true, notes: "70–85%，完全无痛才做。", jumpContacts: contacts(0, 2) },
              { exerciseId: "single-leg-forward-lean-isometric", sets: 1, duration: "15 秒", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" }
            ]),
        block("activeRecovery", "主动恢复", recoveryFinish),
        block("eveningRecovery", "晚间恢复", [{ exerciseId: "legs-up-breathing", duration: "6 分钟", intensity: "low" }])
      ]
    }
  );
}

const weekConfigs: WeekConfig[] = [
  {
    weekNumber: 1,
    cycleNumber: 1,
    title: "Week 1",
    theme: "控制 baseline、膝部降噪、低冲击弹性",
    strengthTitle: "控制基线 + 髋膝力量基础",
    jumpTitle: "低冲击弹性 + 落地质量",
    transferTitle: "篮球技术 / 低冲击脚步",
    strengthContacts: { min: 4, max: 8 },
    jumpContacts: { min: 16, max: 24 },
    transferContacts: { min: 8, max: 12 },
    jumpImpact: "low",
    transferImpact: "variable",
    jumpFatigue: "low",
    transferFatigue: "variable",
    lowerStrengthItems: [
      { exerciseId: "goblet-squat", sets: 3, reps: "6 次", intensity: "medium", notes: "RPE 6–7，膝前侧安静。" },
      { exerciseId: "reverse-lunge", sets: 2, reps: "5 次", side: "each", intensity: "low" },
      { exerciseId: "single-leg-bridge", sets: 2, reps: "6 次", side: "each", intensity: "low" },
      { exerciseId: "calf-raise-with-plate-under-front-foot", sets: 2, reps: "8 次", intensity: "low" },
      { exerciseId: "tibialis-raise", sets: 2, reps: "10 次", intensity: "low" },
      { exerciseId: "wall-sit", sets: 2, duration: "20 秒", intensity: "low", isometricPurpose: "symptom-management" },
      { exerciseId: "box-jump", sets: 2, reps: "2 次", intensity: "low", optional: true, notes: "低箱，上箱轻、下箱走下来。", jumpContacts: contacts(4, 4) }
    ],
    jumpItems: [
      { exerciseId: "low-pogo", sets: 2, reps: "8 次", intensity: "low", jumpContacts: contacts(16, 16) },
      { exerciseId: "single-leg-snap-down-stick", sets: 1, reps: "2 次", side: "each", intensity: "low", jumpContacts: contacts(0, 4, { landingOnly: true }), moduleTag: "single-leg-stiffness" },
      { exerciseId: "box-jump", sets: 2, reps: "2 次", intensity: "low", optional: true, notes: "低箱，stick landing。", jumpContacts: contacts(0, 4) },
      { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" }
    ],
    transferItems: [
      { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low" },
      { exerciseId: "catch-and-jump", sets: 2, reps: "2 次", intensity: "low", optional: true, notes: "如果篮球负荷轻且膝盖安静才做。", jumpContacts: contacts(0, 4) },
      { exerciseId: "step-up-knee-drive-hold", sets: 2, reps: "4 次", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" }
    ]
  },
  {
    weekNumber: 2,
    cycleNumber: 1,
    title: "Week 2",
    theme: "容量建立、受控落地、低量 Pogo 和跳箱",
    strengthTitle: "容量建立 + 分腿蹲控制",
    jumpTitle: "受控落地 + 低箱跳",
    transferTitle: "篮球日 + 低量专项触地",
    strengthContacts: { min: 6, max: 10 },
    jumpContacts: { min: 22, max: 30 },
    transferContacts: { min: 10, max: 16 },
    jumpImpact: "moderate",
    transferImpact: "variable",
    jumpFatigue: "moderate",
    transferFatigue: "variable",
    lowerStrengthItems: [
      { exerciseId: "trap-bar-deadlift", sets: 3, reps: "3 次", intensity: "medium", notes: "RPE 7，不磨重量。" },
      { exerciseId: "bulgarian-split-squat", sets: 3, reps: "5 次", side: "each", intensity: "medium" },
      { exerciseId: "hamstring-slider-curl", sets: 2, reps: "5 次", intensity: "medium" },
      { exerciseId: "single-leg-calf-raise-with-plate-under-front-foot", sets: 2, reps: "6 次", side: "each", intensity: "low" },
      { exerciseId: "tibialis-raise", sets: 2, reps: "12 次", intensity: "low" },
      { exerciseId: "box-jump", sets: 2, reps: "3 次", intensity: "low", optional: true, jumpContacts: contacts(6, 6) }
    ],
    jumpItems: [
      { exerciseId: "low-pogo", sets: 2, reps: "10 次", intensity: "low", jumpContacts: contacts(20, 20) },
      { exerciseId: "box-jump", sets: 3, reps: "2 次", intensity: "medium", notes: "低箱，落地安静。", jumpContacts: contacts(6, 6) },
      { exerciseId: "single-leg-snap-down-stick", sets: 1, reps: "2 次/侧", side: "each", intensity: "low", optional: true, notes: "低幅快速下沉定住；膝前侧敏感时取消。", jumpContacts: contacts(0, 4, { landingOnly: true }), moduleTag: "single-leg-stiffness" },
      { exerciseId: "side-plank", sets: 2, duration: "20 秒", side: "each", intensity: "low" }
    ],
    transferItems: [
      { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low" },
      { exerciseId: "catch-and-jump", sets: 2, reps: "2–3 次", intensity: "low", optional: true, jumpContacts: contacts(0, 6) },
      { exerciseId: "single-leg-weight-exchange", sets: 2, reps: "5 次", side: "each", intensity: "low" }
    ]
  },
  {
    weekNumber: 3,
    cycleNumber: 1,
    title: "Week 3",
    theme: "卸载、右侧质量复查、膝部反应总结",
    strengthTitle: "卸载力量 + 膝部等长",
    jumpTitle: "低量技术弹跳",
    transferTitle: "轻篮球 / 技术复盘",
    strengthContacts: { min: 0, max: 0 },
    jumpContacts: { min: 12, max: 18 },
    transferContacts: { min: 0, max: 6 },
    jumpImpact: "low",
    transferImpact: "variable",
    jumpFatigue: "very-low",
    transferFatigue: "variable",
    lowerStrengthItems: [
      { exerciseId: "goblet-squat", sets: 2, reps: "5 次", intensity: "low" },
      { exerciseId: "lunge-hold", sets: 2, duration: "15–20 秒", side: "each", intensity: "low", isometricPurpose: "position-control" },
      { exerciseId: "bridge", sets: 2, reps: "8 次", intensity: "low" },
      { exerciseId: "tibialis-raise", sets: 2, reps: "10 次", intensity: "low" }
    ],
    jumpItems: [
      { exerciseId: "low-pogo", sets: 2, reps: "6–8 次", intensity: "low", jumpContacts: contacts(12, 16) },
      { exerciseId: "cmj", sets: 1, reps: "2 次", intensity: "low", optional: true, notes: "70–80%，完全无痛才做。", jumpContacts: contacts(0, 2) },
      { exerciseId: "single-leg-forward-lean-isometric", sets: 2, duration: "15 秒", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" }
    ],
    transferItems: [
      { exerciseId: "easy-walk", duration: "按篮球安排或轻投篮", intensity: "low", notes: "不做硬对抗。" },
      { exerciseId: "hip-90-90-standing-rotation", sets: 1, reps: "4 次/方向", side: "each", intensity: "low" }
    ]
  }
];

const weekFourToTwelve: WeekConfig[] = [
  {
    ...weekConfigs[1],
    weekNumber: 4,
    cycleNumber: 2,
    theme: "力量建立、前蹲/高脚杯深蹲进阶、分腿蹲和小腿容量",
    strengthTitle: "力量建立 + 小腿/胫骨前肌容量",
    jumpTitle: "低量蹲跳 + 跳箱进阶",
    transferTitle: "篮球或单脚起跳技术",
    strengthContacts: { min: 6, max: 10 },
    jumpContacts: { min: 26, max: 36 },
    transferContacts: { min: 12, max: 18 },
    jumpImpact: "moderate",
    lowerStrengthItems: [
      { exerciseId: "front-squat", sets: 3, reps: "4 次", intensity: "medium", notes: "RPE 6–7；也可用高脚杯深蹲替代。" },
      { exerciseId: "reverse-lunge-with-height", sets: 3, reps: "5 次", side: "each", intensity: "medium" },
      { exerciseId: "single-leg-good-morning", sets: 2, reps: "5 次", side: "each", intensity: "low" },
      { exerciseId: "calf-raise-with-plate-under-front-foot", sets: 3, reps: "8 次", intensity: "medium" },
      { exerciseId: "tibialis-raise", sets: 3, reps: "12 次", intensity: "low" },
      { exerciseId: "box-jump", sets: 2, reps: "3 次", intensity: "low", jumpContacts: contacts(6, 6) }
    ],
    jumpItems: [
      { exerciseId: "squat-jump", sets: 3, reps: "2 次", intensity: "medium", jumpContacts: contacts(6, 6) },
      { exerciseId: "box-jump", sets: 3, reps: "2 次", intensity: "medium", jumpContacts: contacts(6, 6) },
      { exerciseId: "low-pogo", sets: 2, reps: "8–10 次", intensity: "low", jumpContacts: contacts(16, 20) },
      { exerciseId: "depth-drop", sets: 2, reps: "2 次", intensity: "low", optional: true, jumpContacts: contacts(0, 4, { landingOnly: true }) }
    ],
    transferItems: [
      { exerciseId: "step-up-knee-drive-hold", sets: 2, reps: "4 次", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" },
      { exerciseId: "two-step-single-leg-approach-jump", sets: 2, reps: "1 次/侧", side: "each", intensity: "low", optional: true, jumpContacts: contacts(0, 4), moduleTag: "single-leg-stiffness" },
      { exerciseId: "defensive-slide-stop", sets: 2, reps: "2 次/方向", intensity: "low" }
    ]
  },
  {
    ...weekConfigs[1],
    weekNumber: 5,
    cycleNumber: 2,
    theme: "力量到弹跳转化、低剂量 PAP、低量单脚技术",
    strengthTitle: "力量维持 + 低剂量 PAP 准备",
    jumpTitle: "低剂量 PAP + 蹲跳/跳箱",
    transferTitle: "单脚起跳技术 + 篮球转化",
    strengthContacts: { min: 8, max: 12 },
    jumpContacts: { min: 30, max: 40 },
    transferContacts: { min: 16, max: 24 },
    jumpImpact: "high",
    jumpFatigue: "moderate-high",
    lowerStrengthItems: [
      { exerciseId: "trap-bar-deadlift", sets: 3, reps: "2 次", intensity: "medium", rest: "2–3 分钟", notes: "RPE 7–8，速度干净。" },
      { exerciseId: "bulgarian-split-squat-with-heel-up", sets: 2, reps: "5 次", side: "each", intensity: "medium" },
      { exerciseId: "hamstring-slider-curl", sets: 2, reps: "5 次", intensity: "medium" },
      { exerciseId: "single-leg-calf-isometric-hold", sets: 2, duration: "25–35 秒", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" },
      { exerciseId: "squat-jump", sets: 2, reps: "2 次", intensity: "medium", jumpContacts: contacts(4, 4) },
      { exerciseId: "box-jump", sets: 2, reps: "2 次", intensity: "medium", jumpContacts: contacts(4, 4) }
    ],
    jumpItems: [
      { exerciseId: "trap-bar-deadlift", sets: 3, reps: "2 次", intensity: "medium", rest: "2.5–4 分钟", notes: "低剂量 PAP，RPE 7–8。" },
      { exerciseId: "cmj", sets: 3, reps: "2 次", intensity: "high", rest: "2–3 分钟", jumpContacts: contacts(6, 6, { maxIntent: true }) },
      { exerciseId: "squat-jump", sets: 3, reps: "2 次", intensity: "medium", jumpContacts: contacts(6, 6) },
      { exerciseId: "low-pogo", sets: 2, reps: "8–10 次", intensity: "low", jumpContacts: contacts(16, 20) },
      { exerciseId: "lunge-jump", sets: 2, reps: "2 次/侧", side: "each", intensity: "medium", optional: true, notes: "低剂量；膝前侧敏感时取消。", jumpContacts: contacts(0, 8) }
    ],
    transferItems: [
      { exerciseId: "two-step-single-leg-approach-jump", sets: 3, reps: "1–2 次/侧", side: "each", intensity: "medium", jumpContacts: contacts(6, 12), moduleTag: "single-leg-stiffness" },
      { exerciseId: "catch-and-jump", sets: 2, reps: "2–3 次", intensity: "medium", jumpContacts: contacts(4, 6) },
      { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" }
    ]
  },
  {
    ...weekConfigs[2],
    weekNumber: 6,
    cycleNumber: 2,
    theme: "卸载和中期低量测试",
    strengthTitle: "卸载力量 + 腘绳肌维护",
    jumpTitle: "低量技术跳 + 中期准备",
    transferTitle: "轻篮球 / 中期复盘",
    strengthContacts: { min: 0, max: 0 },
    jumpContacts: { min: 18, max: 26 },
    transferContacts: { min: 0, max: 8 },
    jumpImpact: "low"
  },
  {
    ...weekConfigs[1],
    weekNumber: 7,
    cycleNumber: 3,
    theme: "反应弹性、助跑跳、单脚刚性和篮球专项",
    strengthTitle: "力量维护 + 单腿刚性",
    jumpTitle: "反应弹性 + 助跑起跳",
    transferTitle: "篮球专项转化",
    strengthContacts: { min: 8, max: 12 },
    jumpContacts: { min: 32, max: 42 },
    transferContacts: { min: 24, max: 32 },
    jumpImpact: "high",
    transferImpact: "moderate",
    jumpFatigue: "moderate-high",
    transferFatigue: "moderate",
    lowerStrengthItems: [
      { exerciseId: "rdl", sets: 3, reps: "4 次", intensity: "medium", notes: "RPE 7，腘绳肌不过度酸痛。" },
      { exerciseId: "eccentric-single-leg-squat", sets: 2, reps: "4 次", side: "each", intensity: "low" },
      { exerciseId: "single-leg-calf-raise-with-plate-under-front-foot", sets: 3, reps: "6 次", side: "each", intensity: "medium" },
      { exerciseId: "tibialis-raise", sets: 3, reps: "12 次", intensity: "low" },
      { exerciseId: "single-leg-low-pogo", sets: 1, reps: "4–6 次/侧", side: "each", intensity: "low", jumpContacts: contacts(8, 12), moduleTag: "single-leg-stiffness" }
    ],
    jumpItems: [
      { exerciseId: "single-leg-low-pogo", sets: 2, reps: "6–8 次/侧", side: "each", intensity: "medium", jumpContacts: contacts(24, 32), moduleTag: "single-leg-stiffness" },
      { exerciseId: "approach-jump", sets: 4, reps: "1 次", intensity: "high", jumpContacts: contacts(4, 6, { maxIntent: true }) },
      { exerciseId: "depth-drop", sets: 2, reps: "2 次", intensity: "medium", optional: true, jumpContacts: contacts(0, 4, { landingOnly: true }) },
      { exerciseId: "single-leg-snap-down-stick", sets: 2, reps: "2 次", side: "each", intensity: "low", jumpContacts: contacts(0, 4, { landingOnly: true }), moduleTag: "single-leg-stiffness" }
    ],
    transferItems: [
      { exerciseId: "lateral-stop-jump", sets: 2, reps: "2 次/方向", intensity: "medium", jumpContacts: contacts(8, 8) },
      { exerciseId: "two-step-single-leg-approach-jump", sets: 3, reps: "2 次/侧", side: "each", intensity: "medium", jumpContacts: contacts(8, 12), moduleTag: "single-leg-stiffness" },
      { exerciseId: "second-jump-rebound-drill", sets: 2, reps: "2–3 次", intensity: "medium", jumpContacts: contacts(4, 6) }
    ]
  },
  {
    ...weekConfigs[1],
    weekNumber: 8,
    cycleNumber: 3,
    theme: "篮球转化、侧向停跳、二次起跳和选择性连续跳",
    strengthTitle: "力量维护 + 髋膝控制",
    jumpTitle: "篮球反应弹性 + 选择性连续跳",
    transferTitle: "侧向停跳 + 二次起跳",
    strengthContacts: { min: 8, max: 12 },
    jumpContacts: { min: 34, max: 44 },
    transferContacts: { min: 26, max: 34 },
    jumpImpact: "high",
    transferImpact: "moderate",
    jumpFatigue: "moderate-high",
    transferFatigue: "moderate",
    lowerStrengthItems: [
      { exerciseId: "front-squat", sets: 3, reps: "3 次", intensity: "medium", notes: "RPE 7，不磨。" },
      { exerciseId: "bulgarian-split-squat", sets: 2, reps: "4 次", side: "each", intensity: "medium" },
      { exerciseId: "single-leg-good-morning", sets: 2, reps: "5 次", side: "each", intensity: "low" },
      { exerciseId: "single-leg-low-pogo", sets: 1, reps: "4–6 次/侧", side: "each", intensity: "low", jumpContacts: contacts(8, 12), moduleTag: "single-leg-stiffness" }
    ],
    jumpItems: [
      { exerciseId: "approach-jump", sets: 5, reps: "1 次", intensity: "high", jumpContacts: contacts(5, 6, { maxIntent: true }) },
      { exerciseId: "continuous-lunge-jump", sets: 2, reps: "3 次/侧", side: "each", intensity: "medium", optional: true, notes: "仅膝盖安静时短组；不是 conditioning。", jumpContacts: contacts(0, 12) },
      { exerciseId: "tuck-jump", sets: 2, reps: "2 次", intensity: "medium", optional: true, jumpContacts: contacts(0, 4) },
      { exerciseId: "single-leg-low-pogo", sets: 2, reps: "6–8 次/侧", side: "each", intensity: "medium", jumpContacts: contacts(24, 32), moduleTag: "single-leg-stiffness" },
      { exerciseId: "single-leg-depth-drop", sets: 1, reps: "1 次/侧", side: "each", intensity: "medium", optional: true, notes: "高级可选；疼痛 <=1/10、右膝/落地 >=4/5 才做。", jumpContacts: contacts(0, 2, { landingOnly: true }) }
    ],
    transferItems: [
      { exerciseId: "lateral-stop-jump", sets: 3, reps: "2 次/方向", intensity: "medium", jumpContacts: contacts(12, 12) },
      { exerciseId: "second-jump-rebound-drill", sets: 3, reps: "2 次", intensity: "medium", jumpContacts: contacts(6, 6) },
      { exerciseId: "catch-and-jump", sets: 3, reps: "2–3 次", intensity: "medium", jumpContacts: contacts(6, 9) },
      { exerciseId: "single-leg-hurdle-jump-to-squat-jump", sets: 1, reps: "1 次/侧", side: "each", intensity: "medium", optional: true, notes: "高级可选；无高篮球负荷且右膝/落地质量 >=4/5。", jumpContacts: contacts(0, 4) }
    ]
  },
  {
    ...weekConfigs[2],
    weekNumber: 9,
    cycleNumber: 3,
    theme: "卸载、动作质量复评、不过量失重落地",
    strengthTitle: "卸载力量 + 组织恢复",
    jumpTitle: "低量反应 + 技术复盘",
    transferTitle: "轻篮球 / 转化复盘",
    strengthContacts: { min: 0, max: 0 },
    jumpContacts: { min: 24, max: 32 },
    transferContacts: { min: 16, max: 22 },
    jumpImpact: "moderate",
    transferImpact: "low"
  },
  {
    ...weekConfigs[1],
    weekNumber: 10,
    cycleNumber: 4,
    theme: "维持力量、锐化跳跃技术、降低总量",
    strengthTitle: "力量维持 + 低量等长",
    jumpTitle: "锐化 CMJ / 助跑跳",
    transferTitle: "轻篮球转化",
    strengthContacts: { min: 6, max: 10 },
    jumpContacts: { min: 24, max: 32 },
    transferContacts: { min: 10, max: 16 },
    jumpImpact: "moderate",
    transferImpact: "low",
    lowerStrengthItems: [
      { exerciseId: "trap-bar-deadlift", sets: 3, reps: "2 次", intensity: "medium", notes: "RPE 6–7，速度保留。" },
      { exerciseId: "reverse-lunge", sets: 2, reps: "4 次", side: "each", intensity: "low" },
      { exerciseId: "single-leg-calf-isometric-hold", sets: 2, duration: "25 秒", side: "each", intensity: "low", moduleTag: "single-leg-stiffness" },
      { exerciseId: "box-jump", sets: 2, reps: "2–3 次", intensity: "low", jumpContacts: contacts(6, 10) }
    ],
    jumpItems: [
      { exerciseId: "cmj", sets: 3, reps: "2 次", intensity: "medium", jumpContacts: contacts(6, 6) },
      { exerciseId: "approach-jump", sets: 3, reps: "1–2 次", intensity: "medium", jumpContacts: contacts(6, 8) },
      { exerciseId: "low-pogo", sets: 2, reps: "8–10 次", intensity: "low", jumpContacts: contacts(16, 20) }
    ],
    transferItems: [
      { exerciseId: "two-step-single-leg-approach-jump", sets: 2, reps: "1 次/侧", side: "each", intensity: "low", jumpContacts: contacts(4, 4), moduleTag: "single-leg-stiffness" },
      { exerciseId: "catch-and-jump", sets: 2, reps: "2–3 次", intensity: "low", jumpContacts: contacts(4, 6) },
      { exerciseId: "pallof-press", sets: 2, reps: "8 次", side: "each", intensity: "low" }
    ]
  },
  {
    ...weekConfigs[2],
    weekNumber: 11,
    cycleNumber: 4,
    theme: "测试前 taper、低量高质量、无新动作",
    strengthTitle: "测试前力量维护",
    jumpTitle: "低量高质量激活",
    transferTitle: "轻篮球 / 不制造疲劳",
    strengthContacts: { min: 0, max: 0 },
    jumpContacts: { min: 16, max: 24 },
    transferContacts: { min: 8, max: 12 },
    jumpImpact: "low",
    transferImpact: "low"
  },
  {
    ...weekConfigs[2],
    weekNumber: 12,
    cycleNumber: 4,
    theme: "测试、宏周期复盘、生成下一阶段计划",
    strengthTitle: "测试周轻激活",
    jumpTitle: "测试前轻激活",
    transferTitle: "测试前休整 / 轻投篮",
    strengthContacts: { min: 0, max: 0 },
    jumpContacts: { min: 8, max: 14 },
    transferContacts: { min: 0, max: 0 },
    jumpImpact: "low",
    transferImpact: "none"
  }
];

const allWeekConfigs = [...weekConfigs, ...weekFourToTwelve];

export const trainingPlan: TrainingDay[] = allWeekConfigs.flatMap((week) => {
  const days: TrainingDay[] = [
    makeLowerStrengthDay(week, 1),
    makeBasketballDay(week, 2),
    makeRecoveryDay(week, 3),
    makeJumpDay(week, 4),
    makeUpperCoreDay(week, 5),
    makeTransferDay(week, 6)
  ];

  if (week.weekNumber % 3 === 0) {
    days.push(makeCycleReviewDay(week, 7));
  } else {
    days.push(makeRecoveryDay(week, 7));
  }

  return days;
});
