import { useId, type CSSProperties } from 'react'

// Asymmetric, overlapping cup-shaped petals, ordered from the silhouette to the heart.
const petals = [
  'M222 215C166 198 127 168 132 130C132 106 155 95 174 103C166 79 185 68 207 73C223 76 229 64 248 62C277 55 296 67 303 88C328 72 353 83 354 106C390 106 399 130 384 158C387 195 312 235 262 246Z',
  'M244 248C202 250 133 231 111 190C98 167 104 138 125 134C156 125 173 160 200 163C220 169 248 199 244 248Z',
  'M254 247C296 251 367 228 391 192C408 167 401 139 380 135C351 134 330 168 304 171C280 181 264 208 254 247Z',
  'M233 221C198 213 160 176 157 137C154 114 174 96 193 105C211 115 220 148 245 154C265 170 259 207 233 221Z',
  'M245 204C216 172 192 126 207 101C217 85 238 91 255 89C278 80 301 91 306 107C311 140 283 183 263 208Z',
  'M261 220C280 173 302 130 333 112C355 101 374 121 365 150C356 183 309 221 276 229Z',
  'M249 254C211 259 161 248 141 220C120 192 125 169 142 168C164 172 179 198 207 197C228 196 248 220 249 254Z',
  'M251 253C278 252 338 250 363 218C381 195 380 179 365 177C343 176 323 201 298 203C275 207 257 222 251 253Z',
  'M244 235C217 223 192 195 186 170C181 151 191 132 207 140C221 145 232 159 249 161C270 177 264 216 244 235Z',
  'M257 226C261 188 276 147 298 132C318 116 339 132 330 155C320 185 287 218 257 226Z',
  'M215 164C208 140 223 116 245 114C268 111 292 121 303 139C287 134 277 144 269 155C252 173 231 180 215 164Z',
  'M249 245C218 243 183 226 176 202C172 185 184 179 197 187C214 199 231 198 248 204C266 220 265 237 249 245Z',
  'M252 245C279 241 313 226 325 203C333 186 321 179 307 189C291 200 269 203 255 217Z',
  'M224 212C205 192 205 167 225 153C238 143 254 145 270 151C246 151 233 164 239 180C245 195 263 199 278 190C268 215 242 224 224 212Z',
  'M254 215C273 194 295 185 297 161C298 148 285 136 270 140C254 140 240 152 235 166C251 155 266 155 274 165C285 181 267 199 254 215Z',
  'M229 184C219 166 231 143 251 141C270 138 281 148 282 163C270 156 256 158 248 168C241 178 246 191 258 194C246 198 235 193 229 184Z',
  'M225 192C244 203 266 197 278 180C284 170 281 158 273 153C293 159 297 178 284 197C266 218 237 215 225 192Z',
  'M244 180C238 170 244 158 254 156C265 153 272 160 269 169C265 163 254 166 252 174C250 181 256 184 262 181C257 191 247 189 244 180Z',
  'M251 180C247 174 252 166 259 166C266 165 270 172 265 178C265 171 258 171 255 176L251 180Z',
  'M239 227C246 231 259 233 272 226C271 244 257 251 246 246C236 242 234 234 239 227Z',
]
const folds = [
  'M137 115C162 118 176 145 198 154', 'M182 94C203 95 206 134 222 144',
  'M215 83C233 81 243 101 247 118', 'M272 80C282 82 285 104 281 117',
  'M310 94C316 102 313 117 304 130', 'M351 121C336 128 328 147 316 159',
  'M117 157C140 153 157 192 187 198', 'M382 154C364 158 349 188 323 198',
  'M140 191C162 197 165 220 192 231', 'M358 198C337 213 314 233 285 238',
  'M195 157C202 172 208 195 226 205', 'M310 144C300 159 295 183 275 195',
  'M228 124C239 124 240 143 246 151', 'M280 129C268 129 268 147 262 153',
  'M185 201C201 219 220 219 233 224', 'M306 204C286 210 276 223 265 229',
]

