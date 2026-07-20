import { exercises, getExerciseById } from "@/data/exercises";
import type {
  BasketballLoadLevel,
  Exercise,
  ReadinessLevel,
  TrainingDay,
  TrainingItem
} from "@/types/training";

export interface AdvancedExerciseGateParams {
  readinessLevel: ReadinessLevel;
  anteriorKneeSoreness?: number;
  achillesStiffness?: number;
  patellarPain?: number;
  hamstringSoreness?: number;
  rightFootExternalRotation?: 0 | 1 | 2 | 3;
  rightKneeTracking?: 1 | 2 | 3 | 4 | 5;
  landingQuality?: 1 | 2 | 3 | 4 | 5;
  movementQualityToday?: 1 | 2 | 3 | 4 | 5;
  basketballLoadLast24h: BasketballLoadLevel;
  basketballLoadLast48h: BasketballLoadLevel;
  isAdvancedOnly?: boolean;
  userEnabledAdvancedExercise?: boolean;
}

export interface AdvancedExerciseGateResult {
  allowed: boolean;
  reasons: string[];
}

export interface AdvancedExerciseSubstitution {
  exerciseId: string;
  exerciseName: string;
  alternativeExerciseId: string;
  alternativeName: string;
  reasons: string[];
}

export const advancedExerciseAlternatives: Record<string, string[]> = {
  "power-clean": ["clean-pull", "db-power-snatch", "kettlebell-swing"],
  "squat-jerk": ["db-power-snatch", "medicine-ball-overhead-slam", "assist-squat-jump"],
  "depth-jump-to-vertical-jump-with-weight": ["depth-drop", "depth-jump-less-contact", "box-jump"],
  "single-leg-double-tuck-jump": ["single-leg-low-pogo", "single-leg-snap-down-stick", "two-step-single-leg-approach-jump"],
  "concentric-jump-to-vertical-jump-with-weight": ["db-squat-jump", "squat-jump", "assist-squat-jump"],
  "front-bulgarian-squat": ["bulgarian-split-squat", "split-squat-isometric", "reverse-lunge"],
  "single-leg-hurdle-jump-to-squat-jump": ["single-leg-low-pogo", "single-leg-snap-down-stick", "two-step-single-leg-approach-jump"],
  "single-leg-depth-drop": ["single-leg-snap-down-stick", "right-single-leg-landing-stick"],
  "continuous-lunge-jump": ["lunge-jump", "split-squat-isometric"],
  "continuous-tuck-jump": ["tuck-jump", "low-pogo"],
  "continuous-squat-jump": ["squat-jump", "assist-squat-jump"],
  "kettlebell-swing-with-band": ["kettlebell-swing", "rdl"],
  "clean-pull-to-power-clean": ["clean-pull", "db-power-snatch"]
};

function maxPain(params: AdvancedExerciseGateParams) {
  return Math.max(
    params.anteriorKneeSoreness ?? 0,
    params.achillesStiffness ?? 0,
    params.patellarPain ?? 0
  );
}

function hasAnyTendonOrKneeWarning(params: AdvancedExerciseGateParams) {
  return (
    (params.anteriorKneeSoreness ?? 0) > 0 ||
    (params.achillesStiffness ?? 0) > 0 ||
    (params.patellarPain ?? 0) > 0
  );
}

