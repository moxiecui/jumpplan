import { teachingById, executableTeaching } from '@/data/exerciseTeaching';
import type { Action, Dose, Prescription, Range } from './model';

export const PLAN_VERSION = '84-day-structured-3';
export const PHASES = ['力量基础与动作控制', '力量转爆发', '篮球起跳转化', '减量、测试与复盘'];
export const DOSE_SOURCE = '组次、48小时排程和进阶记录条件是可调整的保守产品规则，不是医学安全上限。参考 NSCA 的低量、少动作原则；适用于已能舒适完成相应基础动作的人，执行前仍需当日评估。';
const stop = '疼痛达到3/10、持续上升或动作明显改变时立即停止；3/10是本App的保守停止规则，不是诊断标准。';
const range = (n: number): Range => ({ min: n, max: n });
export function dose(sets: number, reps: number | Range, extra: Partial<Dose> = {}): Dose {
  return { sets, reps: typeof reps === 'number' ? range(reps) : reps, side: 'both', jumps: 0, landings: 0,
    reactive: false, maxIntent: false, rest: 90, load: '自重或熟悉的轻负重', rpe: '5–6，保留余力', ...extra };
}
const item = (id: string, name: string, d: Dose, extra: Partial<Action> = {}): Action => ({
  key: id, exerciseId: id, name, teaching: teachingById[id], dose: {...d, takeoff:teachingById[id]?.takeoff ?? d.takeoff, landing:teachingById[id]?.landing ?? d.landing, jumps:teachingById[id]?.jumps ?? d.jumps, landings:teachingById[id]?.landings ?? d.landings, reactive:teachingById[id]?.reactive ?? d.reactive}, role: 'main', lower: true, calf: false,
  cue: '动作可控，躯干稳定，膝盖朝向脚尖；不为完成次数改变动作。', stop,
  alternative: '减少幅度或负重仍不舒适就停止；可选舒适的坐姿呼吸或结束，不自动换成跳跃/等长。', ...extra
});
export const breathing = (): Action => item('seated-relaxed-breathing', '舒适坐姿呼吸', dose(1, 1, { seconds: 180, rest: 0, load: '无需负重', rpe: '舒适' }), {
  role: 'recovery', lower: false, cue: '选择不引起症状的有支撑坐姿，自然呼吸。', alternative: '不舒适则结束休息。'
});
const warmup = (lower: boolean): Action[] => [
  item('easy-bike', lower ? '轻松骑车升温' : '坐姿上肢活动升温', dose(1, 1, { seconds: 300, rest: 0, rpe: '2–3' }), { role: 'warmup', lower, cue: '逐渐升温；下肢不舒适时停止骑车，不用跳跃测试热身。' }),
  item(lower ? 'goblet-squat' : 'dumbbell-bench-press', '主动作专项准备', dose(2, 5, { rest: 60, load: '徒手/空杆或极轻负重', rpe: '2–3' }), { key: 'warmup-specific', role: 'warmup', lower, cue: '排练当天主动作，第一组轻负重、第二组稍接近工作重量；不额外加跳跃。' })
];
const cmj = (sets: number, maxIntent = false) => item('cmj', '反向纵跳 CMJ', dose(sets, 2, { jumps: 1, landings: 1, maxIntent, rest: 150, load: '自重', rpe: maxIntent ? '最大意图，每次完全重置' : '次最大意图，轻快而可控' }), { cue: '每次重新站稳，摆臂起跳，安静落地；不连续追跳。' });
const pogo = () => item('low-pogo', '低幅连续 Pogo（需额外进阶依据）', dose(2, 3, { jumps: 1, landings: 1, reactive: true, rest: 120, load: '自重', rpe: '低幅，不追求高度' }), { cue: '每次重复就是一个起跳和一次落地；不测试疼痛阈值，不因短组增加总组数。' });
const approach = () => item('two-step-single-leg-approach-jump', '两步单脚起跳、双脚落地', dose(2, 1, { side: 'each', takeoff:'working', landing:'both', jumps: 1, landings: 1, rest: 150, rpe: '次最大意图，充分重置' }), { cue: '右脚起跳按左—右最后两步，双脚缓冲落地；左右按起跳腿分别记录。' });
export const secondJump = (): Action => item('second-jump-rebound-drill', '二次起跳', dose(2, 1, { jumps: 2, landings: 2, reactive: true, rest: 180 }), { cue: '1次重复包含首次起跳、落地、第二次起跳和落地，共2个跳跃事件。' });
const box = () => item('box-jump', '低箱跳（走下箱）', dose(2, 2, { jumps: 1, landings: 1, rest: 150 }), { cue: '选能稳定落地的低箱，逐次重置，走下箱而非跳下。' });

