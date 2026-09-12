import { useRouter } from 'expo-router';
import { useLocalToday } from '@/hooks/useLocalToday';
import { useTraining } from './TrainingProvider';
import { emptyAssessment, type Assessment } from './model';
import { valueOf } from './model';
import { stopForSymptoms } from './engine';
import { Button, Choice, Copy, Disclosure, Field, Heading, Panel, Score, Shell, yesNo } from './ui';

export default function CheckIn() {
  const today = useLocalToday(), { state, update } = useTraining(), router = useRouter();
  const a = state.assessments[today] ?? emptyAssessment(today);
  const change = <K extends keyof Assessment>(key: K, value: Assessment[K]) => update(s => {
    const next = { ...(s.assessments[today] ?? emptyAssessment(today)), [key]: value };
    const pain = (valueOf(next.ankle) ?? 0) > 0 || valueOf(next.rising) === true || next.otherPain.some(p => (valueOf(p.pain) ?? 0) > 0);
    const fn = valueOf(next.function), changed = fn !== undefined && fn !== 'normal';
    return { ...s, assessments: { ...s.assessments, [today]: next }, sessions: s.sessions.map(session => !session.endedAt && (pain || changed) ? stopForSymptoms(session) : session) };
  });
  return <Shell title="训练前状态"><Copy>{today} · 每项选择自动保存。无需跳到疼痛来测试，未知就保留未知。</Copy>
    <Panel><Heading>先看左踝与恢复</Heading><Score label="当前左踝内侧疼痛（0–10）" answer={a.ankle} onChange={v => change('ankle', v)} />
      <Choice label="日常功能" answer={a.function} onChange={v => change('function', v)} options={[
        { value: 'normal', label: '承重与步行正常' }, { value: 'changed', label: '动作明显改变' }, { value: 'swelling', label: '明显肿胀' }, { value: 'unstable', label: '失稳' }, { value: 'weight-bearing', label: '承重困难' }]} />
      <Choice label="疼痛是否持续上升" answer={a.rising} options={yesNo} onChange={v => change('rising', v)} />
      <Choice label="近期是否持续反复疼痛" answer={a.recurrent} options={yesNo} onChange={v => change('recurrent', v)} />
      <Score label="上一节训练后疼痛（0–10）" answer={a.after} onChange={v => change('after', v)} na />
      <Choice label="上一节次晨是否恢复个人基线" answer={a.morning} onChange={v => change('morning', v)} options={yesNo} na />
      <Copy muted>“不适用”仅用于没有上一节训练。尚未到次晨应选未知；回到基线不等于已伤愈。</Copy>
    </Panel>
    <Panel><Heading>实际负荷与主观恢复</Heading><Choice label="最近48小时篮球负荷" answer={a.basketball} onChange={v => change('basketball', v)} options={[{ value: 'none', label: '明确没有' }, { value: 'light', label: '轻' }, { value: 'moderate', label: '中等' }, { value: 'high', label: '高' }]} />
      <Score label="基础动作质量（1差–5好，不需跳跃）" answer={a.quality} onChange={v => change('quality', v)} min={1} max={5} />
      <Score label="整体疲劳（1低–5高）" answer={a.fatigue} onChange={v => change('fatigue', v)} min={1} max={5} />
    </Panel>
    <Disclosure title="其他疼痛部位（按需填写）">{a.otherPain.map((p, i) => <Panel key={i}>
      <Field label={`部位${i + 1}`} value={p.site} onChange={v => change('otherPain', a.otherPain.map((x, j) => j === i ? { ...x, site: v } : x))} />
      <Choice label={`部位${i + 1}侧别`} answer={{ state: 'known', value: p.side }} options={[{ value: 'left', label: '左' }, { value: 'right', label: '右' }, { value: 'both', label: '双侧' }]} onChange={v => { if (v.state === 'known') change('otherPain', a.otherPain.map((x, j) => j === i ? { ...x, side: v.value } : x)); }} />
      <Score label={`部位${i + 1}疼痛`} answer={p.pain} onChange={v => change('otherPain', a.otherPain.map((x, j) => j === i ? { ...x, pain: v } : x))} />
      <Button title={`移除部位${i + 1}`} onPress={() => change('otherPain', a.otherPain.filter((_, j) => i !== j))} />
    </Panel>)}<Button title="添加疼痛部位" onPress={() => change('otherPain', [...a.otherPain, { site: '', side: 'left', pain: { state: 'unanswered' } }])} /></Disclosure>
    <Disclosure title="可穿戴数据（可选，仅辅助）"><Field label="可穿戴恢复评分（0–100，可留空）" value={a.wearable.state === 'known' ? String(a.wearable.value) : ''} numeric onChange={v => { if (v === '') change('wearable', { state: 'unanswered' }); else if (Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100) change('wearable', { state: 'known', value: Number(v) }); }} /><Copy>高评分不会解除疼痛、功能异常或次晨反应限制。</Copy></Disclosure>
    <Panel warning><Copy>达到3/10、疼痛持续上升或动作明显改变时停止诱发动作。3/10是本App保守停止规则，不是诊断标准。明显肿胀、失稳、承重困难或持续反复疼痛时寻求专业评估。</Copy></Panel>
    <Button title="查看今日执行版" primary onPress={() => router.push('/')} />
  </Shell>;
}