export function canUseAdvancedExercise(params: AdvancedExerciseGateParams): AdvancedExerciseGateResult {
  const reasons: string[] = [];
  const rightKneeTracking = params.rightKneeTracking ?? params.movementQualityToday ?? 3;
  const landingQuality = params.landingQuality ?? params.movementQualityToday ?? 3;
  const pain = maxPain(params);

  if (params.readinessLevel === "red") {
    reasons.push("readiness 为红色");
  }
  if ((params.anteriorKneeSoreness ?? 0) >= 3) {
    reasons.push("膝前侧 soreness >=3/10");
  }
  if ((params.achillesStiffness ?? 0) >= 3 || (params.patellarPain ?? 0) >= 3) {
    reasons.push("跟腱或髌腱症状 >=3/10");
  }
  if ((params.hamstringSoreness ?? 0) >= 4) {
    reasons.push("腘绳肌酸痛 >=4/10");
  }
  if ((params.rightFootExternalRotation ?? 0) >= 2) {
    reasons.push("右脚外旋 >=2/3");
  }
  if (rightKneeTracking <= 2) {
    reasons.push("右膝轨迹 <=2/5");
  }
  if (landingQuality <= 2) {
    reasons.push("落地质量 <=2/5");
  }
  if (params.basketballLoadLast24h === "high") {
    reasons.push("过去 24 小时篮球负荷高");
  }
  if (params.basketballLoadLast48h === "high" && hasAnyTendonOrKneeWarning(params)) {
    reasons.push("过去 48 小时篮球负荷高且已有膝/肌腱提示");
  }

  if (params.isAdvancedOnly) {
    if (params.readinessLevel !== "green") {
      reasons.push("advanced-only 需要绿色 readiness");
    }
    if (pain > 1) {
      reasons.push("advanced-only 需要疼痛 <=1/10");
    }
    if (rightKneeTracking < 4 || landingQuality < 4 || (params.movementQualityToday ?? 4) < 4) {
      reasons.push("advanced-only 需要动作质量 >=4/5");
    }
    if (params.basketballLoadLast48h === "high") {
      reasons.push("advanced-only 需要前 48 小时无高篮球负荷");
    }
    if (!params.userEnabledAdvancedExercise) {
      reasons.push("advanced-only 需要先确认技术/设备安全");
    }
  }

  return {
    allowed: reasons.length === 0,
    reasons
  };
}

export function getSafeAlternativeExerciseIds(exercise: Exercise): string[] {
  return [
    ...(exercise.safeAlternativeExerciseIds ?? []),
    ...(advancedExerciseAlternatives[exercise.id] ?? [])
  ].filter((id, index, allIds) => allIds.indexOf(id) === index);
}

function isGatedExercise(exercise: Exercise) {
  return (
    exercise.riskTier === "high" ||
    exercise.riskTier === "advanced-only" ||
    exercise.category === "power"
  );
}

function substituteTrainingItem(item: TrainingItem, substitution: AdvancedExerciseSubstitution): TrainingItem {
  return {
    ...item,
    exerciseId: substitution.alternativeExerciseId,
    optional: true,
    intensity: item.intensity === "high" ? "medium" : item.intensity,
    jumpContacts: item.jumpContacts
      ? {
          ...item.jumpContacts,
          min: 0,
          max: Math.max(0, Math.min(item.jumpContacts.max, 4)),
          maxIntent: false
        }
      : undefined,
    notes: [
      `今日不建议做此进阶动作，已自动替换为：${substitution.alternativeName}。`,
      substitution.reasons.join("；"),
      item.notes
    ]
      .filter(Boolean)
      .join(" ")
  };
}

export function getBlockedAdvancedExerciseSubstitutions(
  day: TrainingDay,
  params: AdvancedExerciseGateParams
): AdvancedExerciseSubstitution[] {
  const substitutions: AdvancedExerciseSubstitution[] = [];

  day.blocks.forEach((block) => {
    block.items.forEach((item) => {
      const exercise = getExerciseById(item.exerciseId);
      if (!exercise || !isGatedExercise(exercise)) {
        return;
      }

      const result = canUseAdvancedExercise({
        ...params,
        isAdvancedOnly: exercise.riskTier === "advanced-only" || exercise.advancedOnly
      });
      if (result.allowed) {
        return;
      }

      const alternativeId = getSafeAlternativeExerciseIds(exercise).find((id) =>
        exercises.some((candidate) => candidate.id === id)
      );
      const alternative = alternativeId ? getExerciseById(alternativeId) : undefined;
      if (!alternativeId || !alternative) {
        return;
      }

      substitutions.push({
        exerciseId: exercise.id,
        exerciseName: exercise.nameZh,
        alternativeExerciseId: alternativeId,
        alternativeName: alternative.nameZh,
        reasons: result.reasons
      });
    });
  });

  return substitutions;
}

export function applyAdvancedExerciseSubstitutions(
  day: TrainingDay,
  substitutions: AdvancedExerciseSubstitution[]
): TrainingDay {
  if (substitutions.length === 0) {
    return day;
  }

  const substitutionMap = new Map(substitutions.map((substitution) => [substitution.exerciseId, substitution]));
  return {
    ...day,
    blocks: day.blocks.map((block) => ({
      ...block,
      items: block.items.map((item) => {
        const substitution = substitutionMap.get(item.exerciseId);
        return substitution ? substituteTrainingItem(item, substitution) : { ...item };
      })
    }))
  };
}
