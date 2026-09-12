import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { Text } from 'react-native';
import { useLocalToday } from '@/hooks/useLocalToday';
import { useTraining } from './TrainingProvider';
import { actualLoad, assess, dayForDate, endSession, progression, recordSet, sessionStatus, startSession, stopForSymptoms } from './engine';
import { basePlan, breathing, DOSE_SOURCE, duration, PHASES } from './plan';
import { valueOf, type Action, type Answer, type Session } from './model';
import { ActionDetails, ActionList, answerText, Button, Choice, Copy, Disclosure, doseText, Field, Heading, LoadText, Panel, Row, Score, Shell } from './ui';
import { FeedbackForm } from './FeedbackForm';

function CurrentSet({ session, action }: { session: Session; action: Action }) {
  const { update } = useTraining();
  const completed = session.sets.filter(x => x.action.key === action.key), index = completed.length;
  const [reps, setReps] = useState(String(action.dose.reps.max)), [weight, setWeight] = useState(''), [rpe, setRpe] = useState('');
  const [pain, setPain] = useState<Answer<number>>({ state: 'unanswered' }), [quality, setQuality] = useState<Answer<number>>({ state: 'unanswered' });
  const [seconds,setSeconds]=useState(String(action.dose.seconds??0));
  const [side, setSide] = useState(action.dose.side), [error, setError] = useState('');
  const mutate = (fn: (x: Session) => Session) => update(s => ({ ...s, sessions: s.sessions.map(x => x.id === session.id ? fn(x) : x) }));
  const save = () => {
    const actualSeconds=Number(seconds);
    if(action.dose.seconds!==undefined&&(!seconds.trim()||!Number.isFinite(actualSeconds)||actualSeconds<0||actualSeconds>action.dose.seconds)){setError('请输入0至本次计划时长之间的实际秒数。');return;}
    const n = Number(reps), w = weight.trim() ? Number(weight) : undefined, r = rpe.trim() ? Number(rpe) : undefined;
    if (!reps.trim() || !Number.isInteger(n) || n < 0 || n > action.dose.reps.max || w !== undefined && (!Number.isFinite(w) || w < 0 || w > 2000) || r !== undefined && (!Number.isFinite(r) || r < 0 || r > 10)) { setError('请输入有效实际次数、重量和RPE；额外训练请单独记录。'); return; }
    mutate(s => {
      const next = recordSet(s, { id: `${session.id}-${action.key}-${index}`, action: structuredClone(action), index, reps: n, side, weight: w, rpe: r,
        seconds: action.dose.seconds===undefined?undefined:actualSeconds, at: new Date().toISOString(), pain, quality });
      return (valueOf(pain) ?? 0) >= 3 ? stopForSymptoms(next) : next;
    });
    setError(''); setPain({ state: 'unanswered' }); setQuality({ state: 'unanswered' });
  };
  return <Panel><Heading>{action.name}</Heading><Copy>第 {index + 1} / {action.dose.sets} 组 · {doseText(action)}</Copy>
    <Text style={{ fontSize: 32, fontWeight: '800', color: '#152238' }}>{action.dose.seconds ? `${action.dose.seconds} 秒` : `${action.dose.reps.min === action.dose.reps.max ? action.dose.reps.max : `${action.dose.reps.min}–${action.dose.reps.max}`} 次`}</Text>
    <Copy>负重：{action.dose.load} · RPE {action.dose.rpe}</Copy>
    <Copy muted>上一组：{completed.length ? `${completed.at(-1)!.reps}次${completed.at(-1)!.weight !== undefined ? `，${completed.at(-1)!.weight}kg` : ''}，疼痛${answerText(completed.at(-1)!.pain)}` : '尚无记录'}</Copy>
    <Field label={action.dose.seconds ? '完成的计时段数（未完成填0，完成填1）' : '本组实际次数'} numeric value={reps} onChange={setReps} />
    {action.dose.seconds!==undefined?<Field label="本段实际秒数" numeric value={seconds} onChange={setSeconds}/>:null}
    {action.dose.side === 'each' ? <Choice label="本组实际侧别" answer={{ state: 'known', value: side }} options={[{ value: 'each', label: '左右各完成以上次数' }, { value: 'left', label: '只完成左侧' }, { value: 'right', label: '只完成右侧' }]} onChange={v => { if (v.state === 'known') setSide(v.value); }} /> : null}
    {error ? <Copy>{error}</Copy> : null}<Button title="完成本组并保存" primary onPress={save} />
    <Button title="疼痛上升 / 动作改变 · 立即停止" danger onPress={() => mutate(stopForSymptoms)} />
    <Disclosure title="本组疼痛、重量与质量（可选）"><Score label="本组疼痛（可保留未知）" answer={pain} onChange={v => { setPain(v); if ((valueOf(v) ?? 0) >= 3) mutate(s => stopForSymptoms({ ...s, feedback: { ...s.feedback, peak: v } })); }} /><Field label="实际重量kg（可留空）" numeric value={weight} onChange={setWeight} /><Field label="本组RPE（0–10，可留空）" numeric value={rpe} onChange={setRpe} /><Score label="本组动作质量" answer={quality} onChange={v => { setQuality(v); if ((valueOf(v) ?? 5) <= 2) mutate(stopForSymptoms); }} min={1} max={5} /></Disclosure>
    <Row><Button title="减少一组" disabled={action.dose.sets <= index + 1} onPress={() => mutate(s => ({ ...s, actions: s.actions.map(a => a.key === action.key ? { ...a, dose: { ...a.dose, sets: a.dose.sets - 1 } } : a), changes: [...s.changes, `${action.name}减少一组`] }))} />
      <Button title="跳过剩余组" onPress={() => mutate(s => ({ ...s, skipped: [...s.skipped, action.key], changes: [...s.changes, `${action.name}跳过剩余组`] }))} /></Row>
    <Disclosure title="更换动作"><Copy>替代也必须舒适。可换成呼吸；若有症状请用停止按钮，不需要继续完成。</Copy><Button title="换成舒适体位呼吸" onPress={() => mutate(s => ({ ...s, actions: s.actions.map(a => a.key === action.key ? { ...breathing(), key: `${a.key}-breathing` } : a), changes: [...s.changes, `${action.name}改为舒适体位呼吸，不计为原训练刺激`] }))} /></Disclosure>
    <ActionDetails action={action} />
  </Panel>;
}
function TrainingMode({ session, onExit }: { session: Session; onExit: () => void }) {
  const { update } = useTraining(), [now, setNow] = useState(() => Date.now());
  const [partial, setPartial] = useState('');
  const [partialSide,setPartialSide]=useState<'each'|'left'|'right'>('each');
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const current = session.actions.find(a => !session.skipped.includes(a.key) && session.sets.filter(r => r.action.key === a.key).length < a.dose.sets);
  const mutate = (fn: (s: Session) => Session) => update(s => ({ ...s, sessions: s.sessions.map(x => x.id === session.id ? fn(x) : x) }));
  const actual = actualLoad(session), remaining = Math.max(0, Math.ceil(((session.restUntil ?? 0) - now) / 1000));
  return <><Button title={session.endedAt?'返回今天':'暂时离开训练（保留记录）'} onPress={onExit}/><Panel><Heading>{session.snapshot.title}</Heading><Copy>计划第{session.day}天 · 实际开始于 {session.date} · {sessionStatus(session)}</Copy><Copy>已记录跳跃 {actual.jumps} 次 · 左 {actual.left} / 右 {actual.right}</Copy>{!session.endedAt ? <Copy>组间休息：{remaining > 0 ? `剩余 ${remaining} 秒` : '计时结束 / 尚未开始'}</Copy> : null}</Panel>
    {!session.endedAt && !session.symptomStopped && current ? <CurrentSet key={`${current.key}-${session.sets.filter(r => r.action.key === current.key).length}`} session={session} action={current} /> : null}
    {session.symptomStopped ? <Panel warning><Heading>已停止，不必补齐</Heading><Copy>剩余动作已移除。记录已发生的症状即可。持续反复疼痛、明显肿胀、失稳或承重困难时寻求专业评估。</Copy>
      {session.interruptedAction && !session.endedAt && !session.sets.some(r => r.id === `${session.id}-interrupted`) ? <Disclosure title="补录停止前已做的部分（不继续训练）"><Copy>{session.interruptedAction.name}；仅记录尚未保存的次数，留空不计入。{session.interruptedAction.dose.side === 'each' ? '选择停止前实际完成的一侧或左右相同次数，不推算另一侧。' : ''}</Copy><Choice label="停止前实际侧别" answer={{state:'known',value:partialSide}} options={[{value:'each',label:'左右相同次数'},{value:'left',label:'仅左侧'},{value:'right',label:'仅右侧'}]} onChange={v=>{if(v.state==='known')setPartialSide(v.value);}}/><Field label="停止前本组实际次数" value={partial} onChange={setPartial} numeric /><Button title="保存停止前已做部分" disabled={!partial.trim() || !Number.isInteger(Number(partial)) || Number(partial) < 0 || Number(partial) > session.interruptedAction.dose.reps.max} onPress={() => mutate(s => !s.interruptedAction || s.sets.some(r => r.id === `${s.id}-interrupted`) ? s : { ...s, sets: [...s.sets, { id: `${s.id}-interrupted`, action: s.interruptedAction, index: s.sets.filter(r => r.action.key === s.interruptedAction!.key).length, reps: Number(partial), side: s.interruptedAction.dose.side==='each'?partialSide:s.interruptedAction.dose.side, at: new Date().toISOString(), pain: s.feedback.peak, quality: { state: 'unanswered' } }] })} /></Disclosure> : null}
    </Panel> : null}
    {!session.endedAt ? <><Row><Button title="撤销上一组记录" disabled={!session.sets.length} onPress={() => mutate(s => ({ ...s, sets: s.sets.slice(0, -1), restUntil: undefined }))} /><Button title="撤销最近跳过" disabled={!session.skipped.length} onPress={() => mutate(s => ({ ...s, skipped: s.skipped.slice(0, -1) }))} /></Row><Button title="结束并记录本节" primary onPress={() => mutate(s => endSession(s, new Date().toISOString()))} /></> : null}
    <Disclosure title="处方快照、调整与实际记录"><Copy>开始时处方已锁定。后续评估不会悄悄改写本节；减少组数与替代另行记录。</Copy><Heading>开始时计划负荷</Heading><LoadText actions={session.base.actions} /><Heading>调整后开始处方</Heading><LoadText actions={session.snapshot.actions} /><Heading>当前剩余安排</Heading><LoadText actions={session.actions.filter(a => !session.skipped.includes(a.key)).map(a => ({ ...a, dose: { ...a.dose, sets: Math.max(0, a.dose.sets - session.sets.filter(r => r.action.key === a.key).length) } }))} />
      {session.changes.map((c, i) => <Copy key={i}>{c}</Copy>)}{session.sets.map(r => <Copy key={r.id}>{r.action.name} 第{r.index + 1}组：{r.reps}次 · {r.side === 'each' ? '每侧' : r.side === 'left' ? '左' : r.side === 'right' ? '右' : '双侧'} · 疼痛{answerText(r.pain)}</Copy>)}
    </Disclosure><Panel><Heading>训练后简短反馈</Heading><FeedbackForm session={session} /><Copy muted>反馈自动保存，可以现在离开；次晨再到记录页补充。</Copy><Button title="返回今天" primary onPress={onExit}/></Panel></>;
}
export default function Today() {
  const date = useLocalToday(), { state, update } = useTraining(), router = useRouter();
  const {training}=useLocalSearchParams<{training?:string}>();
  const [clock, setClock] = useState(() => new Date().toISOString());
  useEffect(() => { const timer = setInterval(() => setClock(new Date().toISOString()), 60000); return () => clearInterval(timer); }, []);
  const day = dayForDate(state, date), active = state.sessions.find(s => !s.endedAt), completed = state.sessions.find(s => s.date === date && s.endedAt);
  const session = active ?? completed, base = day === null ? undefined : basePlan(day), assessment = state.assessments[date];
  const p = base ? assess(base, assessment, state, date, clock) : undefined;
  const inTraining=!!session&&training==='1';
  const enter=()=>router.replace('/?training=1');
  return <Shell key={inTraining?'session':'home'} title={inTraining ? active?'训练中':'训练反馈' : '今天练什么'}>
    {inTraining&&session ? <TrainingMode session={session} onExit={()=>router.replace('/')} /> : session ? <>
      <Panel><Heading>{date} · 今日训练摘要</Heading><Heading>{sessionStatus(session)}</Heading><Copy>计划第{session.day}天 · 实际训练日期 {session.date}</Copy><Copy>{session.snapshot.title}</Copy><Copy>已记录跳跃 {actualLoad(session).jumps} 次</Copy><Copy>{session.endedAt?'本节已结束，记录已保存。次晨反应可以稍后补充。':'训练已保留，可以继续；暂时离开不会结束训练或清除计时。'}</Copy><Button title={session.endedAt?'查看 / 补充训练反馈':'继续本节训练'} primary onPress={enter}/></Panel>
      <Button title="查看训练记录" onPress={()=>router.push('/records' as Href)}/><Button title="查看计划" onPress={()=>router.push('/plan')}/>
    </> : p ? <>
      <Panel><Heading>{date} · 计划第{day}天</Heading><Copy>第 {p.week} / 12 周 · {PHASES[p.phase - 1]}</Copy><Heading>{p.title}</Heading><Copy>{p.goal}</Copy><Copy muted>预计 {duration(p)} 分钟</Copy></Panel>
      <Panel warning={p.level !== 'maintain'}><Heading>{p.level === 'unassessed' ? '尚未评估' : p.level === 'restricted' ? '已评估 · 已调整' : '已评估 · 维持基础训练'}</Heading><Copy>左踝：{assessment ? answerText(assessment.ankle) : '未填写'} · 次晨恢复：{assessment ? answerText(assessment.morning) : '未填写'}</Copy><Copy>{p.reasons[0]}</Copy><Button title="填写 / 更新训练前状态" onPress={() => router.push('/checkin')} /></Panel>
      {state.skippedDates.includes(date) ? <Panel><Copy>今天已跳过，不补课、不累计训练刺激。</Copy><Button title="撤销今日跳过" onPress={() => update(s => ({ ...s, skippedDates: s.skippedDates.filter(d => d !== date) }))} /></Panel> : <Button title={p.level === 'unassessed' ? '开始保守训练' : '开始今日训练'} primary onPress={() => { if(update(s => startSession(s, date, new Date().toISOString()))) enter(); }} />}
      <Heading>今日执行动作</Heading><LoadText actions={p.actions} /><ActionList actions={p.actions} />
      <Disclosure title="原计划、修改内容和原因"><Heading>{base!.title}</Heading><Copy>{base!.goal}</Copy><LoadText actions={base!.actions} /><Copy>原计划动作：{base!.actions.map(a => `${a.name} ${doseText(a)}`).join('；')}</Copy>{p.reasons.map(r => <Copy key={r}>{r}</Copy>)}<Copy>{DOSE_SOURCE}</Copy></Disclosure>
      <Disclosure title="何时进阶"><Copy>{progression(state, date).reason}</Copy><Copy>力量进阶需本动作实际完成、质量良好、无症状且次晨回到基线；下一次只尝试调整一个变量（例如最小幅度加重量）。本App不按日历自动增加组数或强度。</Copy></Disclosure>
      <Disclosure title="今日安排"><Copy>查看历史不改变训练进度；跳过不自动补课。</Copy><Button title="今天跳过训练" onPress={() => update(s => ({ ...s, skippedDates: [...new Set([...s.skippedDates, date])] }))} /><Button title="在计划页查看或调整安排" onPress={() => router.push('/plan')} /></Disclosure>
    </> : <Panel><Heading>{date < state.startDate ? '计划尚未开始' : '84天计划已结束'}</Heading><Copy>不循环执行最后一天，不自动补课或解锁新阶段。查看记录并复盘后再制定下一阶段。</Copy><Button title="查看12周计划" onPress={() => router.push('/plan')} /></Panel>}
    <Copy muted>今天的饮食提醒：正常吃饭，训练前后安排碳水和蛋白质，按口渴与出汗情况补水。</Copy>
  </Shell>;
}
