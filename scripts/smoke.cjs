const {chromium}=require('playwright');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');
(async()=>{
 const server=spawn('python3',['-m','http.server','8000','--bind','127.0.0.1'],{cwd:require('node:path').resolve(__dirname,'../..'),stdio:'ignore'});
 let browser;
 try {
  browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  for(const viewport of [{width:1440,height:1000},{width:390,height:844}]){
   const page=await browser.newPage({viewport,hasTouch:viewport.width<700});const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8000/'+require('node:path').basename(require('node:path').resolve(__dirname,'..'))+'/',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelector('#phoneModel').loaded&&document.body.classList.contains('screen-aligned'),{timeout:60000});
   await page.waitForFunction(()=>document.body.classList.contains('residence-ready'),{timeout:60000});
   await page.getByRole('button',{name:'Front',exact:true}).click();
   await page.getByRole('button',{name:'Open Photos',exact:true}).click();
   await page.locator('.photo-thumb img').first().waitFor({state:'visible'});
   assert.equal(await page.locator('.photo-thumb img').evaluateAll(xs=>xs.filter(x=>x.complete&&x.naturalWidth>0).length),10);
   await page.getByRole('button',{name:'Open photo 1',exact:true}).click();
   assert.equal(await page.locator('#viewerPhoto img').getAttribute('src'),'./assets/photos/photo-01.jpg');
   await page.getByRole('button',{name:'Home',exact:true}).click();
   for(const name of ['Camera','Mail','Maps','Clock','Health','Notes','Settings','Phone','Messages','Music']){
    await page.getByRole('button',{name:'Open '+name,exact:true}).click();await page.locator('#systemPanel.open').waitFor({state:'visible'});assert.ok((await page.locator('#systemPanel').innerText()).includes(name));await page.getByRole('button',{name:'Home',exact:true}).click();
   }
   await page.getByRole('button',{name:'Open Settings',exact:true}).click();await page.getByLabel('Dark appearance').check();await page.getByLabel('Liquid Glass tint').press('End');assert.equal(await page.locator('.screen').evaluate(el=>el.classList.contains('dark-ui')),true);
   await page.getByRole('button',{name:'Home',exact:true}).click();
   await page.getByRole('button',{name:'Lock',exact:true}).click();await page.getByRole('button',{name:'Unlock',exact:true}).click();
   await page.getByRole('button',{name:'Controls',exact:true}).click();await page.getByRole('button',{name:/WiFi/}).click();assert.ok(await page.getByRole('button',{name:/WiFi/}).innerText().then(t=>t.includes('Off')));await page.getByRole('button',{name:'Done',exact:true}).click();
   await page.getByRole('button',{name:'Back',exact:true}).click();await page.waitForFunction(()=>!document.body.classList.contains('screen-aligned'));await page.getByRole('button',{name:'Front',exact:true}).click();await page.waitForFunction(()=>document.body.classList.contains('screen-aligned'));
   await page.screenshot({path:'/tmp/lovely-'+viewport.width+'.png'});assert.deepEqual(errors,[]);console.log('PASS',viewport,'gallery, apps, glass, lock, controls, front/back; no page errors');await page.close();
  }
 } finally {await browser?.close();server.kill()}
})().catch(e=>{console.error(e);process.exitCode=1});
