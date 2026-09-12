require('./register-ts.cjs');
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { freshState, validateState, exportData, importData, migrate } = require('../src/training/storage.ts');
const { known, emptyAssessment } = require('../src/training/model.ts');
const { basePlan, fullPlan, dose, secondJump, breathing, summary } = require('../src/training/plan.ts');
const { assess, actionLoad, plannedLoad, actualLoad, progression, startSession, recordSet, stopForSymptoms, endSession, stimulus, sessionStatus, civil, dateForDay, dayForDate } = require('../src/training/engine.ts');
const { getExerciseById } = require('../src/data/exercises.ts');
const date = '2026-08-18';
function calm(d = date) { return { ...emptyAssessment(d), ankle: known(0), function: known('normal'), rising: known(false), recurrent: known(false), after: known(0), morning: known(true), fatigue: known(2), quality: known(4), basketball: known('none') }; }
function stateWith(day = 24, d = date) { const s = freshState(); s.assessments[d] = calm(d); s.overrides[d] = day; return s; }
function begin(day = 24, d = date) { return startSession(stateWith(day, d), d, `${d}T12:00:00Z`).sessions[0]; }
function fill(session) {
  let s = session;
  for (const a of s.actions) for (let i = 0; i < a.dose.sets; i++) s = recordSet(s, { id: `${s.id}-${a.key}-${i}`, action: a, index: i, reps: a.dose.reps.max, side: a.dose.side, at: `${s.date}T12:00:00Z`, pain: known(0), quality: known(4) });
  return endSession({ ...s, feedback: { ...s.feedback, peak: known(0), after: known(0), morning: known(true), quality: known(4) } }, `${s.date}T13:00:00Z`);
}
test('unknown / explicit zero / untested / not applicable are distinct; no default green', () => {
  const s = freshState();
  for (const a of [undefined, emptyAssessment(date), { ...calm(), ankle: { state: 'untested' } }, { ...calm(), ankle: { state: 'na' } }]) {
    const p = assess(basePlan(24), a, s, date); assert.equal(p.level, 'unassessed'); assert.equal(plannedLoad(p.actions).jumps, 0);
  }
  assert.equal(assess(basePlan(24), calm(), s, date).level, 'maintain');
  assert.equal(assess(basePlan(24), { ...calm(), after: { state: 'na' }, morning: { state: 'na' } }, s, date).level, 'maintain');
});
test('all 84 days: pain outranks wearables and removes lower loading, rising and function flags stop below threshold', () => {
  for (const p of fullPlan) for (const signal of [{ ankle: known(3) }, { ankle: known(1), rising: known(true) }, { function: known('swelling') }, { function: known('weight-bearing') }, { otherPain: [{ site: '膝', side: 'right', pain: known(3) }] }]) {
    const adjusted = assess(p, { ...calm(), wearable: known(100), ...signal }, freshState(), date);
    assert.ok(adjusted.actions.every(a => !a.lower)); assert.equal(plannedLoad(adjusted.actions).jumps, 0);
  }
});
test('post-training/morning reactions and actual basketball override current zero pain', () => {
  for (const signal of [{ after: known(2) }, { morning: known(false) }]) assert.ok(assess(basePlan(24), { ...calm(), ...signal }, freshState(), date).actions.every(a => !a.lower));
  const state = freshState(); state.basketball.push({ id: 'b', date, at: `${date}T09:00:00Z`, minutes: 30, rpe: 7, jumps: { state: 'unanswered' }, estimated: true });
  assert.equal(plannedLoad(assess(basePlan(24), calm(), state, date).actions).jumps, 0);
});
test('Day24 and Day31 prescriptions reduced, not relabelled; warmup, each-side, ranges, landing and second jumps counted', () => {
  assert.equal(plannedLoad(basePlan(24).actions).jumps, 8);
  assert.equal(plannedLoad(basePlan(31).actions).jumps, 8);
  assert.ok(basePlan(24).actions.every(a => !a.dose.reactive));
  const a = { ...secondJump(), dose: dose(3, 2, { side: 'each', jumps: 1, landings: 1 }) };
  assert.deepEqual([plannedLoad([a]).jumps, plannedLoad([a]).left, plannedLoad([a]).right], [12, 6, 6]);
  assert.equal(plannedLoad([secondJump()]).jumps, 4);
  assert.deepEqual([actionLoad({ ...a, dose: { ...a.dose, side: 'both' } }, 2).jumps, actionLoad({ ...a, dose: { ...a.dose, side: 'both' } }, 2).left], [6, 6]);
  assert.equal(plannedLoad([{ ...a, role: 'warmup' }]).jumps, 12);
  assert.equal(plannedLoad([{ ...a, dose: { ...a.dose, jumps: 0 } }]).landings, 12);
  assert.equal(plannedLoad([{ ...a, dose: { ...a.dose, reps: { min: 1, max: 2 } } }], 'min').jumps, 6);
});
test('snapshots immutable, partial actual counts, replacements and zero reps do not fake load', () => {
  let s = begin(), before = JSON.stringify(s.snapshot), a = s.actions.find(a => a.dose.jumps);
  s = recordSet(s, { id: 'partial', action: a, index: 0, reps: 1, side: 'both', at: `${date}T12:00:00Z`, pain: known(0), quality: known(4) });
  assert.equal(actualLoad(s).jumps, 1);
  s.actions = [breathing()]; assert.equal(plannedLoad(s.actions).jumps, 0); assert.equal(actualLoad(s).jumps, 1); assert.equal(JSON.stringify(s.snapshot), before);
  const calf = { ...breathing(), calf: true, dose: dose(2, 1, { seconds: 20, side: 'each' }) };
  assert.equal(plannedLoad([calf]).calfSeconds, 80); assert.equal(actionLoad(calf, 0, 1).calfSets, 0); assert.equal(actionLoad(calf, 0, 1).calfSeconds, 0);
});
test('start, set and end are idempotent; all skipped and partial-side not stimulus', () => {
  const state = startSession(stateWith(), date, `${date}T12:00:00Z`); assert.equal(startSession(state, date, `${date}T12:00:01Z`).sessions.length, 1);
  let s = state.sessions[0], a = s.actions[0], r = { id: 'same', action: a, index: 0, reps: 1, side: a.dose.side, at: `${date}T12:00:00Z`, pain: known(0), quality: known(4) };
  s = recordSet(recordSet(s, r), r); assert.equal(s.sets.length, 1);
  const end = endSession(s, `${date}T13:00:00Z`); assert.deepEqual(endSession(end, `${date}T14:00:00Z`), end);
  assert.equal(stimulus(endSession({ ...begin(), skipped: begin().actions.map(a => a.key) }, `${date}T13:00:00Z`)), false);
  assert.equal(stimulus(fill(begin())), true);
  const strength = fill(begin(1)); strength.sets = strength.sets.map(r => r.action.dose.side === 'each' ? { ...r, side: 'left' } : r); assert.equal(stimulus(strength), false);
});
test('symptom stop removes execution, preserves actual counts, and never completes stimulus', () => {
  const s = stopForSymptoms({ ...fill(begin()), endedAt: undefined });
  assert.equal(s.actions.length, 0); assert.equal(actualLoad(s).jumps, 8);
  assert.equal(stimulus(endSession(s, `${date}T13:00:00Z`)), false); assert.equal(sessionStatus(endSession(s, `${date}T13:00:00Z`)), '因症状停止');
});
test('day43 does not unlock reactive; two painless sessions not permission, actual evidence and review needed', () => {
  let state = freshState();
  for (const d of ['2026-08-04', '2026-08-08']) state.sessions.push(fill(begin(24, d)));
  assert.equal(progression(state, date).ready, false);
  assert.equal(plannedLoad(assess(basePlan(45), calm(), state, date).actions).reactive, 0);
  state.sessions.push(fill(begin(24, '2026-08-12'))); assert.equal(progression(state, date).ready, false);
  state.history.push({ id: 'progress-review-test', recordedDate: date, occurredDate: date, site: '复核', side: 'both', text: '已复核' });
  assert.equal(progression(state, date).ready, true);
  assert.ok(plannedLoad(assess(basePlan(45), calm(), state, date).actions).reactive > 0);
  assert.equal(plannedLoad(assess(basePlan(45), { ...calm(), recurrent: known(true) }, state, date).actions).reactive, 0);
});
test('civil-date boundary days 21/22,42/43,63/64,84 and end; changing one date isolated', () => {
  const state = freshState();
  for (const n of [1, 21, 22, 42, 43, 63, 64, 84]) assert.equal(dayForDate(state, dateForDay(state.startDate, n)), n);
  assert.equal(dayForDate(state, dateForDay(state.startDate, 85)), null);
  assert.equal(dayForDate(state, dateForDay(state.startDate, 0)), null);
  const next = dateForDay(state.startDate, 32), prev = dayForDate(state, next); state.overrides[date] = 31; assert.equal(dayForDate(state, next), prev);
  assert.equal(civil('2026-11-02') - civil('2026-11-01'), 86400000); assert.throws(() => civil('2026-02-30'));
});
test('full cycle has valid library IDs, core summaries, lower deload volume, subset invariants and bounded menus', () => {
  assert.equal(fullPlan.length, 84);
  for (const p of fullPlan) {
    const l = plannedLoad(p.actions); assert.ok(l.reactive <= l.jumps); assert.ok(l.maxIntent <= l.jumps);
    assert.ok(p.actions.filter(a => a.role === 'main').length <= 3); assert.ok(!summary(p).includes('升温'));
    for (const a of p.actions) { assert.ok(getExerciseById(a.exerciseId), a.exerciseId); assert.ok(a.cue && a.stop && a.alternative && a.dose.load && a.dose.rpe); }
  }
  for (const [normal, deload] of [[8, 15], [29, 36], [50, 57], [64, 78]]) assert.ok(plannedLoad(basePlan(deload).actions).strengthSets < plannedLoad(basePlan(normal).actions).strengthSets);
  for (const p of fullPlan.filter(p => p.kind === '恢复')) assert.equal(plannedLoad(p.actions).calfSets, 0);
});
test('roundtrip restores snapshots across dates; migration preserves raw old logs; corrupt imports rejected', () => {
  const state = stateWith(); state.sessions.push(fill(begin()));
  validateState(state); assert.equal(exportData(importData(exportData(state))), exportData(state));
  const old = { 'jumpplan-old-logs': JSON.stringify({ dose: 'old', log: [1] }), 'other': 'not ours' };
  const migrated = migrate({ length: 2, key: i => Object.keys(old)[i], getItem: k => old[k] });
  assert.equal(migrated.archived['jumpplan-old-logs'], old['jumpplan-old-logs']); assert.equal(migrated.sessions.length, 0);
  const corrupt = JSON.parse(exportData(state)); corrupt.data.sessions[0].snapshot.actions[0].dose.reps.max = -1; assert.throws(() => importData(JSON.stringify(corrupt)));
  const duplicate = JSON.parse(exportData(state)); duplicate.data.sessions.push(duplicate.data.sessions[0]); assert.throws(() => importData(JSON.stringify(duplicate)));
  assert.throws(() => importData('{bad')); assert.equal(state.sessions.length, 1);
});
test('every day can begin, record and serialize using unique action keys', () => {
  for (let day = 1; day <= 84; day++) { const state = stateWith(day); state.sessions.push(fill(begin(day))); validateState(state); }
});
test('two calendar days are not automatically 48 recovery hours', () => {
  const state = freshState(); const s = fill(begin(24, '2026-08-16')); s.endedAt = '2026-08-17T06:00:00Z'; state.sessions.push(s);
  assert.equal(plannedLoad(assess(basePlan(24), calm(), state, date, '2026-08-18T08:00:00Z').actions).jumps, 0);
  assert.equal(plannedLoad(assess(basePlan(24), calm(), state, date, '2026-08-19T06:00:00Z').actions).jumps, 8);
});
const { teachingById, teachingInventory }=require('../src/data/exerciseTeaching.ts');
const { exercises,auditedOriginalIds }=require('../src/data/exercises.ts');
test('all 147 audited IDs retained, seven explicit additions, no instructional templates or pending automatic actions',()=>{
 assert.equal(auditedOriginalIds.length,147);assert.equal(exercises.length,154);assert.equal(new Set(teachingInventory.map(t=>t.id)).size,154);
 for(const e of exercises){const t=teachingById[e.id];assert.ok(t);assert.deepEqual(e.instructions,t.steps);if(t.status!=='edited'){assert.equal(t.steps.length,0);continue;}
 assert.ok(t.steps.length>=3);assert.equal(t.keyPoints.length,3);assert.ok(t.mistakes.length>=2);
 assert.ok(!t.steps.join('').includes('先用轻重量或自重找到稳定动作轨迹'));
 }
 const sequences=teachingInventory.filter(t=>t.status==='edited'&&t.id!=='lunge-hold').map(t=>t.steps.join('|'));assert.equal(new Set(sequences).size,sequences.length);
 for(const p of fullPlan)for(const a of p.actions){assert.equal(teachingById[a.exerciseId].status,'edited');assert.equal(a.teaching.variantId,teachingById[a.exerciseId].variantId);assert.equal(a.dose.jumps,a.teaching.jumps);assert.equal(a.dose.landings,a.teaching.landings);}
});
test('event semantics: mixed feet, two-jump rounds, pure drops, jump shrug, inspection jump, actual timed calf',()=>{
 const make=(id,side='both')=>{const t=teachingById[id];return {...breathing(),exerciseId:id,teaching:t,dose:dose(3,2,{side,jumps:t.jumps,landings:t.landings,reactive:t.reactive,takeoff:t.takeoff,landing:t.landing})};};
 const single=actionLoad(make('single-leg-forward-hop-stick','each'),2);assert.equal(single.jumps,12);assert.equal(single.left,6);assert.equal(single.right,6);
 const mixed=actionLoad(make('two-step-single-leg-approach-jump','each'),2);assert.equal(mixed.jumps,12);assert.equal(mixed.leftTakeoffs,6);assert.equal(mixed.leftLandings,12);assert.equal(mixed.rightLandings,12);
 const doubleToSingle=actionLoad(make('single-leg-landing-stick','each'),2);assert.equal(doubleToSingle.leftTakeoffs,12);assert.equal(doubleToSingle.leftLandings,6);
 assert.equal(actionLoad(make('depth-drop'),2).jumps,0);assert.equal(actionLoad(make('depth-drop'),2).landings,6);
 assert.equal(actionLoad(make('depth-jump-less-contact'),2).jumps,6);assert.equal(actionLoad(make('depth-jump-less-contact'),2).landings,12);
 for(const id of ['jump-shrug','low-landing-stick'])assert.equal(actionLoad(make(id),2).jumps,6);
 assert.equal(actionLoad(make('second-jump-rebound-drill'),2).jumps,12);
 const s=begin();s.sets=[{action:{...breathing(),calf:true},reps:1,side:'both',seconds:17}];assert.equal(actualLoad(s).calfSeconds,17);
});
test('teaching snapshot survives roundtrip and malformed teaching is rejected',()=>{
 const s=stateWith();const started=startSession(s,date,`${date}T12:00:00Z`);const before=JSON.stringify(started.sessions[0].snapshot);
 assert.equal(JSON.stringify(importData(exportData(started)).sessions[0].snapshot),before);
 const bad=structuredClone(started);bad.sessions[0].actions[0].teaching.steps=42;assert.throws(()=>validateState(bad));
});
test('rising group pain stops below 3; known set pain remains unresolved without morning follow-up',()=>{
 let s=begin();let a=s.actions.find(x=>x.exerciseId==='cmj');
 s=recordSet(s,{id:'pain1',action:a,index:0,reps:1,side:'both',at:`${date}T12:00:00Z`,pain:known(1),quality:known(4)});
 s=recordSet(s,{id:'pain2',action:a,index:1,reps:1,side:'both',at:`${date}T12:05:00Z`,pain:known(2),quality:known(4)});
 assert.equal(s.symptomStopped,true);assert.equal(s.feedback.peak.value,2);assert.equal(s.actions.length,0);
 const state=stateWith();state.sessions=[endSession(s,`${date}T12:06:00Z`)];const later='2026-08-22';assert.equal(plannedLoad(assess(basePlan(31),calm(later),state,later).actions).jumps,0);
});
