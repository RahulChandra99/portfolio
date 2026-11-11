import { useEffect, useRef } from 'react'
import { ripple as fx } from './backgrounds'

// Canvas behind the hero section running the dot-grid ripple: handles sizing,
// pointer tracking, pausing while hidden, and a single still frame for reduced-motion users.
export default function PageBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = { w: 0, h: 0, t: 0, mouse: { x: 0, y: 0, active: false } }
    let frame = 0
    let visible = true
    let last = performance.now()

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      s.w = canvas.clientWidth
      s.h = canvas.clientHeight
      canvas.width = s.w * dpr
      canvas.height = s.h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fx.init(s)
      if (reduceMotion) fx.draw(ctx, s, 0)
    }

    function tick(now) {
      // dt is in 60fps frames, clamped so a backgrounded tab doesn't jump
      const dt = Math.min(now - last, 50) / 16.67
      last = now
      s.t += dt
      fx.draw(ctx, s, dt)
      if (visible) frame = requestAnimationFrame(tick)
    }

    function pointer(e, kind) {
      const r = canvas.getBoundingClientRect()
      s.mouse.x = e.clientX - r.left
      s.mouse.y = e.clientY - r.top
      s.mouse.active = s.mouse.x >= 0 && s.mouse.y >= 0 && s.mouse.x <= r.width && s.mouse.y <= r.height
      if (s.mouse.active) fx.pointer?.(s, kind)
    }
    const onMove = e => pointer(e, 'move')
    const onDown = e => pointer(e, 'down')
    const onLeave = () => { s.mouse.active = false }

    resize()
    if (!reduceMotion) frame = requestAnimationFrame(tick)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && !reduceMotion) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    observer.observe(canvas)
    // The hero's height changes with fonts and viewport width, not just window resizes
    const sizer = new ResizeObserver(resize)
    sizer.observe(canvas)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizer.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="page-bg" aria-hidden="true" />
}
