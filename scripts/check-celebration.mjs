import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createServer,preview} from 'vite';
/* global document,innerWidth,window,getComputedStyle */
const runtime=process.env.RUNTIME_NODE_MODULES||path.join(process.env.USERPROFILE||'','.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const {chromium}=createRequire(path.join(runtime,'package.json'))('playwright');
const vite=await createServer({cacheDir:'.build/celebration-browser-cache',server:{middlewareMode:true,hmr:false},appType:'custom'});
const {rooms}=await vite.ssrLoadModule('/src/restoration/curriculum.ts');
const {SAVE_KEY}=await vite.ssrLoadModule('/src/restoration/engine.ts');
const {completedRooms,winningAnswer}=await vite.ssrLoadModule('/src/tests/restoration-fixtures.ts');
const headers=Object.fromEntries(JSON.parse(fs.readFileSync('vercel.json','utf8')).headers.filter(v=>v.source==='/(.*)').flatMap(v=>v.headers.map(h=>[h.key,h.value])));
const server=await preview({preview:{host:'127.0.0.1',port:4289,strictPort:true,headers}}),base='http://127.0.0.1:4289';
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||path.join(process.env.USERPROFILE||'','AppData/Local/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-win64/chrome-headless-shell.exe')});
const output=path.resolve('output/qa'),shots=[],errors=[],checks=[];fs.mkdirSync(output,{recursive:true});
function seed(id){const s=completedRooms(id),r=rooms[id-1],t=r.steps[3];s.rooms[id].completed.pop();delete s.rooms[id].answers[t.id];s.rooms[id].answers[t.id]=winningAnswer(t,s);s.currentRoom=id;return s;}
async function open(p,id){await p.goto(base);await p.evaluate(([key,s])=>{localStorage.setItem(key,JSON.stringify(s));localStorage.setItem('mln131-escape-save-v1','v1-keep');localStorage.setItem('mln131-council-save-v2','v2-keep');},[SAVE_KEY,seed(id)]);await p.goto(`${base}/room/${id}`);await p.getByRole('button',{name:'Xác nhận phục dựng',exact:true}).waitFor();await p.evaluate(()=>document.fonts.ready);await p.getByRole('button',{name:'Xác nhận phục dựng',exact:true}).click();await p.getByRole('dialog').waitFor();}
async function capture(p,name){assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' page overflow');const file=path.join(output,name+'.png');await p.screenshot({path:file});shots.push(file);}
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&/content security policy/i.test(m.text()))errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});}
try{
 for(const width of [1366,768,360]){
  const c=await browser.newContext({viewport:{width,height:width===360?800:900},isMobile:width===360,hasTouch:width===360});
  await c.addInitScript(()=>{localStorage.setItem('mln131-guide-intro-v1','seen');localStorage.setItem('mln131-council-settings-v1',JSON.stringify({muted:false,music:0,effects:.4,reducedMotion:false}));const NativeAudio=window.Audio;window.__celebrationSounds=[];window.Audio=function(src){if(src)window.__celebrationSounds.push(src);return src?new NativeAudio(src):new NativeAudio();};});
  const p=await c.newPage();watch(p);
  for(const r of rooms){await open(p,r.id);const dialog=p.getByRole('dialog'),state=p.locator('.restoration-celebration');assert.equal(await state.getAttribute('data-state'),'awakening');assert.equal((await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),SAVE_KEY)).rooms[r.id].completed.length,4);
   const particles=await p.locator('.celebration-particles>i').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').length);assert.equal(particles,width===360?12:24);
   if(r.id===1){await capture(p,`celebration-${width}-start`);await p.waitForTimeout(950);await capture(p,`celebration-${width}-light`);await p.waitForTimeout(2200);}
   else await dialog.getByRole('button',{name:'Bỏ qua hiệu ứng',exact:true}).click();
   await dialog.getByRole('button',{name:'Ở lại khám phá',exact:true}).waitFor();assert(await dialog.getByRole('button',{name:r.id===4?'Đến Phòng Lõi':`Sang phòng ${r.id+1}`,exact:true}).evaluate(e=>e===document.activeElement),'Ready action must receive focus');
   for(const button of await dialog.getByRole('button').all()){const b=await button.boundingBox();assert(b&&b.x>=-1&&b.y>=-1&&b.x+b.width<=width+1&&b.y+b.height<=(width===360?800:900)+1,'Button outside viewport');}
   const img=await p.locator('.celebration-image-lit').evaluate(e=>({fit:getComputedStyle(e).objectFit,w:e.clientWidth,h:e.clientHeight,nw:e.naturalWidth,nh:e.naturalHeight}));assert.equal(img.fit,'contain');assert(Math.abs(img.w/img.h-img.nw/img.nh)<.01,'Image ratio changed');
   await capture(p,`celebration-${width}-room-${r.id}-ready`);
   const sounds=await p.evaluate(()=>window.__celebrationSounds);assert.equal(sounds.filter(s=>s==='/audio/chapter.ogg').length,1);assert.equal(sounds.filter(s=>s==='/audio/insight.ogg').length,0);
   if(r.id===1){if(width===360)await dialog.getByRole('button',{name:'Ở lại khám phá',exact:true}).tap();else await dialog.getByRole('button',{name:'Ở lại khám phá',exact:true}).click();assert(await p.getByLabel('Tổng kết phục dựng').evaluate(e=>e===document.activeElement));await p.reload();assert.equal(await p.getByRole('dialog').count(),0);}
   else if(r.id===2){await p.keyboard.press('Escape');assert.equal(await p.getByRole('dialog').count(),0);assert(await p.getByLabel('Tổng kết phục dựng').evaluate(e=>e===document.activeElement));}
   else if(r.id===3)await dialog.getByRole('button',{name:'Đóng cửa sổ',exact:true}).click();
   else {await dialog.getByRole('button',{name:'Đến Phòng Lõi',exact:true}).click();await p.waitForURL('**/final');}
   assert.equal(await p.evaluate(()=>document.body.style.overflow),'');assert.equal(await p.evaluate(()=>localStorage.getItem('mln131-escape-save-v1')),'v1-keep');assert.equal(await p.evaluate(()=>localStorage.getItem('mln131-council-save-v2')),'v2-keep');
  }
  checks.push(`4 rooms, timing, colors, particles, save, focus, controls at ${width}px`);await c.close();
 }
 const c=await browser.newContext({viewport:{width:360,height:800},reducedMotion:'reduce'});await c.addInitScript(()=>{localStorage.setItem('mln131-guide-intro-v1','seen');localStorage.setItem('mln131-council-settings-v1',JSON.stringify({muted:true,music:0,effects:.4,reducedMotion:false}));});const p=await c.newPage();watch(p);await open(p,3);await p.getByRole('dialog').getByRole('button',{name:'Ở lại khám phá'}).waitFor();assert.equal(await p.locator('.restoration-celebration').getAttribute('data-state'),'ready');await capture(p,'celebration-reduced-360');assert.equal(await p.locator('.celebration-image-lit').evaluate(e=>e.getAnimations().length),0);await c.close();checks.push('OS reduced motion bypasses3second wait');
 assert.deepEqual(errors,[]);const report={passed:true,checks,screenshots:shots,errors,physicalPhoneTested:false,humanExcitementMeasured:false};fs.writeFileSync(path.join(output,'celebration-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({...report,screenshots:shots.length},null,2));
}finally{await browser.close();await vite.close();await server.close();}
