import { trainingPlan } from "@/data/plan";
import type { TrainingDay } from "@/types/training";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
export const DEFAULT_PLAN_START_DATE = "2026-06-07";
export const PLAN_LENGTH_DAYS = trainingPlan.length;

export function getPlanDate(dayNumber: number): string {
  const startDateValue = process.env.EXPO_PUBLIC_PLAN_START_DATE ?? DEFAULT_PLAN_START_DATE;
  const startDate = new Date(`${startDateValue}T00:00:00`);
  const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  date.setDate(date.getDate() + Math.max(0, dayNumber - 1));
  return date.toISOString().slice(0, 10);
}

export function getTrainingDay(day: number): TrainingDay | undefined {
  return trainingPlan.find((trainingDay) => trainingDay.day === day);
}

function getPlanStartDate() {
  const startDateValue = process.env.EXPO_PUBLIC_PLAN_START_DATE ?? DEFAULT_PLAN_START_DATE;

  const startDate = new Date(`${startDateValue}T00:00:00`);
  if (Number.isNaN(startDate.getTime())) {
    return undefined;
  }

  return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
}

function clampPlanIndex(index: number) {
  return Math.min(Math.max(index, 0), PLAN_LENGTH_DAYS - 1);
}

export function getPlanDayNumberForDate(date = new Date(), dayOffset = 0): number {
  const startDay = getPlanStartDate();
  if (!startDay) {
    return 1;
  }

  const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((currentDate.getTime() - startDay.getTime()) / MS_PER_DAY);
  const planIndex = clampPlanIndex(diffDays + dayOffset);

  return planIndex + 1;
}

export function getTodayTrainingDay(date = new Date(), dayOffset = 0): TrainingDay {
  const planDayNumber = getPlanDayNumberForDate(date, dayOffset);

  return getTrainingDay(planDayNumber) ?? trainingPlan[0];
}
