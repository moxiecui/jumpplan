import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { getAdaptiveBlock, getSessionUnit } from "@/data/adaptiveProgram";
import { usePlanProgress } from "@/context/PlanProgressContext";
import { markAdaptivePlanVersionMigrated, resolveTrainingSessionForDate } from "@/logic/sessionSchedule";
import type { JumpReadinessResult, JumpReadinessTest, TrainingSessionUnit } from "@/types/training";

export interface CompletedSessionUnitEntry {
  id: string;
  sessionUnitId: string;
  sessionTitle: string;
  sessionType: TrainingSessionUnit["type"];
  blockNumber: 1 | 2 | 3 | 4;
  completedAt: string;
  note?: string;
}

interface SessionProgressContextValue {
  completedSessionUnits: CompletedSessionUnitEntry[];
  jumpReadinessTests: JumpReadinessTest[];
  getCompletedSessionUnitIdsLast14Days: () => string[];
  completeSessionUnit: (sessionUnitId: string, note?: string) => void;
  saveJumpReadinessTest: (test: JumpReadinessTest, result: JumpReadinessResult) => void;
  latestJumpReadinessResult?: JumpReadinessResult;
  latestJumpReadinessTest?: JumpReadinessTest;
  currentAdaptiveDay: number;
  currentAdaptiveWeek: number;
  currentBlock: 1 | 2 | 3 | 4;
  currentBlockTitle: string;
  localStoragePlanVersion: string;
  legacyOverrideDetected: boolean;
}

const SessionProgressContext = createContext<SessionProgressContextValue | undefined>(undefined);

export function SessionProgressProvider({ children }: { children: ReactNode }) {
  const { dayOffset } = usePlanProgress();
  const [completedSessionUnits, setCompletedSessionUnits] = useState<CompletedSessionUnitEntry[]>([]);
  const [jumpReadinessEntries, setJumpReadinessEntries] = useState<
    { test: JumpReadinessTest; result: JumpReadinessResult }[]
  >([]);
  const resolvedToday = resolveTrainingSessionForDate(new Date(), dayOffset);
  const currentAdaptiveDay = resolvedToday.macrocycleDay;
  const currentAdaptiveWeek = resolvedToday.weekNumber;
  const currentBlock = resolvedToday.blockNumber;
  const currentBlockTitle = getAdaptiveBlock(currentBlock).title;

  useEffect(() => {
    markAdaptivePlanVersionMigrated();
  }, []);

  const value = useMemo<SessionProgressContextValue>(
    () => ({
      completedSessionUnits,
      jumpReadinessTests: jumpReadinessEntries.map((entry) => entry.test),
      getCompletedSessionUnitIdsLast14Days: () => {
        const cutoff = Date.now() - 14 * 86400000;
        return completedSessionUnits
          .filter((entry) => new Date(entry.completedAt).getTime() >= cutoff)
          .map((entry) => entry.sessionUnitId);
      },
      completeSessionUnit: (sessionUnitId, note) => {
        const unit = getSessionUnit(sessionUnitId);
        if (!unit) {
          return;
        }

        setCompletedSessionUnits((current) => [
          {
            id: `${sessionUnitId}-${new Date().toISOString()}`,
            sessionUnitId,
            sessionTitle: unit.title,
            sessionType: unit.type,
            blockNumber: unit.blockNumber,
            completedAt: new Date().toISOString(),
            note
          },
          ...current
        ]);
      },
      saveJumpReadinessTest: (test, result) => {
        setJumpReadinessEntries((current) => [{ test, result }, ...current.filter((entry) => entry.test.date !== test.date)]);
      },
      latestJumpReadinessResult: jumpReadinessEntries[0]?.result,
      latestJumpReadinessTest: jumpReadinessEntries[0]?.test,
      currentAdaptiveDay,
      currentAdaptiveWeek,
      currentBlock,
      currentBlockTitle,
      localStoragePlanVersion: resolvedToday.localStoragePlanVersion,
      legacyOverrideDetected: resolvedToday.legacyOverrideDetected
    }),
    [
      completedSessionUnits,
      currentAdaptiveDay,
      currentAdaptiveWeek,
      currentBlock,
      currentBlockTitle,
      jumpReadinessEntries,
      resolvedToday.legacyOverrideDetected,
      resolvedToday.localStoragePlanVersion
    ]
  );

  return <SessionProgressContext.Provider value={value}>{children}</SessionProgressContext.Provider>;
}

export function useSessionProgress() {
  const context = useContext(SessionProgressContext);

  if (!context) {
    throw new Error("useSessionProgress must be used inside SessionProgressProvider");
  }

  return context;
}
