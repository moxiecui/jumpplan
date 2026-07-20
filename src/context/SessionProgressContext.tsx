import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { ADAPTIVE_MACROCYCLE_START_DATE, getAdaptiveBlock, getSessionUnit } from "@/data/adaptiveProgram";
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
}

const SessionProgressContext = createContext<SessionProgressContextValue | undefined>(undefined);

function daysSinceStart() {
  const start = new Date(`${ADAPTIVE_MACROCYCLE_START_DATE}T00:00:00`);
  const now = new Date();
  const current = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.floor((current.getTime() - start.getTime()) / 86400000));
}

export function SessionProgressProvider({ children }: { children: ReactNode }) {
  const [completedSessionUnits, setCompletedSessionUnits] = useState<CompletedSessionUnitEntry[]>([]);
  const [jumpReadinessEntries, setJumpReadinessEntries] = useState<
    { test: JumpReadinessTest; result: JumpReadinessResult }[]
  >([]);
  const currentAdaptiveDay = Math.min(84, daysSinceStart() + 1);
  const currentAdaptiveWeek = Math.min(12, Math.floor((currentAdaptiveDay - 1) / 7) + 1);
  const currentBlock = Math.ceil(currentAdaptiveWeek / 3) as 1 | 2 | 3 | 4;
  const currentBlockTitle = getAdaptiveBlock(currentBlock).title;

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
      currentBlockTitle
    }),
    [completedSessionUnits, currentAdaptiveDay, currentAdaptiveWeek, currentBlock, currentBlockTitle, jumpReadinessEntries]
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
