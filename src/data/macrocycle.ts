import type { TrainingCycle } from "@/types/training";

export const trainingCycles: TrainingCycle[] = [
  {
    cycleNumber: 1,
    startDay: 1,
    endDay: 21,
    title: "控制、容量与膝部负荷管理",
    phase: "control-capacity",
    goals: [
      "右脚 tripod 和右膝轨迹",
      "膝前侧负荷管理",
      "低冲击弹性",
      "腘绳肌、小腿和胫骨前肌基础容量",
      "核心抗旋转和上肢维护"
    ],
    progressionRules: [
      "疼痛 <=1–2/10 且第二天不加重，才增加跳跃接触。",
      "右脚外旋和右膝轨迹稳定，才从静态控制进入低幅弹跳。",
      "Cycle 1 不使用连续弓步跳、连续蹲跳、单脚失重落地或高级组合跳。"
    ],
    deloadRules: [
      "第 3 周降低力量和跳跃总量。",
      "膝前侧或肌腱 >=3/10 时改恢复或受控力量。",
      "篮球负荷高时取消额外跳跃。"
    ],
    testDays: [1, 21]
  },
  {
    cycleNumber: 2,
    startDay: 22,
    endDay: 42,
    title: "基础力量与低量弹跳转化",
    phase: "strength-conversion",
    goals: [
      "深蹲、髋铰链和分腿蹲力量",
      "小腿和胫骨前肌结构化容量",
      "低到中等弹跳暴露",
      "低剂量单脚起跳技术",
      "低剂量 PAP 和腘绳肌离心进阶"
    ],
    progressionRules: [
      "力量动作 RPE 6–8，动作质量稳定才加 2.5–5%。",
      "弹跳只增加强度或总量其中一个，不同时增加。",
      "Nordic 只做低量，避开篮球、高冲击和测试前 48 小时。"
    ],
    deloadRules: [
      "第 6 周降低总量并做低量复测。",
      "篮球负荷中高时 Day D/Day F 自动减少冲击。",
      "膝前侧疼痛 >=3/10 时取消深膝角跳跃。"
    ],
    testDays: [42]
  },
  {
    cycleNumber: 3,
    startDay: 43,
    endDay: 63,
    title: "反应弹性、单脚起跳与篮球专项转化",
    phase: "reactive-basketball-transfer",
    goals: [
      "更高质量反应弹性",
      "助跑起跳和单脚起跳",
      "侧向急停起跳和二次起跳",
      "低剂量失重落地进阶",
      "篮球专项转化"
    ],
    progressionRules: [
      "只有疼痛 <=1/10、右膝轨迹和落地质量 >=4/5 时才使用高级单脚进阶。",
      "连续跳跃动作只做短组、高质量，不做 conditioning。",
      "前 48 小时篮球负荷高时取消 PAP、最大跳和单脚高冲击。"
    ],
    deloadRules: [
      "第 9 周做动作质量复评，不堆失重落地。",
      "接触节奏变慢、落地变响或右脚外旋增加时退阶。",
      "任何膝前侧或肌腱症状 >=3/10，动态单脚内容取消。"
    ],
    testDays: [63]
  },
  {
    cycleNumber: 4,
    startDay: 64,
    endDay: 84,
    title: "整合、减量、测试与下一阶段生成",
    phase: "taper-test-review",
    goals: [
      "维持力量",
      "减少不必要总量",
      "锐化 CMJ 和助跑起跳",
      "测试 CMJ、助跑跳和可选单脚起跳",
      "复盘右侧质量、膝部和肌腱反应"
    ],
    progressionRules: [
      "测试周不引入新高级动作。",
      "强度保留，接触次数下降。",
      "黄色 readiness 改 70–85% 技术跳。"
    ],
    deloadRules: [
      "第 11 周开始 taper。",
      "第 12 周只保留测试需要的低量接触。",
      "Day 84 生成下一阶段计划。"
    ],
    testDays: [84]
  }
];

export function getTrainingCycle(cycleNumber: 1 | 2 | 3 | 4) {
  return trainingCycles.find((cycle) => cycle.cycleNumber === cycleNumber) ?? trainingCycles[0];
}
