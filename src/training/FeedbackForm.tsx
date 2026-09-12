import { useTraining } from './TrainingProvider';
import type { Feedback, Session } from './model';
import { valueOf } from './model';
import { stopForSymptoms } from './engine';
import { Choice, Copy, Disclosure, Field, Score, yesNo } from './ui';

export function FeedbackForm({ session }: { session: Session }) {
  const { update } = useTraining(), f = session.feedback;
  const set = <K extends keyof Feedback>(key: K, value: Feedback[K]) => update(s => ({ ...s, sessions: s.sessions.map(x => {
    if (x.id !== session.id) return x;
    const next = { ...x, feedback: { ...x.feedback, [key]: value } };
    return !x.endedAt && (valueOf(next.feedback.peak) ?? 0) >= 3 ? stopForSymptoms(next) : next;
  }) }));
  return <>
    <Score label="训练中峰值疼痛（0–10）" answer={f.peak} onChange={v => set('peak', v)} />
    <Score label="训练后疼痛（0–10）" answer={f.after} onChange={v => set('after', v)} />
    <Score label="本节动作质量（1差–5好）" answer={f.quality} onChange={v => set('quality', v)} max={5} min={1} />
    <Choice label="次晨恢复至个人基线" answer={f.morning} options={yesNo} onChange={v => set('morning', v)} na />
    <Copy muted>次晨再来补录；今天先保留未知。不适用不能用作进阶依据。</Copy>
    <Disclosure title="不适部位与首次出现位置"><Field label="不适部位" value={f.site} onChange={v => set('site', v)} />
      <Choice label="不适侧别" answer={{ state: 'known', value: f.side }} options={[{ value: 'left', label: '左' }, { value: 'right', label: '右' }, { value: 'both', label: '双侧' }]} onChange={v => { if (v.state === 'known') set('side', v.value); }} />
      <Field label="首次不适在第几组（可留空）" value={f.onsetSet?.toString() ?? ''} numeric onChange={v => { if (!v || Number.isInteger(Number(v)) && Number(v) > 0) set('onsetSet', v ? Number(v) : undefined); }} />
      <Field label="该组第几次（可留空）" value={f.onsetRep?.toString() ?? ''} numeric onChange={v => { if (!v || Number.isInteger(Number(v)) && Number(v) > 0) set('onsetRep', v ? Number(v) : undefined); }} />
      <Copy>仅记录已经发生的经历，勿刻意跳到疼痛。既往第12次疼不代表前8–10次安全。</Copy>
    </Disclosure><Field label="训练备注" value={f.notes} onChange={v => set('notes', v)} multiline />
  </>;
}
