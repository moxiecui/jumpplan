import { teachingById, teachingSources, type Teaching } from '@/data/exerciseTeaching';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePathname, useRouter, type Href } from 'expo-router';
import { getExerciseById } from '@/data/exercises';
import { getExerciseVideoUrl } from '@/logic/videoLinks';
import { valueOf, type Action, type Answer } from './model';
import { useTraining } from './TrainingProvider';
import { plannedLoad } from './engine';

export const colors = { bg: '#f6f8fc', surface: '#ffffff', ink: '#152238', muted: '#54647b', blue: '#2459d3', line: '#dce3ed' };
export function Button({ title, onPress, primary = false, danger = false, disabled = false }: { title: string; onPress: () => void; primary?: boolean; danger?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} style={[styles.button, primary && styles.primary, danger && styles.danger, disabled && { opacity: .5 }]}><Text style={[styles.buttonText, primary && { color: '#fff' }, danger && { color: '#a12124' }]}>{title}</Text></Pressable>;
}
export function Copy({ children, muted = false }: { children: ReactNode; muted?: boolean }) { return <Text style={[styles.copy, muted && { color: colors.muted }]}>{children}</Text>; }
export function Heading({ children }: { children: ReactNode }) { return <Text accessibilityRole="header" style={styles.heading}>{children}</Text>; }
export function Panel({ children, warning = false }: { children: ReactNode; warning?: boolean }) { return <View style={[styles.panel, warning && styles.warning]}>{children}</View>; }
export function Row({ children }: { children: ReactNode }) { return <View style={styles.row}>{children}</View>; }
export function Disclosure({ title, children, subtitle, status }: { title: string; children: ReactNode; subtitle?: string; status?: string }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.disclosure}><Pressable accessibilityRole="button" accessibilityLabel={title} accessibilityState={{ expanded: open }} onPress={() => setOpen(!open)} style={styles.disclosureButton}><Text style={styles.buttonText}>{title} {open ? '−' : '+'}</Text>{subtitle ? <Text numberOfLines={2} style={{ color: colors.ink, fontSize: 13, lineHeight: 20, marginTop: 5 }}>{subtitle}</Text> : null}{status ? <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }}>{status}</Text> : null}</Pressable>{open ? <View style={{ padding: 14, gap: 10 }}>{children}</View> : null}</View>;
}
export function Field({ label, value, onChange, numeric = false, multiline = false }: { label: string; value: string; onChange: (v: string) => void; numeric?: boolean; multiline?: boolean }) {
  return <View style={{ gap: 6, flexShrink: 1 }}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChange} keyboardType={numeric ? 'decimal-pad' : 'default'} multiline={multiline} style={[styles.input, multiline && { minHeight: 110 }]} /></View>;
}
export function Choice<T extends string | number | boolean>({ label, answer, options, onChange, na = false }: { label: string; answer: Answer<T>; options: { value: T; label: string }[]; onChange: (v: Answer<T>) => void; na?: boolean }) {
  return <View style={styles.choice}><Text style={styles.label}>{label}</Text><View style={styles.row}>{options.map(o => <Pressable key={String(o.value)} accessibilityRole="radio" accessibilityLabel={`${label}：${o.label}`} accessibilityState={{ checked: answer.state === 'known' && answer.value === o.value }} onPress={() => onChange({ state: 'known', value: o.value })} style={[styles.option, answer.state === 'known' && answer.value === o.value && styles.selected]}><Text style={styles.optionText}>{o.label}</Text></Pressable>)}</View><View style={styles.row}>{(['unanswered', 'untested', ...(na ? ['na'] : [])] as const).map(s => <Pressable key={s} accessibilityRole="radio" accessibilityLabel={`${label}：${s === 'unanswered' ? '未填写' : s === 'untested' ? '未测试/未知' : '不适用'}`} accessibilityState={{ checked: answer.state === s }} onPress={() => onChange({ state: s as 'unanswered' | 'untested' | 'na' })} style={[styles.option, answer.state === s && styles.selected]}><Text style={styles.optionText}>{s === 'unanswered' ? '未填写' : s === 'untested' ? '未测试/未知' : '不适用'}</Text></Pressable>)}</View></View>;
}
export function Score({ label, answer, onChange, max = 10, min = 0, na = false }: { label: string; answer: Answer<number>; onChange: (v: Answer<number>) => void; max?: number; min?: number; na?: boolean }) {
  return <Choice label={label} answer={answer} onChange={onChange} na={na} options={Array.from({ length: max - min + 1 }, (_, i) => ({ value: i + min, label: i + min === 0 ? '0 无痛' : String(i + min) }))} />;
}
export const yesNo = [{ value: true, label: '是' }, { value: false, label: '否' }];
export function Shell({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter(), pathname = usePathname(), { ready, error } = useTraining();
  return <View style={{ flex: 1, backgroundColor: colors.bg }}><ScrollView contentContainerStyle={styles.scroll}><View style={styles.container}>
    <Text style={styles.brand}>JumpPlan</Text><Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {error ? <Panel warning><Copy>{error}</Copy></Panel> : null}
    {ready ? children : <Copy>正在恢复本地记录…</Copy>}
  </View></ScrollView><View style={styles.nav}>{([['今天', '/'], ['计划', '/plan'], ['记录', '/records'], ['更多', '/more']] as const).map(([label, route]) => <Pressable key={route} accessibilityRole="tab" accessibilityState={{ selected: route === '/' ? pathname === '/' || pathname === '/today' : pathname.startsWith(route) }} onPress={() => router.push(route as Href)} style={styles.navItem}><Text style={[styles.navText, (route === '/' ? pathname === '/' || pathname === '/today' : pathname.startsWith(route)) && { color: colors.blue }]}>{label}</Text></Pressable>)}</View></View>;
}
export function doseText(a: Action) {
  const d = a.dose, rep = d.reps.min === d.reps.max ? `${d.reps.max}` : `${d.reps.min}–${d.reps.max}`;
  return `${d.sets}组 × ${d.seconds ? `${d.seconds}秒` : `${rep}次`}${d.side === 'each' ? '/侧' : d.side === 'left' ? '（左）' : d.side === 'right' ? '（右）' : '（双侧）'} · 组间休息${d.rest}秒`;
}
export function LoadText({ actions }: { actions: Action[] }) {
  const l = plannedLoad(actions), low = plannedLoad(actions, 'min');
  return <Copy>跳跃 {low.jumps === l.jumps ? l.jumps : `${low.jumps}–${l.jumps}`} 次 · 连续反应性 {l.reactive} 次 · 最大意图 {l.maxIntent} 次{ '\n' }落地 {l.landings} 次 · 起跳左/右 {l.leftTakeoffs}/{l.rightTakeoffs} · 落地左/右 {l.leftLandings}/{l.rightLandings}{'\n'}左侧暴露 {l.left} / 右侧 {l.right}{l.calfSets ? ` · 小腿${l.calfSets}侧组 / 等长${l.calfSeconds}秒` : ''}</Copy>;
}
export function ActionDetails({ action }: { action: Action }) {
 return <Disclosure title="动作说明、视频与替代"><TeachingView teaching={action.teaching} /><Copy>负重：{action.dose.load}；强度：{action.dose.rpe}</Copy><Copy>{action.stop}</Copy><Copy>替代：{action.alternative}</Copy></Disclosure>;
}
export function TeachingView({teaching:t}:{teaching?:Teaching}) {
 const router=useRouter();
 if(!t)return <Copy>这条历史动作未保存教学版本；保留当时记录，动作定义待核实。</Copy>;
 const ex=getExerciseById(t.id),url=ex&&getExerciseVideoUrl(ex);
 return <View style={{gap:12}}><Heading>{t.variant}</Heading><Copy muted>审查状态：{{edited:'已编辑具体变式',pending:'动作定义待核实 · 不自动推荐',selector:'需要选择具体变式',workflow:'记录流程 · 非身体动作'}[t.status]}</Copy>
 {t.status==='edited'?<><Copy>先看3个关键点</Copy>{t.keyPoints.map((v,i)=><Copy key={i}>{i+1}. {v}</Copy>)}<Disclosure title="展开完整步骤">{t.steps.map((v,i)=><Copy key={i}>{i+1}. {v}</Copy>)}<Copy>一次怎么数：{t.counting}</Copy><Copy>{t.sideRule}</Copy><Copy>常见错误：{t.mistakes.join('；')}</Copy><Copy muted>次数、负重、休息和保持时长只取今天处方；技术停顿不另加量。</Copy></Disclosure></>:<Copy>{t.originalIssue}</Copy>}
 {t.alternatives?.map(id=><Button key={id} title={'查看具体变式：'+(teachingById[id]?.variant??id)} onPress={()=>router.push(('/exercise/'+id) as Href)}/>)}
 {t.status==='workflow'?<Button title="进入记录与反应反馈" onPress={()=>router.push('/records' as Href)}/>:null}
 <Disclosure title="看示范与来源状态">{t.sources.map(key=>{const source=teachingSources[key];return source?<View key={key} style={{gap:6}}><Copy>{source.title} · {source.author}</Copy><Copy muted>{{'provided-draft':'用户审查稿，经逐项编辑','text-checked':'已核对作者文字，未声称看完视频','video-candidate':'视频候选，未观看核实'}[source.method]} · {source.checkedAt}</Copy><Copy muted>适用：{source.variant}。{source.note}</Copy>{source.url?<Button title={'打开来源：'+source.title} onPress={()=>void Linking.openURL(source.url!)}/>:null}</View>:null;})}{url?<Button title="搜索更多示范（未验证）" onPress={()=>void Linking.openURL(url)}/>:null}<Copy muted>{t.unresolved.join('；')}。外部示范的剂量不是今天处方。</Copy></Disclosure></View>;
}
export function ActionList({ actions }: { actions: Action[] }) { return <View style={{ gap: 12 }}>{actions.map((a, i) => <View key={a.key} style={styles.action}><Text style={styles.label}>{i + 1}. {a.name}</Text><Copy muted>{{ warmup: '热身', main: '核心动作', support: '辅助', recovery: '恢复' }[a.role]} · {doseText(a)}</Copy><ActionDetails action={a} /></View>)}</View>; }
export function answerText<T>(a: Answer<T>): string { return a.state === 'known' ? typeof valueOf(a) === 'boolean' ? valueOf(a) ? '是' : '否' : String(valueOf(a)) : a.state === 'na' ? '不适用' : a.state === 'untested' ? '未测试/未知' : '未填写'; }
const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 18, paddingBottom: 32 }, container: { width: '100%', maxWidth: 820, alignSelf: 'center', gap: 18, paddingTop: 24 },
  brand: { fontSize: 23, fontWeight: '800', color: colors.blue, fontStyle: 'italic' }, title: { fontSize: 30, fontWeight: '800', lineHeight: 40, color: colors.ink },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '700', color: colors.ink }, copy: { color: colors.ink, fontSize: 15, lineHeight: 24, flexShrink: 1 },
  panel: { backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: 12, padding: 18, gap: 12 }, warning: { backgroundColor: '#fff7e3', borderColor: '#e8c777' },
  button: { minHeight: 46, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, borderColor: colors.line, borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', flexShrink: 1 },
  primary: { backgroundColor: colors.blue, borderColor: colors.blue }, danger: { backgroundColor: '#fff1f0', borderColor: '#e5a5a5' }, buttonText: { color: colors.blue, fontSize: 15, lineHeight: 22, fontWeight: '700', flexShrink: 1 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, alignItems: 'center' }, disclosure: { borderRadius: 10, backgroundColor: '#f0f4fa', overflow: 'hidden' }, disclosureButton: { padding: 14, minHeight: 48 },
  input: { minHeight: 46, padding: 12, borderWidth: 1, borderColor: '#a4b1c3', borderRadius: 8, backgroundColor: '#fff', fontSize: 16, color: colors.ink, width: '100%' }, label: { color: colors.ink, fontSize: 16, lineHeight: 24, fontWeight: '700' },
  choice: { gap: 8, paddingVertical: 6 }, option: { borderWidth: 1, borderColor: colors.line, padding: 10, minHeight: 44, minWidth: 44, borderRadius: 8, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }, selected: { backgroundColor: '#dce8ff', borderColor: colors.blue, borderWidth: 2 }, optionText: { fontSize: 14, color: colors.ink },
  nav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderColor: colors.line, paddingBottom: 8 }, navItem: { flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center' }, navText: { color: colors.muted, fontSize: 16, fontWeight: '700' },
  action: { borderBottomWidth: 1, borderColor: colors.line, paddingBottom: 16, gap: 8 }
});
