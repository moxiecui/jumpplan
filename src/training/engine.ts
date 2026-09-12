import { basePlan, breathing } from './plan';
import { emptyFeedback, valueOf } from './model';
import type { Action, Assessment, Dose, Prescription, Session, SetRecord, TrainingState } from './model';

// Civil dates use UTC only for arithmetic: local date strings never become UTC instants.
export function civil(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('日期格式应为YYYY-MM-DD');
  const [y, m, d] = date.split('-').map(Number);
  const stamp = Date.UTC(y, m - 1, d);
  if (new Date(stamp).toISOString().slice(0, 10) !== date) throw new Error('日期不存在');
  return stamp;
}
export const dateForDay = (start: string, day: number) => new Date(civil(start) + (day - 1) * 86400000).toISOString().slice(0, 10);
export function dayForDate(state: TrainingState, date: string): number | null {
  const day = state.overrides[date] ?? Math.round((civil(date) - civil(state.startDate)) / 86400000) + 1;
  return day >= 1 && day <= 84 ? day : null;
}
export interface Load { jumps: number; landings: number; left: number; right: number; leftTakeoffs:number; rightTakeoffs:number; leftLandings:number; rightLandings:number; reactive: number; maxIntent: number; calfSets: number; calfSeconds: number; strengthSets: number; }
const zero = (): Load => ({ jumps: 0, landings: 0, left: 0, right: 0, leftTakeoffs:0,rightTakeoffs:0,leftLandings:0,rightLandings:0, reactive: 0, maxIntent: 0, calfSets: 0, calfSeconds: 0, strengthSets: 0 });
export function actionLoad(a: Action, reps: number, sets = a.dose.sets, side = a.dose.side): Load {
  const d = a.dose, factor = side === 'each' ? 2 : 1, jumps = sets * reps * d.jumps * factor;
  const landings = sets * reps * d.landings * factor;
  // Exposure counts loaded jumping/landing events, not an injury-risk score.
  const exposure={left:0,right:0,leftTakeoffs:0,rightTakeoffs:0,leftLandings:0,rightLandings:0};
  const workingSides = side==='each'?['left','right']:[side];
  for(const work of workingSides){
    const foot=(mode: Dose['takeoff'],target:string)=>mode==='both'||work==='both'||(mode==='opposite'?work!==target:work===target);
    const lt=foot(d.takeoff,'left')?sets*reps*d.jumps:0,rt=foot(d.takeoff,'right')?sets*reps*d.jumps:0;
    const ll=foot(d.landing,'left')?sets*reps*d.landings:0,rl=foot(d.landing,'right')?sets*reps*d.landings:0;
    exposure.leftTakeoffs+=lt;exposure.rightTakeoffs+=rt;exposure.leftLandings+=ll;exposure.rightLandings+=rl;
    exposure.left+=Math.max(lt,ll);exposure.right+=Math.max(rt,rl);
  }
  return { jumps, landings, ...exposure,
    reactive: d.reactive ? jumps : 0, maxIntent: d.maxIntent ? jumps : 0,
    calfSets: a.calf && reps > 0 ? sets * factor : 0, calfSeconds: a.calf ? sets * reps * (d.seconds ?? 0) * factor : 0,
    strengthSets: a.role === 'main' && !d.jumps && !d.seconds && reps > 0 ? sets * factor : 0 };
}
function add(a: Load, b: Load): Load { for (const k of Object.keys(a) as (keyof Load)[]) a[k] += b[k]; return a; }
export function plannedLoad(actions: Action[], bound: 'min' | 'max' = 'max') { return actions.reduce((sum, a) => add(sum, actionLoad(a, a.dose.reps[bound])), zero()); }
export function actualLoad(s: Session): Load { return s.sets.reduce((sum, r) => add(sum, actionLoad({...r.action,dose:{...r.action.dose,seconds:r.seconds??r.action.dose.seconds}}, r.reps, 1, r.side)), zero()); }
export function stimulus(s: Session): boolean {
  if (!s.endedAt || s.symptomStopped) return false;
  const core = s.snapshot.actions.filter(a => a.role === 'main');
  return core.length > 0 && core.every(a => s.sets.filter(r => r.action.key === a.key).length >= a.dose.sets &&
    s.sets.filter(r => r.action.key === a.key).every(r => r.reps >= a.dose.reps.min && r.side === a.dose.side && (a.dose.seconds===undefined || (r.seconds??0)>=a.dose.seconds)));
}
export function sessionStatus(s: Session): string {
  if (!s.endedAt) return '进行中';
  if (s.symptomStopped) return '因症状停止';
  if (stimulus(s)) return '训练刺激完成';
  return s.sets.length ? '部分完成' : '已结束并记录（无训练刺激）';
}
const recentSessions = (state: TrainingState, date: string) => state.sessions.filter(s => s.date < date && civil(date) - civil(s.date) <= state.rules.evidenceDays * 86400000);
export function progression(state: TrainingState, date: string) {
  const recent = recentSessions(state, date);
  const qualifying = recent.filter(s => stimulus(s) && s.snapshot.kind === '爆发技术' && actualLoad(s).jumps > 0 &&
    valueOf(s.feedback.peak) === 0 && valueOf(s.feedback.after) === 0 && valueOf(s.feedback.morning) === true &&
    (valueOf(s.feedback.quality) ?? 0) >= 4 && s.sets.every(r => (valueOf(r.pain) ?? 0) === 0 && (valueOf(r.quality) ?? 4) >= 4));
  // Distinct dates and a documented review, not merely two painless sessions.
  const dates = new Set(qualifying.map(s => s.date));
  const reviewed = state.history.some(h => h.id.startsWith('progress-review-') && h.recordedDate <= date && civil(date) - civil(h.recordedDate) <= state.rules.evidenceDays * 86400000);
  const ready = dates.size >= state.rules.evidenceSessions && reviewed;
  return { ready, count: dates.size, reason: `需最近${state.rules.evidenceDays}天内${state.rules.evidenceSessions}个不同日期的基础弹跳实际完成、质量≥4/5、训练中及训练后无痛且次晨回到个人基线，并记录针对反复症状的进阶复核。当前${dates.size}次，${reviewed ? '已' : '未'}复核；这不是伤愈或医疗许可。` };
}
export function assess(base: Prescription, a: Assessment | undefined, state: TrainingState, date: string, at?: string): Prescription {
  const p: Prescription = JSON.parse(JSON.stringify(base));
  const reasons: string[] = [], ankle = valueOf(a?.ankle), fn = valueOf(a?.function);
  const other = a?.otherPain.some(x => (valueOf(x.pain) ?? 0) > 0) ?? false;
  const abnormal = fn !== undefined && fn !== 'normal';
  const symptoms = (ankle !== undefined && ankle > 0) || other || abnormal || valueOf(a?.rising) === true;
  const missing = !a || ankle === undefined || fn === undefined || valueOf(a.rising) === undefined || valueOf(a.recurrent) === undefined ||
    valueOf(a.fatigue) === undefined || valueOf(a.quality) === undefined || valueOf(a.basketball) === undefined ||
    (valueOf(a.after) === undefined && a.after.state !== 'na') || (valueOf(a.morning) === undefined && a.morning.state !== 'na') || a.otherPain.some(p => valueOf(p.pain) === undefined);
  const unresolved = recentSessions(state, date).some(s => (s.symptomStopped || (valueOf(s.feedback.peak) ?? 0) > 0 || s.sets.some(r=>(valueOf(r.pain)??0)>0)) && valueOf(s.feedback.morning) !== true);
  const response = (valueOf(a?.after) ?? 0) > 0 || valueOf(a?.morning) === false || unresolved;
  const nowMs = at ? Date.parse(at) : civil(date);
  const lastImpact = state.sessions.filter(s => s.date <= date && (actualLoad(s).jumps > 0 || actualLoad(s).landings > 0 || s.sets.some(r => r.reps > 0 && r.action.lower && (r.action.role === 'main' || r.action.calf))))
    .some(s => nowMs - Math.max(Date.parse(s.endedAt ?? s.startedAt), ...s.sets.map(r => Date.parse(r.at))) < state.rules.minimumRecoveryHours * 3600000);
  // Basketball/tests with only a civil date: use a conservative whole-date interval.
  const recentBall = state.basketball.some(b => b.date <= date && civil(date) - civil(b.date) <= state.rules.minimumRecoveryHours * 3600000 && (b.rpe >= 5 || valueOf(b.jumps) === undefined || (valueOf(b.jumps) ?? 0) > 0));
  const recentTest = state.tests.some(t => !t.sessionId && t.date <= date && civil(date) - civil(t.date) <= state.rules.minimumRecoveryHours * 3600000);
  const load = ['moderate', 'high'].includes(valueOf(a?.basketball) ?? '') || lastImpact || recentBall || recentTest;
  const poorQuality = valueOf(a?.quality) !== undefined && valueOf(a?.quality)! < 4;
  const fatigue = (valueOf(a?.fatigue) ?? 0) >= 4;
  if (symptoms) reasons.push('当前症状或功能异常：移除冲击及下肢负荷，不把双脚跳、负重跳或等长当成默认安全替代。');
  if (abnormal || valueOf(a?.recurrent) === true) reasons.push('如疼痛持续反复、明显肿胀、失稳或承重困难，暂停诱发活动并寻求专业评估。');
  if (response) reasons.push('训练后/次晨反应尚未恢复或记录未闭环：今天不增加下肢负荷。');
  if (missing) reasons.push('尚未评估：存在未填/未测试的必要输入。可选择不依赖跳跃测试的舒适恢复。');
  if (load) reasons.push('近期实际训练或篮球负荷需要恢复间隔：移除本次冲击，不补齐周目标。');
  if (poorQuality) reasons.push('动作质量不足：先维持控制练习，不做弹跳。');
  if (fatigue) reasons.push('主观疲劳偏高：减少工作组，不增加强度。');
  if (symptoms || response || missing) {
    p.actions = [breathing()];
    p.title = '舒适恢复 · 今日执行版'; p.kind = '恢复'; p.goal = '记录症状与恢复，舒适则做呼吸，不适就结束';
  } else {
    p.actions = p.actions.filter(x => !(load || poorQuality || fatigue) || !x.dose.jumps && !x.dose.landings);
    if (load || fatigue || poorQuality) p.actions = p.actions.map(x => ({ ...x, dose: { ...x.dose, sets: Math.max(1, x.dose.sets - 1), rpe: '不超过5–6；质量下降即结束' } }));
    const gate = progression(state, date);
    if (!gate.ready || valueOf(a?.recurrent) === true) {
      if (p.actions.some(x => x.dose.reactive || x.dose.maxIntent || x.dose.side === 'each' && x.dose.jumps)) reasons.push(gate.reason);
      p.actions = p.actions.filter(x => !x.dose.reactive && !x.dose.maxIntent && !(x.dose.side === 'each' && x.dose.jumps));
    }
    if (!p.actions.length) p.actions = [breathing()];
    p.title = `${p.actions.some(x => x.role === 'main') ? base.title : '恢复与复盘'} · 今日执行版`;
  }
  p.level = missing ? 'unassessed' : reasons.length ? 'restricted' : 'maintain';
  p.reasons = reasons.length ? reasons : ['依据当日已填写反馈维持基础处方；可穿戴数据不提供跳跃许可。逐组观察症状。'];
  return p;
}
export function startSession(state: TrainingState, date: string, now: string): TrainingState {
  if (state.sessions.some(s => !s.endedAt) || state.sessions.some(s => s.date === date) || state.skippedDates.includes(date)) return state;
  const day = dayForDate(state, date); if (day === null) return state;
  const base = basePlan(day), snapshot = assess(base, state.assessments[date], state, date, now);
  const s: Session = { id: `session-${now}`, day, date, startedAt: now, base, snapshot, assessment: state.assessments[date],
    actions: structuredClone(snapshot.actions), sets: [], skipped: [], changes: [], symptomStopped: false, feedback: emptyFeedback() };
  return { ...state, sessions: [...state.sessions, s] };
}
export function recordSet(s: Session, r: SetRecord): Session {
  if (s.endedAt || s.symptomStopped || s.sets.some(x => x.id === r.id)) return s;
  const a = s.actions.find(x => x.key === r.action.key);
  if (!a || s.skipped.includes(a.key) || s.sets.filter(x => x.action.key === a.key).length >= a.dose.sets) return s;
  if (!Number.isInteger(r.reps) || r.reps < 0 || r.reps > a.dose.reps.max) throw new Error('实际次数应在0与本组计划次数之间');
  const pain=valueOf(r.pain),previous=s.sets.filter(x=>x.action.key===a.key&&valueOf(x.pain)!==undefined).at(-1);
  const rising=pain!==undefined&&previous!==undefined&&pain>valueOf(previous.pain)!;
  const next:Session = { ...s, sets: [...s.sets, r], feedback:{...s.feedback,peak:pain===undefined?s.feedback.peak:{state:'known',value:Math.max(pain,valueOf(s.feedback.peak)??pain)}}, restUntil: new Date(r.at).getTime() + a.dose.rest * 1000 };
  return (pain ?? 0) >= 3 || rising || (valueOf(r.quality) ?? 5) <= 2 ? stopForSymptoms(next) : next;
}
export function stopForSymptoms(s: Session): Session {
  if (s.endedAt) return s;
  return { ...s, symptomStopped: true, actions: [], restUntil: undefined,
    interruptedAction: s.interruptedAction ?? s.actions.find(a => !s.skipped.includes(a.key) && s.sets.filter(r => r.action.key === a.key).length < a.dose.sets),
    changes: [...s.changes, '因症状停止：移除所有剩余动作。实际记录保留，无补齐要求。'] };
}
export function endSession(s: Session, now: string): Session { return s.endedAt ? s : { ...s, endedAt: now, restUntil: undefined }; }
