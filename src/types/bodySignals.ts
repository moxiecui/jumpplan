export type WearableSource =
  | "manual"
  | "oura"
  | "whoop"
  | "withings"
  | "apple-health"
  | "mock";

export type ReadinessLevel = "green" | "yellow" | "red";

export interface DailyWearableSignals {
  date: string;
  source: WearableSource;

  ouraReadiness?: number;
  ouraSleepScore?: number;
  ouraHrvMs?: number;
  ouraRestingHr?: number;
  ouraBodyTempDeviationC?: number;
  ouraRespiratoryRate?: number;
  ouraSleepDurationMinutes?: number;

  whoopRecovery?: number;
  whoopStrain?: number;
  whoopSleepPerformance?: number;
  whoopHrvMs?: number;
  whoopRestingHr?: number;
  whoopRespiratoryRate?: number;

  manualSleepQuality?: 1 | 2 | 3 | 4 | 5;
  manualEnergy?: 1 | 2 | 3 | 4 | 5;
  manualLegHeaviness?: 1 | 2 | 3 | 4 | 5;

  notes?: string;
}

export interface DailyPainAndMovementSignals {
  date: string;
  anteriorKneeSoreness?: number;
  achillesStiffness?: number;
  patellarPain?: number;
  hamstringSoreness?: number;
  calfTightness?: number;
  generalDoms?: number;
  movementQualityToday?: 1 | 2 | 3 | 4 | 5;
  rightFootExternalRotation?: 0 | 1 | 2 | 3;
  rightKneeTracking?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface BasketballLoadSignals {
  date: string;
  playedBasketball: boolean;
  durationMinutes?: number;
  sessionRpe?: number;
  loadLevel?: "none" | "light" | "moderate" | "high";
  fullCourt?: boolean;
  repeatedMaxJumps?: boolean;
  estimatedJumpContacts?: number;
  changeOfDirectionLoad?: 0 | 1 | 2 | 3;
  notes?: string;
}

export interface WithingsBodySignals {
  date: string;
  weightKg?: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  fatMassKg?: number;
  boneMassKg?: number;
  bodyWaterPercent?: number;

  leftLegMuscleMassKg?: number;
  rightLegMuscleMassKg?: number;
  leftRightLegMuscleDifferencePercent?: number;

  visceralFatIndex?: number;
  notes?: string;
}

export interface DailyBodySignals {
  date: string;
  wearable?: DailyWearableSignals;
  painAndMovement?: DailyPainAndMovementSignals;
  basketballLoad?: BasketballLoadSignals;
  withings?: WithingsBodySignals;
}

export interface BodySignalBaseline {
  hrvMsBaseline?: number;
  restingHrBaseline?: number;
  sleepDurationBaselineMinutes?: number;
  weightKgBaseline?: number;
  muscleMassKgBaseline?: number;
}

export interface TrainingReminder {
  id: string;
  date: string;
  level: "info" | "caution" | "warning" | "stop";
  title: string;
  message: string;
  recommendedAction:
    | "follow-plan"
    | "reduce-intensity"
    | "remove-high-impact"
    | "recovery-only"
    | "manual-review"
    | "nutrition-review";
  triggeredBy: string[];
  blockedExerciseIds?: string[];
  suggestedAlternativeIds?: string[];
}
