import type {
  BasketballLoadLevel,
  BasketballSessionLog,
  DailyTrainingAdjustment,
  SubjectiveReadinessInput
} from "@/types/training";

export function classifyBasketballLoad(
  input: Pick<
    BasketballSessionLog,
    "durationMinutes" | "sessionRpe" | "fullCourt" | "repeatedMaxJumps"
  >
): BasketballLoadLevel {
  if (
    input.sessionRpe >= 7 ||
    input.fullCourt ||
    input.repeatedMaxJumps
  ) {
    return "high";
  }

  if (input.durationMinutes >= 45 || input.sessionRpe >= 5) {
    return "moderate";
  }

  if (input.durationMinutes > 0) {
    return "light";
  }

  return "none";
}

export function getBasketballLoadWarning(
  load24h: BasketballLoadLevel,
  load48h: BasketballLoadLevel
): string | undefined {
  if (load24h === "high") {
    return "过去 24 小时篮球负荷高：今天不做 PAP、最大跳或额外高冲击训练。";
  }

  if (load24h === "moderate") {
    return "过去 24 小时篮球负荷中等：取消最大跳，并减少可选增强式训练量。";
  }

  if (load48h === "high") {
    return "过去 48 小时有高篮球负荷：如果腿仍沉重，降低力量总量并取消 PAP。";
  }

  return undefined;
}

export function shouldDowngradePap(params: {
  subjective?: SubjectiveReadinessInput;
  adjustment?: DailyTrainingAdjustment;
  previousBasketballLoad?: BasketballLoadLevel;
  warmupJumpQualityGood?: boolean;
}) {
  const { subjective, adjustment, previousBasketballLoad, warmupJumpQualityGood = true } = params;

  return Boolean(
    previousBasketballLoad === "moderate" ||
      previousBasketballLoad === "high" ||
      (subjective?.achillesStiffness ?? 0) >= 3 ||
      (subjective?.patellarPain ?? 0) >= 3 ||
      (subjective?.hamstringSoreness ?? 0) >= 3 ||
      adjustment?.level === "yellow" ||
      adjustment?.level === "red" ||
      !warmupJumpQualityGood
  );
}
