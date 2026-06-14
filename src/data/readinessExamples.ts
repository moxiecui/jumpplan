import { evaluateDailyReadiness } from "@/logic/readinessScore";
import type { OuraDailyReadinessInput, SubjectiveReadinessInput } from "@/types/training";

const baseline = {
  restingHeartRate: 56,
  hrv: 70
};

const calmSubjective: SubjectiveReadinessInput = {
  date: "2026-06-05",
  achillesStiffness: 0,
  patellarPain: 0,
  calfTightness: 1,
  sleepQuality: 4,
  hamstringSoreness: 0,
  upperBodySoreness: 0,
  generalDoms: 1,
  generalFatigue: 2,
  movementQualityToday: 4,
  legsFeelHeavy: false,
  basketballLoadLast24h: "none",
  basketballLoadLast48h: "none"
};

export const greenHighReadiness = {
  oura: {
    date: "2026-06-05",
    readinessScore: 88,
    restingHeartRate: 55,
    hrv: 74,
    sleepScore: 84,
    source: "mock"
  } satisfies OuraDailyReadinessInput,
  subjective: calmSubjective,
  baseline,
  dayType: "jump" as const
};

export const yellowLowHRV = {
  oura: {
    date: "2026-06-05",
    readinessScore: 72,
    restingHeartRate: 57,
    hrv: 55,
    sleepScore: 76,
    source: "mock"
  } satisfies OuraDailyReadinessInput,
  subjective: calmSubjective,
  baseline,
  dayType: "jump" as const
};

export const yellowElevatedRHR = {
  oura: {
    date: "2026-06-05",
    readinessScore: 74,
    restingHeartRate: 64,
    hrv: 68,
    sleepScore: 72,
    source: "mock"
  } satisfies OuraDailyReadinessInput,
  subjective: calmSubjective,
  baseline,
  dayType: "strength" as const
};

export const redTendonPain = {
  oura: {
    date: "2026-06-05",
    readinessScore: 91,
    restingHeartRate: 55,
    hrv: 76,
    sleepScore: 88,
    source: "mock"
  } satisfies OuraDailyReadinessInput,
  subjective: {
    ...calmSubjective,
    date: "2026-06-05",
    achillesStiffness: 4,
    patellarPain: 2,
    calfTightness: 3,
    sleepQuality: 4
  } satisfies SubjectiveReadinessInput,
  baseline,
  dayType: "jump" as const
};

export const testDayNotRecommended = {
  oura: {
    date: "2026-06-05",
    readinessScore: 68,
    restingHeartRate: 62,
    hrv: 58,
    sleepScore: 66,
    source: "mock"
  } satisfies OuraDailyReadinessInput,
  subjective: calmSubjective,
  baseline,
  dayType: "test" as const
};

export const readinessExampleOutputs = {
  greenHighReadiness: evaluateDailyReadiness(greenHighReadiness),
  yellowLowHRV: evaluateDailyReadiness(yellowLowHRV),
  yellowElevatedRHR: evaluateDailyReadiness(yellowElevatedRHR),
  redTendonPain: evaluateDailyReadiness(redTendonPain),
  testDayNotRecommended: evaluateDailyReadiness(testDayNotRecommended)
};
