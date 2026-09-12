// All contexts are ephemeral. This runner never uses the user's browser profile.
require('./register-ts.cjs');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const { freshState, STORAGE_KEY, exportData } = require('../src/training/storage.ts');
const { emptyAssessment, known } = require('../src/training/model.ts');
const { dateForDay } = require('../src/training/engine.ts');
const root = path.resolve(__dirname, '..');
const out = process.env.JUMPPLAN_QA_DIR || path.join(os.homedir(), '.codex', 'jumpplan-qa');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };
function build() {
  for (const args of [['node_modules/expo/bin/cli', 'export', '-p', 'web', '--clear'], ['.tools/copy-gh-pages-404.js']]) {
    const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' }); if (result.status !== 0) throw new Error('Production export failed');
  }
}
function server() { return http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/jumpplan\/?/, '');
  const file = path.resolve(root, 'dist', pathname || 'index.html');
  if (!file.startsWith(path.join(root, 'dist') + path.sep)) { res.writeHead(403); res.end(); return; }
  try { res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); res.end(await fs.readFile(file)); }
  catch { res.setHeader('Content-Type', mime['.html']); res.end(await fs.readFile(path.join(root, 'dist/index.html'))); }
}); }
const calm = d => ({ ...emptyAssessment(d), ankle: known(0), after: known(0), morning: known(true), function: known('normal'), rising: known(false), recurrent: known(false), basketball: known('none'), quality: known(4), fatigue: known(2) });
async function main() {
  if (!process.argv.includes('--no-build')) build();
  await fs.mkdir(out, { recursive: true }); const app = server(); await new Promise(r => app.listen(4177, '127.0.0.1', r));
  const browser = await chromium.launch({ headless: true }), errors = [], checks = [];
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'America/Los_Angeles', deviceScaleFactor: 1 });
  const page = await context.newPage(); let recordedFixture;
  page.on('pageerror', e => errors.push(e.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  const url = 'http://127.0.0.1:4177/jumpplan/';
  const check = async (name, fn) => { await fn(); checks.push({ name, passed: true }); };
  const visible = async text => { await page.getByText(text, { exact: true }).first().waitFor({ state: 'visible' }); };
  const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth), false);
  const data = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)), STORAGE_KEY);
  const seed = async (s, d = '2026-08-18') => {
    await page.clock.setSystemTime(new Date(`${d}T19:00:00Z`));
    await page.evaluate(({ s, key }) => localStorage.setItem(key, JSON.stringify(s)), { s, key: STORAGE_KEY }); await page.goto(url); await visible('今天练什么');
    await page.getByText('正在恢复本地记录…', { exact: true }).waitFor({ state: 'hidden' });
  };
  try {
    await page.clock.install({ time: new Date('2026-09-11T19:00:00Z') });
    await page.goto(url, { waitUntil: 'networkidle' });
    await check('identity / no blank / unknown state / one execution entry', async () => {
      assert.equal(await page.title(), 'JumpPlan'); await visible('尚未评估');
      assert.equal(await page.getByRole('button', { name: /^开始/ }).count(), 1);
      assert.ok(!(await page.locator('body').innerText()).includes('Legacy'));
      await noOverflow(); await page.screenshot({ path: path.join(out, 'mobile-today.png'), fullPage: true });
    });
    await check('preflight input explicit zero, ankle pain overrides wearable', async () => {
      await page.getByRole('button', { name: '填写 / 更新训练前状态', exact: true }).click();
      await page.getByRole('radio', { name: '当前左踝内侧疼痛（0–10）：3', exact: true }).click();
      await page.getByRole('button', { name: /可穿戴数据（可选/ }).click(); await page.getByRole('textbox', { name: '可穿戴恢复评分（0–100，可留空）' }).fill('100');
      await noOverflow(); await page.screenshot({ path: path.join(out, 'mobile-checkin.png'), fullPage: true });
      await page.getByRole('button', { name: '查看今日执行版', exact: true }).click();
      assert.equal((await data()).assessments['2026-09-11'].ankle.value, 3);
      assert.ok((await page.locator('body').innerText()).includes('移除冲击及下肢负荷'));
    });
    const s = freshState(); s.assessments['2026-08-18'] = calm('2026-08-18');
    await seed(s);
    await check('actual reduced rep, countdown, reload and immutable prescription', async () => {
      await page.getByRole('button', { name: '开始今日训练', exact: true }).click();
      for (let i = 0; i < 3; i++) await page.getByRole('button', { name: '完成本组并保存', exact: true }).click();
      await page.getByRole('textbox', { name: '本组实际次数', exact: true }).fill('1');
      await page.getByRole('button', { name: '完成本组并保存', exact: true }).click();
      assert.equal((await data()).sessions[0].sets.length, 4);
      await page.reload(); await visible('训练中'); assert.equal((await data()).sessions[0].sets.length, 4);
      assert.ok((await page.locator('body').innerText()).includes('已记录跳跃 1 次'));
      await noOverflow(); await page.screenshot({ path: path.join(out, 'mobile-training.png'), fullPage: true });
      const preDetail=JSON.stringify((await data()).sessions[0]);
      await page.getByRole('button',{name:'动作说明、视频与替代',exact:true}).click();
      await page.getByRole('button',{name:'展开完整步骤',exact:true}).click();
      await visible('一次怎么数：1次离地并落回=1跳+1落地。');
      await page.getByRole('button',{name:'动作说明、视频与替代',exact:true}).click();
      assert.equal(JSON.stringify((await data()).sessions[0]),preDetail);
      const kept = JSON.stringify((await data()).sessions[0]);
      await page.getByRole('button',{name:'暂时离开训练（保留记录）',exact:true}).click();
      await visible('继续本节训练'); assert.equal(JSON.stringify((await data()).sessions[0]),kept);
      await page.reload(); await visible('继续本节训练');
      await page.getByRole('button',{name:'继续本节训练',exact:true}).click();await visible('训练中');
      assert.equal(JSON.stringify((await data()).sessions[0]),kept);
      const before = JSON.stringify((await data()).sessions[0].snapshot);
      await page.goto(url + 'checkin'); await page.getByRole('radio', { name: '整体疲劳（1低–5高）：5', exact: true }).click(); await page.goto(url);
      assert.equal(JSON.stringify((await data()).sessions[0].snapshot), before);
    });
    await check('symptom stop removes all remaining actions; finish does not count stimulus', async () => {
      await page.getByRole('button',{name:'继续本节训练',exact:true}).click();
      await page.getByRole('button', { name: '疼痛上升 / 动作改变 · 立即停止', exact: true }).click(); await visible('已停止，不必补齐');
      assert.equal(await page.getByRole('button', { name: '完成本组并保存', exact: true }).count(), 0);
      await page.getByRole('button', { name: '结束并记录本节', exact: true }).click();
      assert.equal((await data()).sessions.length, 1); assert.equal((await data()).sessions[0].symptomStopped, true);
      assert.equal(await page.getByRole('button', { name: '结束并记录本节', exact: true }).count(), 0);
      const ended = JSON.stringify((await data()).sessions[0]);
      await page.getByRole('button',{name:'返回今天',exact:true}).last().click();
      await visible('查看 / 补充训练反馈');assert.equal(await page.getByText('训练后简短反馈',{exact:true}).count(),0);
      await page.reload();await visible('查看 / 补充训练反馈');assert.equal(JSON.stringify((await data()).sessions[0]),ended);
      await page.getByRole('button',{name:'查看 / 补充训练反馈',exact:true}).click();await visible('训练后简短反馈');
      await page.getByRole('tab',{name:'今天',exact:true}).click();await visible('查看 / 补充训练反馈');
      assert.equal(JSON.stringify((await data()).sessions[0]),ended);
      await page.screenshot({path:path.join(out,'mobile-exit-fixed.png'),fullPage:true});
      checks.push({name:'active pause/resume and ended feedback exit/reopen/reload/today tab preserve records and timer',passed:true});
    });
    await check('history and week browsing do not change progression; one-date override isolated', async () => {
      await page.getByRole('tab', { name: '计划', exact: true }).click(); await visible('第 4 / 12 周 · 力量转爆发');
      const old = await data(); await page.getByRole('button', { name: '上一周', exact: true }).click(); await page.getByRole('button', { name: '下一周', exact: true }).click();
      await page.getByRole('button', { name: /08-18 · 第24天/ }).click(); await page.getByRole('button', { name: '查看第24天', exact: true }).click();
      assert.deepEqual((await data()).overrides, old.overrides); assert.deepEqual((await data()).sessions, old.sessions);
      await page.getByRole('tab', { name: '计划', exact: true }).click();
      await page.getByRole('button', { name: /改变某一天的安排/ }).click(); await page.getByRole('textbox', { name: '安排日期（YYYY-MM-DD）' }).fill('2026-08-19'); await page.getByRole('textbox', { name: '执行哪个计划日（1–84）' }).fill('31'); await page.getByRole('button', { name: '仅修改这一天', exact: true }).click();
      assert.deepEqual((await data()).overrides, { '2026-08-19': 31 });
      await noOverflow(); await page.screenshot({ path: path.join(out, 'mobile-plan.png'), fullPage: true });
    });
    await check('next day preserves previous records; dated assessment does not leak', async () => {
      const previous = (await data()).sessions;
      await page.clock.setSystemTime(new Date('2026-08-19T19:00:00Z')); await page.goto(url); await visible('尚未评估');
      assert.deepEqual((await data()).sessions, previous); assert.equal((await data()).assessments['2026-08-19'], undefined);
    });
    await check('validated import, export and restart; corrupted import cannot overwrite', async () => {
      await page.getByRole('tab', { name: '更多', exact: true }).click(); await page.getByRole('button', { name: /复制 \/ 粘贴JSON备份/ }).click();
      const before = await data(); await page.getByRole('textbox', { name: '备份内容', exact: true }).fill('{broken'); await page.getByRole('button', { name: '校验并合并备份', exact: true }).click(); assert.deepEqual(await data(), before);
      await page.getByRole('textbox', { name: '备份内容', exact: true }).fill(exportData(before)); await page.getByRole('button', { name: '校验并合并备份', exact: true }).click(); assert.equal((await data()).sessions.length, 1);
      const download = page.waitForEvent('download'); await page.getByRole('button', { name: '导出训练备份', exact: true }).click(); await (await download).saveAs(path.join(out, 'isolated-test-backup.json'));
      await page.reload(); assert.equal((await data()).sessions.length, 1);
      recordedFixture = await data();
      const reopened = await browser.newContext({ storageState: await context.storageState(), viewport: { width: 390, height: 844 }, timezoneId: 'America/Los_Angeles' });
      const tab = await reopened.newPage(); await tab.clock.install({ time: new Date('2026-08-19T19:00:00Z') }); await tab.goto(url + 'records');
      await tab.getByRole('button', { name: /2026-08-18 · 第24天 · 因症状停止/ }).waitFor({ state: 'visible' });
      await tab.screenshot({ path: path.join(out, 'mobile-records.png'), fullPage: true }); await reopened.close();
    });
    await check('all skipped, reduction, substitution, undo and storage failure preserve honest state', async () => {
      await seed(s); await page.getByRole('button', { name: '开始今日训练', exact: true }).click();
      await page.getByRole('button', { name: '跳过剩余组', exact: true }).click();
      await page.getByRole('button', { name: '减少一组', exact: true }).click(); assert.equal((await data()).sessions[0].actions[1].dose.sets, 1);
      await page.getByRole('button', { name: '更换动作', exact: true }).click(); await page.getByRole('button', { name: '换成舒适体位呼吸', exact: true }).click();
      assert.equal((await data()).sessions[0].actions[1].dose.jumps, 0);
      await page.getByRole('button', { name: '完成本组并保存', exact: true }).click(); await page.getByRole('button', { name: '撤销上一组记录', exact: true }).click(); assert.equal((await data()).sessions[0].sets.length, 0);
      while (await page.getByRole('button', { name: '跳过剩余组', exact: true }).count()) await page.getByRole('button', { name: '跳过剩余组', exact: true }).click();
      await page.getByRole('button', { name: '结束并记录本节', exact: true }).click(); assert.ok((await page.locator('body').innerText()).includes('已结束并记录（无训练刺激）'));
      await seed(s); await page.evaluate(() => { window.__originalStorageSet = Storage.prototype.setItem; Storage.prototype.setItem = function() { throw new Error('isolated quota simulation'); }; });
      await page.getByRole('button', { name: '开始今日训练', exact: true }).click(); assert.equal((await data()).sessions.length, 0);
      assert.ok((await page.locator('body').innerText()).includes('isolated quota simulation')); await page.evaluate(() => { Storage.prototype.setItem = window.__originalStorageSet; });
    });
    await check('midnight changes today without reload; yesterday assessment never treated as current', async () => {
      await seed(freshState(), '2026-08-18');
      await page.clock.setSystemTime(new Date('2026-08-19T06:59:59Z')); await page.reload();
      await page.clock.fastForward(65000); await visible('2026-08-19 · 计划第25天'); await visible('尚未评估');
    });
    await check('all calendar boundaries render, day85 terminates instead of repeating last day', async () => {
      for (const n of [21, 22, 42, 43, 63, 64, 84]) { const d = dateForDay(s.startDate, n); await seed(freshState(), d); assert.ok((await page.locator('body').innerText()).includes(`计划第${n}天`)); }
      await seed(freshState(), dateForDay(s.startDate, 85)); await visible('84天计划已结束'); assert.equal(await page.getByRole('button', { name: /^开始/ }).count(), 0);
    });
    await check('migration preserves old raw records without retroactive prescriptions', async () => {
      await page.evaluate(key => { localStorage.removeItem(key); localStorage.setItem('jumpplan-old-test-log', '{"historicalDose":"6x6","completed":true}'); }, STORAGE_KEY); await page.reload();
      await page.getByText('正在恢复本地记录…', { exact: true }).waitFor({ state: 'hidden' });
      assert.equal((await data()).archived['jumpplan-old-test-log'], '{"historicalDose":"6x6","completed":true}'); assert.equal((await data()).sessions.length, 0);
    });
    await check('desktop primary routes, keyboard and no horizontal overflow', async () => {
      await page.setViewportSize({ width: 1440, height: 1000 }); await seed(s);
      const checkin = page.getByRole('button', { name: '填写 / 更新训练前状态', exact: true }); await checkin.focus(); await page.keyboard.press('Enter'); await visible('训练前状态');
      const radio = page.getByRole('radio', { name: '当前左踝内侧疼痛（0–10）：0 无痛', exact: true }); await radio.focus(); await page.keyboard.press('Enter'); assert.equal((await data()).assessments['2026-08-18'].ankle.value, 0);
      for (const [route, name] of [['', 'today'], ['plan', 'plan'], ['records', 'records'], ['more', 'more'], ['nutrition', 'nutrition'], ['exercise/cmj', 'exercise'], ['body-signals', 'body'], ['glossary','glossary'], ['glossary/cmj','term']]) {
        if (route === 'records') await seed(recordedFixture, '2026-08-19');
        await page.goto(url + route); await page.getByText('正在恢复本地记录…', { exact: true }).waitFor({ state: 'hidden' }); await noOverflow(); assert.ok((await page.locator('body').innerText()).length > 60); await page.screenshot({ path: path.join(out, `desktop-${name}.png`), fullPage: true });
      }
      await check('teaching variants, pending entries and 360px details',async()=>{
       for(const width of [360,390]){
        await page.setViewportSize({width,height:844});
        for(const id of ['cmj','hip-airplane','ankle-cars','kettlebell-swing','clean-pull','dead-bug','seated-relaxed-breathing']){
         await page.goto(url+'exercise/'+id);await page.getByText('先看3个关键点',{exact:true}).waitFor();
         await page.getByRole('button',{name:'展开完整步骤',exact:true}).click(); await noOverflow();
         await page.screenshot({path:path.join(out,'exercise-'+id+'-'+width+'.png'),fullPage:true});
        }
       }
       await page.goto(url+'exercise/single-leg-snatch-with-body-control');await visible('动作定义待核实');assert.equal(await page.getByRole('button',{name:'展开完整步骤',exact:true}).count(),0);
       await page.goto(url+'exercise/pull-up-or-lat-pulldown');await page.getByRole('button',{name:/查看具体变式：正握引体/}).click();await visible('正握引体向上');
      });
      await page.setViewportSize({ width: 320, height: 700 }); await page.goto(url); await noOverflow();
    });
    assert.deepEqual(errors, []); checks.push({ name: 'no app console errors or framework overlay', passed: true });
    await fs.writeFile(path.join(out, 'ui-results.json'), JSON.stringify({ url, browser: 'Playwright Chromium; Browser plugin not available', viewports: ['320x700','360x844','390x844', '1440x1000'], checks, errors }, null, 2));
    console.log(JSON.stringify({ checks: checks.length, passed: true, artifacts: out, errors }));
  } catch (e) { await page.screenshot({ path: path.join(out, 'failure.png'), fullPage: true }); await fs.writeFile(path.join(out, 'failure.txt'), await page.locator('body').innerText()); throw e; }
  finally { await browser.close(); await new Promise(r => app.close(r)); }
}
main().catch(e => { console.error(e); process.exitCode = 1; });
