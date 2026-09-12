import { useState } from 'react';
import { Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { exercises } from '@/data/exercises';
import { useTraining } from './TrainingProvider';
import { exportData, importData } from './storage';
import { Button, Copy, Disclosure, Field, Heading, Panel, Shell } from './ui';

export default function More() {
  const { state, restore, update } = useTraining(), router = useRouter();
  const [raw, setRaw] = useState(''), [message, setMessage] = useState(''), [query, setQuery] = useState('');
  const download = () => {
    const data = exportData(state); setRaw(data);
    if (typeof document !== 'undefined') {
      const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = `jumpplan-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
    }
    setMessage('导出已生成，包含处方快照、逐组记录、历史与安排。请妥善保存备份。');
  };
  const load = (text: string) => {
    try { const imported = importData(text); restore(text); setMessage(`已校验并合并${imported.sessions.length}节训练；同一记录以本地版本为准。导入前本地备份已保存。`); } catch (e) { setMessage(String(e)); }
  };
  const upload = () => {
    if (typeof document === 'undefined') { setMessage('请在浏览器选择文件或粘贴备份。'); return; }
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json,application/json'; input.onchange = () => { const file = input.files?.[0]; if (file) { if (file.size > 10000000) { setMessage('文件超过10MB'); return; } void file.text().then(load).catch(e => setMessage(String(e))); } }; input.click();
  };
  return <Shell title="更多"><Panel><Heading>训练之外</Heading><Button title="饮食与营养" onPress={() => router.push('/nutrition')} /><Button title="身体数据（可选）" onPress={() => router.push('/body-signals')} /><Button title="术语词典" onPress={() => router.push('/glossary')} /></Panel>
    <Disclosure title="动作库与原有视频"><Field label="搜索动作名称" value={query} onChange={setQuery} />{exercises.filter(e => `${e.nameZh} ${e.nameEn ?? ''}`.toLowerCase().includes(query.toLowerCase())).map(e => <Button key={e.id} title={e.nameZh} onPress={() => router.push(`/exercise/${e.id}`)} />)}</Disclosure>
    <Panel><Heading>数据保存与备份</Heading><Copy>每次操作先写入当前浏览器本地存储。刷新、重启仍可恢复；换设备、清理浏览器数据前请导出。没有云同步。</Copy><Button title="导出训练备份" onPress={download} /><Button title="选择备份文件并校验导入" onPress={upload} /><Disclosure title="复制 / 粘贴JSON备份"><Field label="备份内容" value={raw} onChange={setRaw} multiline /><Button title="校验并合并备份" disabled={!raw.trim()} onPress={() => load(raw)} /></Disclosure>{message ? <Copy>{message}</Copy> : null}</Panel>
    <Disclosure title="迁移档案"><Copy>旧版内存中未持久保存的数据无法从刷新后的浏览器恢复。检测到的旧存储原文保留，不用新处方反向覆盖历史，也不把旧完成标签当成已完成刺激。</Copy><Copy>保留的历史数据项：{Object.keys(state.archived).length}</Copy>{Object.keys(state.archived).map((k, i) => <Copy key={k}>档案 {i + 1}（随备份导出）</Copy>)}</Disclosure>
    <Disclosure title="可配置的保守产品规则"><Copy>不是医学安全上限。延长恢复或增加进阶证据要求只影响未来评估，不改写已开始处方。</Copy><Field label="最短恢复间隔小时（48–168）" value={String(state.rules.minimumRecoveryHours)} numeric onChange={v => { const n = Number(v); if (Number.isFinite(n) && n >= 48 && n <= 168) update(s => ({ ...s, rules: { ...s.rules, minimumRecoveryHours: n } })); }} /><Field label="进阶所需不同日期记录（3–20）" value={String(state.rules.evidenceSessions)} numeric onChange={v => { const n = Number(v); if (Number.isInteger(n) && n >= 3 && n <= 20) update(s => ({ ...s, rules: { ...s.rules, evidenceSessions: n } })); }} /></Disclosure>
  </Shell>;
}
export function Nutrition() {
  return <Shell title="饮食与营养"><Panel><Heading>先把日常饮食安排好</Heading><Copy>保证足够食物与能量；训练前后安排熟悉、易消化的碳水食物。各餐加入蛋白质来源，配蔬果与饮水。训练量降低时调整食量，而不是省略整餐。</Copy><Copy>长时间或大量出汗时兼顾液体与电解质；根据环境、出汗和个人耐受安排。当天状态与疼痛不靠补剂抵消。</Copy></Panel>
    <Disclosure title="补剂：辅助选项，不是必需"><Heading>证据较充分 · 特定表现目标</Heading><Copy>肌酸一水合物：用于反复短时高强度表现与力量训练适应，研究常见每日3–5克；查看有效成分克数，不按“粒数”推算。蛋白粉只用于补足饮食中蛋白质不足，没有不足就不必添加。</Copy><Heading>特定情况下可能有用</Heading><Copy>咖啡因可能帮助部分运动表现，但需考虑睡眠、耐受与其他摄入来源。本App不自动安排用量。维生素或矿物质补充应有膳食不足或专业评估依据。</Copy><Heading>证据有限 · 对本次疼痛恢复目标</Heading><Copy>胶原蛋白、鱼油、镁不作为必需清单，也不承诺修复疼痛组织。若使用，按标签看胶原蛋白克数、EPA+DHA毫克数或元素镁毫克数，不把“1–2粒”当成剂量。</Copy><Copy>是否适合使用及与个人用药的关系需结合具体情况；补剂不替代饮食或疼痛评估。</Copy></Disclosure>
    <Button title="NIH：运动表现与膳食补充剂资料" onPress={() => void Linking.openURL('https://ods.od.nih.gov/factsheets/ExerciseAndAthleticPerformance-HealthProfessional/')} />
  </Shell>;
}
