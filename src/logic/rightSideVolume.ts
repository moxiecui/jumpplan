import type { ImpactLevel } from "@/types/training";

export interface RightSideVolumeInput {
  impactLevel: ImpactLevel;
  rightFootExternalRotation?: 0 | 1 | 2 | 3;
  rightKneeTracking?: 1 | 2 | 3 | 4 | 5;
  pelvisStability?: 1 | 2 | 3 | 4 | 5;
  tendonOrKneePain?: number;
  landingQuietness?: 1 | 2 | 3 | 4 | 5;
}

export interface RightSideVolumeGuidance {
  allowExtraRightSideSet: boolean;
  maxExtraTechnicalSets: 0 | 1;
  reason: string;
}

export function getRightSideVolumeGuidance(input: RightSideVolumeInput): RightSideVolumeGuidance {
  if (input.impactLevel === "high" || input.impactLevel === "variable") {
    return {
      allowExtraRightSideSet: false,
      maxExtraTechnicalSets: 0,
      reason: "高冲击或篮球变量日不追加右侧跳跃量。"
    };
  }

  if ((input.tendonOrKneePain ?? 0) >= 3) {
    return {
      allowExtraRightSideSet: false,
      maxExtraTechnicalSets: 0,
      reason: "疼痛 >=3/10 时不靠加量修正右侧差异。"
    };
  }

  if (
    (input.rightFootExternalRotation ?? 0) >= 2 ||
    (input.rightKneeTracking ?? 5) <= 2 ||
    (input.pelvisStability ?? 5) <= 2 ||
    (input.landingQuietness ?? 5) <= 2
  ) {
    return {
      allowExtraRightSideSet: false,
      maxExtraTechnicalSets: 0,
      reason: "右脚、右膝、骨盆或落地质量不稳定时先退阶，不加量。"
    };
  }

  return {
    allowExtraRightSideSet: true,
    maxExtraTechnicalSets: 1,
    reason: "只允许 1 组低强度技术/控制加练，不增加右侧高冲击接触。"
  };
}
