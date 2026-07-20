import { cycleOneScheduledSessions } from "@/data/adaptiveProgram";
import { isHighImpactExercise } from "@/logic/trainingAdjustment";
import { getAdaptiveDateForMacrocycleDay, resolveTrainingSessionForDate } from "@/logic/sessionSchedule";
import type { TrainingSessionUnit } from "@/types/training";

function exerciseIdsForSession(session: TrainingSessionUnit) {
  return session.exerciseBlocks.flatMap((block) => block.items.map((item) => item.exerciseId));
}

function volumeForSession(session: TrainingSessionUnit) {
  const metadataVolume = session.progressionMetadata?.volumeMultiplier ?? 1;
  const contactVolume = session.plannedJumpContacts?.max ?? 0;
  const setVolume = session.exerciseBlocks.reduce(
    (sum, block) => sum + block.items.reduce((blockSum, item) => blockSum + (item.sets ?? 1), 0),
    0
  );

  return metadataVolume * (setVolume + contactVolume * 0.25);
}

function sharedReferenceDays<T extends object>(
  valuesByDay: { day: number; values: T[] }[],
  label: string
) {
  const seen = new Map<T, number>();
  const shared: string[] = [];

  for (const entry of valuesByDay) {
    for (const value of entry.values) {
      const previousDay = seen.get(value);
      if (previousDay && previousDay !== entry.day) {
        shared.push(`Day ${previousDay} and Day ${entry.day} share ${label} reference`);
      } else {
        seen.set(value, entry.day);
      }
    }
  }

  return [...new Set(shared)];
}

export function getCycleOneDaySummary() {
  return cycleOneScheduledSessions.map((session) => ({
    day: session.progressionMetadata?.macrocycleDay ?? 0,
    week: session.progressionMetadata?.weekNumber ?? 0,
    sessionUnitId: session.id,
    type: session.type,
    title: session.title,
    impactLevel: session.impactLevel,
    plannedIntensity: session.plannedIntensity,
    jumpContacts: session.plannedJumpContacts
      ? `${session.plannedJumpContacts.min}-${session.plannedJumpContacts.max}`
      : "0-0",
    mainExerciseIds: exerciseIdsForSession(session).slice(0, 8)
  }));
}

export function validateCycleVariation(plan = cycleOneScheduledSessions) {
  const sorted = [...plan].sort(
    (left, right) =>
      (left.progressionMetadata?.macrocycleDay ?? 0) - (right.progressionMetadata?.macrocycleDay ?? 0)
  );
  const consecutiveIdenticalExerciseIds: string[] = [];
  const duplicateSessionIds = [...new Set(
    sorted
      .map((session) => session.id)
      .filter((id, index, allIds) => allIds.indexOf(id) !== index)
  )];
  const sessionObjectReferences = sharedReferenceDays(
    sorted.map((session) => ({
      day: session.progressionMetadata?.macrocycleDay ?? 0,
      values: [session]
    })),
    "session"
  );
  const blockObjectReferences = sharedReferenceDays(
    sorted.map((session) => ({
      day: session.progressionMetadata?.macrocycleDay ?? 0,
      values: session.exerciseBlocks
    })),
    "block"
  );
  const itemObjectReferences = sharedReferenceDays(
    sorted.map((session) => ({
      day: session.progressionMetadata?.macrocycleDay ?? 0,
      values: session.exerciseBlocks.flatMap((block) => block.items)
    })),
    "item"
  );

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];
    const previousIds = exerciseIdsForSession(previous).join("|");
    const currentIds = exerciseIdsForSession(current).join("|");

    if (previousIds === currentIds) {
      consecutiveIdenticalExerciseIds.push(
        `Day ${previous.progressionMetadata?.macrocycleDay ?? "?"} and Day ${current.progressionMetadata?.macrocycleDay ?? "?"}`
      );
    }
  }

  const weeksWithFewerThanThreeDistinctSessionTypes = [1, 2, 3]
    .map((weekNumber) => {
      const types = new Set(
        sorted
          .filter((session) => session.progressionMetadata?.weekNumber === weekNumber)
          .map((session) => session.type)
      );
      return { weekNumber, count: types.size };
    })
    .filter((week) => week.count < 3)
    .map((week) => `Week ${week.weekNumber}: ${week.count} distinct session-unit types`);

  const recoveryDaysContainingHighImpactExercises = sorted
    .filter((session) => session.type === "recovery" || session.type === "review")
    .flatMap((session) =>
      session.exerciseBlocks.flatMap((block) =>
        block.items
          .filter((item) => isHighImpactExercise(item.exerciseId, item.notes))
          .map((item) => `Day ${session.progressionMetadata?.macrocycleDay ?? "?"}: ${item.exerciseId}`)
      )
    );

  const weekVolumes = [1, 2, 3].map((weekNumber) => ({
    weekNumber,
    volume: sorted
      .filter((session) => session.progressionMetadata?.weekNumber === weekNumber)
      .reduce((sum, session) => sum + volumeForSession(session), 0)
  }));
  const week2Volume = weekVolumes.find((week) => week.weekNumber === 2)?.volume ?? 0;
  const week3Volume = weekVolumes.find((week) => week.weekNumber === 3)?.volume ?? 0;
  const deloadWeekVolumeNotLowerThanWeekTwo =
    week2Volume > 0 && week3Volume > week2Volume * 0.75
      ? [`Week 3 volume ${week3Volume.toFixed(1)} is not at least 25% below Week 2 ${week2Volume.toFixed(1)}`]
      : [];

  const resolvedCycleOne = Array.from({ length: 21 }, (_, index) => {
    const macrocycleDay = index + 1;
    return resolveTrainingSessionForDate(new Date(`${getAdaptiveDateForMacrocycleDay(macrocycleDay)}T12:00:00`));
  });
  const resolvedIds = new Set(resolvedCycleOne.map((resolved) => resolved.session.id));
  const fallbackResolvedDates = resolvedCycleOne
    .filter((resolved) => resolved.fallbackUsed)
    .map((resolved) => `${resolved.date}: ${resolved.session.id}`);
  const everyDateResolvingToSameFallbackSession =
    resolvedIds.size === 1 && resolvedCycleOne.every((resolved) => resolved.fallbackUsed)
      ? [`All Cycle 1 dates resolved to fallback ${resolvedCycleOne[0]?.session.id ?? "unknown"}`]
      : [];

  return {
    consecutiveIdenticalExerciseIds,
    daysSharingSameObjectReference: [
      ...sessionObjectReferences,
      ...blockObjectReferences,
      ...itemObjectReferences
    ],
    duplicateSessionIds,
    weeksWithFewerThanThreeDistinctSessionTypes,
    recoveryDaysContainingHighImpactExercises,
    weekVolumes,
    deloadWeekVolumeNotLowerThanWeekTwo,
    everyDateResolvingToSameFallbackSession,
    fallbackResolvedDates,
    savedLegacyPlanOverridingGeneratedCycleOne: [],
    distinctSessionUnitTypes: [...new Set(sorted.map((session) => session.type))],
    resolvedCycleOneSessionIds: resolvedCycleOne.map((resolved) => ({
      day: resolved.macrocycleDay,
      sessionUnitId: resolved.session.id,
      source: resolved.source
    }))
  };
}
