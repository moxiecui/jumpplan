import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { BodySignalBaseline, DailyBodySignals } from "@/types/bodySignals";

interface BodySignalsContextValue {
  entriesByDate: Record<string, DailyBodySignals>;
  baselinesByDate: Record<string, BodySignalBaseline>;
  saveBodySignals: (entry: DailyBodySignals, baseline?: BodySignalBaseline) => void;
  getBodySignals: (date: string) => DailyBodySignals | undefined;
  getBodySignalBaseline: (date: string) => BodySignalBaseline | undefined;
}

const BodySignalsContext = createContext<BodySignalsContextValue | undefined>(undefined);

export function BodySignalsProvider({ children }: { children: ReactNode }) {
  const [entriesByDate, setEntriesByDate] = useState<Record<string, DailyBodySignals>>({});
  const [baselinesByDate, setBaselinesByDate] = useState<Record<string, BodySignalBaseline>>({});

  const value = useMemo<BodySignalsContextValue>(
    () => ({
      entriesByDate,
      baselinesByDate,
      saveBodySignals: (entry, baseline) => {
        setEntriesByDate((current) => ({
          ...current,
          [entry.date]: entry
        }));
        if (baseline) {
          setBaselinesByDate((current) => ({
            ...current,
            [entry.date]: baseline
          }));
        }
      },
      getBodySignals: (date) => entriesByDate[date],
      getBodySignalBaseline: (date) => baselinesByDate[date]
    }),
    [baselinesByDate, entriesByDate]
  );

  return <BodySignalsContext.Provider value={value}>{children}</BodySignalsContext.Provider>;
}

export function useBodySignals() {
  const context = useContext(BodySignalsContext);

  if (!context) {
    throw new Error("useBodySignals must be used within BodySignalsProvider.");
  }

  return context;
}
