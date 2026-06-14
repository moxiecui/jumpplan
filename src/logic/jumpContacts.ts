import type {
  BasketballSessionLog,
  JumpContactSummary,
  TrainingDay,
  TrainingItem
} from "@/types/training";

export function getPlannedItemContacts(item: TrainingItem) {
  return item.jumpContacts
    ? {
        min: item.jumpContacts.min,
        max: item.jumpContacts.max,
        estimated: Boolean(item.jumpContacts.estimated)
      }
    : undefined;
}

export function getPlannedDayContacts(day: TrainingDay) {
  if (day.plannedJumpContacts) {
    return day.plannedJumpContacts;
  }

  return day.blocks
    .flatMap((block) => block.items)
    .reduce(
      (summary, item) => ({
        min: summary.min + (item.jumpContacts?.min ?? 0),
        max: summary.max + (item.jumpContacts?.max ?? 0)
      }),
      { min: 0, max: 0 }
    );
}

export function buildRollingSevenDaySummaries(
  plan: TrainingDay[],
  basketballLogs: BasketballSessionLog[] = []
) {
  return plan.slice(0, Math.max(0, plan.length - 6)).map((_, startIndex) => {
    const days = plan.slice(startIndex, startIndex + 7);
    const contacts = days.reduce(
      (total, day) => {
        const dayContacts = getPlannedDayContacts(day);
        return {
          min: total.min + dayContacts.min,
          max: total.max + dayContacts.max
        };
      },
      { min: 0, max: 0 }
    );

    return {
      startDay: days[0].day,
      endDay: days[6].day,
      plannedGymContacts: contacts,
      highImpactDays: days.filter((day) => day.impactLevel === "high").length,
      maxIntentContacts: days.reduce(
        (total, day) => total + (day.maxIntentJumpContacts?.max ?? 0),
        0
      ),
      estimatedBasketballContacts: basketballLogs.reduce(
        (total, log) => total + (log.estimatedJumpContacts ?? 0),
        0
      )
    };
  });
}

export function emptyJumpContactSummary(day: TrainingDay): JumpContactSummary {
  const planned = getPlannedDayContacts(day);
  return {
    plannedContacts: planned.max,
    completedContacts: 0,
    maxIntentContacts: day.maxIntentJumpContacts?.max ?? 0,
    landingOnlyContacts: 0
  };
}