export function Rose({ growing = false, variant = 0, className = '' }: { growing?: boolean; variant?: number; className?: string }) {
  const id = useId().replaceAll(':', '')
  const leaf = `url(#${id}-leaf)`
  return <svg viewBox="55 25 390 585" className={`rose ${growing ? 'rose-growing' : ''} ${className}`} aria-hidden="true" fill="none">
    <defs>
      <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#8c9965"/><stop offset=".38" stopColor="#506744"/><stop offset="1" stopColor="#172e2b"/></linearGradient>
      <linearGradient id={`${id}-stem`}><stop stopColor="#334a36"/><stop offset=".5" stopColor="#9f9e61"/><stop offset="1" stopColor="#43583c"/></linearGradient>
      {Array.from({ length: 6 }, (_, i) => <linearGradient key={i} id={`${id}-petal-${i}`} x1={i % 2 ? '.2' : '.8'} y1="0" x2={i % 2 ? '.8' : '.2'} y2="1">
        <stop stopColor={['#fff0b0','#f9df8c','#ffeca4','#efd07a','#ffe9a3','#eac063'][i]}/><stop offset=".23" stopColor="#efd071"/><stop offset=".61" stopColor={i % 2 ? '#dba73b' : '#e5b645'}/><stop offset=".86" stopColor="#ae701f"/><stop offset="1" stopColor="#734016"/>
      </linearGradient>)}
      <linearGradient id={`${id}-edge`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff1bb" stopOpacity=".85"/><stop offset="1" stopColor="#d0a34b" stopOpacity=".12"/></linearGradient>
    </defs>
    <g className="rose-body">
      <path className="stem" d="M252 235C248 323 282 393 247 481C229 527 231 559 238 592" stroke={`url(#${id}-stem)`} strokeWidth="5" pathLength="1"/>
      <g className="leaf leaf-left" style={{ '--leaf-delay': '.9s' } as CSSProperties}>
        <path d="M261 395C225 372 177 365 150 306C197 302 248 314 261 395Z" fill={leaf} stroke="#92a471" strokeWidth=".7"/>
        <path d="M260 394L156 311M229 369L227 326M210 352L202 315M189 336L182 311M229 369L189 352M211 354L174 337" stroke="#a2ab79" strokeWidth=".8" opacity=".5"/>
        <path d="M260 405L217 365" stroke="#7c8754" strokeWidth="2"/>
      </g>
      <g className="leaf leaf-right" style={{ '--leaf-delay': '1.2s' } as CSSProperties}>
        <path d="M260 445C269 401 304 365 355 357C345 414 310 441 260 445Z" fill={leaf} stroke="#8b9a69" strokeWidth=".7"/>
        <path d="M262 443L352 360M292 416L297 384M313 396L321 370M292 416L325 409M313 396L340 388" stroke="#a2ab79" strokeWidth=".8" opacity=".5"/>
      </g>
      <g className="leaf leaf-small" style={{ '--leaf-delay': '1.4s' } as CSSProperties}>
        <path d="M238 522C215 507 191 492 187 460C219 462 242 487 238 522Z" fill={leaf}/><path d="M237 522L190 466" stroke="#a2ab79" strokeWidth=".7" opacity=".5"/>
      </g>
      <path className="sepals" d="M251 274C233 261 216 250 207 226L246 246L255 224L264 244L295 227C285 253 267 260 251 274Z" fill={leaf}/>
      <g className="blossom" transform={`translate(${variant % 2 ? 8 : 0} 0) rotate(${variant ? (variant - 2) * 5 : -6} 250 210) scale(${variant === 2 ? '.92 1.05' : variant === 3 ? '1.03 .92' : '1 1'})`}>
        {petals.map((d, i) => <g className="petal" key={i} style={{ '--petal-delay': `${1.4 + i * .115}s` } as CSSProperties}>
          <path className="petal-fill" d={d} fill={`url(#${id}-petal-${(i + variant) % 6})`} stroke={`url(#${id}-edge)`} strokeWidth=".8"/>
          <path className="petal-ink" d={d} pathLength="1" stroke="#f1d285" strokeWidth=".85"/>
        </g>)}
        <g className="folds" stroke="#fff0b2" strokeWidth=".7" opacity=".32">{folds.map((d,i)=><path key={i} d={d}/>)}</g>
        <path className="folds" d="M149 205C168 233 195 239 217 241M286 86C296 84 300 94 300 104M215 222C229 233 245 235 257 233" stroke="#fff4c6" strokeWidth="1" opacity=".6"/>
      </g>
    </g>
  </svg>
}
