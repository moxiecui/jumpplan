import { useState } from 'react';
import { useLocalToday } from '@/hooks/useLocalToday';
import { useTraining } from './TrainingProvider';
import { actualLoad, civil, progression, sessionStatus } from './engine';
import { unknown, valueOf, type JumpTest } from './model';
import { answerText, Button, Choice, Copy, Disclosure, Field, Heading, Panel, Shell } from './ui';
import { FeedbackForm } from './FeedbackForm';

export default function Records() {
  const today = useLocalToday(), { state, update } = useTraining();
  const [ballDate, setBallDate] = useState(today), [minutes, setMinutes] = useState(''), [rpe, setRpe] = useState(''), [jumps, setJumps] = useState(''), [message, setMessage] = useState('');
  const [type, setType] = useState<JumpTest['type']>('CMJ'), [method, setMethod] = useState(''), [attempts, setAttempts] = useState(''), [testDate, setTestDate] = useState(today), [linked, setLinked] = useState('');
  const [review, setReview] = useState('');
  const recent = state.sessions.filter(s => s.date <= today && civil(today) - civil(s.date) < 7 * 86400000);
  const gym = recent.reduce((sum, s) => sum + actualLoad(s).jumps, 0);
  const ball = state.basketball.filter(s => s.date <= today && civil(today) - civil(s.date) < 7 * 86400000);
  const externalTests = state.tests.filter(t => !t.sessionId && t.date <= today && civil(today) - civil(t.date) < 7 * 86400000);
  const addBall = () => {
    try {
      civil(ballDate); if (ballDate > today || !minutes.trim() || !rpe.trim() || !Number.isFinite(Number(minutes)) || Number(minutes) < 0 || Number(minutes) > 1440 || !Number.isFinite(Number(rpe)) || Number(rpe) < 0 || Number(rpe) > 10 || jumps.trim() && (!Number.isInteger(Number(jumps)) || Number(jumps) < 0 || Number(jumps) > 10000)) throw new Error('请填写有效日期、分钟、RPE；跳跃次数可留空（未知）。');
      const saved=update(s => ({ ...s, basketball: [...s.basketball, { id: `basketball-${Date.now()}`, date: ballDate, at: new Date().toISOString(), minutes: Number(minutes), rpe: Number(rpe), jumps: jumps.trim() ? { state: 'known', value: Number(jumps) } : unknown(), estimated: true }] }));
      if(!saved){setMessage('未保存，请查看存储错误；输入已保留。');return;}
      setMinutes(''); setRpe(''); setJumps(''); setMessage('篮球负荷已记录，之后的排程会考虑它。');
    } catch (e) { setMessage(String(e)); }
  };
  const addTest = () => {
    try {
      civil(testDate); const values = attempts.split(/[,，\s]+/).filter(Boolean).map(Number);
      if (testDate > today || !method.trim() || !values.length || values.some(v => !Number.isFinite(v) || v < 0 || v > 500)) throw new Error('填写已有测试的日期、测量方法和有效结果。无需今天测试。');
      const source = linked ? state.sessions.find(s => s.id === linked) : undefined;
      if (source && source.date !== testDate) throw new Error('关联训练必须与测试日期相同');
      if (source && actualLoad(source).jumps < values.length) throw new Error('关联训练的已记录跳跃少于测试次数，先检查原记录');
      const saved=update(s => ({ ...s, tests: [...s.tests, { id: `test-${Date.now()}`, date: testDate, type, method: method.trim(), attempts: values, unit: 'cm', sessionId: source?.id }] }));
      if(!saved){setMessage('未保存，请查看存储错误；输入已保留。');return;}
      setAttempts(''); setMessage('已有测试已记录；未关联训练的尝试会独立计入实际跳跃。');
    } catch (e) { setMessage(String(e)); }
  };
  return <Shell title="训练记录"><Panel><Heading>最近7天实际负荷</Heading><Copy>健身房跳跃 {gym} 次 · 额外测试 {externalTests.reduce((n, t) => n + t.attempts.length, 0)} 次</Copy><Copy>篮球：{!ball.length ? '无记录，负荷未知' : ball.every(b=>valueOf(b.jumps)===undefined)?'次数未知（已有时长/强度记录）': `${ball.reduce((n, b) => n + (valueOf(b.jumps) ?? 0), 0)}次已填写估算${ball.some(b => valueOf(b.jumps) === undefined) ? '，另有未知次数' : ''}`}</Copy><Copy muted>数据不足时不画趋势、不预测伤病；不同测试方法不混合比较。</Copy></Panel>
    <Heading>左踝与次晨反应</Heading>{state.history.filter(h => !h.id.startsWith('progress-review-')).map(h => <Panel key={h.id}><Copy>{h.recordedDate}记录 · 实际发生日期：{h.occurredDate ?? '未提供'}</Copy><Copy>{h.text}</Copy></Panel>)}
    {state.sessions.length ? [...state.sessions].reverse().map(s => <Disclosure key={s.id} title={`${s.date} · 第${s.day}天 · ${sessionStatus(s)}`}><Copy>{s.snapshot.title}</Copy><Copy>实际跳跃{actualLoad(s).jumps}次 · 左{actualLoad(s).left} / 右{actualLoad(s).right} · 小腿{actualLoad(s).calfSets}侧组 / {actualLoad(s).calfSeconds}秒等长</Copy><Copy>峰值疼痛：{answerText(s.feedback.peak)} · 次晨回到基线：{answerText(s.feedback.morning)}</Copy>
      <Disclosure title="补录训练后与次晨反馈"><FeedbackForm session={s} /></Disclosure>
      <Disclosure title="当时处方与逐组记录"><Copy>原计划：{s.base.actions.map(a => `${a.name} ${a.dose.sets}组`).join('；')}</Copy><Copy>开始时执行版：{s.snapshot.actions.map(a => `${a.name} ${a.dose.sets}组`).join('；')}</Copy>{s.snapshot.reasons.map(r => <Copy key={r}>{r}</Copy>)}{s.sets.map(r => <Copy key={r.id}>{r.action.name} 第{r.index + 1}组：{r.reps}次{r.weight === undefined ? '，重量未知' : `，${r.weight}kg`}，RPE {r.rpe ?? '未知'}</Copy>)}</Disclosure>
    </Disclosure>) : <Copy>尚无实际训练记录。历史症状不会自动视为今天无痛。</Copy>}
    <Disclosure title="记录近期篮球"><Field label="篮球日期" value={ballDate} onChange={setBallDate} /><Field label="实际分钟" value={minutes} onChange={setMinutes} numeric /><Field label="篮球RPE（0–10）" value={rpe} onChange={setRpe} numeric /><Field label="估算跳跃次数（未知留空）" value={jumps} onChange={setJumps} numeric /><Button title="保存篮球负荷" onPress={addBall} />{ball.map(b => <Copy key={b.id}>{b.date} · {b.minutes}分钟 · RPE {b.rpe} · 跳跃{answerText(b.jumps)}（估算）</Copy>)}</Disclosure>
    <Disclosure title="标准化跳跃测试（记录已有经历）"><Copy>允许跳过。只有本来适合测试时才测，不为获得进阶资格测试到疼痛。请固定测量方法、热身、鞋与场地。</Copy>
      <Choice label="测试类型" answer={{ state: 'known', value: type }} options={(['CMJ', '助跑摸高', '左单脚', '右单脚'] as const).map(value => ({ value, label: value }))} onChange={v => { if (v.state === 'known') setType(v.value); }} />
      <Field label="测试日期" value={testDate} onChange={setTestDate} /><Field label="测量方法（设备、摸高或跳高、起跳与落地侧别）" value={method} onChange={setMethod} />
      <Field label="每次结果cm（逗号分隔）" value={attempts} onChange={setAttempts} /><Choice label="是否已在训练逐组计数" answer={{ state: 'known', value: linked }} options={[{ value: '', label: '未计入（额外跳跃）' }, ...state.sessions.filter(s => s.date === testDate).map(s => ({ value: s.id, label: `${s.date} 第${s.day}天训练` }))]} onChange={v => { if (v.state === 'known') setLinked(v.value); }} />
      <Button title="保存已有测试" onPress={addTest} />{state.tests.map(t => <Copy key={t.id}>{t.date} · {t.type} · {t.method} · {t.attempts.join(' / ')}cm · {t.sessionId ? '已关联训练，不重复累计' : '额外跳跃已计入'}</Copy>)}
    </Disclosure>
    <Disclosure title="力量进展"><Copy>仅比较相同动作的实际组次、重量、RPE与质量。没有重量或次晨反馈时，不判断进步或自动加重。</Copy>{state.sessions.flatMap(s => s.sets.filter(r => r.weight !== undefined).map(r => <Copy key={`${s.id}-${r.id}`}>{s.date} · {r.action.name} · {r.reps}次 × {r.weight}kg · RPE {r.rpe ?? '未知'}</Copy>))}</Disclosure>
    <Disclosure title="进阶依据与复核记录"><Copy>{progression(state, today).reason}</Copy><Field label="复核内容（当前功能、症状处理、基础训练反应）" value={review} onChange={setReview} multiline /><Button title="保存进阶复核" disabled={!review.trim()} onPress={() => { update(s => ({ ...s, history: [...s.history, { id: `progress-review-${Date.now()}`, recordedDate: today, occurredDate: today, site: '整体训练复核', side: 'both', text: review.trim() }] })); setReview(''); }} /><Copy>复核只是记录，不等同于医生许可。反复疼痛需要专业评估；两次无痛不能直接解锁高冲击。</Copy>{state.history.filter(h => h.id.startsWith('progress-review-')).map(h => <Copy key={h.id}>{h.recordedDate}：{h.text}</Copy>)}</Disclosure>
    {message ? <Panel><Copy>{message}</Copy></Panel> : null}
  </Shell>;
}
