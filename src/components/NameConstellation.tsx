import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { nameGeometry } from '../data/nameGlyphs'
import { content } from '../content'

gsap.registerPlugin(useGSAP, DrawSVGPlugin, MotionPathPlugin)

export function NameConstellation({ still, paused }: { still: boolean; paused: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const started = useRef(false)
  const [narrow, setNarrow] = useState<boolean | null>(null)
  const width = narrow ? 390 : 760
  const height = narrow ? 350 : 270
  const totalWidth = nameGeometry.words.reduce((sum, word) => sum + word.width, 0) + 24

  useEffect(() => {
    const element = root.current
    if (!element) return
    const update = () => setNarrow(element.clientWidth < 520)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useGSAP(() => {
    if (narrow === null || !root.current) return
    const scope = root.current
    const strokes = [...scope.querySelectorAll<SVGPathElement>('.name-stroke')]
    const fills = [...scope.querySelectorAll<SVGPathElement>('.name-fill')]
    const pen = scope.querySelector('.writing-star')!
    const points = scope.querySelectorAll('.gathering-star')
    const instant = still || started.current
    started.current = true
    scope.dataset.phase = instant ? 'complete' : 'gathering'
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: () => { scope.dataset.phase = 'complete' } })
    timeline.current = tl
    gsap.set(strokes, { drawSVG: '0% 0%' })
    gsap.set(fills, { opacity: 0 })
    gsap.set(pen, { autoAlpha: 0 })
    tl.addLabel('gather', 0)
      .fromTo(points, { x: (i: number) => (i % 2 ? -1 : 1) * (35 + i * 9), y: -24, opacity: .15 }, { x: 0, y: 0, opacity: 1, duration: .65, stagger: .035 }, 'gather')
      .fromTo('.initials-line', { drawSVG: 0 }, { drawSVG: '100%', duration: .7 }, 'gather+=.15')
      .to('.initials', { opacity: .25, duration: .35 }, .9)
      .fromTo('.name-connector', { drawSVG: 0 }, { drawSVG: '100%', duration: .4 }, .8)
      .addLabel('write', 1.05)
      .set(pen, { autoAlpha: 1 }, 'write')
      .call(() => { scope.dataset.phase = 'writing' }, [], 'write')

    // Reads are batched before the timeline writes. Each contour is a single SVG path.
    const lengths = strokes.map(path => path.getTotalLength())
    const sum = lengths.reduce((a, b) => a + b, 0)
    let cursor = 1.05
    strokes.forEach((path, i) => {
      const duration = .035 + (lengths[i] / sum) * 3.25
      tl.to(path, { drawSVG: '100%', duration, ease: 'sine.inOut' }, cursor)
      tl.to(pen, { motionPath: { path, align: path, alignOrigin: [.5, .5] }, duration, ease: 'sine.inOut' }, cursor)
      if (path.dataset.last === 'true') {
        const fill = fills[Number(path.dataset.letter)]
        tl.to(fill, { opacity: 1, duration: .3 }, cursor + duration * .65)
      }
      cursor += duration
    })
    tl.addLabel('settle', cursor)
      .to(pen, { autoAlpha: 0, duration: .25 }, 'settle')
      .to(strokes, { opacity: .32, duration: .4 }, 'settle')
      .fromTo('.name-caption', { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: .4 }, 'settle')
    const last = strokes[strokes.length - 2]
    tl.fromTo('.letter-mote', { autoAlpha: 0 }, { autoAlpha: .85, duration: .15 }, 'settle')
      .to('.letter-mote', { motionPath: { path: last, align: last, alignOrigin: [.5, .5] }, duration: .65, ease: 'sine.inOut' }, 'settle')
      .to('.letter-mote', { autoAlpha: 0, duration: .25 }, 'settle+=.5')
    if (instant) tl.progress(1).pause()
    return () => { timeline.current = null }
  }, { scope: root, dependencies: [narrow], revertOnUpdate: true })

  useEffect(() => {
    const tl = timeline.current
    if (!tl) return
    if (still) tl.progress(1).pause()
    else tl.paused(paused)
  }, [still, paused, narrow])

  let letterIndex = 0
  let wordX = (width - totalWidth) / 2
  return <div ref={root} className="name-constellation" data-phase="preparing">
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Constelación ${content.recipient}`}>
      <defs><linearGradient id="name-gold" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff1bf"/><stop offset="1" stopColor="#e4b65e"/></linearGradient></defs>
      <g className="initials" transform={`translate(${width / 2 - 70} 8) scale(.54)`} aria-hidden="true">
        <path className="initials-line" d="M20 90L55 15L90 90M36 58H74M170 15L205 90L240 15"/>
        {[[20,90],[55,15],[90,90],[36,58],[74,58],[170,15],[205,90],[240,15]].map(([x,y],i)=><circle key={i} className="gathering-star" cx={x} cy={y} r="3"/>)}
        <path fill="#ffdf92" stroke="none" d="M130 36L134 50L148 54L134 58L130 72L126 58L112 54L126 50Z"/>
      </g>
      <path className="name-connector" d={narrow ? 'M194 63C184 95 107 61 92 95' : 'M378 63C353 102 149 62 116 105'} />
      {nameGeometry.words.map((word, wi) => {
        const x = narrow ? (width - word.width) / 2 : wordX
        const y = narrow ? 64 + wi * 112 : 65
        wordX += word.width + 24
        return <g key={word.text} className="name-word" transform={`translate(${x} ${y})`}>
          {word.letters.map(letter => {
            const index = letterIndex++
            return <g key={index} transform={`translate(${letter.x} 0)`}>
              <path className="name-fill" d={letter.d} />
              {letter.strokes.map((d, i) => <path key={i} d={d} className="name-stroke" data-letter={index} data-last={i === letter.strokes.length - 1} />)}
            </g>
          })}
        </g>
      })}
      <g className="writing-star" aria-hidden="true"><circle r="9" opacity=".12"/><path d="M0 -7L1.8 -1.8L7 0L1.8 1.8L0 7L-1.8 1.8L-7 0L-1.8 -1.8Z"/></g>
      <circle className="letter-mote" r="2.5" aria-hidden="true"/>
    </svg>
    <p className="name-caption">{content.constellation.caption}</p>
  </div>
}
