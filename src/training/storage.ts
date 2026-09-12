import { civil } from './engine';
import type { TrainingState } from './model';

export const STORAGE_KEY = 'jumpplan-training-v2';
export function freshState(): TrainingState {
  return { schema: 2, revision: 0, startDate: '2026-07-26', assessments: {}, sessions: [], basketball: [], tests: [], overrides: {}, skippedDates: [],
    rules: { minimumRecoveryHours: 48, evidenceSessions: 3, evidenceDays: 28 }, archived: {},
    history: [{ id: 'reported-medial-ankle', recordedDate: '2026-09-11', occurredDate: null, site: '踝内侧', side: 'left',
      text: '用户历史报告：连续Pogo约第12次开始疼痛。症状发生日期未提供；本条是2026-09-11需求中的历史记录，不代表今天状态，也不代表前11次安全。' }] };
}
type Obj = Record<string, unknown>;
const obj = (x: unknown): x is Obj => !!x && typeof x === 'object' && !Array.isArray(x);
const num = (x: unknown, min = 0, max = 100000): x is number => typeof x === 'number' && Number.isFinite(x) && x >= min && x <= max;
const integer = (x: unknown, min = 0, max = 100000) => num(x, min, max) && Number.isInteger(x);
const str = (x: unknown): x is string => typeof x === 'string' && x.length <= 100000;
const date = (x: unknown): x is string => { try { return str(x) && Number.isFinite(civil(x)); } catch { return false; } };
const instant = (x: unknown) => str(x) && !Number.isNaN(Date.parse(x));
const sides = ['both', 'each', 'left', 'right'];
function answer(x: unknown, check: (v: unknown) => boolean): boolean {
  return obj(x) && (['unanswered', 'untested', 'na'].includes(String(x.state)) || x.state === 'known' && check(x.value));
}
const score = (x: unknown) => answer(x, v => num(v, 0, 10));
const quality = (x: unknown) => answer(x, v => integer(v, 1, 5));
const bool = (x: unknown) => answer(x, v => typeof v === 'boolean');
function teaching(x:unknown):boolean {
 if(!obj(x))return false;
 return ['id','variantId','variant','originalIssue','equipment','counting','sideRule'].every(k=>str(x[k])) && ['edited','pending','workflow','selector'].includes(String(x.status)) && ['reps','seconds','meters','rounds','workflow'].includes(String(x.unit)) && ['steps','keyPoints','mistakes','sources','unresolved'].every(k=>Array.isArray(x[k])&&(x[k] as unknown[]).every(str)) && integer(x.jumps,0,100) && integer(x.landings,0,100) && typeof x.reactive==='boolean' && (x.alternatives===undefined||Array.isArray(x.alternatives)&&x.alternatives.every(str));
}
function action(x: unknown): boolean {
  if (!obj(x) || !obj(x.dose)) return false;
  const d = x.dose;
  if(x.teaching!==undefined && (!teaching(x.teaching) || (x.teaching as Obj).id!==x.exerciseId)) return false;
  if([d.takeoff,d.landing].some(v=>v!==undefined&&!['both','working','opposite'].includes(String(v))))return false;
  return ['key', 'exerciseId', 'name', 'cue', 'stop', 'alternative'].every(k => str(x[k])) && ['warmup', 'main', 'support', 'recovery'].includes(String(x.role)) &&
    typeof x.lower === 'boolean' && typeof x.calf === 'boolean' && integer(d.sets, 0, 100) && obj(d.reps) && integer(d.reps.min, 0, 1000) && integer(d.reps.max, Number(d.reps.min), 1000) &&
    sides.includes(String(d.side)) && integer(d.jumps, 0, 20) && integer(d.landings, 0, 20) && typeof d.reactive === 'boolean' && typeof d.maxIntent === 'boolean' &&
    num(d.rest, 0, 3600) && str(d.load) && str(d.rpe) && (d.seconds === undefined || num(d.seconds, 0, 86400));
}
const actions = (x: unknown) => Array.isArray(x) && x.length <= 100 && x.every(action) && new Set(x.map(a => a.key)).size === x.length;
function prescription(x: unknown): boolean {
  return obj(x) && integer(x.day, 1, 84) && integer(x.week, 1, 12) && integer(x.phase, 1, 4) && str(x.version) && str(x.title) && str(x.goal) &&
    ['力量A', '力量B', '爆发技术', '篮球技术', '恢复', '测试与复盘'].includes(String(x.kind)) && typeof x.deload === 'boolean' && actions(x.actions) && strings(x.reasons) && ['unassessed', 'restricted', 'maintain'].includes(String(x.level));
}
const strings = (x: unknown): boolean => Array.isArray(x) && x.every(str);
function assessment(x: unknown): boolean {
  return obj(x) && date(x.date) && score(x.ankle) && score(x.after) && bool(x.morning) && bool(x.rising) && bool(x.recurrent) && quality(x.fatigue) && quality(x.quality) &&
    answer(x.basketball, v => ['none', 'light', 'moderate', 'high'].includes(String(v))) && answer(x.function, v => ['normal', 'changed', 'swelling', 'unstable', 'weight-bearing'].includes(String(v))) &&
    answer(x.wearable, v => num(v, 0, 100)) && score(x.jumpTest) && Array.isArray(x.otherPain) && x.otherPain.every(p => obj(p) && str(p.site) && sides.includes(String(p.side)) && score(p.pain));
}
function feedback(x: unknown): boolean {
  return obj(x) && score(x.peak) && score(x.after) && bool(x.morning) && quality(x.quality) && str(x.site) && sides.includes(String(x.side)) && str(x.notes) &&
    (x.onsetSet === undefined || integer(x.onsetSet, 1, 1000)) && (x.onsetRep === undefined || integer(x.onsetRep, 1, 1000));
}
function session(x: unknown): boolean {
  return obj(x) && str(x.id) && date(x.date) && integer(x.day, 1, 84) && instant(x.startedAt) && (x.endedAt === undefined || instant(x.endedAt)) &&
    prescription(x.base) && prescription(x.snapshot) && actions(x.actions) && (x.assessment === undefined || assessment(x.assessment)) &&
    strings(x.skipped) && strings(x.changes) && typeof x.symptomStopped === 'boolean' && feedback(x.feedback) && (x.restUntil === undefined || num(x.restUntil, 0, 1e15)) && (x.interruptedAction === undefined || action(x.interruptedAction)) &&
    Array.isArray(x.sets) && new Set(x.sets.map(r => r?.id)).size === x.sets.length && x.sets.every(r => obj(r) && str(r.id) && action(r.action) && integer(r.index, 0, 1000) && integer(r.reps, 0, 1000) && sides.includes(String(r.side)) &&
      instant(r.at) && score(r.pain) && quality(r.quality) && (r.weight === undefined || num(r.weight, 0, 2000)) && (r.rpe === undefined || num(r.rpe, 0, 10)) && (r.seconds === undefined || num(r.seconds, 0, 86400)));
}
export function validateState(x: unknown): asserts x is TrainingState {
  if (!obj(x) || x.schema !== 2 || !integer(x.revision) || !date(x.startDate) || !obj(x.assessments) || !Object.entries(x.assessments).every(([d, a]) => date(d) && assessment(a) && (a as Obj).date === d) ||
    !Array.isArray(x.sessions) || !x.sessions.every(session) || new Set(x.sessions.map(s => s.id)).size !== x.sessions.length || x.sessions.filter(s => !s.endedAt).length > 1 ||
    !Array.isArray(x.basketball) || !x.basketball.every(b => obj(b) && str(b.id) && date(b.date) && instant(b.at) && num(b.minutes, 0, 1440) && num(b.rpe, 0, 10) && b.estimated === true && answer(b.jumps, v => integer(v, 0, 10000))) ||
    !Array.isArray(x.tests) || !x.tests.every(t => obj(t) && str(t.id) && date(t.date) && ['CMJ', '助跑摸高', '左单脚', '右单脚'].includes(String(t.type)) && str(t.method) && t.method.trim().length > 0 && t.unit === 'cm' && Array.isArray(t.attempts) && t.attempts.length > 0 && t.attempts.every(v => num(v, 0, 500)) && (t.sessionId === undefined || str(t.sessionId)) && (t.baselineReach === undefined || num(t.baselineReach, 0, 400))) ||
    (x.body !== undefined && (!Array.isArray(x.body) || !x.body.every(b => obj(b) && date(b.date) && str(b.notes) && (b.weightKg === undefined || num(b.weightKg, 1, 500)) && (b.restingHeartRate === undefined || num(b.restingHeartRate, 1, 250)) && (b.hrv === undefined || num(b.hrv, 0, 1000)) && (b.sleepHours === undefined || num(b.sleepHours, 0, 24))))) ||
    !obj(x.overrides) || !Object.entries(x.overrides).every(([d, n]) => date(d) && integer(n, 1, 84)) || !Array.isArray(x.skippedDates) || !x.skippedDates.every(date) ||
    !obj(x.rules) || !num(x.rules.minimumRecoveryHours, 48, 168) || !integer(x.rules.evidenceSessions, 3, 20) || !integer(x.rules.evidenceDays, 14, 90) ||
    !obj(x.archived) || !Array.isArray(x.history) || !x.history.every(h => obj(h) && str(h.id) && date(h.recordedDate) && (h.occurredDate === null || date(h.occurredDate)) && str(h.site) && sides.includes(String(h.side)) && str(h.text))) {
    throw new Error('数据校验失败：版本、日期、组次或记录字段无效；未覆盖现有记录。');
  }
}
export function exportData(state: TrainingState): string { validateState(state); return JSON.stringify({ format: 'JumpPlan', version: 2, data: state }, null, 2); }
export function importData(raw: string): TrainingState {
  if (raw.length > 10000000) throw new Error('导入超过10MB');
  const x: unknown = JSON.parse(raw);
  if (!obj(x) || x.format !== 'JumpPlan' || x.version !== 2) throw new Error('不支持的导入格式；旧版原始数据会保留在迁移档案。');
  validateState(x.data); return x.data;
}
export function migrate(storage: Pick<Storage, 'length' | 'key' | 'getItem'>): TrainingState {
  const state = freshState();
  // Preserve raw historical payloads without synthesizing prescriptions or completions.
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    if (key?.startsWith('jumpplan') && key !== STORAGE_KEY && !key.startsWith(`${STORAGE_KEY}-backup`)) state.archived[key] = storage.getItem(key);
  }
  return state;
}
