import { lazy, Suspense, useEffect, useReducer, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { content } from './content'
import { sceneReducer } from './scene'
import { useMotion } from './hooks/useMotion'
import { Sky, type Burst } from './components/Sky'
import { Rose } from './components/Rose'
import { Observatory } from './components/Observatory'
import { Envelope, Star } from './components/Icons'
import { Letter } from './components/Letter'

const NameConstellation = lazy(() => import('./components/NameConstellation').then(module => ({ default: module.NameConstellation })))

const gardenFlowers = [
  { x: 8, y: 9, size: 260, tilt: -17, variant: 1, depth: 'near' },
  { x: 25, y: 21, size: 175, tilt: 13, variant: 2, depth: 'far' },
  { x: 43, y: 4, size: 300, tilt: -8, variant: 3, depth: 'near' },
  { x: 66, y: 21, size: 185, tilt: 16, variant: 4, depth: 'far' },
  { x: 84, y: 6, size: 310, tilt: 12, variant: 1, depth: 'near' },
  { x: 95, y: 27, size: 150, tilt: -18, variant: 2, depth: 'far' },
]

export function App() {
  const [scene, dispatch] = useReducer(sceneReducer, 'intro')
  const [cycle, setCycle] = useState(0)
  const motion = useMotion()
  const [burst, setBurst] = useState<Burst | null>(null)
  const [secret, setSecret] = useState(false)
  const [message, setMessage] = useState('')
  const [messageClosing, setMessageClosing] = useState(false)
  const [discovered, setDiscovered] = useState<number[]>([])
  const primaryRef = useRef<HTMLButtonElement>(null)
  const envelopeRef = useRef<HTMLButtonElement>(null)
  const previousScene = useRef(scene)
  const garden = scene === 'garden' || scene === 'letter'
  const act = scene === 'intro' ? 1 : garden || scene === 'seeding' ? 3 : 2

  useEffect(() => {
    if (scene !== 'growing' && scene !== 'seeding') return
    const timer = setTimeout(() => dispatch('FINISH'), motion.still ? 20 : scene === 'growing' ? 5400 : 1900)
    return () => clearTimeout(timer)
  }, [scene, motion.still])
  useEffect(() => {
    if (scene === previousScene.current) return
    previousScene.current = scene
    if (scene === 'bloom' || scene === 'intro') primaryRef.current?.focus({ preventScroll: true })
    if (scene === 'garden') envelopeRef.current?.focus({ preventScroll: true })
  }, [scene])
  useEffect(() => {
    if (!message) return
    const fade = setTimeout(() => setMessageClosing(true), 5000)
    const clear = setTimeout(() => {setMessage('');setMessageClosing(false)}, 5500)
    return () => {clearTimeout(fade);clearTimeout(clear)}
  }, [message, burst?.id])

  const sparkle = (e: MouseEvent<HTMLButtonElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect()
    setBurst({ x: e.detail ? e.clientX : bounds.x + bounds.width / 2, y: e.detail ? e.clientY : bounds.y + bounds.height / 3, id: performance.now() })
  }
  const discover = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    sparkle(e); setSecret(false); setMessage(content.secrets[index % 3]); setMessageClosing(false)
    setDiscovered(d => d.includes(index % 3) ? d : [...d, index % 3])
  }
  const replay = () => { setSecret(false);setMessage('');setDiscovered([]);setBurst(null);setCycle(c=>c+1);dispatch('REPLAY') }

  return <main className={`universe scene-${scene} ${secret ? 'is-secret' : ''} ${motion.still ? 'still' : ''} ${motion.ambientPaused || scene === 'letter' ? 'ambient-paused' : ''}`} data-scene={scene}>
    <a className="skip-link" href="#experience">Ir a la experiencia</a>
    <div className="nebula" aria-hidden="true"/>
    <Sky paused={motion.ambientPaused || scene === 'letter'} burst={burst}/>
    <div className="grain" aria-hidden="true"/>
    <header className="masthead">
      <div className="wordmark"><Star/><span>{content.brand[0]}<span className="wordmark-sub">{content.brand[1]}</span></span></div>
      <div className="header-controls">
        <button className="quiet-button motion-button" onClick={()=>motion.setPaused(p=>!p)} aria-pressed={motion.paused} disabled={motion.reduced} aria-label={motion.reduced ? 'Movimiento reducido del sistema activado' : motion.paused ? 'Reanudar movimiento' : 'Pausar movimiento'}>
          <svg viewBox="0 0 20 20" aria-hidden="true">{motion.still ? <path d="M7 4L15 10L7 16Z" fill="currentColor"/> : <><path d="M7 4V16M13 4V16" stroke="currentColor" strokeWidth="1.5"/></>}</svg>
          <span>{motion.reduced ? 'Movimiento reducido' : motion.paused ? 'Reanudar' : 'Pausar'}</span>
        </button>
        {(scene === 'intro' || scene === 'growing') ? <button className="quiet-button skip-intro" onClick={()=>dispatch('SKIP')}>Saltar intro <span aria-hidden="true">↗</span></button> : <button className="quiet-button" onClick={replay}>Repetir <span aria-hidden="true">↺</span></button>}
      </div>
    </header>

    <div className="scene-content" id="experience" tabIndex={-1} key={cycle}>
      <div className="story-copy" key={garden ? 'garden-copy' : 'main-copy'}>
        <p className="dedication">Para {content.recipient}<span className="small-spark" aria-hidden="true">✧</span></p>
        {garden ? <><h1 className="garden-title">{content.gardenTitle[0]}<br/>{content.gardenTitle[1]}<br/><em>{content.gardenTitle[2]}</em></h1><div className="garden-message"><p>{content.garden[0]}</p><p>{content.garden[1]}</p></div></> : <><h1>{content.title[0]}<br/>{content.title[1]}<br/><em>{content.title[2]}</em></h1>
          <div className="story-note" key={scene === 'bloom' || scene === 'seeding' ? 'bloom-note' : 'intro-note'}>
            {scene === 'bloom' || scene === 'seeding' ? <p>{content.bloom}</p> : <><p className="recipient">{content.recipient}…</p><p>{content.intro}</p></>}
          </div></>}
        <div className="tiny-line" aria-hidden="true"/><p className="aside-note">{content.aside}</p>
      </div>

      <div className="celestial-stage">
        {garden && <button className={`secret-star ${secret ? 'discovered' : ''}`} onClick={()=>{setMessage('');setSecret(s=>!s)}} aria-label={secret ? content.constellation.close : `${content.constellation.discover} ${content.constellation.label}`} aria-pressed={secret}><Star/><span>{secret ? content.constellation.close : content.constellation.discover}</span></button>}
        <div className="celestial-visual">
        <Observatory/>
        <span className="orbit-caption" aria-hidden="true">{content.orbit}</span>
        {scene === 'intro' && <button ref={primaryRef} className="traveler" onClick={()=>dispatch('START')} aria-label="Tocar la estrella y hacer florecer la rosa"><span className="star-halo"/><Star/><span className="star-orbit"/><span className="touch-hint">{content.starHint[0]}<span>{content.starHint[1]}</span></span></button>}
        {scene === 'growing' && <svg className="falling-trail" viewBox="0 0 390 585" aria-hidden="true"><path d="M225 40C360 190 120 230 200 350C270 452 207 515 210 555" pathLength="1"/><circle r="4" fill="#fff3c4"><animateMotion dur="1.8s" fill="freeze" path="M225 40C360 190 120 230 200 350C270 452 207 515 210 555"/></circle></svg>}
        {scene !== 'intro' && <div className={`hero-flower ${burst ? 'has-sparkled' : ''}`}>
          <div className="flower-aura"/>
          {burst && <div key={burst.id} className="petal-flash"/>}
          <Rose growing={scene === 'growing'}/>
          {(scene === 'bloom' || garden) && !secret && <button ref={primaryRef} className="flower-touch" aria-label={garden ? 'Tocar los pétalos de la rosa' : 'Tocar la rosa y descubrir el jardín'} onClick={e=>{if(scene === 'bloom'){sparkle(e);dispatch('PLANT')} else discover(0,e)}}><span className="touch-ring"/><span className="sr-only">Tocar pétalos</span></button>}
          {scene === 'seeding' && <svg className="escaping-petal" viewBox="0 0 80 80" aria-hidden="true"><path d="M40 9C57 0 76 19 70 40C75 57 56 75 40 69C21 77 6 58 10 40C2 23 22 4 40 9Z" fill="#edc76d"><animate attributeName="d" dur="1.8s" fill="freeze" values="M40 9C57 0 76 19 70 40C75 57 56 75 40 69C21 77 6 58 10 40C2 23 22 4 40 9Z;M40 3C43 31 49 37 77 40C49 43 43 49 40 77C37 49 31 43 3 40C31 37 37 31 40 3Z"/></path></svg>}
        </div>}
        {secret && garden && <Suspense fallback={<p className="constellation-loading" role="status">{content.constellation.loading}</p>}><NameConstellation still={motion.still} paused={motion.ambientPaused || scene === 'letter'}/></Suspense>}
        </div>
        {(scene === 'bloom' || scene === 'growing') && <div className="flower-caption"><span className="caption-rule"/><span>{content.flowerCaption[scene === 'growing' ? 0 : 1]}</span><span className="specimen-number" aria-hidden="true">✧</span></div>}
        {scene === 'bloom' && <button className="bloom-hint" onClick={e=>{sparkle(e);dispatch('PLANT')}}>{content.bloomHint}<span aria-hidden="true">↗</span></button>}
      </div>

      {garden && <div className="garden">
        <button ref={envelopeRef} className="letter-invitation" onClick={()=>{setMessage('');dispatch('LETTER')}} aria-label="Abrir la carta para Anel"><span className="envelope-birth"><Star className="envelope-star"/><Envelope/></span><span>{content.invitation[0]}<span>{content.invitation[1]}</span></span></button>
        <div className={`hidden-message ${messageClosing ? 'message-closing' : ''}`} role="status" aria-live="polite">{message ? <p key={message}>{message}</p> : <span className="garden-hint">{content.gardenHint}</span>}</div>
        <div className="garden-meadow">
        <svg className="garden-constellations" viewBox="0 0 1200 500" preserveAspectRatio="none" aria-hidden="true"><path d="M30 350L170 170L280 270L460 130L610 310L790 140L990 250L1130 150" pathLength="1"/>{[[30,350],[170,170],[280,270],[460,130],[610,310],[790,140],[990,250],[1130,150]].map(([x,y])=><circle key={x} cx={x} cy={y} r="3"/>)}</svg>
        {gardenFlowers.map((flower,i)=><button key={i} className={`garden-flower garden-flower-${i} ${flower.depth}`} style={{'--x': `${flower.x}%`, '--y': `${flower.y}%`, '--size': `${flower.size}px`, '--tilt': `${flower.tilt}deg`, '--delay': `${i * .12}s`} as CSSProperties} onClick={e=>discover(i,e)} aria-label={`Descubrir mensaje en flor ${i + 1}`}><Rose variant={flower.variant}/><span className="flower-firefly"/><span className="sr-only">Descubrir una frase</span></button>)}
        </div>
      </div>}
    </div>

    <footer className="scene-footer"><div className="act-progress" aria-label={`Acto ${act} de 3`}><span className="act-number">0{act}<span>/ 03</span></span><span className="progress-track"><i style={{width:`${act / 3 * 100}%`}}/></span><span className="act-name">{content.acts[act - 1]}</span></div><span className="footer-note">{garden ? `${discovered.length} de 3 pequeñas sorpresas` : content.footer}<Star/></span></footer>
    <div className="sr-only" role="status" aria-live="polite">{scene === 'bloom' ? 'La rosa ha florecido. Tócala para descubrir el jardín.' : garden ? 'El jardín ha florecido. Puedes explorar las flores o abrir la carta.' : scene === 'growing' ? 'La estrella está dibujando tu rosa.' : ''}</div>
    {scene === 'letter' && <Letter still={motion.still} onClose={()=>dispatch('CLOSE')}/>}
  </main>
}
