import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import assert from 'node:assert/strict'

const directory=`${process.env.EVIDENCE_DIR || 'output/playwright/v2'}/motion`
await mkdir(directory,{recursive:true})
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true})
const report={date:new Date().toISOString(),views:[],checks:[],errors:[]}
const check=(value,label)=>{assert.ok(value,label);report.checks.push(label);console.log(`PASS ${label}`)}
try {
  for(const [width,height] of [[320,568],[360,640],[375,667],[390,844],[414,896],[768,1024],[1024,768],[1440,900],[844,390]]) {
    const context=await browser.newContext({viewport:{width,height},reducedMotion:'no-preference'})
    const page=await context.newPage()
    page.on('pageerror',error=>report.errors.push(error.message))
    const shot=async phase=>{
      const geometry=await page.evaluate(()=>{
        const copy=document.querySelector('.story-copy').getBoundingClientRect()
        const blossom=document.querySelector('.hero-flower .blossom').getBoundingClientRect()
        const secret=document.querySelector('main').classList.contains('is-secret')
        return {overflow:document.documentElement.scrollWidth>innerWidth,collision:!secret&&copy.left<blossom.right&&copy.right>blossom.left&&copy.top<blossom.bottom&&copy.bottom>blossom.top}
      })
      assert.equal(geometry.overflow,false);assert.equal(geometry.collision,false)
      await page.screenshot({path:`${directory}/${width}x${height}-${phase}.png`,fullPage:true})
      report.views.push({width,height,phase,...geometry})
    }
    await page.goto(process.env.TEST_URL||'http://127.0.0.1:3000/')
    await page.locator('.traveler').click()
    await page.locator('[data-scene="growing"]').waitFor()
    await page.waitForTimeout(2300);await shot('growing')
    await page.locator('[data-scene="bloom"]').waitFor()
    await page.locator('.flower-touch').click()
    await page.locator('[data-scene="seeding"]').waitFor()
    await page.waitForTimeout(750);await shot('seeding')
    await page.locator('[data-scene="garden"]').waitFor()
    await page.locator('.secret-star').click()
    await page.locator('.name-constellation[data-phase="writing"]').waitFor()
    await page.waitForTimeout(900);await shot('writing')
    const penDistance=await page.evaluate(()=>{
      const r=document.querySelector('.writing-star').getBoundingClientRect()
      const active=[...document.querySelectorAll('.name-stroke')].find(p=>{const dash=parseFloat(p.style.strokeDasharray);return dash>0&&dash<p.getTotalLength()-.5})
      if(!active)return null
      const point=active.getPointAtLength(parseFloat(active.style.strokeDasharray)).matrixTransform(active.getScreenCTM())
      return Math.hypot(point.x-r.x-r.width/2,point.y-r.y-r.height/2)
    })
    report.views.at(-1).penDistance=penDistance
    await page.locator('.name-constellation[data-phase="complete"]').waitFor()
    check(await page.locator('.name-fill').evaluateAll(nodes=>nodes.every(n=>getComputedStyle(n).opacity==='1')),`${width} × ${height}: todas las letras completas`)
    if(width===390) {
      await page.locator('.secret-star').click();await page.locator('.secret-star').click()
      await page.locator('.name-constellation[data-phase="writing"]').waitFor()
      await page.setViewportSize({width:1440,height:900})
      await page.locator('.name-constellation[data-phase="complete"]').waitFor()
      check(await page.locator('.name-word').evaluateAll(words=>words[0].getCTM().f===words[1].getCTM().f),'Cambio de orientación durante escritura recompone y termina sin reiniciar')
      await page.locator('.secret-star').click();await page.locator('.secret-star').click()
      await page.locator('.name-constellation[data-phase="writing"]').waitFor()
      await page.getByRole('button',{name:'Pausar movimiento'}).click()
      await page.locator('.name-constellation[data-phase="complete"]').waitFor()
      check(true,'Pausa durante escritura muestra el nombre completo')
      await page.getByRole('button',{name:'Reanudar movimiento'}).click()
      await page.locator('.secret-star').click();await page.locator('.secret-star').click()
      await page.locator('.name-constellation[data-phase="writing"]').waitFor()
      await page.getByRole('button',{name:'Repetir',exact:true}).click()
      await page.waitForTimeout(6000)
      check(await page.locator('main').getAttribute('data-scene')==='intro'&&await page.locator('.name-constellation').count()===0,'Repetir durante escritura limpia la secuencia y sus callbacks')
      await page.emulateMedia({reducedMotion:'reduce'})
      await page.locator('.skip-intro').click();await page.locator('.flower-touch').click();await page.locator('.secret-star').click()
      await page.locator('.name-constellation[data-phase="complete"]').waitFor({timeout:2000})
      check(true,'Movimiento reducido revela el nombre sin secuencia compleja')
    }
    await context.close()
  }
  check(report.errors.length===0,'Sin excepciones durante transiciones e interrupciones')
} finally {
  await writeFile(`${directory}/report.json`,JSON.stringify(report,null,2))
  for(const phase of ['growing','seeding','writing'])await writeFile(`${directory}/${phase}.html`,`<!doctype html><html lang="es"><meta charset="utf-8"><title>${phase} v2</title><style>body{background:#15202b;color:#f5eddb;font:14px system-ui;margin:24px}main{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{margin:0}img{width:100%;height:520px;object-fit:contain;background:#080f19}</style><h1>${phase} — V2</h1><main>${report.views.filter(v=>v.phase===phase).map(v=>`<figure><img src="${v.width}x${v.height}-${phase}.png" alt="${v.width} × ${v.height}"><figcaption>${v.width} × ${v.height}</figcaption></figure>`).join('')}</main></html>`)
  await browser.close()
}
