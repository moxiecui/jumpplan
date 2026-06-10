import { trainingPlan } from "@/data/plan";
import type { TrainingDay } from "@/types/training";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_PLAN_START_DATE = "2026-06-07";
export const PLAN_LENGTH_DAYS = trainingPlan.length;

export function getTrainingDay(day: number): TrainingDay | undefined {
  return trainingPlan.find((trainingDay) => trainingDay.day === day);
}

export function getTodayTrainingDay(date = new Date()): TrainingDay {
  const startDateValue = process.env.EXPO_PUBLIC_PLAN_START_DATE ?? DEFAULT_PLAN_START_DATE;

  const startDate = new Date(`${startDateValue}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) {
    return trainingPlan[0];
  }

  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const diffDays = Math.floor((currentDate.getTime() - startDay.getTime()) / MS_PER_DAY);
  const planIndex = ((diffDays % PLAN_LENGTH_DAYS) + PLAN_LENGTH_DAYS) % PLAN_LENGTH_DAYS;

  return trainingPlan[planIndex] ?? trainingPlan[0];
}
