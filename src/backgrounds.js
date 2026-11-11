// Hero background effect: init(s) on resize, draw(ctx, s, dt) each frame, and
// pointer(s, kind) for cursor input. `s` holds w, h, t (time in 60fps frames) and mouse.
// dt is 0 for the single still frame drawn for reduced-motion users.

// Accent comes from the --accent-rgb CSS variable so the theme stays in one place
const accent = () =>
  getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || '251, 146, 60'
const TAU = Math.PI * 2

/* Dot grid that ripples out from the cursor and clicks */
export const ripple = {
  init(s) {
    s.accent = accent()
    const gap = s.w < 720 ? 24 : 28
    s.dots = []
    for (let y = gap / 2; y < s.h; y += gap) for (let x = gap / 2; x < s.w; x += gap) s.dots.push([x, y])
    s.ripples = s.ripples || []
    s.lastMove = -100
  },
  pointer(s, kind) {
    if (kind === 'down') s.ripples.push({ x: s.mouse.x, y: s.mouse.y, born: s.t, strength: 1 })
    else if (s.t - s.lastMove > 10) {
      s.lastMove = s.t
      s.ripples.push({ x: s.mouse.x, y: s.mouse.y, born: s.t, strength: 0.45 })
    }
  },
  draw(ctx, s, dt) {
    ctx.clearRect(0, 0, s.w, s.h)
    // An ambient ripple now and then so it's alive without a mouse
    if (dt && Math.random() < 0.008) {
      s.ripples.push({ x: Math.random() * s.w, y: Math.random() * s.h, born: s.t, strength: 0.6 })
    }
    s.ripples = s.ripples.filter(r => s.t - r.born < 220).slice(-10)
    for (const [x, y] of s.dots) {
      let disp = 0
      let ox = 0
      let oy = 0
      for (const r of s.ripples) {
        const dx = x - r.x
        const dy = y - r.y
        const d = Math.hypot(dx, dy)
        const age = s.t - r.born
        const diff = d - age * 3
        if (Math.abs(diff) > 40) continue
        const amp = r.strength * Math.cos((diff / 40) * (Math.PI / 2)) * Math.exp(-age / 90)
        disp += amp
        if (d > 0) { ox += (dx / d) * amp * 5; oy += (dy / d) * amp * 5 }
      }
      const glow = Math.min(1, disp)
      ctx.fillStyle = glow > 0.08 ? `rgba(${s.accent}, ${0.25 + glow * 0.7})` : 'rgba(250, 250, 250, 0.14)'
      ctx.beginPath()
      ctx.arc(x + ox, y + oy, 1.1 + glow * 1.8, 0, TAU)
      ctx.fill()
    }
  },
}
