import { getExerciseById } from "@/data/exercises";
import type {
  DailyTrainingAdjustment,
  TrainingBlock,
  TrainingDay,
  TrainingItem
} from "@/types/training";

const explicitHighImpactIds = new Set([
  "low-pogo",
  "cmj",
  "approach-jump",
  "lateral-stop-jump",
  "hurdle-hop-forward-back",
  "lateral-hurdle-hop",
  "single-leg-landing-stick",
  "defensive-slide-stop"
]);

const controlledStrengthIds = new Set([
  "bulgarian-split-squat-eccentric",
  "single-leg-calf-raise",
  "single-leg-rdl-contralateral",
  "trap-bar-deadlift",
  "spanish-squat-isometric",
  "calf-isometric-hold",
  "split-squat-isometric",
  "wall-sit",
  "step-down",
  "rdl",
  "nordic-curl",
  "copenhagen-plank",
  "dead-bug",
  "side-plank",
  "pallof-press",
  "suitcase-carry",
  "farmer-carry",
  "push-up",
  "dumbbell-bench-press",
  "one-arm-dumbbell-row",
  "pull-up-or-lat-pulldown",
  "landmine-press"
]);

function cloneDay(day: TrainingDay): TrainingDay {
  return {
    ...day,
    blocks: day.blocks.map((block) => ({
      ...block,
      items: block.items.map((item) => ({ ...item }))
    }))
  };
}

function buildNoteBlock(adjustment: DailyTrainingAdjustment): TrainingBlock {
  return {
    type: "notes",
    title: "Readiness 调整说明",
    items: [
      {
        exerciseId: "legs-up-breathing",
        duration: "按需",
        intensity: "low",
        notes: [adjustment.headline, ...adjustment.modifications].join(" ")
      }
    ]
  };
}

function annotateItem(item: TrainingItem, note: string): TrainingItem {
  return {
    ...item,
    notes: item.notes ? `${item.notes} ${note}` : note
  };
}

function isPAPOrSprintLike(item: TrainingItem) {
  const text = `${item.exerciseId} ${item.notes ?? ""}`.toLowerCase();
  return (
    text.includes("pap") ||
    text.includes("sprint") ||
    text.includes("contrast") ||
    text.includes("french") ||
    text.includes("复合训练") ||
    text.includes("冲刺")
  );
}

export function isHighImpactExercise(exerciseId: string, notes?: string): boolean {
  if (explicitHighImpactIds.has(exerciseId)) {
    return true;
  }

  const exercise = getExerciseById(exerciseId);
  const text = `${exerciseId} ${exercise?.nameZh ?? ""} ${exercise?.nameEn ?? ""} ${notes ?? ""}`.toLowerCase();

  if (exercise?.category === "plyometric") {
    return true;
  }

  if (exercise?.category === "basketball-skill") {
    return (
      text.includes("max") ||
      text.includes("最大") ||
      text.includes("sprint") ||
      text.includes("冲刺") ||
      text.includes("deceleration") ||
      text.includes("急停") ||
      text.includes("jump") ||
      text.includes("跳")
    );
  }

  return false;
}

function withNote(day: TrainingDay, adjustment: DailyTrainingAdjustment): TrainingDay {
  const next = cloneDay(day);
  return {
    ...next,
    readinessRule: adjustment.headline,
    blocks: [...next.blocks, buildNoteBlock(adjustment)]
  };
}

function applyReduceImpact(day: TrainingDay, adjustment: DailyTrainingAdjustment): TrainingDay {
  const next = cloneDay(day);
  const volumeNote = adjustment.reduceVolumePercent
    ? `Readiness 调整：总量减少约 ${adjustment.reduceVolumePercent}%，取消最大努力。`
    : "Readiness 调整：降低冲击和最大努力。";

  return {
    ...next,
    readinessRule: adjustment.headline,
    blocks: [
      ...next.blocks.map((block) => {
        if (block.type === "warmup" || block.type === "activeRecovery" || block.type === "eveningRecovery") {
          return block;
        }

        return {
          ...block,
          items: block.items
            .filter((item) => {
              if (!adjustment.allowPogo && item.exerciseId === "low-pogo") {
                return false;
              }

              if (!adjustment.allowMaxJump && isHighImpactExercise(item.exerciseId, item.notes)) {
                return false;
              }

              return !isPAPOrSprintLike(item);
            })
            .map((item) =>
              isHighImpactExercise(item.exerciseId, item.notes)
                ? annotateItem(item, volumeNote)
                : annotateItem(item, adjustment.intensityCap ? `强度封顶 ${adjustment.intensityCap}。` : volumeNote)
            )
        };
      }),
      buildNoteBlock(adjustment)
    ]
  };
}

function applyStrengthOnly(day: TrainingDay, adjustment: DailyTrainingAdjustment): TrainingDay {
  const next = cloneDay(day);

  return {
    ...next,
    readinessRule: adjustment.headline,
    blocks: [
      ...next.blocks.map((block) => {
        if (block.type === "warmup" || block.type === "activeRecovery" || block.type === "eveningRecovery") {
          return block;
        }

        return {
          ...block,
          title: `${block.title}（力量降级）`,
          items: block.items
            .filter((item) => {
              if (isPAPOrSprintLike(item) || isHighImpactExercise(item.exerciseId, item.notes)) {
                return false;
              }

              const exercise = getExerciseById(item.exerciseId);
              return (
                controlledStrengthIds.has(item.exerciseId) ||
                exercise?.category === "strength" ||
                exercise?.category === "knee-tendon" ||
                exercise?.category === "isometric" ||
                exercise?.category === "core" ||
                exercise?.category === "upper-body"
              );
            })
            .map((item) => annotateItem(item, `Readiness 调整：保持受控速度，强度封顶 ${adjustment.intensityCap ?? "RPE 7"}。`))
        };
      }),
      buildNoteBlock(adjustment)
    ]
  };
}

