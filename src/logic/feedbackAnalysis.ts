import type {
  FeedbackSeverity,
  PlanGenerationRequest,
  PlanLength,
  TrainingFeedback
} from "@/types/adaptivePlan";

function maxPain(feedback: TrainingFeedback[]) {
  return feedback.reduce(
    (max, item) =>
      Math.max(max, item.achillesPain ?? 0, item.patellarPain ?? 0, item.calfTightness ?? 0),
    0
  );
}

export function detectTendonRisk(feedback: TrainingFeedback[]): boolean {
  return feedback.some((item) => (item.achillesPain ?? 0) >= 4 || (item.patellarPain ?? 0) >= 4);
}

export function detectMovementQualityRisk(feedback: TrainingFeedback[]): boolean {
  const valgusCount = feedback.filter((item) => item.rightKneeValgusObserved).length;
  const heavyLandingCount = feedback.filter((item) => item.landingFeltHeavy).length;

  return valgusCount >= 1 || heavyLandingCount >= 2;
}

export function analyzeFeedbackSeverity(feedback: TrainingFeedback[]): FeedbackSeverity {
  if (feedback.length === 0) {
    return "none";
  }

  if (detectTendonRisk(feedback)) {
    return "high";
  }

  const pain = maxPain(feedback);
  const extraBasketballCount = feedback.filter((item) => item.extraBasketball).length;
  const lowEnergyCount = feedback.filter((item) => (item.subjectiveEnergy ?? 5) <= 2).length;

  if (pain >= 3 || detectMovementQualityRisk(feedback) || extraBasketballCount >= 2 || lowEnergyCount >= 2) {
    return "moderate";
  }

  if (pain > 0 || extraBasketballCount === 1 || lowEnergyCount === 1) {
    return "mild";
  }

  return "none";
}

export function suggestPlanLength(request: PlanGenerationRequest): PlanLength {
  if (request.requestedLength) {
    return request.requestedLength;
  }

  if (detectTendonRisk(request.recentFeedback)) {
    return request.trigger === "mid-cycle-adjustment" ? "3-days" : "7-days";
  }

  if (request.cycleSummary && request.cycleSummary.completionRate < 0.7) {
    return "7-days";
  }

  if (request.trigger === "mid-cycle-adjustment") {
    return "7-days";
  }

  if (request.trigger === "end-of-cycle-regeneration") {
    return "21-days";
  }

  return "10-days";
}
