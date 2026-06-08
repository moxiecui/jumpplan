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

interface TrainingLogContextValue {
  entries: TrainingLogEntry[];
  getTrainingLogEntry: (id: string) => TrainingLogEntry | undefined;
  upsertTrainingLogEntry: (entry: Omit<TrainingLogEntry, "updatedAt">) => void;
  clearTrainingLogEntry: (id: string) => void;
}

const TrainingLogContext = createContext<TrainingLogContextValue | undefined>(undefined);

export function TrainingLogProvider({ children }: { children: ReactNode }) {
  const [entryMap, setEntryMap] = useState<Record<string, TrainingLogEntry>>({});

  const value = useMemo<TrainingLogContextValue>(
    () => ({
      entries: Object.values(entryMap).sort(
        (left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
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
      }
    }),
    [entryMap]
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
