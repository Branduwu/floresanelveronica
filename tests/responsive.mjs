import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const baseline = process.env.BASELINE === '1'
const directory = `${process.env.EVIDENCE_DIR || 'output/playwright/v2'}/${baseline ? 'before' : 'responsive'}`
await mkdir(directory, {recursive:true})
const browser = await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL || 'chrome',headless:true})
const report = {baseline, date:new Date().toISOString(), views:[], errors:[]}
const sizes = [[320,568],[360,640],[375,667],[390,844],[414,896],[768,1024],[1024,768],[1440,900],[844,390]]
const gallery=[]
try {
  for (const [width,height] of sizes) {
    const context=await browser.newContext({viewport:{width,height},hasTouch:width<768,reducedMotion:'reduce',deviceScaleFactor:1})
    const page=await context.newPage()
    page.on('pageerror',e=>report.errors.push(e.message))
    const capture=async name=>{
      // Let the reduced-motion enter styles settle after a scene or viewport change.
      await page.waitForTimeout(100)
      await page.screenshot({path:`${directory}/${width}x${height}-${name}.png`,fullPage:!name.startsWith('letter'),scale:'css'})
      const layout=await page.evaluate(()=>{
        const rect=selector=>{const el=typeof selector==='string'?document.querySelector(selector):selector;if(!el || !el.getClientRects().length || getComputedStyle(el).visibility==='hidden')return null;const {x,y,width,height}=el.getBoundingClientRect();return {x,y,width,height}}
        return {overflow:document.documentElement.scrollWidth>innerWidth, copy:rect('.story-copy'),flower:rect('.hero-flower .blossom'),meadow:[...document.querySelectorAll('.garden-flower .blossom')].map(rect),invitation:rect('.letter-invitation'),message:rect('.hidden-message p'),nameBox:rect('.name-constellation'),controls:rect('.header-controls'),wordmark:rect('.wordmark')}
      })
      const intersects=(a,b)=>a&&b&&a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y
      const collisions=['copy','invitation','message','nameBox'].filter(key=>[layout.flower,...layout.meadow].some(flower=>intersects(layout[key],flower)))
      if(intersects(layout.invitation,layout.message))collisions.push('invitation/message')
      if(intersects(layout.controls,layout.wordmark))collisions.push('header')
      report.views.push({width,height,name,...layout,collisions})
      if(!baseline){assert.equal(layout.overflow,false,`${width} ${name}: horizontal overflow`);assert.deepEqual(collisions,[],`${width} ${name}: ${collisions.join(',')}`)}
      gallery.push({width,height,name,file:`${width}x${height}-${name}.png`})
    }
    await page.goto(process.env.TEST_URL || 'http://127.0.0.1:3000/');await page.evaluate(()=>document.fonts.ready)
    await capture('intro')
    await page.locator('.skip-intro').click();await page.locator('[data-scene="bloom"]').waitFor();await capture('bloom')
    await page.locator('.flower-touch').click();await page.locator('[data-scene="garden"]').waitFor();await capture('garden')
    await page.locator('.secret-star').click()
    if(!baseline)await page.locator('.name-constellation[data-phase="complete"]').waitFor()
    await capture('constellation')
    await page.locator('.garden-flower-0').click();await capture('message')
    if(!baseline)for(const i of [1,2]){await page.locator(`.garden-flower-${i}`).click();await capture(`message-${i+1}`)}
    await page.locator('.letter-invitation').click();await page.getByRole('dialog').waitFor();await capture('letter')
    if(!baseline){
      await page.locator('.letter-paper').evaluate(el=>el.scrollTop=el.scrollHeight)
      await capture('letter-bottom')
      const end=await page.locator('.return-garden').boundingBox()
      assert.ok(end.y>=0&&end.y+end.height<=height,'El final de la carta queda accesible al desplazar el papel')
      await page.locator('.return-garden').click();await page.locator('[data-scene="garden"]').waitFor()
      await page.setViewportSize({width,height:height-90});await capture('browser-bar')
    }
    console.log(`CAPTURED ${width}x${height}`)
    await context.close()
  }
  assert.equal(report.errors.length,0)
} finally {
  await writeFile(`${directory}/report.json`,JSON.stringify(report,null,2))
  const scenes=[...new Set(gallery.map(g=>g.name))]
  for(const scene of scenes)await writeFile(`${directory}/${scene}.html`,`<!doctype html><html lang="es"><meta charset="utf-8"><title>${scene} v2</title><style>body{background:#15202b;color:#f5eddb;font:14px system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{margin:0}img{width:100%;height:520px;object-fit:contain;background:#080f19}a{color:#e7bd64}</style><h1>${scene} — ${baseline?'Antes':'V2'}</h1><main>${gallery.filter(g=>g.name===scene).map(g=>`<figure><a href="${g.file}"><img src="${g.file}" alt="${g.width} × ${g.height}"></a><figcaption>${g.width} × ${g.height}</figcaption></figure>`).join('')}</main></html>`)
  await browser.close()
}
