import type { BasketballLoadLevel, JumpReadinessResult, JumpReadinessTest } from "@/types/training";

interface JumpReadinessContext {
  anteriorKneeSoreness?: number;
  achillesStiffness?: number;
  patellarPain?: number;
  hamstringSoreness?: number;
  basketballLoadLast24h?: BasketballLoadLevel;
  movementQualityToday?: number;
}

export function calculateRollingJumpBaseline(tests: JumpReadinessTest[]): number | undefined {
  const validValues = tests
    .filter((test) => !test.invalid && !test.painful && !test.afterHardTraining)
    .slice(-10)
    .map((test) => test.bestValue)
    .filter((value) => Number.isFinite(value) && value > 0);

  if (validValues.length < 3) {
    return undefined;
  }

  const recent = validValues.slice(-5);
  const sorted = [...recent].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

export function evaluateJumpReadiness(
  test: JumpReadinessTest,
  context: JumpReadinessContext
): JumpReadinessResult {
  const reasons: string[] = [];
  const worstPain = Math.max(
    context.anteriorKneeSoreness ?? 0,
    context.achillesStiffness ?? 0,
    context.patellarPain ?? 0
  );
  const baseline = test.baselineValue;
  const percentChange =
    test.percentChangeFromBaseline ??
    (baseline && baseline > 0 ? ((test.bestValue - baseline) / baseline) * 100 : undefined);

  if (worstPain >= 4) {
    return {
      level: "red",
      percentChange,
      recommendation: "recovery-only",
      reasons: ["疼痛 >=4/10，CMJ 结果不能覆盖疼痛。"]
    };
  }

  if (
    worstPain >= 3 ||
    (context.hamstringSoreness ?? 0) >= 4 ||
    (context.movementQualityToday ?? 5) <= 2 ||
    (test.landingQuality ?? 5) <= 2
  ) {
    return {
      level: "red",
      percentChange,
      recommendation: worstPain >= 3 ? "strength-only" : "technical-only",
      reasons: ["疼痛 >=3/10、腘绳肌酸痛高或落地/动作质量差，阻止高冲击。"]
    };
  }

  if (context.basketballLoadLast24h === "high") {
    reasons.push("过去 24 小时篮球负荷高。");
    return {
      level: "red",
      percentChange,
      recommendation: "technical-only",
      reasons
    };
  }

  if (percentChange === undefined) {
    return {
      level: "unknown",
      recommendation: "normal-session",
      reasons: ["有效 rolling baseline 不足；先记录，不用单次结果做大幅调整。"]
    };
  }

  if (percentChange < -5) {
    return {
      level: "red",
      percentChange,
      recommendation: "technical-only",
      reasons: ["CMJ 比 rolling baseline 下降超过 5%，不做最大跳、PAP 或高级反应跳。"]
    };
  }

  if (percentChange < -2) {
    return {
      level: "yellow",
      percentChange,
      recommendation: "technical-only",
      reasons: ["CMJ 比 baseline 下降 2–5%，减少可选跳跃接触，不自动进阶。"]
    };
  }

  if (percentChange > 3 && (test.perceivedExplosiveness ?? 4) >= 4 && (test.landingQuality ?? 4) >= 4) {
    return {
      level: "green",
      percentChange,
      recommendation: "allow-high-intensity",
      reasons: ["CMJ 高于 baseline 且动作质量好；允许计划内 power 进阶，但不自动加量。"]
    };
  }

  return {
    level: "green",
    percentChange,
    recommendation: "normal-session",
    reasons: ["CMJ 在 baseline ±2% 附近，按计划执行。"]
  };
}
