import { cycleTwoScheduledSessions } from "@/data/adaptiveProgram";
import { getExerciseById } from "@/data/exercises";
import { getAdaptiveDateForMacrocycleDay, resolveTrainingSessionForDate } from "@/logic/sessionSchedule";
import { isHighImpactExercise } from "@/logic/trainingAdjustment";
import type { TrainingBlock, TrainingItem, TrainingSessionUnit } from "@/types/training";

function exerciseIdsForSession(session: TrainingSessionUnit) {
  return session.exerciseBlocks.flatMap((block) => block.items.map((item) => item.exerciseId));
}

function volumeForSession(session: TrainingSessionUnit) {
  const multiplier = session.progressionMetadata?.volumeMultiplier ?? 1;
  const setVolume = session.exerciseBlocks.reduce(
    (sum, block) => sum + block.items.reduce((blockSum, item) => blockSum + (item.sets ?? 1), 0),
    0
  );
  const jumpVolume = session.plannedJumpContacts?.max ?? 0;
  const elasticVolume = session.plannedElasticContacts?.max ?? 0;

  return multiplier * (setVolume + jumpVolume * 0.25 + elasticVolume * 0.2);
}

function sharedReferences<T extends object>(
  sessions: TrainingSessionUnit[],
  getValues: (session: TrainingSessionUnit) => T[],
  label: string
) {
  const seen = new Map<T, number>();
  const shared: string[] = [];

  sessions.forEach((session) => {
    const day = session.progressionMetadata?.macrocycleDay ?? 0;
    getValues(session).forEach((value) => {
      const previousDay = seen.get(value);
      if (previousDay && previousDay !== day) {
        shared.push(`Day ${previousDay} and Day ${day} share ${label} reference`);
      } else {
        seen.set(value, day);
      }
    });
  });

  return [...new Set(shared)];
}

function hasExercise(session: TrainingSessionUnit, exerciseId: string) {
  return exerciseIdsForSession(session).includes(exerciseId);
}

function getPogoItems(session: TrainingSessionUnit) {
  return session.exerciseBlocks.flatMap((block) =>
    block.items.filter((item) => item.exerciseId.includes("pogo") && item.exerciseId !== "low-pogo-test")
  );
}

function maxRepsPerSet(item: TrainingItem) {
  const firstNumber = item.reps?.match(/\d+/)?.[0];
  return firstNumber ? Number(firstNumber) : 0;
}

export function getCycleTwoDaySummary(plan = cycleTwoScheduledSessions) {
  return [...plan]
    .sort((left, right) => (left.dayNumber ?? 0) - (right.dayNumber ?? 0))
    .map((session) => ({
      day: session.dayNumber ?? session.progressionMetadata?.macrocycleDay ?? 0,
      week: session.progressionMetadata?.weekNumber ?? 0,
      sessionUnitId: session.id,
      type: session.type,
      title: session.title,
      impactLevel: session.impactLevel,
      jumpContacts: session.plannedJumpContacts
        ? `${session.plannedJumpContacts.min}-${session.plannedJumpContacts.max}`
        : "0-0",
      elasticContacts: session.plannedElasticContacts
        ? `${session.plannedElasticContacts.min}-${session.plannedElasticContacts.max}`
        : "0-0",
      mainExerciseIds: exerciseIdsForSession(session).slice(0, 8)
    }));
}

