import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import type { TrainingItemCompletionStatus } from "@/types/training";

export interface TrainingLogEntry {
  id: string;
  exerciseId: string;
  exerciseName: string;
  status: Exclude<TrainingItemCompletionStatus, "not-started">;
  dayLabel?: string;
  blockTitle?: string;
  reasons?: string[];
  note?: string;
  updatedAt: string;
}

export interface TrainingDayCompletionEntry {
  id: string;
  dayLabel: string;
  dayTitle: string;
  totalCount: number;
  completedCount: number;
  regressedCount: number;
  skippedCount: number;
  unloggedCount: number;
  note?: string;
  completedAt: string;
}

interface TrainingLogContextValue {
  entries: TrainingLogEntry[];
  dayCompletions: TrainingDayCompletionEntry[];
  getTrainingLogEntry: (id: string) => TrainingLogEntry | undefined;
  upsertTrainingLogEntry: (entry: Omit<TrainingLogEntry, "updatedAt">) => void;
  clearTrainingLogEntry: (id: string) => void;
  getDayCompletion: (id: string) => TrainingDayCompletionEntry | undefined;
  completeTrainingDay: (entry: Omit<TrainingDayCompletionEntry, "completedAt">) => void;
  clearDayCompletion: (id: string) => void;
}

const TrainingLogContext = createContext<TrainingLogContextValue | undefined>(undefined);

export function TrainingLogProvider({ children }: { children: ReactNode }) {
  const [entryMap, setEntryMap] = useState<Record<string, TrainingLogEntry>>({});
  const [dayCompletionMap, setDayCompletionMap] = useState<Record<string, TrainingDayCompletionEntry>>({});

  const value = useMemo<TrainingLogContextValue>(
    () => ({
      entries: Object.values(entryMap).sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      ),
      dayCompletions: Object.values(dayCompletionMap).sort(
        (left, right) => new Date(right.completedAt).getTime() - new Date(left.completedAt).getTime()
      ),
      getTrainingLogEntry: (id) => entryMap[id],
      upsertTrainingLogEntry: (entry) => {
        setEntryMap((current) => ({
          ...current,
          [entry.id]: {
            ...entry,
            updatedAt: new Date().toISOString()
          }
        }));
      },
      clearTrainingLogEntry: (id) => {
        setEntryMap((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
      },
      getDayCompletion: (id) => dayCompletionMap[id],
      completeTrainingDay: (entry) => {
        setDayCompletionMap((current) => ({
          ...current,
          [entry.id]: {
            ...entry,
            completedAt: new Date().toISOString()
          }
        }));
      },
      clearDayCompletion: (id) => {
        setDayCompletionMap((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
      }
    }),
    [dayCompletionMap, entryMap]
  );

  return <TrainingLogContext.Provider value={value}>{children}</TrainingLogContext.Provider>;
}

export function useTrainingLog() {
  const context = useContext(TrainingLogContext);

  if (!context) {
    throw new Error("useTrainingLog must be used inside TrainingLogProvider");
  }

  return context;
}
