import type { TrainingItem } from "@/types/training";

export const singleLegStiffnessModule = {
  id: "single-leg-stiffness",
  titleZh: "单腿刚性与单脚起跳效率",
  titleEn: "Single-Leg Stiffness and One-Foot Takeoff Efficiency",
  definition:
    "单腿支撑时，足弓、踝、膝、髋能够快速形成稳定支柱，减少过度塌陷和侧向晃动，并把助跑产生的力量有效传向地面。刚性不是把膝盖锁死，而是在需要发力时快速稳定、在落地时仍能正常缓冲。",
  primaryQualities: [
    "右脚 tripod 控制",
    "踝部刚性",
    "小腿 / 跟腱等长容量",
    "右膝轨迹",
    "髋稳定",
    "骨盆控制",
    "抗旋转",
    "快速支撑腿稳定",
    "摆动腿驱动",
    "垂直传力",
    "安静落地",
    "合适时缩短触地时间"
  ]
};

export const singleLegStiffnessExerciseIds = [
  "single-leg-calf-isometric-hold",
  "single-leg-snap-down-stick",
  "step-up-knee-drive-hold",
  "single-leg-rdl-top-lock",
  "single-leg-forward-lean-isometric",
  "single-leg-low-pogo",
  "forward-back-single-leg-pogo",
  "lateral-single-leg-pogo",
  "penultimate-step-drill",
  "two-step-single-leg-approach-jump",
  "max-single-leg-approach-jump"
];

export const singleLegProgressionLadder = [
  {
    phase: "静态基础",
    exercises: [
      "single-leg-calf-isometric-hold",
      "single-leg-forward-lean-isometric",
      "step-up-knee-drive-hold",
      "single-leg-rdl-top-lock"
    ]
  },
  {
    phase: "落地 / 控制",
    exercises: ["single-leg-snap-down-stick", "single-leg-landing-stick"]
  },
  {
    phase: "动态刚性",
    exercises: [
      "single-leg-low-pogo",
      "forward-back-single-leg-pogo",
      "lateral-single-leg-pogo"
    ]
  },
  {
    phase: "起跳转化",
    exercises: [
      "penultimate-step-drill",
      "two-step-single-leg-approach-jump",
      "max-single-leg-approach-jump"
    ]
  }
];

export const singleLegProgressionRules = {
  staticControl: [
    "疼痛 <=1–2/10。",
    "右脚控制 >=4/5。",
    "右膝轨迹 >=4/5。",
    "骨盆稳定 >=4/5。"
  ],
  dynamicStiffness: [
    "落地安静。",
    "触地节奏保持快速。",
    "第二天跟腱晨僵没有增加。",
    "右脚外旋没有明显增加。"
  ],
  takeoffIntensity: [
    "支撑脚控制 >=4/5。",
    "右膝轨迹 >=4/5。",
    "过去 24–48 小时没有高篮球负荷。",
    "Readiness 为绿色或稳定。"
  ],
  regressWhen: [
    "跟腱或髌腱症状 >=3/10。",
    "落地质量 <=2/5。",
    "右脚控制 <=2/5。",
    "右膝轨迹 <=2/5。",
    "动作变慢或落地变吵。",
    "右脚外旋变成中等或明显。",
    "过去 24 小时篮球负荷高。"
  ],
  neverDo: ["不要在同一次可比训练中同时增加跳跃强度和跳跃接触次数。"]
};

export function isSingleLegStiffnessItem(item: TrainingItem) {
  return item.moduleTag === "single-leg-stiffness" || singleLegStiffnessExerciseIds.includes(item.exerciseId);
}
