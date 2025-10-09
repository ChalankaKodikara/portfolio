import { useEffect, useRef } from 'react'

// Simple parallax bubbles using CSS variables and scroll listener
export default function BubbleField({ count = 10, color = '#06b6d4' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset
      el.style.setProperty('--scroll', String(y))
    }
    const onMove = (e) => {
      const glow = document.getElementById('cursor-glow')
      if (glow) {
        glow.style.setProperty('--mx', e.clientX + 'px')
        glow.style.setProperty('--my', e.clientY + 'px')
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove) }
  }, [])

  const bubbles = Array.from({ length: count }).map((_, i) => {
    const size = 40 + ((i * 37) % 120)
    const left = (i * 97) % 100
    const top = (i * 53) % 100
    const depth = 0.3 + ((i * 29) % 70) / 100 // 0.3 – 1.0
    const delay = (i * 0.12) % 3
    return (
      <span
        key={i}
        className="absolute rounded-full opacity-20 will-change-transform"
        style={{
          width: size,
          height: size,
          left: `${left}%`,
          top: `${top}%`,
          background: color,
          transform: `translate3d(0, calc(var(--scroll,0px) * ${depth * 0.06}px), 0)`,
          animation: `floatY ${5 + depth * 5}s ease-in-out ${delay}s infinite alternate`,
          filter: 'blur(0.3px)'
        }}
      />
    )
  })

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <style>{`@keyframes floatY{from{transform:translate3d(0,calc(var(--scroll,0px)*var(--d,0.04)),0)}to{transform:translate3d(0,calc(var(--scroll,0px)*var(--d,0.04) - 20px),0)}}`}</style>
      {bubbles}
    </div>
  )
}


