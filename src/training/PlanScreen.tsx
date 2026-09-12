import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useLocalToday } from '@/hooks/useLocalToday';
import { useTraining } from './TrainingProvider';
import { assess, civil, dateForDay, dayForDate, sessionStatus, stimulus } from './engine';
import { basePlan, DOSE_SOURCE, fullPlan, PHASES, summary } from './plan';
import { ActionList, Button, Copy, Disclosure, Field, Heading, LoadText, Panel, Row, Shell } from './ui';

export default function Plan() {
  const today = useLocalToday(), { state, update } = useTraining(), router = useRouter();
  const current = dayForDate(state, today), [selectedWeek, setWeek] = useState<number | null>(null);
  const week = selectedWeek ?? (current ? Math.ceil(current / 7) : today < state.startDate ? 1 : 12);
  const days = fullPlan.filter(d => d.week === week);
  const [arrangeDate, setDate] = useState(today), [arrangeDay, setDay] = useState(''), [message, setMessage] = useState('');
  const apply = () => {
    try {
      civil(arrangeDate); const n = Number(arrangeDay);
      if (!Number.isInteger(n) || n < 1 || n > 84) throw new Error('计划日应在1–84之间');
      if (arrangeDate < today) throw new Error('历史日期只可查看，不重排已过去训练');
      if (state.sessions.some(s => s.date === arrangeDate)) throw new Error('该日期已有训练记录，处方快照不可覆盖');
      update(s => ({ ...s, overrides: { ...s.overrides, [arrangeDate]: n } })); setMessage('仅修改该日期；其他日期保持原安排，缺课不会自动补齐。');
    } catch (e) { setMessage(String(e)); }
  };
  const weekStart = dateForDay(state.startDate, (week - 1) * 7 + 1), weekEnd = dateForDay(state.startDate, week * 7);
  return <Shell title="训练计划"><Copy>12周 / 84天 · 日历安排不代表已获得进阶资格</Copy>
    <Row><Button title="上一周" disabled={week === 1} onPress={() => setWeek(week - 1)} /><Button title="回到当前周" onPress={() => setWeek(null)} /><Button title="下一周" disabled={week === 12} onPress={() => setWeek(week + 1)} /></Row>
    <Heading>第 {week} / 12 周 · {PHASES[Math.ceil(week / 3) - 1]}</Heading>
    <Panel>{days.map(p => {
      const date = dateForDay(state.startDate, p.day), actual = state.sessions.filter(s => s.date === date), scheduled = basePlan(state.overrides[date] ?? p.day);
      const adjusted = state.assessments[date] ? assess(scheduled, state.assessments[date], state, date) : undefined;
      return <Disclosure key={p.day} title={`${date === today ? '今天 · ' : ''}${date.slice(5)} · 第${scheduled.day}天 · ${scheduled.title}`} subtitle={summary(scheduled)} status={`${actual.length ? actual.map(sessionStatus).join('、') : state.skippedDates.includes(date) ? '已跳过' : date < today ? '无记录' : '待训练'}${state.overrides[date] ? ' · 已改安排' : ''}${actual[0]?.snapshot.level === 'restricted' || adjusted?.level === 'restricted' ? ' · 已调整' : ' · 开始前评估'}`}>
        <Copy>主训练：{summary(scheduled)}</Copy><Copy>实际状态：{actual.length ? actual.map(sessionStatus).join('、') : state.skippedDates.includes(date) ? '已跳过' : date < today ? '无训练记录（不等于已完成）' : '待训练'}</Copy>
        <Copy>{state.overrides[date] ? '该日期已重新安排 · ' : ''}{actual[0]?.snapshot.reasons.length || adjusted?.level === 'restricted' ? '有调整，请查看记录/当天评估' : '开始前需评估'}</Copy><LoadText actions={scheduled.actions} /><Button title={`查看第${scheduled.day}天`} onPress={() => router.push(`/plan/${scheduled.day}`)} />
      </Disclosure>;
    })}</Panel>
    <Panel><Heading>本周目标与实际</Heading>{(['力量A', '力量B', '爆发技术'] as const).map(kind => {
      const target = Array.from({ length: 7 }, (_, i) => { const d = dateForDay(state.startDate, (week - 1) * 7 + i + 1); return basePlan(state.overrides[d] ?? days[i].day); }).filter(p => p.kind === kind).length;
      const actual = new Set(state.sessions.filter(s => s.date >= weekStart && s.date <= weekEnd && s.snapshot.kind === kind && stimulus(s)).map(s => s.id)).size;
      return target || actual ? <Copy key={kind}>{kind}：已完成{actual}次，目标{target}次</Copy> : null;
    })}<Copy muted>目标用于回顾，不是必须补齐的配额。因症状停止、全部跳过不计为关键刺激。</Copy></Panel>
    <Disclosure title="12周总览（按阶段展开）">{PHASES.map((name, i) => <Disclosure key={name} title={`阶段${i + 1} · ${name} · 第${i * 21 + 1}–${(i + 1) * 21}天`}><Copy>第{i * 3 + 3}周真实减少组数及暴露；条件不足时维持或转恢复。</Copy>{[1, 2, 3].map(w => <Button key={w} title={`查看第${i * 3 + w}周`} onPress={() => setWeek(i * 3 + w)} />)}</Disclosure>)}</Disclosure>
    <Disclosure title="改变某一天的安排"><Field label="安排日期（YYYY-MM-DD）" value={arrangeDate} onChange={setDate} /><Field label="执行哪个计划日（1–84）" value={arrangeDay} onChange={setDay} numeric /><Button title="仅修改这一天" onPress={apply} />{message ? <Copy>{message}</Copy> : null}<Copy>开始训练后仍会应用当天状态和恢复间隔限制，不会因调换日程绕过疼痛规则。</Copy></Disclosure>
    <Disclosure title="剂量来源与计数说明"><Copy>{DOSE_SOURCE}</Copy><Copy>双脚跳一次=1次跳跃，同时左右各1次暴露；3×2/侧=12次跳跃，每侧6次。连续跳每次起跳都计入；二次起跳每次重复=2次跳跃。独立落地单列。连续反应性为总跳跃子集，不是加权风险分数。篮球另列估算，未知不是0。</Copy></Disclosure>
  </Shell>;
}
export function PlanDay() {
  const params = useLocalSearchParams<{ day: string }>(), n = Number(params.day), { state } = useTraining();
  if (!Number.isInteger(n) || n < 1 || n > 84) return <Shell title="计划日不存在"><Copy>计划范围为第1–84天。</Copy></Shell>;
  const p = basePlan(n);
  return <Shell title={`第${n}天 · ${p.title}`}><Copy>基础计划只读预览 · {dateForDay(state.startDate, n)} · {PHASES[p.phase - 1]}</Copy><Copy>{p.goal}</Copy><Panel warning><Copy>查看本页不会改变今天的进度或安排。基础剂量不是执行许可，训练需从今天页经评估开始。</Copy></Panel><LoadText actions={p.actions} /><ActionList actions={p.actions} /><Copy muted>{DOSE_SOURCE}</Copy></Shell>;
}
