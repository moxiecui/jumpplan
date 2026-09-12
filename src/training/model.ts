import type { Teaching } from '@/data/exerciseTeaching';
// Versioned execution model. Missing answers never mean zero or permission.
export type Answer<T> = { state: 'unanswered' | 'untested' | 'na' } | { state: 'known'; value: T };
export const unknown = <T>(): Answer<T> => ({ state: 'unanswered' });
export const known = <T>(value: T): Answer<T> => ({ state: 'known', value });
export const valueOf = <T>(answer?: Answer<T>): T | undefined => answer?.state === 'known' ? answer.value : undefined;
export type Side = 'both' | 'each' | 'left' | 'right';
export type Range = { min: number; max: number };
export interface Dose {
  sets: number; reps: Range; side: Side; seconds?: number;
  jumps: number; landings: number; reactive: boolean; maxIntent: boolean;
  rest: number; load: string; rpe: string;
  takeoff?: 'both' | 'working' | 'opposite'; landing?: 'both' | 'working' | 'opposite';
}
export interface Action {
  key: string; exerciseId: string; name: string; role: 'warmup' | 'main' | 'support' | 'recovery';
  teaching?: Teaching;
  dose: Dose; lower: boolean; calf: boolean; cue: string; stop: string; alternative: string;
}
export type Kind = '力量A' | '力量B' | '爆发技术' | '篮球技术' | '恢复' | '测试与复盘';
export interface Prescription {
  version: string; day: number; week: number; phase: number; title: string; goal: string;
  kind: Kind; deload: boolean; actions: Action[]; reasons: string[]; level: 'unassessed' | 'restricted' | 'maintain';
}
export interface Assessment {
  date: string; ankle: Answer<number>; after: Answer<number>; morning: Answer<boolean>;
  basketball: Answer<'none' | 'light' | 'moderate' | 'high'>; fatigue: Answer<number>;
  quality: Answer<number>; function: Answer<'normal' | 'changed' | 'swelling' | 'unstable' | 'weight-bearing'>;
  rising: Answer<boolean>; recurrent: Answer<boolean>; otherPain: { site: string; side: Side; pain: Answer<number> }[];
  wearable: Answer<number>; jumpTest: Answer<number>;
}
export interface SetRecord {
  id: string; action: Action; index: number; reps: number; side: Side; weight?: number; rpe?: number;
  seconds?: number; at: string; pain: Answer<number>; quality: Answer<number>;
}
export interface Feedback {
  peak: Answer<number>; site: string; side: Side; onsetSet?: number; onsetRep?: number;
  after: Answer<number>; morning: Answer<boolean>; quality: Answer<number>; notes: string;
}
export interface Session {
  id: string; day: number; date: string; startedAt: string; endedAt?: string;
  base: Prescription; snapshot: Prescription; assessment?: Assessment; actions: Action[];
  sets: SetRecord[]; skipped: string[]; changes: string[]; symptomStopped: boolean;
  feedback: Feedback; restUntil?: number;
  interruptedAction?: Action;
}
export interface Basketball {
  id: string; date: string; at: string; minutes: number; rpe: number; jumps: Answer<number>; estimated: true;
}
export interface JumpTest {
  id: string; date: string; type: 'CMJ' | '助跑摸高' | '左单脚' | '右单脚'; method: string;
  unit: 'cm'; attempts: number[]; baselineReach?: number; sessionId?: string;
}
export interface RuleConfig { minimumRecoveryHours: number; evidenceSessions: number; evidenceDays: number; }
export interface TrainingState {
  schema: 2; revision: number; startDate: string; assessments: Record<string, Assessment>; sessions: Session[];
  basketball: Basketball[]; tests: JumpTest[]; overrides: Record<string, number>; skippedDates: string[];
  history: { id: string; recordedDate: string; occurredDate: string | null; site: string; side: Side; text: string }[];
  archived: Record<string, unknown>; rules: RuleConfig;
  body?: { date: string; weightKg?: number; restingHeartRate?: number; hrv?: number; sleepHours?: number; notes: string }[];
}
export const emptyAssessment = (date: string): Assessment => ({
  date, ankle: unknown(), after: unknown(), morning: unknown(), basketball: unknown(), fatigue: unknown(),
  quality: unknown(), function: unknown(), rising: unknown(), recurrent: unknown(), otherPain: [], wearable: unknown(), jumpTest: { state: 'untested' }
});
export const emptyFeedback = (): Feedback => ({ peak: unknown(), site: '踝内侧', side: 'left', after: unknown(), morning: unknown(), quality: unknown(), notes: '' });
