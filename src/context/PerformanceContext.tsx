import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import type {
  BasketballSessionLog,
  JumpTestResult,
  RightSideAssessment
} from "@/types/training";

interface PerformanceContextValue {
  basketballLogs: BasketballSessionLog[];
  assessments: RightSideAssessment[];
  jumpTests: JumpTestResult[];
  saveBasketballLog: (log: BasketballSessionLog) => void;
  saveAssessment: (assessment: RightSideAssessment) => void;
  saveJumpTest: (result: JumpTestResult) => void;
  getBasketballLog: (date: string) => BasketballSessionLog | undefined;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [basketballLogs, setBasketballLogs] = useState<BasketballSessionLog[]>([]);
  const [assessments, setAssessments] = useState<RightSideAssessment[]>([]);
  const [jumpTests, setJumpTests] = useState<JumpTestResult[]>([]);

  const value = useMemo<PerformanceContextValue>(
    () => ({
      basketballLogs,
      assessments,
      jumpTests,
      saveBasketballLog: (log) => {
        setBasketballLogs((current) => [
          ...current.filter((item) => item.date !== log.date),
          log
        ]);
      },
      saveAssessment: (assessment) => {
        setAssessments((current) => [
          ...current.filter(
            (item) => item.date !== assessment.date || item.dayNumber !== assessment.dayNumber
          ),
          assessment
        ]);
      },
      saveJumpTest: (result) => {
        setJumpTests((current) => [
          ...current.filter((item) => item.date !== result.date),
          result
        ]);
      },
      getBasketballLog: (date) => basketballLogs.find((item) => item.date === date)
    }),
    [assessments, basketballLogs, jumpTests]
  );

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance() {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error("usePerformance must be used inside PerformanceProvider");
  }

  return context;
}
