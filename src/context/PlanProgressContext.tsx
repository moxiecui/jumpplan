import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { getPlanDayNumberForDate, getTodayTrainingDay, PLAN_LENGTH_DAYS } from "@/logic/schedule";
import type { TrainingDay } from "@/types/training";

const STORAGE_KEY = "jumpplan-day-offset";

interface PlanProgressContextValue {
  dayOffset: number;
  calendarDayNumber: number;
  currentDayNumber: number;
  currentDay: TrainingDay;
  isAdjusted: boolean;
  canSkipToday: boolean;
  canGoBackOneDay: boolean;
  skipToday: () => void;
  goBackOneDay: () => void;
  resetToCalendarDay: () => void;
}

function readStoredOffset() {
  if (typeof window === "undefined" || !window.localStorage) {
    return 0;
  }

  const value = Number(window.localStorage.getItem(STORAGE_KEY));
  return Number.isFinite(value) ? value : 0;
}

function writeStoredOffset(offset: number) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, String(offset));
}

function clampOffset(offset: number, calendarDayNumber: number) {
  const minOffset = 1 - calendarDayNumber;
  const maxOffset = PLAN_LENGTH_DAYS - calendarDayNumber;
  return Math.min(Math.max(offset, minOffset), maxOffset);
}

const PlanProgressContext = createContext<PlanProgressContextValue | undefined>(undefined);

export function PlanProgressProvider({ children }: { children: ReactNode }) {
  const calendarDayNumber = getPlanDayNumberForDate();
  const [dayOffset, setDayOffset] = useState(() =>
    clampOffset(readStoredOffset(), calendarDayNumber)
  );
  const safeDayOffset = clampOffset(dayOffset, calendarDayNumber);

  useEffect(() => {
    writeStoredOffset(safeDayOffset);
  }, [safeDayOffset]);

  const currentDayNumber = getPlanDayNumberForDate(new Date(), safeDayOffset);
  const currentDay = getTodayTrainingDay(new Date(), safeDayOffset);

  const value = useMemo<PlanProgressContextValue>(
    () => ({
      dayOffset: safeDayOffset,
      calendarDayNumber,
      currentDayNumber,
      currentDay,
      isAdjusted: safeDayOffset !== 0,
      canSkipToday: currentDayNumber < PLAN_LENGTH_DAYS,
      canGoBackOneDay: currentDayNumber > 1,
      skipToday: () => {
        setDayOffset(clampOffset(safeDayOffset + 1, calendarDayNumber));
      },
      goBackOneDay: () => {
        setDayOffset(clampOffset(safeDayOffset - 1, calendarDayNumber));
      },
      resetToCalendarDay: () => {
        setDayOffset(0);
      }
    }),
    [calendarDayNumber, currentDay, currentDayNumber, safeDayOffset]
  );

  return <PlanProgressContext.Provider value={value}>{children}</PlanProgressContext.Provider>;
}

export function usePlanProgress() {
  const context = useContext(PlanProgressContext);

  if (!context) {
    throw new Error("usePlanProgress must be used inside PlanProgressProvider");
  }

  return context;
}
