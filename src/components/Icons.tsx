export function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M20 1C21.5 15 25 18.5 39 20C25 21.5 21.5 25 20 39C18.5 25 15 21.5 1 20C15 18.5 18.5 15 20 1Z" fill="currentColor" /><path d="M7 7L33 33M33 7L7 33" stroke="currentColor" strokeWidth=".6" opacity=".45" /></svg>
}
export function Envelope() {
  return <svg viewBox="0 0 56 42" fill="none" aria-hidden="true"><path className="envelope-flap" d="M5 15L28 1L51 15" stroke="currentColor"/><path d="M5 14H51V40H5Z" fill="#15202a" stroke="currentColor"/><path d="M5 14L28 29L51 14M5 40L22 25M51 40L34 25" stroke="currentColor"/><circle cx="28" cy="28" r="3" fill="currentColor"/></svg>
}
