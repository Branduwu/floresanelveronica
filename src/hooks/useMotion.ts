import { useEffect, useState } from 'react'
export function useMotion() {
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(document.hidden)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReduced(media.matches)
    const visibility = () => setHidden(document.hidden)
    media.addEventListener('change', change)
    document.addEventListener('visibilitychange', visibility)
    return () => { media.removeEventListener('change', change); document.removeEventListener('visibilitychange', visibility) }
  }, [])
  return { reduced, paused, setPaused, still: reduced || paused, ambientPaused: reduced || paused || hidden }
}
