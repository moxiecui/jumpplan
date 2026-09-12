import { useState } from 'react';
import { useLocalToday } from '@/hooks/useLocalToday';
import { useTraining } from './TrainingProvider';
import { civil } from './engine';
import { Button, Copy, Field, Panel, Shell } from './ui';

export default function BodyData() {
  const today = useLocalToday(), { state, update } = useTraining();
  const [date, setDate] = useState(today), [weight, setWeight] = useState(''), [hr, setHr] = useState(''), [hrv, setHrv] = useState(''), [sleep, setSleep] = useState(''), [notes, setNotes] = useState(''), [message, setMessage] = useState('');
  const save = () => {
    try {
      civil(date); if (date > today) throw new Error('不能记录未来测量');
      const optional = (s: string, low: number, high: number) => { if (!s.trim()) return undefined; const n = Number(s); if (!Number.isFinite(n) || n < low || n > high) throw new Error('数值超出记录格式范围，请检查单位'); return n; };
      const b = { date, weightKg: optional(weight, 1, 500), restingHeartRate: optional(hr, 1, 250), hrv: optional(hrv, 0, 1000), sleepHours: optional(sleep, 0, 24), notes };
      const saved = update(s => ({ ...s, body: [...(s.body ?? []).filter(x => x.date !== date), b] })); if (saved) setMessage('已保存本日测量。');
    } catch (e) { setMessage(String(e)); }
  };
  return <Shell title="身体数据"><Copy>可选记录，留空代表未知。不同设备的HRV等数据不直接混合比较，不用于覆盖疼痛限制。</Copy><Panel><Field label="测量日期" value={date} onChange={setDate} /><Field label="体重kg（可留空）" value={weight} onChange={setWeight} numeric /><Field label="静息心率bpm（可留空）" value={hr} onChange={setHr} numeric /><Field label="HRV毫秒（可留空）" value={hrv} onChange={setHrv} numeric /><Field label="睡眠小时（可留空）" value={sleep} onChange={setSleep} numeric /><Field label="设备、测量条件与备注" value={notes} onChange={setNotes} /><Button title="保存本日身体数据" primary onPress={save} />{message ? <Copy>{message}</Copy> : null}</Panel>
    {(state.body ?? []).map(b => <Panel key={b.date}><Copy>{b.date} · 体重 {b.weightKg ?? '未知'}kg · 静息心率 {b.restingHeartRate ?? '未知'}bpm · HRV {b.hrv ?? '未知'}ms · 睡眠 {b.sleepHours ?? '未知'}小时</Copy><Copy>{b.notes}</Copy></Panel>)}
  </Shell>;
}
