import { useEffect, useRef } from 'react'
export type Burst = { x: number; y: number; id: number }
type Dust = { x: number; y: number; vx: number; vy: number; life: number }
export function Sky({ paused, burst }: { paused: boolean; burst: Burst | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dust = useRef<Dust[]>([])
  useEffect(() => {
    dust.current = []
    if (!burst || paused || !canvasRef.current) return
    const origin = canvasRef.current.getBoundingClientRect()
    dust.current = Array.from({ length: 24 }, (_, i) => ({ x: burst.x - origin.x, y: burst.y - origin.y, vx: Math.cos(i * 2.4) * (10 + i), vy: Math.sin(i * 2.4) * (10 + i) - 12, life: 1 }))
  }, [burst, paused])
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = 0, height = 0, frame = 0, time = 0, previous = 0
    let pointerX = 0, pointerY = 0, x = 0, y = 0
    let stars: { x: number; y: number; r: number; phase: number; depth: number }[] = []
    let readingZones: { x: number; y: number; width: number; height: number }[] = []
    const resize = () => {
      width = canvas.clientWidth; height = canvas.clientHeight
      const dpr = Math.min(devicePixelRatio || 1, width < 600 ? 1.5 : 1.75)
      canvas.width = width * dpr; canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const limited = navigator.hardwareConcurrency <= 4
      const count = Math.min(limited ? 100 : 230, Math.floor(width * height / 4200))
      stars = Array.from({ length: count }, (_, i) => ({ x: ((Math.sin(i * 127.1 + 7) * 43758.5453) % 1 + 1) % 1 * width, y: ((Math.sin(i * 311.7 + 4) * 23758.5453) % 1 + 1) % 1 * height, r: .45 + (i % 5) * .22, phase: i * 1.91, depth: 1 + i % 3 }))
      const origin = canvas.getBoundingClientRect()
      readingZones = [...document.querySelectorAll('.story-copy, .hidden-message, .letter-invitation, .name-constellation')].map(element => {
        const r = element.getBoundingClientRect()
        return { x: r.x - origin.x - 10, y: r.y - origin.y - 10, width: r.width + 20, height: r.height + 20 }
      })
      if (paused) draw(0)
    }
    const draw = (now: number) => {
      const dt = previous ? Math.min((now - previous) / 1000, .05) : 0
      previous = now; time += dt
      x += (pointerX - x) * .025; y += (pointerY - y) * .025
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        const alpha = .26 + .35 * (1 + Math.sin(time * .42 + star.phase)) / 2
        const sx = star.x + x * star.depth, sy = star.y + y * star.depth
        ctx.fillStyle = `rgba(226,225,204,${alpha})`
        ctx.beginPath(); ctx.arc(sx, sy, star.r, 0, Math.PI * 2); ctx.fill()
        if (star.depth === 3 && star.r > 1) {
          ctx.strokeStyle = `rgba(232,210,163,${alpha * .4})`; ctx.lineWidth = .5
          ctx.beginPath(); ctx.moveTo(sx - 4, sy); ctx.lineTo(sx + 4, sy); ctx.moveTo(sx, sy - 4); ctx.lineTo(sx, sy + 4); ctx.stroke()
        }
      }
      if (!paused) {
        dust.current = dust.current.filter(p => p.life > 0)
        for (const p of dust.current) {
          p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * .7
          if (readingZones.some(r => p.x > r.x && p.x < r.x + r.width && p.y > r.y && p.y < r.y + r.height)) continue
          ctx.fillStyle = `rgba(249,204,103,${Math.max(0, p.life)})`
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(.2, p.life * 2), 0, Math.PI * 2); ctx.fill()
        }
        frame = requestAnimationFrame(draw)
      }
    }
    const pointer = (e: PointerEvent) => { if (e.pointerType === 'mouse') { pointerX = (e.clientX / width - .5) * 5; pointerY = (e.clientY / height - .5) * 5 } }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    if (!paused) frame = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', pointer, { passive: true })
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', pointer) }
  }, [paused])
  return <canvas ref={canvasRef} className="sky" aria-hidden="true" />
}
