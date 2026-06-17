export type TrainingDayType =
  | "jump"
  | "strength"
  | "basketball"
  | "recovery"
  | "test"
  | "skill"
  | "rest";

export type Intensity = "low" | "medium" | "high";

export type ImpactLevel = "none" | "low" | "moderate" | "high" | "variable";

export type EstimatedFatigue =
  | "very-low"
  | "low"
  | "moderate"
  | "moderate-high"
  | "high"
  | "variable";

export type BasketballLoadLevel = "none" | "light" | "moderate" | "high";

export type IsometricPurpose =
  | "maintenance"
  | "position-control"
  | "symptom-management"
  | "high-force";

export type SingleLegTrackingField =
  | "durationSec"
  | "painScore"
  | "rightFootControl"
  | "rightKneeTracking"
  | "rpe"
  | "landingQuality"
  | "landingQuietness"
  | "rightFootExternalRotation"
  | "pelvisStability"
  | "holdTwoSeconds"
  | "weight"
  | "reps"
  | "topPositionStability"
  | "balanceQuality"
  | "contactRhythm"
  | "jumpContacts"
  | "takeoffLeg"
  | "jumpHeightCm"
  | "reachHeightCm";

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
  | "optionalRecovery"
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
  glossaryTermIds?: string[];
  trackingFields?: SingleLegTrackingField[];
  progressionCriteria?: string[];
  regressionCriteria?: string[];
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
  optional?: boolean;
  jumpContacts?: {
    min: number;
    max: number;
    estimated?: boolean;
    landingOnly?: boolean;
    maxIntent?: boolean;
  };
  isometricPurpose?: IsometricPurpose;
  moduleTag?: "single-leg-stiffness";
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
  impactLevel: ImpactLevel;
  estimatedFatigue: EstimatedFatigue;
  estimatedDurationMinutes?: {
    min: number;
    max: number;
  };
  plannedJumpContacts?: {
    min: number;
    max: number;
  };
  maxIntentJumpContacts?: {
    min: number;
    max: number;
  };
  conditionalRules?: string[];
  assessmentProtocolId?: "right-side-reassessment";
  blocks: TrainingBlock[];
}

export interface JumpContactSummary {
  plannedContacts: number;
  completedContacts: number;
  maxIntentContacts: number;
  landingOnlyContacts: number;
  estimatedBasketballContacts?: number;
}

export interface BasketballSessionLog {
  date: string;
  durationMinutes: number;
  sessionRpe: number;
  loadLevel: BasketballLoadLevel;
  fullCourt: boolean;
  repeatedMaxJumps: boolean;
  estimatedJumpContacts?: number;
  sprintLoad?: 0 | 1 | 2 | 3;
  changeOfDirectionLoad?: 0 | 1 | 2 | 3;
  notes?: string;
}

export interface RightSideAssessment {
  date: string;
  dayNumber: 1 | 14 | 20 | 21;
  rightFootExternalRotation: 0 | 1 | 2 | 3;
  rightKneeValgus: 0 | 1 | 2 | 3;
  pelvisStability: 1 | 2 | 3 | 4 | 5;
  landingQuietness: 1 | 2 | 3 | 4 | 5;
  holdTwoSeconds: boolean;
  shiftTowardLeft: 0 | 1 | 2 | 3;
  notes?: string;
}

export interface SingleLegStiffnessAssessment {
  date: string;
  dayNumber: number;
  singleLegStiffnessQuality: 1 | 2 | 3 | 4 | 5;
  rightFootExternalRotation: 0 | 1 | 2 | 3;
  rightFootControl: 1 | 2 | 3 | 4 | 5;
  rightKneeTracking: 1 | 2 | 3 | 4 | 5;
  pelvisStability: 1 | 2 | 3 | 4 | 5;
  topPositionStability: 1 | 2 | 3 | 4 | 5;
  landingQuietness: 1 | 2 | 3 | 4 | 5;
  contactRhythm: 1 | 2 | 3 | 4 | 5;
  holdDurationSec?: number;
  jumpContacts?: number;
  takeoffLeg?: "left" | "right";
  jumpHeightCm?: number;
  reachHeightCm?: number;
  painScore?: number;
  notes?: string;
}

export interface JumpTestResult {
  date: string;
  cmjBest?: number;
  approachJumpBest?: number;
  unit: "cm" | "in" | "reach-mark";
  cmjAttempts: number;
  approachJumpAttempts: number;
  movementQuality: 1 | 2 | 3 | 4 | 5;
  stoppedForDecline: boolean;
  notes?: string;
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
  hamstringSoreness: number;
  upperBodySoreness: number;
  generalDoms: number;
  generalFatigue: 1 | 2 | 3 | 4 | 5;
  movementQualityToday: 1 | 2 | 3 | 4 | 5;
  rightFootExternalRotation?: 0 | 1 | 2 | 3;
  rightFootControl?: 1 | 2 | 3 | 4 | 5;
  rightKneeTracking?: 1 | 2 | 3 | 4 | 5;
  legsFeelHeavy: boolean;
  basketballLoadLast24h: BasketballLoadLevel;
  basketballLoadLast48h: BasketballLoadLevel;
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
