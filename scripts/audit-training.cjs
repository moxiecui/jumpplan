require('./register-ts.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { fullPlan, PHASES, summary, DOSE_SOURCE } = require('../src/training/plan.ts');
const { plannedLoad, assess } = require('../src/training/engine.ts');
const { freshState } = require('../src/training/storage.ts');
const { emptyAssessment, known } = require('../src/training/model.ts');
const { exercises } = require('../src/data/exercises.ts');
const { getExerciseVideoUrl } = require('../src/logic/videoLinks.ts');
const output = process.env.JUMPPLAN_QA_DIR || path.join(os.homedir(), '.codex', 'jumpplan-qa');
fs.mkdirSync(output, { recursive: true });
const date = '2026-09-11';
const a = { ...emptyAssessment(date), ankle: known(0), after: known(0), morning: known(true), function: known('normal'), rising: known(false), recurrent: known(false), fatigue: known(2), quality: known(4), basketball: known('none') };
const rows = fullPlan.map(p => ({ day: p.day, week: p.week, phase: PHASES[p.phase - 1], title: p.title, goal: p.goal,
  main: summary(p), baseLoad: plannedLoad(p.actions), assessedWithoutProgression: plannedLoad(assess(p, a, freshState(), date).actions), actions: p.actions }));
fs.writeFileSync(path.join(output, 'daily-loads.json'), JSON.stringify({ source: DOSE_SOURCE, rows }, null, 2));
const md = ['# JumpPlan 全周期每日概要与计算负荷', '', '共12周、84天。数字均由结构化组次计算，无手写总量。', '', DOSE_SOURCE, '',
  '“基础跳跃”是候选处方，不是执行许可；“无进阶依据”列假设当日已明确无痛、功能正常、主观恢复良好、无近期实际负荷限制，但尚无高阶训练依据。未填必要状态时，所有日期均只提供舒适恢复，跳跃为0。', '',
  '暴露指跳跃/落地事件中参与承重的脚，双脚一次跳跃为一个事件、左右各一次暴露。力量侧组按每侧分别累计；小腿组数单列，恢复日无机械叠加小腿训练。独立落地记录保留单独计数。篮球/额外测试另计实际负荷，未知不得补0。', '',
  '|天|周|训练目标 / 核心动作|基础跳跃|无进阶依据时跳跃|连续反应性|最大意图|左/右暴露|力量侧组|小腿侧组|', '|---|---|---|---:|---:|---:|---:|---|---:|---:|',
  ...rows.map(r => `|${r.day}|${r.week}|${r.title}：${r.main}|${r.baseLoad.jumps}|${r.assessedWithoutProgression.jumps}|${r.baseLoad.reactive}|${r.baseLoad.maxIntent}|${r.baseLoad.left}/${r.baseLoad.right}|${r.baseLoad.strengthSets}|${r.baseLoad.calfSets}|`), '',
  '详细组次、每侧标记、每次重复跳跃/落地事件数、休息、负重、RPE、技术要点、替代与停止规则见配套 daily-loads.json。每第3周减少真实工作组与冲击，11周亦减量。日历推进不自动增加重量/组数。阶段3每节只选择一个专项动作槽，最多两个跳跃主动作，不叠加所有菜单。', '',
  'Day24：原 Pogo 6×6 + CMJ 4×2 + Box 5×2 = 54（不含检查）；现 CMJ 2×2 + Box 2×2 = 8，无Pogo/检查跳。',
  'Day31：原 Pogo 8×5 + CMJ 3×2 + 单脚4×2/侧 + Box 4×2 = 70（不含检查）；现 CMJ 2×2 + 单脚2×1/侧 = 8候选，无进阶依据时仅4。',
  'Day26/33：删去多项相似单腿堆叠，改为一个蹲模式加上肢拉力。小腿支持只安排在力量A且受症状限制，不安排“补回”组数。', '',
  '二次起跳的结构化示例：2组×1次重复×每次2个跳跃 = 4跳。动作库保留，但不自动纳入本次基础周期。'];
fs.writeFileSync(path.join(output, 'daily-loads.md'), md.join('\n'));
const links = exercises.map(e => ({ id: e.id, name: e.nameZh, url: getExerciseVideoUrl(e) }));
const invalid = links.filter(x => !x.url || !/^https:\/\/www\.youtube\.com\/(results\?search_query=|watch\?v=)/.test(x.url));
fs.writeFileSync(path.join(output, 'video-link-audit.json'), JSON.stringify({ total: links.length, invalid, note: '所有链接均核查URL结构与非空查询；原库提供搜索入口，不能将可用搜索页面等同于某条视频有效或内容正确。', links }, null, 2));
console.log(JSON.stringify({ days: rows.length, videos: links.length, invalid: invalid.length, output }));
const {teachingById,teachingSources}=require('../src/data/exerciseTeaching.ts');
const {auditedOriginalIds}=require('../src/data/exercises.ts');
const {execFileSync}=require('node:child_process');
const ts=require('typescript');
const originalSource=execFileSync('git',['show','0e9f66d45a51a8d28a03a3dbbbc9e0be185f93d5:src/data/exercises.ts'],{encoding:'utf8'});
const oldExports={};new Function('exports','require',ts.transpileModule(originalSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(oldExports,require);
const original=oldExports.exercises;
const coverage=exercises.map(e=>{
 const t=teachingById[e.id],old=original.find(x=>x.id===e.id),index=auditedOriginalIds.indexOf(e.id);
 return {exerciseId:e.id,originalName:old?.nameZh??null,name:e.nameZh,mapping:!old?'新增具体变式/实际动作':e.nameZh!==old.nameZh?'保留ID，改名':'保留ID',originalIssue:(index>=67?'原通用工厂教学模板；':'')+t.originalIssue,originalInstructions:old?.instructions??[],...t,sourceDetails:t.sources.map(k=>teachingSources[k])};
});
const statuses=coverage.reduce((n,t)=>(n[t.status]=(n[t.status]??0)+1,n),{});
fs.writeFileSync(path.join(output,'exercise-coverage.json'),JSON.stringify({auditedOriginalCount:147,currentCount:exercises.length,missingOriginal:auditedOriginalIds.filter(id=>!teachingById[id]),statuses,coverage},null,2));
const sourceLabel=s=>`${s.method==='text-checked'?'文字核对':s.method==='video-candidate'?'未观看的视频候选':'用户审查稿编辑'}：${s.url?`[${s.title}](${s.url})`:s.title}（${s.author}，${s.checkedAt}；${s.variant}）`;
fs.writeFileSync(path.join(output,'exercise-coverage.md'),[
 '# JumpPlan 全动作库教学修复覆盖表','',
 `原库147条全部保留；现${exercises.length}条，新增7条。状态：${JSON.stringify(statuses)}。edited表示具体教学已编辑，不表示已观看或验证视频。`,
 '','原稿中的待定项均被排除自动执行。另将两项未核实固定器械的等长动作暂停；旧ID和原日志不删除。5个选择入口不生成混合教学；3个检查/复盘入口不生成身体动作、RPE或替代处方。',
 '','## 完整覆盖表','',
 '|exerciseId|原问题|最终变式/状态|最终步骤|3个关键点 / 错误 / 计数|来源状态|未解决事项|',
 '|---|---|---|---|---|---|---|',
 ...coverage.map(t=>`|${t.id}|${t.originalIssue}|${t.variant} / ${t.status}|${t.steps.map((s,i)=>`${i+1}. ${s}`).join('<br>')||'不生成身体动作步骤'}|${t.keyPoints.join('；')}<br>错误：${t.mistakes.join('；')}<br>${t.counting}|${t.sourceDetails.map(sourceLabel).join('<br>')}|${t.unresolved.join('；')}|`),
 '','## 名称与映射','',...coverage.filter(t=>t.mapping!=='保留ID').map(t=>`- ${t.exerciseId}：${t.originalName??'新增'} → ${t.name}（${t.mapping}）`),
 '','## 内容抽查（逐项阅读，不以字段长度代替教学质量）','',
 '足踝：短足保持足底接触但不蜷趾；单腿提踵顶端明确脚跟离地；踝CARs手稳小腿；屈膝提踵保持膝角。',
 '跳跃：CMJ摆臂且不暂停，静止蹲跳手叉腰且底部暂停；连续跳不要求每次定住；二次跳每轮2跳；下落定住0主动跳1落地；下落反跳1主动跳2落地。',
 '左右：对侧RDL为右腿左手；Pallof侧别为朝向锚点；单腿助跑明确左—右最后两步、右起双落；Copenhagen上侧膝支撑、下腿离地。',
 '髋铰链与奥举：摆荡有回摆接续及放回；RDL站立起始而非每次触地；翻举拉不接杠、高翻要翻肘接杠、Squat Jerk深蹲接杠。奥举未进入本次自动计划；完整片段未核实。',
 '核心与恢复：死虫左右按伸出腿记录；脚趾瑜伽两模式一轮；臀桥不是后弯桥；步行骑车按时间、不附加隐性活动度；复盘与检查不生成动作模板。',
 '','## 来源限制','',
 '本轮读取NSCA、NIH及用户列出的7个动作原作者教学页面；技术文字核对与视频观看严格区分。未逐一观看147条视频。所有原有搜索入口保留但明确标为未验证；搜索页面能打开不证明某个视频变式正确。仓库没有能确认待定器械/特殊组合的原截图或原作者视频，定向检索没有建立与旧条目的同一性，因此保留待定。',
 '完整机器可读文件附每条原步骤、最终步骤、变式编号、来源元数据、未解决项；不会用新教学反向覆盖旧处方。'
].join('\n'));
console.log(JSON.stringify({teaching:statuses,coverage:coverage.length}));