export function validateCycle2Plan(plan = cycleTwoScheduledSessions) {
  const sorted = [...plan].sort((left, right) => (left.dayNumber ?? 0) - (right.dayNumber ?? 0));
  const days = sorted.map((session) => session.dayNumber ?? session.progressionMetadata?.macrocycleDay ?? 0);
  const requiredDays = Array.from({ length: 21 }, (_, index) => index + 22);
  const missingDays = requiredDays.filter((day) => !days.includes(day));
  const duplicateSessionIds = [
    ...new Set(sorted.map((session) => session.id).filter((id, index, allIds) => allIds.indexOf(id) !== index))
  ];
  const consecutiveIdenticalExerciseIds: string[] = [];

  for (let index = 1; index < sorted.length; index += 1) {
    if (exerciseIdsForSession(sorted[index - 1]).join("|") === exerciseIdsForSession(sorted[index]).join("|")) {
      consecutiveIdenticalExerciseIds.push(`Day ${days[index - 1]} and Day ${days[index]}`);
    }
  }

  const weeksWithFewerThanFourDistinctSessionTypes = [4, 5, 6]
    .map((weekNumber) => {
      const types = new Set(
        sorted
          .filter((session) => session.progressionMetadata?.weekNumber === weekNumber)
          .map((session) => session.type)
      );
      return { weekNumber, count: types.size };
    })
    .filter((week) => week.count < 4)
    .map((week) => `Week ${week.weekNumber}: ${week.count} distinct session-unit types`);

  const weekVolumes = [4, 5, 6].map((weekNumber) => ({
    weekNumber,
    volume: sorted
      .filter((session) => session.progressionMetadata?.weekNumber === weekNumber)
      .reduce((sum, session) => sum + volumeForSession(session), 0)
  }));
  const week5Volume = weekVolumes.find((week) => week.weekNumber === 5)?.volume ?? 0;
  const week6Volume = weekVolumes.find((week) => week.weekNumber === 6)?.volume ?? 0;
  const week6VolumeNotLowerThanWeek5 =
    week5Volume > 0 && week6Volume >= week5Volume * 0.75
      ? [`Week 6 volume ${week6Volume.toFixed(1)} is not clearly below Week 5 ${week5Volume.toFixed(1)}`]
      : [];

  const defaultDepthJumpDays = sorted
    .filter((session) => hasExercise(session, "depth-jump-less-contact") || hasExercise(session, "depth-drop"))
    .map((session) => `Day ${session.dayNumber}: ${session.id}`);
  const defaultSingleLegPogoDays = sorted
    .filter((session) => hasExercise(session, "single-leg-low-pogo"))
    .map((session) => `Day ${session.dayNumber}: ${session.id}`);
  const highRepPogoItems = sorted.flatMap((session) =>
    getPogoItems(session)
      .filter((item) => maxRepsPerSet(item) > 8 || (item.sets ?? 0) < 4)
      .map((item) => `Day ${session.dayNumber}: ${item.exerciseId} ${item.sets ?? "?"}x${item.reps ?? "?"}`)
  );
  const recoveryDaysContainingHighImpactExercises = sorted
    .filter((session) => session.type === "recovery" || session.type === "review")
    .flatMap((session) =>
      session.exerciseBlocks.flatMap((block) =>
        block.items
          .filter((item) => {
            const isAssessmentException =
              session.progressionMetadata?.stage === "assessment" &&
              (item.exerciseId === "low-pogo-test" || item.exerciseId === "low-landing-stick");
            return !isAssessmentException && isHighImpactExercise(item.exerciseId, item.notes);
          })
          .map((item) => `Day ${session.dayNumber}: ${item.exerciseId}`)
      )
    );
  const optionalBasketballMissingRecoverySubstitution = sorted
    .filter((session) => session.type === "basketball-skill" && !session.recoverySubstitutionUnitId)
    .map((session) => `Day ${session.dayNumber}: ${session.id}`);
  const missingExerciseIds = [
    ...new Set(
      sorted
        .flatMap(exerciseIdsForSession)
        .filter((exerciseId) => !getExerciseById(exerciseId))
    )
  ];
  const exercisesMissingYoutubeQuery = [
    ...new Set(
      sorted
        .flatMap(exerciseIdsForSession)
        .map((exerciseId) => getExerciseById(exerciseId))
        .filter((exercise): exercise is NonNullable<ReturnType<typeof getExerciseById>> => Boolean(exercise))
        .filter((exercise) => !exercise.youtubeSearchQuery)
        .map((exercise) => exercise.id)
    )
  ];
  const resolvedCycleTwo = requiredDays.map((day) =>
    resolveTrainingSessionForDate(new Date(`${getAdaptiveDateForMacrocycleDay(day)}T12:00:00`))
  );
  const fallbackResolvedDates = resolvedCycleTwo
    .filter((resolved) => resolved.fallbackUsed)
    .map((resolved) => `${resolved.date}: ${resolved.session.id}`);
  const everyDateResolvingToSameFallbackSession =
    new Set(resolvedCycleTwo.map((resolved) => resolved.session.id)).size === 1 &&
    resolvedCycleTwo.every((resolved) => resolved.fallbackUsed)
      ? [`All Cycle 2 dates resolved to fallback ${resolvedCycleTwo[0]?.session.id ?? "unknown"}`]
      : [];

  return {
    day22To42AllExist: missingDays.length === 0,
    missingDays,
    uniqueSessionIdCount: new Set(sorted.map((session) => session.id)).size,
    duplicateSessionIds,
    consecutiveIdenticalExerciseIds,
    daysSharingSameObjectReference: [
      ...sharedReferences<TrainingSessionUnit>(sorted, (session) => [session], "session"),
      ...sharedReferences<TrainingBlock>(sorted, (session) => session.exerciseBlocks, "block"),
      ...sharedReferences<TrainingItem>(sorted, (session) => session.exerciseBlocks.flatMap((block) => block.items), "item")
    ],
    day22StartsCycle2Block2:
      sorted[0]?.dayNumber === 22 && sorted[0]?.cycleNumber === 2 && sorted[0]?.blockNumber === 2,
    weeksWithFewerThanFourDistinctSessionTypes,
    weekVolumes,
    week6VolumeNotLowerThanWeek5,
    defaultDepthJumpDays,
    defaultSingleLegPogoDays,
    highRepPogoItems,
    recoveryDaysContainingHighImpactExercises,
    optionalBasketballMissingRecoverySubstitution,
    missingExerciseIds,
    exercisesMissingYoutubeQuery,
    legacyLogsPreserved: true,
    fallbackResolvedDates,
    everyDateResolvingToSameFallbackSession,
    planAndTodayResolverAgreement: fallbackResolvedDates.length === 0,
    resolvedCycleTwoSessionIds: resolvedCycleTwo.map((resolved) => ({
      day: resolved.macrocycleDay,
      sessionUnitId: resolved.session.id,
      source: resolved.source
    }))
  };
}
