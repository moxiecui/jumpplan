import type { DailyTrainingAdjustment, TrainingDay } from "@/types/training";

export type PlanGenerationTrigger =
  | "mid-cycle-adjustment"
  | "end-of-cycle-regeneration"
  | "manual-request";

export type PlanLength =
  | "3-days"
  | "7-days"
  | "10-days"
  | "21-days"
  | "4-weeks";

export type FeedbackSeverity =
  | "none"
  | "mild"
  | "moderate"
  | "high";

export interface TrainingFeedback {
  date: string;
  dayNumber?: number;
  completedExerciseIds: string[];
  skippedExerciseIds: string[];
  difficultExerciseIds: string[];
  painNotes?: string;
  achillesPain?: number;
  patellarPain?: number;
  calfTightness?: number;
  rightKneeValgusObserved?: boolean;
  landingFeltHeavy?: boolean;
  jumpFeltExplosive?: boolean;
  basketballMinutes?: number;
  extraBasketball?: boolean;
  subjectiveEnergy?: number;
  notes?: string;
}

export interface CycleSummary {
  startDate: string;
  endDate: string;
  completedDays: number;
  plannedDays: number;
  completionRate: number;
  bestCMJ?: number;
  bestApproachJump?: number;
  cmjChange?: number;
  approachJumpChange?: number;
  averageReadinessScore?: number;
  averageHRV?: number;
  averageRestingHR?: number;
  achillesPainTrend?: "improved" | "stable" | "worse" | "unknown";
  patellarPainTrend?: "improved" | "stable" | "worse" | "unknown";
  mainUserNotes?: string;
}

export interface PlanGenerationRequest {
  trigger: PlanGenerationTrigger;
  requestedLength?: PlanLength;
  currentDay?: number;
  currentPlanTitle?: string;
  recentFeedback: TrainingFeedback[];
  cycleSummary?: CycleSummary;
  readinessContext?: DailyTrainingAdjustment[];
  constraints: {
    basketballSessionsPerWeek: number;
    maxHighImpactDaysPerWeek: number;
    prioritizeTendonSafety: boolean;
    rightKneeTrackingFocus: boolean;
    allowPAP: boolean;
    allowMaxJumpTesting: boolean;
    equipmentAvailable: string[];
  };
  userGoal: string;
}

export interface GeneratedPlanMetadata {
  title: string;
  length: PlanLength;
  focus: string;
  rationale: string;
  safetySummary: string;
  generatedAt: string;
  model?: string;
  source: "mock" | "backend-gpt";
}

export interface GeneratedAdaptivePlan {
  metadata: GeneratedPlanMetadata;
  days: TrainingDay[];
  globalRules: string[];
  progressionRules: string[];
  deloadRules: string[];
  redFlags: string[];
}
