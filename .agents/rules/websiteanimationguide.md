---
trigger: always_on
---

# UPSERA Motion System — Antigravity Custom Instructions

You are building premium agency-tier websites for UPSERA. Every website must feel cinematic, intentional, and alive. Follow these rules on every generation without exception.

---

## ANIMATION STACK (in order of preference)

1. **Framer Motion** — default for all React/Next.js. Scroll reveals, hover physics, spring animations, page transitions.
2. **GSAP + ScrollTrigger** — full-page scrolltelling, parallax sequences, horizontal scroll. Never mix with Framer Motion in the same component.
3. **CSS @keyframes** — infinite loops, marquee, blobs, shimmer. Zero JS overhead.
4. **React Three Fiber / Three.js** — 3D hero backgrounds, particles. Always clean up in useEffect.

Always check package.json before importing. If library is missing, output the install command first.

---

## MOTION DEFAULTS

```
MOTION_INTENSITY: 7   → Spring-based, scroll-triggered reveals
DESIGN_VARIANCE: 7    → Asymmetric layouts, offset grids
VISUAL_DENSITY: 3     → Premium, airy
```

- Kochi SMB clients (restaurants, boutiques): MOTION_INTENSITY 5
- US clients / luxury brands / portfolio: MOTION_INTENSITY 9

---

## SCROLL REVEAL (use on EVERY element)

```jsx
const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 80, damping: 20, duration: 0.8 }
  }
}

<motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>
```

## STAGGERED GRID/LIST

```jsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 22 } }
}
```

## HERO — WORD BY WORD REVEAL

```jsx
const wordReveal = {
  hidden: { y: '110%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 24 } }
}
// Split headline.split(' ') → wrap each in motion.span display:inline-block
```

## HERO — CINEMATIC IMAGE REVEAL

```jsx
<div style={{ overflow: 'hidden' }}>
  <motion.img
    initial={{ scale: 1.15, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
  />
</div>
```

## PARALLAX (GSAP)

```jsx
useEffect(() => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: 1.5 }
  })
  tl.to(imageRef.current, { y: '25%', ease: 'none' })
  tl.to(headlineRef.current, { y: '-15%', opacity: 0.3, ease: 'none' }, 0)
  return () => tl.kill()
}, [])
```

## MAGNETIC BUTTON (UPSERA SIGNATURE)

```jsx
'use client'
import { useMotionValue, useTransform, motion } from 'framer-motion'

function MagneticButton({ children }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [8, -8])
  const rotateY = useTransform(x, [-50, 50], [-8, 8])
  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  return (
    <motion.button
      onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
    >
      {children}
    </motion.button>
  )
}
```

## PAGE TRANSITIONS (Next.js layout.jsx)

```jsx
<AnimatePresence mode="wait">
  <motion.main
    key={pathname}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.main>
</AnimatePresence>
```

## MARQUEE (CSS only)

```css
@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
.marquee-track { display: flex; width: max-content; animation: marquee 20s linear infinite; }
.marquee-track:hover { animation-play-state: paused; }
```

## BACKGROUND BLOB (CSS only)

```css
@keyframes blob-drift {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(30px,-20px) scale(1.05); }
  66% { transform: translate(-20px,15px) scale(0.97); }
}
.bg-blob { position: fixed; pointer-events: none; border-radius: 9999px; filter: blur(80px); opacity: 0.12; animation: blob-drift 18s ease-in-out infinite; }
```

---

## CLIENT PRESETS

**Luxury / Perfume / Jewelry (e.g. Musk Malaki)**
- Slow cinematic 0.8–1.4s. Curtain reveals. Word-by-word headline. Film-grain overlay.
- Palette: deep black, warm gold, cream. No bright colors.
- Fonts: Cormorant Garamond, PP Editorial, Neue Montreal.

**Restaurant / Food / Kochi Local**
- Warm gentle fade-ups. Hover card lifts. Split screen hero.
- Palette: terracotta, deep green, warm cream.
- Fonts: Satoshi, Plus Jakarta Sans.

**Tech / SaaS**
- Sharp fast 0.3–0.5s. Bento grid. Dark mode. Electric accent.
- Fonts: Geist, JetBrains Mono.

**Portfolio / Agency**
- Maximum expressiveness. Horizontal scroll. Text scramble. Three.js.

---

## PERFORMANCE — NON-NEGOTIABLE

**Always:**
- Animate only `transform` and `opacity` — never top/left/width/height
- `min-h-[100dvh]` not `h-screen` (iOS Safari bug)
- `useMotionValue` for hover — NEVER `useState` for continuous animations
- `useEffect` cleanup: `return () => tl.kill()`
- `IntersectionObserver` for scroll — NEVER `window.addEventListener('scroll')`
- Isolate perpetual animations in their own `'use client'` leaf components
- Z-index system: nav 40 / modal 50 / loader 60

**Never:**
- Mix Framer Motion + GSAP in same component tree
- `backdrop-blur` on scrolling containers
- `z-[9999]` spam

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## OUTPUT RULES

- Never write `// TODO: add animation here`
- Never write `// rest follows same pattern`
- Always write complete copy-paste-ready code
- Always include install commands for any new library
- Always include mobile responsive collapse
- If token limit hit, end at a clean component boundary with: `[PAUSED — say "continue" for next component]`