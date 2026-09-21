import { useId } from 'react'

export type GardenSpecies = 'tulip' | 'sunflower'

// Fixed botanical details: no random geometry or per-frame React work.
const seeds = Array.from({ length: 125 }, (_, i) => {
  const angle = i * 2.399963
  const radius = Math.sqrt(i / 125) * 48
  return { x: 250 + Math.cos(angle) * radius, y: 178 + Math.sin(angle) * radius, angle: angle * 180 / Math.PI }
})
const tulipPetals = [
  'M250 286C207 245 178 156 205 76C230 89 248 118 258 157C275 122 297 102 319 94C330 174 312 249 250 286Z',
  'M249 285C193 274 148 224 149 150C148 124 155 106 164 91C185 129 222 137 244 166C260 198 267 250 249 285Z',
  'M249 286C280 241 266 199 286 166C302 138 336 120 346 87C367 149 359 218 326 252C302 277 274 288 249 286Z',
  'M250 288C200 273 174 225 177 155C191 173 216 176 235 192C260 216 266 257 250 288Z',
  'M250 288C224 254 218 214 232 174C238 155 248 142 255 133C275 153 290 174 293 200C298 240 278 275 250 288Z',
  'M250 288C282 253 281 214 304 189C318 175 336 161 344 145C349 215 313 278 250 288Z',
]

export function GardenFlower({ species, variant = 0 }: { species: GardenSpecies; variant?: number }) {
  const id = useId().replaceAll(':', '')
  const paint = (name: string) => `url(#${id}-${name})`
  const tulip = species === 'tulip'
  return <svg viewBox="55 25 390 585" className={`rose botanical-flower ${species}`} aria-hidden="true" fill="none">
    <defs>
      <linearGradient id={`${id}-stem`}><stop stopColor="#233b30"/><stop offset=".5" stopColor="#a3a765"/><stop offset="1" stopColor="#4f6944"/></linearGradient>
      <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2=".85"><stop stopColor="#a6af72"/><stop offset=".35" stopColor="#667d4c"/><stop offset=".75" stopColor="#344d36"/><stop offset="1" stopColor="#172f29"/></linearGradient>
      <linearGradient id={`${id}-petal`} x1=".15" y1="0" x2=".9" y2="1"><stop stopColor="#fff1af"/><stop offset=".32" stopColor="#f5d46e"/><stop offset=".7" stopColor="#dfa932"/><stop offset="1" stopColor="#96621f"/></linearGradient>
      <linearGradient id={`${id}-fold`} x1="0" y1=".15" x2="1" y2=".8"><stop stopColor="#bf852b"/><stop offset=".3" stopColor="#f3cb64"/><stop offset=".64" stopColor="#ffe8a0"/><stop offset="1" stopColor="#d49a32"/></linearGradient>
      <linearGradient id={`${id}-back`} x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#f0c455"/><stop offset=".6" stopColor="#d79c2e"/><stop offset="1" stopColor="#8c561e"/></linearGradient>
      <radialGradient id={`${id}-heart`} cx=".38" cy=".3"><stop stopColor="#88713d"/><stop offset=".55" stopColor="#594222"/><stop offset=".86" stopColor="#35291d"/><stop offset="1" stopColor="#b38739"/></radialGradient>
    </defs>
    <g className="rose-body">
      <path d={tulip ? 'M250 273C263 365 229 432 241 501C246 538 261 565 265 592' : 'M250 233C264 320 231 382 251 455C266 510 245 551 243 592'} stroke={paint('stem')} strokeWidth={tulip ? 5 : 7} strokeLinecap="round"/>
      {tulip ? <g fill={paint('leaf')} stroke="#91a269" strokeWidth=".65">
        <path d="M244 477C201 421 161 355 171 271C188 326 237 346 244 397C249 426 241 451 244 477Z"/>
        <path d="M253 553C278 459 335 414 331 324C347 399 321 464 280 509Z"/>
        <path d="M244 476C218 404 186 345 172 281M254 550C278 477 317 415 331 337" stroke="#c6c691" opacity=".38"/>
      </g> : <g fill={paint('leaf')} stroke="#889b63" strokeWidth=".75">
        <path d="M248 386C215 341 170 322 137 340C149 368 175 417 209 412C227 409 239 397 248 386Z"/>
        <path d="M252 456C273 414 309 389 358 401C348 442 321 478 287 474C271 473 260 461 252 456Z"/>
        <path d="M249 387L143 343M252 455L351 405M215 376L208 344M215 376L179 392M186 361L180 337M289 435L297 404M289 435L320 455M319 420L335 441" stroke="#c1c48a" fill="none" opacity=".45"/>
        <path d="M250 529C221 511 213 488 210 466C235 477 251 497 250 529Z"/>
      </g>}
      <g className="blossom" transform={`rotate(${(variant - 2) * 3} 250 220)`}>
        {tulip ? <>
          <path d="M230 276L250 297L269 276L253 279L247 264L242 280Z" fill={paint('leaf')}/>
          {tulipPetals.map((d, i) => <path key={d} d={d} fill={paint(i === 0 ? 'back' : i % 2 ? 'petal' : 'fold')} stroke="#ffeaa3" strokeOpacity=".55" strokeWidth="1"/>)}
          <g stroke="#fff0b5" strokeWidth="1.1" opacity=".4" strokeLinecap="round">
            <path d="M252 282C244 243 239 193 255 143M243 279C210 248 191 209 184 176M261 283C303 256 325 208 337 168"/>
            <path d="M208 137C210 121 209 101 207 87M314 123L321 107"/>
          </g>
        </> : <g transform="translate(0 12) scale(1 .95)">
          {Array.from({ length: 15 }, (_, i) => <path key={`back-${i}`} transform={`rotate(${i * 24 + 10} 250 178)`} d={`M238 151C222 114 227 ${55 + i % 3 * 4} 248 37C270 62 278 112 260 153Z`} fill={paint('back')} stroke="#f1d274" strokeWidth=".65"/>)}
          {Array.from({ length: 18 }, (_, i) => <g key={i} transform={`rotate(${i * 20} 250 178)`}>
            <path d={`M236 148C217 120 223 ${75 + i % 4 * 3} 248 ${43 + i % 3 * 5}C267 62 285 111 263 149L250 176Z`} fill={paint(i % 3 === 0 ? 'fold' : 'petal')} stroke="#ffe597" strokeWidth=".9"/>
            <path d="M249 57C246 95 254 123 250 147" stroke="#fff3b2" strokeOpacity=".5" strokeWidth="1.1"/>
          </g>)}
          <circle cx="250" cy="178" r="57" fill={paint('heart')} stroke="#dab354" strokeWidth="2.5"/>
          <circle cx="250" cy="178" r="50" stroke="#dbb664" strokeOpacity=".25" strokeDasharray="1 4" strokeWidth="3"/>
          {seeds.map((seed, i) => <ellipse key={i} cx={seed.x} cy={seed.y} rx="1.5" ry="2.3" transform={`rotate(${seed.angle} ${seed.x} ${seed.y})`} fill={i % 4 === 0 ? '#d7b36b' : i % 3 === 0 ? '#9d7e45' : '#baa063'} opacity={i % 2 ? .65 : .8}/>)}
          <path d="M215 149C228 132 252 128 271 138" stroke="#f2cd7c" strokeOpacity=".3" strokeWidth="2" strokeLinecap="round"/>
        </g>}
      </g>
    </g>
  </svg>
}
