import type { DailyCheckIn, ReadinessLevel } from "@/types/training";

export function getReadiness(checkIn: DailyCheckIn): {
  level: ReadinessLevel;
  message: string;
  modifications: string[];
} {
  const warnings = [
    checkIn.achillesStiffness >= 3,
    checkIn.patellarPain >= 3,
    checkIn.calfTightness >= 4,
    checkIn.sleepQuality <= 2
  ].filter(Boolean).length;

  if (warnings >= 3) {
    return {
      level: "red",
      message: "今天不适合高冲击训练。",
      modifications: [
        "取消 Pogo、最大跳、深度跳和冲刺。",
        "只做热身、Zone 2、活动度和主动恢复。",
        "如果疼痛持续，下一次训练也降级。"
      ]
    };
  }

  if (warnings === 2) {
    return {
      level: "yellow",
      message: "今天需要降级训练。",
      modifications: [
        "取消最大跳和 PAP。",
        "Pogo 组数减半。",
        "力量动作保持 RPE 6–7，不做力竭。"
      ]
    };
  }

  return {
    level: "green",
    message: "可以按计划训练。",
    modifications: []
  };
}