export function basePlan(day: number): Prescription {
  if (!Number.isInteger(day) || day < 1 || day > 84) throw new Error('计划日必须在1–84之间');
  const week = Math.ceil(day / 7), phase = Math.ceil(day / 21), weekday = (day - 1) % 7 + 1;
  const deload = week % 3 === 0 || week === 11;
  const sets = deload ? 2 : 3;
  let kind: Prescription['kind'] = '恢复', goal = '恢复与观察次晨反应，不补课', actions: Action[] = [breathing()];
  // Three separated gym slots. Basketball replaces impact; never adds a catch-up slot.
  if (weekday === 1 || weekday === 5) {
    kind = weekday === 1 ? '力量A' : '力量B'; goal = '发展基础力量，保留动作质量与恢复余地';
    const main = weekday === 1
      ? item('trap-bar-deadlift', '六角杠硬拉', dose(sets, 5, { rest: 180, load: '熟悉重量；最后一组仍保留约3次余力', rpe: deload ? '5–6' : '6–7' }), { cue: '先收紧躯干，脚掌稳定推地，髋膝一起伸展。' })
      : item('goblet-squat', '高脚杯深蹲', dose(sets, 6, { rest: 150, rpe: deload ? '5–6' : '6–7' }));
    actions = [...warmup(true), main,
      item('one-arm-dumbbell-row', '支撑单臂哑铃划船', dose(sets, 8, { side: 'each', rest: 90 }), { lower: false, cue: '以长凳支撑，躯干不旋转。' }),
      item('dead-bug', '死虫式', dose(deload ? 1 : 2, 5, { side: 'each', rest: 60 }), { role: 'support', lower: false, cue: '呼气时伸展对侧手脚，腰背保持可控。' })];
    if (weekday === 1) actions.push(item('single-leg-calf-raise', '扶持单脚提踵', dose(deload ? 1 : 2, 6, { side: 'each', rest: 90 }), { role: 'support', calf: true, cue: '只有当前踝部和日常承重舒适才做；扶持平衡，不追求拉伸痛。' }));
  } else if (weekday === 3) {
    kind = '爆发技术'; goal = phase < 3 ? '在疲劳前练习少量独立起跳' : '在满足条件时把基础力量用于篮球起跳';
    actions = [...warmup(true), cmj(deload ? 1 : 2), ...(phase === 2 && !deload ? [box()] : []),
      // Select ONE specialty slot, never append the entire exercise menu.
      ...(phase === 3 && !deload ? [week === 8 ? approach() : pogo()] : [])];
  } else if (weekday === 6) {
    kind = '篮球技术'; goal = '低强度原地控球；实战需另记负荷并替代冲击训练';
    actions = [item('easy-bike', '轻松升温', dose(1, 1, { seconds: 300, rest: 0, rpe: '2–3' }), { role: 'warmup' }),
      item('stationary-ball-handling', '原地控球（不跑跳）', dose(1, 1, { seconds: deload ? 600 : 900, rest: 0, rpe: '2–3' }), { cue: '仅舒适站立或坐姿控球，不包括对抗、冲刺、变向与跳投。' })];
  } else if (weekday === 7 && week % 3 === 0) {
    kind = '测试与复盘'; goal = '可跳过测试；回顾实际完成、症状与次晨恢复';
    actions = [...warmup(true), cmj(1, true)];
  }
  // Requested anchor days remain auditable; no Pogo in cycle 2.
  if (day === 24) { kind = '爆发技术'; goal = '独立起跳质量，取消连续Pogo与检查跳'; actions = [...warmup(true), cmj(2), box()]; }
  if (day === 31) { kind = '爆发技术'; goal = '少量单脚起跳转化，不增加连续弹跳总量'; actions = [...warmup(true), cmj(2), approach()]; }
  if (day === 26 || day === 33) { kind = '力量B'; goal = '单一蹲模式与上肢拉力，减少重复单腿堆叠'; actions = [...warmup(true), item('goblet-squat', '高脚杯深蹲', dose(3, 6, { rest: 150 })), item('one-arm-dumbbell-row', '支撑单臂哑铃划船', dose(3, 8, { side: 'each' }), { lower: false })]; }
  const main = actions.find(a=>a.role==='main');
  if(main?.exerciseId==='trap-bar-deadlift') actions=actions.map(a=>a.key==='warmup-specific'?{...main,key:a.key,role:'warmup',name:'六角杠硬拉专项准备',dose:{...main.dose,sets:2,reps:range(5),rest:60,load:'空杠或熟悉的极轻负重',rpe:'2–3'}}:a);
  if(actions.some(a=>!executableTeaching(a.exerciseId))) throw new Error('未核实或未选择的动作不能进入自动计划');
  return { version: PLAN_VERSION, day, week, phase, kind, title: `${kind}${deload ? ' · 减量' : ''}`, goal, deload, actions, reasons: [], level: 'unassessed' };
}
export const fullPlan = Array.from({ length: 84 }, (_, i) => basePlan(i + 1));
export const summary = (p: Prescription) => p.actions.filter(a => a.role === 'main').map(a => a.name).join('、') || '舒适休息与症状记录';
export function duration(p: Prescription) {
  return Math.max(3, Math.ceil(p.actions.reduce((n, a) => n + a.dose.sets * ((a.dose.seconds ?? a.dose.reps.max * 5) * (a.dose.side === 'each' ? 2 : 1)) + Math.max(0, a.dose.sets - 1) * a.dose.rest + 45, 0) / 60));
}
