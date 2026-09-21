export function Observatory() {
  return <div className="observatory" aria-hidden="true"><svg viewBox="0 0 700 700" fill="none">
    <circle cx="350" cy="350" r="295"/><circle cx="350" cy="350" r="278"/><circle cx="350" cy="350" r="221" strokeDasharray="1 9"/>
    <ellipse cx="350" cy="350" rx="318" ry="112" transform="rotate(-32 350 350)"/>
    <path d="M350 35V80M350 620V665M35 350H80M620 350H665M138 138L166 166M534 534L562 562M138 562L166 534M534 166L562 138"/>
    {Array.from({ length: 72 }, (_, i) => <path key={i} d={`M350 55V${i % 6 === 0 ? 67 : 61}`} transform={`rotate(${i * 5} 350 350)`}/>)}
    <path d="M104 304L180 206L250 227M485 133L529 235L606 272M109 471L203 498L227 561" className="constellation-line"/>
    {[[104,304],[180,206],[250,227],[485,133],[529,235],[606,272],[109,471],[203,498],[227,561]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" className="chart-star"/>)}
    <text x="350" y="25" textAnchor="middle">N</text><text x="682" y="355" textAnchor="middle">E</text><text x="350" y="687" textAnchor="middle">S</text><text x="17" y="355" textAnchor="middle">O</text>
  </svg></div>
}