function recoveryMainBlock(adjustment: DailyTrainingAdjustment): TrainingBlock {
  const patellarCaution = adjustment.cautionFlags.some((flag) => flag.includes("髌腱"));
  const achillesCaution = adjustment.cautionFlags.some((flag) => flag.includes("跟腱"));
  const items: TrainingItem[] = [
    { exerciseId: "easy-walk", duration: "10–20 分钟", intensity: "low", notes: "保持能完整说话。" },
    { exerciseId: "easy-bike", duration: "10–20 分钟", intensity: "low", notes: "可替代步行或作为 Zone 2。" },
    ...(patellarCaution
      ? []
      : [
          {
            exerciseId: "spanish-squat-isometric",
            sets: 2,
            duration: "20–30 秒",
            intensity: "low" as const,
            notes: "仅在疼痛不超过 3/10 时做。"
          }
        ]),
    ...(achillesCaution
      ? []
      : [
          {
            exerciseId: "calf-isometric-hold",
            sets: 2,
            duration: "20–30 秒",
            intensity: "low" as const,
            notes: "仅在跟腱没有尖锐痛、疼痛不超过 3/10 时做。"
          }
        ]),
    {
      exerciseId: "split-squat-isometric",
      sets: 1,
      duration: "20 秒/侧",
      side: "each",
      intensity: "low",
      notes: "可选；只做无痛、浅幅、稳定版本。"
    },
    { exerciseId: "foot-ball-release", duration: "1 分钟/侧", intensity: "low" },
    { exerciseId: "legs-up-breathing", duration: "4–6 分钟", intensity: "low" }
  ];

  return {
    type: "main",
    title: "主训练（恢复替代）",
    items
  };
}

function applyRecoveryOnly(day: TrainingDay, adjustment: DailyTrainingAdjustment): TrainingDay {
  const next = cloneDay(day);
  const keptBlocks = next.blocks.filter((block) => block.type !== "main");

  return {
    ...next,
    readinessRule: adjustment.headline,
    blocks: [...keptBlocks.slice(0, 1), recoveryMainBlock(adjustment), ...keptBlocks.slice(1), buildNoteBlock(adjustment)]
  };
}

function applyTestNotRecommended(day: TrainingDay, adjustment: DailyTrainingAdjustment): TrainingDay {
  const next = cloneDay(day);
  const testReplacementItems: TrainingItem[] = [
    {
      exerciseId: "cmj",
      sets: 3,
      reps: "1–2 次",
      intensity: "medium",
      rest: "90 秒",
      notes: "70–85% 技术跳，不做正式测试。"
    },
    {
      exerciseId: "approach-jump",
      sets: 2,
      reps: "1 次",
      intensity: "medium",
      rest: "90 秒",
      notes: "只练节奏和落地，不追高度。"
    },
    { exerciseId: "easy-walk", duration: "10 分钟", intensity: "low" }
  ];

  return {
    ...next,
    readinessRule: adjustment.headline,
    blocks: [
      ...next.blocks.map((block) => {
        if (block.type !== "main") {
          return block;
        }

        return {
          ...block,
          title: "主训练（测试降级）",
          items: testReplacementItems
        };
      }),
      buildNoteBlock(adjustment)
    ]
  };
}

export function applyAdjustmentToDay(
  day: TrainingDay,
  adjustment: DailyTrainingAdjustment
): TrainingDay {
  switch (adjustment.adjustmentType) {
    case "optional-upgrade":
    case "train-as-planned":
      return withNote(day, adjustment);
    case "reduce-impact":
      return applyReduceImpact(day, adjustment);
    case "strength-only":
      return applyStrengthOnly(day, adjustment);
    case "recovery-only":
      return applyRecoveryOnly(day, adjustment);
    case "test-not-recommended":
      return applyTestNotRecommended(day, adjustment);
    default:
      return withNote(day, adjustment);
  }
}

export function applyDay11PapDowngrade(day: TrainingDay, reason: string): TrainingDay {
  if (day.day !== 11) {
    return cloneDay(day);
  }

  const next = cloneDay(day);
  return {
    ...next,
    plannedJumpContacts: { min: 6, max: 10 },
    maxIntentJumpContacts: { min: 0, max: 0 },
    readinessRule: `PAP 已自动降级：${reason}`,
    blocks: next.blocks.map((block) => {
      if (block.type === "warmup") {
        return {
          ...block,
          items: block.items.filter((item) => item.exerciseId !== "low-pogo")
        };
      }

      if (block.type !== "main") {
        return block;
      }

      return {
        ...block,
        title: "主训练（PAP 自动降级）",
        items: [
          {
            exerciseId: "cmj",
            sets: 3,
            reps: "2 次",
            intensity: "medium",
            rest: "90–120 秒",
            notes: "70–85% 技术跳，不做最大努力；与助跑跳二选一。",
            jumpContacts: { min: 6, max: 6 }
          },
          {
            exerciseId: "approach-jump",
            sets: 2,
            reps: "2 次",
            intensity: "medium",
            rest: "90–120 秒",
            optional: true,
            notes: "可替代 CMJ；只练节奏，总接触不超过 10 次。",
            jumpContacts: { min: 0, max: 4 }
          }
        ]
      };
    })
  };
}
