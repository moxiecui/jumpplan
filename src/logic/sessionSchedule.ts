import {
  ADAPTIVE_MACROCYCLE_START_DATE,
  ADAPTIVE_PLAN_VERSION,
  getPreferredSessionUnit,
  getSessionUnit,
  scheduledSessionAssignments
} from "@/data/adaptiveProgram";
import type { ResolvedTrainingSession } from "@/types/training";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const ADAPTIVE_PLAN_VERSION_STORAGE_KEY = "jumpplan-adaptive-plan-version";
const legacyPlanKeys = ["jumpplan-day-offset-2026-06-28"];

function startDate() {
  return new Date(`${ADAPTIVE_MACROCYCLE_START_DATE}T00:00:00`);
}

export function getAdaptiveMacrocycleDayForDate(date = new Date(), dayOffset = 0) {
  const start = startDate();
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diff = Math.floor((current.getTime() - start.getTime()) / MS_PER_DAY);
  return Math.min(Math.max(diff + dayOffset + 1, 1), 84);
}

export function getAdaptiveDateForMacrocycleDay(macrocycleDay: number) {
  const start = startDate();
  const date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  date.setDate(date.getDate() + Math.max(0, macrocycleDay - 1));
  return date.toISOString().slice(0, 10);
}

function readPlanVersion() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "server";
  }

  return window.localStorage.getItem(ADAPTIVE_PLAN_VERSION_STORAGE_KEY) ?? "unmigrated";
}

function hasLegacyOverrideKey() {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }

  return legacyPlanKeys.some((key) => window.localStorage.getItem(key) !== null);
}

export function markAdaptivePlanVersionMigrated() {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(ADAPTIVE_PLAN_VERSION_STORAGE_KEY, ADAPTIVE_PLAN_VERSION);
}

export function resolveTrainingSessionForDate(date = new Date(), dayOffset = 0): ResolvedTrainingSession {
  const macrocycleDay = getAdaptiveMacrocycleDayForDate(date, dayOffset);
  const weekNumber = Math.min(12, Math.floor((macrocycleDay - 1) / 7) + 1);
  const blockNumber = Math.ceil(weekNumber / 3) as 1 | 2 | 3 | 4;
  const assignment = scheduledSessionAssignments.find((entry) => entry.macrocycleDay === macrocycleDay);
  const generatedSession = assignment ? getSessionUnit(assignment.sessionUnitId) : undefined;
  const fallbackSession = getPreferredSessionUnit("recovery", blockNumber);
  const session = generatedSession ?? fallbackSession;

  if (!session) {
    throw new Error("No adaptive training session is available.");
  }

  return {
    date: date.toISOString().slice(0, 10),
    macrocycleDay,
    weekNumber,
    blockNumber,
    session,
    source: generatedSession ? "generated" : "fallback",
    localStoragePlanVersion: readPlanVersion(),
    fallbackUsed: !generatedSession,
    legacyOverrideDetected: hasLegacyOverrideKey()
  };
}
