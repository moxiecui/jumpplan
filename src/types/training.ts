export type TrainingDayType =
  | "jump"
  | "strength"
  | "basketball"
  | "recovery"
  | "test"
  | "skill"
  | "rest";

export type Intensity = "low" | "medium" | "high";

export type TrainingItemCompletionStatus =
  | "not-started"
  | "completed"
  | "skipped"
  | "regressed";

export type TrainingBlockType =
  | "warmup"
  | "main"
  | "activeRecovery"
  | "eveningRecovery"
  | "notes";

export interface Exercise {
  id: string;
  nameZh: string;
  nameEn?: string;
  category:
    | "foot-ankle"
    | "knee-tendon"
    | "hip"
    | "plyometric"
    | "strength"
    | "mobility"
    | "recovery"
    | "upper-body"
    | "core"
    | "isometric"
    | "basketball-skill";
  purpose: string;
  whyForUser: string;
  instructions: string[];
  keyCues: string[];
  commonMistakes: string[];
  regressions?: string[];
  progressions?: string[];
  painRules?: string[];
  youtubeSearchQuery?: string;
  youtubeUrl?: string;
  videoNote?: string;
}

export interface TrainingItem {
  exerciseId: string;
  sets?: number;
  reps?: string;
  duration?: string;
  side?: "left" | "right" | "both" | "each";
  intensity?: Intensity;
  rest?: string;
  notes?: string;
}

export interface TrainingBlock {
  type: TrainingBlockType;
  title: string;
  items: TrainingItem[];
}

export interface TrainingDay {
  day: number;
  title: string;
  type: TrainingDayType;
  goal: string;
  phase?: 1 | 2 | 3;
  phaseTitle?: string;
  performanceFocus?: string[];
  upperBodyIncluded?: boolean;
  coreIncluded?: boolean;
  isometricIncluded?: boolean;
  nutritionPlanId?: string;
  contrastModuleId?: "french-contrast";
  readinessRule?: string;
  blocks: TrainingBlock[];
}

export interface OuraDailyReadinessInput {
  date: string;
  readinessScore?: number;
  restingHeartRate?: number;
  hrv?: number;
  sleepScore?: number;
  source: "manual" | "oura-api" | "mock";
}

export interface SubjectiveReadinessInput {
  date: string;
  achillesStiffness: number;
  patellarPain: number;
  calfTightness: number;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export type DailyCheckIn = SubjectiveReadinessInput;

export type ReadinessLevel = "green" | "yellow" | "red";

export type TrainingAdjustmentType =
  | "train-as-planned"
  | "reduce-impact"
  | "strength-only"
  | "recovery-only"
  | "test-not-recommended"
  | "optional-upgrade";

export interface DailyTrainingAdjustment {
  date: string;
  level: ReadinessLevel;
  adjustmentType: TrainingAdjustmentType;
  headline: string;
  explanation: string;
  modifications: string[];
  removeExerciseCategories: Exercise["category"][];
  reduceVolumePercent?: number;
  intensityCap?: "RPE 6" | "RPE 7" | "RPE 8";
  allowMaxJump: boolean;
  allowPogo: boolean;
  allowPAP: boolean;
  allowBasketball: boolean;
  cautionFlags: string[];
}
