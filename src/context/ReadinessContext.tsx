import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type {
  DailyTrainingAdjustment,
  OuraDailyReadinessInput,
  SubjectiveReadinessInput
} from "@/types/training";

export interface ReadinessEntry {
  date: string;
  oura?: OuraDailyReadinessInput;
  subjective?: SubjectiveReadinessInput;
  baseline?: {
    restingHeartRate?: number;
    hrv?: number;
  };
  adjustment: DailyTrainingAdjustment;
}

interface ReadinessContextValue {
  entriesByDate: Record<string, ReadinessEntry>;
  saveReadinessEntry: (entry: ReadinessEntry) => void;
  getReadinessEntry: (date: string) => ReadinessEntry | undefined;
}

const ReadinessContext = createContext<ReadinessContextValue | undefined>(undefined);

export function ReadinessProvider({ children }: { children: ReactNode }) {
  const [entriesByDate, setEntriesByDate] = useState<Record<string, ReadinessEntry>>({});

  const value = useMemo<ReadinessContextValue>(
    () => ({
      entriesByDate,
      saveReadinessEntry: (entry) => {
        setEntriesByDate((current) => ({
          ...current,
          [entry.date]: entry
        }));
      },
      getReadinessEntry: (date) => entriesByDate[date]
    }),
    [entriesByDate]
  );

  return <ReadinessContext.Provider value={value}>{children}</ReadinessContext.Provider>;
}

export function useReadiness() {
  const context = useContext(ReadinessContext);

  if (!context) {
    throw new Error("useReadiness must be used within ReadinessProvider.");
  }

  return context;
}
