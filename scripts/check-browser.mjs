import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer,preview} from 'vite';
/* global document,innerWidth */
const runtime=process.env.RUNTIME_NODE_MODULES||path.join(process.env.USERPROFILE||'','.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const req=createRequire(path.join(runtime,'package.json'));const {chromium}=req('playwright');
const vite=await createServer({cacheDir:'.build/browser-v3-cache',server:{middlewareMode:true,hmr:false},appType:'custom'});
const {rooms}=await vite.ssrLoadModule('/src/restoration/curriculum.ts');
const {SAVE_KEY,proofAvailable}=await vite.ssrLoadModule('/src/restoration/engine.ts');
const {completedRooms}=await vite.ssrLoadModule('/src/tests/restoration-fixtures.ts');
const {finishThrough}=await vite.ssrLoadModule('/src/tests/council-fixtures.ts');
const headers=Object.fromEntries(JSON.parse(fs.readFileSync('vercel.json','utf8')).headers.filter(v=>v.source==='/(.*)').flatMap(v=>v.headers.map(h=>[h.key,h.value])));
const base=process.env.TEST_URL||'http://127.0.0.1:4273',server=process.env.TEST_URL?null:await preview({preview:{host:'127.0.0.1',port:4273,strictPort:true,headers}});
const executablePath=process.env.PLAYWRIGHT_EXECUTABLE_PATH||path.join(process.env.USERPROFILE||'','AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe');
const browser=await chromium.launch({headless:true,executablePath});const out=path.resolve('output/qa');fs.mkdirSync(out,{recursive:true});
const errors=[],shots=[],measurements=[];
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&/content security policy/i.test(m.text()))errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});}
async function capture(p,name){await p.evaluate(()=>document.fonts.ready);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow');const file=path.join(out,name+'.png');await p.screenshot({path:file,fullPage:true});shots.push(file);}
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
async function solve(p,t,demo=false){const ui=p.getByRole('region',{name:t.title,exact:true}),i=t.interaction;
 if(i.kind==='matching'||i.kind==='timeline'){for(const item of i.items){await ui.getByRole('button',{name:item.label,exact:true}).click();await ui.getByRole('group',{name:'Vị trí phục dựng'}).getByRole('button',{name:i.targets.find(v=>v.id===item.target).label,exact:true}).click();}}
 else if(i.kind==='decision')await ui.getByRole('radio',{name:i.options.find(v=>v.id===i.correct).text,exact:true}).check();
 else{await ui.getByRole('radio',{name:i.decisions.find(v=>v.id===i.correctDecision).text,exact:true}).check();await ui.getByRole('button',{name:'Tiếp theo',exact:true}).click();const s=demo?null:await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY);const proof=i.proofOptions.find(v=>v.reasonIds.length&&(demo||proofAvailable(s,t,v.id)));await ui.getByRole('radio',{name:proof.text,exact:true}).check();await ui.getByRole('button',{name:'Tiếp theo',exact:true}).click();await ui.getByRole('radio',{name:i.reasons.find(v=>v.id===proof.reasonIds[0]).text,exact:true}).check();}
 await ui.getByRole('button',{name:i.kind==='council'?'Xác nhận phục dựng':'Kiểm tra quyết định',exact:true}).click();
}
try{
 for(const width of [1366,768,360]){const c=await browser.newContext({viewport:{width,height:900},isMobile:width===360,hasTouch:width===360});const p=await c.newPage();watch(p);await p.goto(base);await p.waitForLoadState('networkidle');await capture(p,'v3-home-'+width);if(width===1366){await p.keyboard.press('Tab');assert.equal(await p.locator(':focus').textContent(),'Đến nội dung chính');}const bytes=await p.evaluate(()=>performance.getEntriesByType('resource').reduce((n,r)=>n+(r.transferSize||0),0));assert(bytes<4*1024*1024);await p.getByRole('button',{name:'Để sau',exact:true}).click();await p.goto(base+'/room/1');await p.getByRole('heading',{name:rooms[0].name,exact:true}).waitFor();const text=await p.locator('main').innerText();const words=text.trim().split(/\s+/).length;assert(words<=213,'Initial text not reduced by50%');measurements.push({width,firstLoadBytes:bytes,initialRoomWords:words,baselineWords:427});await capture(p,'v3-initial-'+width);
 await p.getByRole('button',{name:/^Mở hồ sơ:/}).click();await p.getByRole('dialog').getByRole('button',{name:/Ghi nhận chứng cứ/}).click();await capture(p,'v3-task-'+width);
 await p.getByRole('navigation',{name:'Điều hướng chính'}).getByRole('link',{name:'Hướng dẫn',exact:true}).click();await p.getByRole('navigation',{name:'Mục lục hướng dẫn'}).waitFor();await capture(p,'v3-guide-'+width);await c.close();}
 // Full game via actual controls, with both optional and main content.
 const c=await browser.newContext({viewport:{width:1366,height:1000}});const p=await c.newPage();watch(p);await p.goto(base+'/room/1');await p.getByRole('button',{name:'Để sau',exact:true}).click();
 for(const r of rooms){for(const t of r.steps){for(const id of t.requiresEvidence){const current=await p.evaluate(key=>localStorage.getItem(key),SAVE_KEY);if(current&&JSON.parse(current).rooms[r.id].evidence.includes(id))continue;await p.getByRole('button',{name:/^Mở hồ sơ:/}).click();await p.getByRole('dialog').getByRole('button',{name:/^Ghi nhận chứng cứ/}).click();}
  await solve(p,t);if(t!==r.steps[3])await p.getByRole('button',{name:'Tiếp tục',exact:true}).click();
  if(t===r.steps[1]){await p.getByText('Các điểm khám phá',{exact:true}).click();await p.getByRole('button',{name:new RegExp('Thư 0'+r.id)}).click();await p.getByRole('dialog').getByRole('button',{name:/^Ghi nhận chứng cứ/}).click();}
 }
 await capture(p,'v3-restored-'+r.id);await p.getByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`,exact:true}).click();}
 for(const r of rooms){await p.getByRole('group',{name:'Các phần báo cáo'}).getByRole('button',{name:new RegExp(escape(r.shortName))}).click();await solve(p,r.finalCase);}
 await p.getByRole('button',{name:'Khôi phục thư viện',exact:true}).click();await p.getByRole('heading',{name:'Ký ức được nối lại.',exact:true}).waitFor();await p.reload();await capture(p,'v3-ending-letters');const saved=await p.evaluate(key=>localStorage.getItem(key),SAVE_KEY);assert(JSON.parse(saved).finalComplete);
 await p.goto(base+'/demo');await p.getByRole('button',{name:/Ghi nhận chứng cứ/}).click();await p.getByRole('button',{name:/Ghi nhận chứng cứ/}).click();await solve(p,rooms[2].steps[3],true);await p.getByRole('link',{name:'Bắt đầu hành trình',exact:true}).waitFor();assert.equal(await p.evaluate(key=>localStorage.getItem(key),SAVE_KEY),saved);await capture(p,'v3-demo-complete');
 // Normal ending, migration and incomplete council reload.
 const normal=JSON.parse(saved);normal.rooms[1].evidence=normal.rooms[1].evidence.filter(v=>v!=='c1-e7');await p.evaluate(([key,s])=>localStorage.setItem(key,JSON.stringify(s)),[SAVE_KEY,normal]);await p.goto(base+'/result');await p.getByRole('heading',{name:'Thư viện đã sáng lại.',exact:true}).waitFor();await capture(p,'v3-ending-main');
 await p.evaluate(([key,raw])=>{localStorage.removeItem(key);localStorage.setItem('mln131-council-save-v2',raw);},[SAVE_KEY,JSON.stringify(finishThrough(2))]);await p.goto(base+'/');await p.getByRole('button',{name:'Tiếp tục hành trình',exact:true}).click();assert.equal((await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY)).rooms[2].completed.length,4);assert(await p.evaluate(()=>localStorage.getItem('mln131-council-save-v2')));
 const partial=completedRooms(1);partial.rooms[1].completed.pop();delete partial.rooms[1].answers['r1-p4'];await p.evaluate(([key,s])=>localStorage.setItem(key,JSON.stringify(s)),[SAVE_KEY,partial]);await p.goto(base+'/room/1');const t=rooms[0].steps[3],ui=p.getByRole('region',{name:t.title});await ui.getByRole('radio',{name:t.interaction.decisions[0].text,exact:true}).check();await ui.getByRole('button',{name:'Tiếp theo',exact:true}).click();await p.reload();await p.getByRole('radio',{name:t.interaction.proofOptions.find(v=>v.id==='direct').text,exact:true}).waitFor();await capture(p,'v3-council-reload');
 await c.close();assert.deepEqual(errors,[]);const report={passed:true,revision:3,fullUIWalkthrough:true,screenshots:shots,measurements,errors,humanPlaytestCompleted:false,physicalPhoneTested:false};fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,screenshots:shots.length},null,2));
}finally{await browser.close();await vite.close();if(server)await server.close();}
