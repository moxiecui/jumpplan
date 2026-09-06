import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { formatLocalDate, getMillisecondsUntilNextLocalMidnight } from "@/logic/localDate";

export function useLocalToday() {
  const [today, setToday] = useState(() => formatLocalDate());

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout>;

    const refreshAndSchedule = () => {
      const now = new Date();
      setToday(formatLocalDate(now));
      midnightTimer = setTimeout(refreshAndSchedule, getMillisecondsUntilNextLocalMidnight(now) + 50);
    };

    refreshAndSchedule();
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        clearTimeout(midnightTimer);
        refreshAndSchedule();
      }
    });

    return () => {
      clearTimeout(midnightTimer);
      appStateSubscription.remove();
    };
  }, []);

  return today;
}
