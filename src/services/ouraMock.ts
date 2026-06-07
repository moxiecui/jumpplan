import type { OuraDailyReadinessInput } from "@/types/training";

export async function getMockOuraReadiness(date: string): Promise<OuraDailyReadinessInput> {
  return {
    date,
    readinessScore: 82,
    restingHeartRate: 56,
    hrv: 70,
    sleepScore: 78,
    source: "mock"
  };
}
