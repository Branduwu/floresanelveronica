import { useEffect, useRef } from 'react'
import { content } from '../content'
import { Star } from './Icons'
export function Letter({ onClose, still }: { onClose: () => void; still: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    ref.current?.showModal()
    return () => { clearTimeout(timer.current); previous?.focus() }
  }, [])
  const close = () => {
    if (closing.current) return
    closing.current = true
    ref.current?.classList.add('letter-closing')
    timer.current = setTimeout(onClose, still ? 0 : 300)
  }
  return <dialog ref={ref} className="letter-dialog" aria-labelledby="letter-title" onCancel={e=>{e.preventDefault();close()}}>
    <article className="letter-paper">
      <button className="letter-close" onClick={close} aria-label="Cerrar carta y volver al jardín">×</button>
      <Star className="letter-star"/>
      <span className="letter-eyebrow">{content.letterDetails.eyebrow}</span>
      <h2 id="letter-title">{content.recipient}:</h2>
      {content.letter.map((p,i)=><p key={p} className={i === content.letter.length - 1 ? 'letter-signoff' : ''}>{p}</p>)}
      <div className="letter-bottom"><span>{content.letterDetails.signoff}</span><span className="letter-monogram">{content.letterDetails.monogram}</span></div>
      <button className="return-garden" onClick={close}>{content.letterDetails.return} <span aria-hidden="true">↗</span></button>
    </article>
  </dialog>
}
