"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
  color: string
  baseColor: string
  activeColor: string
  opacity: number
  baseOpacity: number
}

// Palette: soft, muted tones for a subtle AI aesthetic
const BASE_COLOR = "rgba(77, 182, 172, 0.07)" // very subtle teal dots
const ACTIVE_COLORS = [
  "rgba(77, 182, 172, 0.5)",  // teal
  "rgba(38, 198, 218, 0.45)", // cyan
  "rgba(124, 77, 255, 0.4)",  // purple
  "rgba(68, 138, 255, 0.45)", // blue
  "rgba(0, 230, 118, 0.4)",   // green
  "rgba(255, 109, 0, 0.35)",  // orange
  "rgba(224, 64, 251, 0.35)", // magenta
  "rgba(0, 176, 255, 0.4)",   // light blue
]

const GRID_SPACING = 30
const INTERACTION_RADIUS = 100
const REPULSE_FORCE = 5
const SPRING_FACTOR = 0.035
const DAMPING = 0.9
const GLOW_RADIUS = 150
const PARTICLE_SIZE = 1.4

export default function CursorParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const animFrameRef = useRef<number>(0)
  const dimensionsRef = useRef({ w: 0, h: 0, dpr: 1 })

  const createParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = []
    const cols = Math.ceil(w / GRID_SPACING) + 2
    const rows = Math.ceil(h / GRID_SPACING) + 2
    const offsetX = (w - (cols - 1) * GRID_SPACING) / 2
    const offsetY = (h - (rows - 1) * GRID_SPACING) / 2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = offsetX + col * GRID_SPACING
        const y = offsetY + row * GRID_SPACING
        const activeColor = ACTIVE_COLORS[Math.floor(Math.random() * ACTIVE_COLORS.length)]
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: PARTICLE_SIZE + (Math.random() - 0.5) * 0.6,
          color: BASE_COLOR,
          baseColor: BASE_COLOR,
          activeColor,
          opacity: 0.08 + Math.random() * 0.06,
          baseOpacity: 0.08 + Math.random() * 0.06,
        })
      }
    }
    return particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimensionsRef.current = { w, h, dpr }
      return { w, h }
    }

    const { w, h } = setCanvasSize()
    particlesRef.current = createParticles(w, h)

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        const { w, h } = setCanvasSize()
        particlesRef.current = createParticles(w, h)
      }, 150)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { ...mouseRef.current, active: false }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          active: true,
        }
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current = { ...mouseRef.current, active: false }
    }

    const animate = () => {
      const particles = particlesRef.current
      const mouse = mouseRef.current
      const { w, h } = dimensionsRef.current

      ctx.clearRect(0, 0, w, h)

      // Draw subtle glow around cursor
      if (mouse.active) {
        const glowGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, GLOW_RADIUS
        )
        glowGrad.addColorStop(0, "rgba(77, 182, 172, 0.03)")
        glowGrad.addColorStop(0.4, "rgba(124, 77, 255, 0.015)")
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = glowGrad
        ctx.fillRect(mouse.x - GLOW_RADIUS, mouse.y - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2)
      }

      for (const p of particles) {
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        // Repulsion when mouse is nearby
        if (mouse.active && dist < INTERACTION_RADIUS && dist > 0) {
          const force = (1 - dist / INTERACTION_RADIUS) * REPULSE_FORCE
          const angle = Math.atan2(dy, dx)
          p.vx += Math.cos(angle) * force
          p.vy += Math.sin(angle) * force
        }

        // Spring back to base position
        const springDx = p.baseX - p.x
        const springDy = p.baseY - p.y
        p.vx += springDx * SPRING_FACTOR
        p.vy += springDy * SPRING_FACTOR

        // Damping
        p.vx *= DAMPING
        p.vy *= DAMPING
        p.x += p.vx
        p.y += p.vy

        // Calculate displacement from base
        const dispX = p.x - p.baseX
        const dispY = p.y - p.baseY
        const displacement = Math.sqrt(dispX * dispX + dispY * dispY)
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)

        // Activation intensity based on displacement and speed
        const activationDisp = Math.min(displacement / 35, 1)
        const activationSpeed = Math.min(speed / 4, 1)
        const activation = Math.max(activationDisp, activationSpeed)

        // Transition color and opacity
        if (activation > 0.05) {
          p.opacity = p.baseOpacity + activation * (0.45 - p.baseOpacity)
          p.color = p.activeColor
        } else {
          p.opacity = p.baseOpacity
          p.color = p.baseColor
        }

        // Draw particle
        ctx.globalAlpha = Math.min(p.opacity + activation * 0.25, 0.6)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + activation * 0.8, 0, Math.PI * 2)
        ctx.fill()

        // Add subtle glow to active particles
        if (activation > 0.4) {
          ctx.globalAlpha = activation * 0.12
          ctx.fillStyle = p.activeColor
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size + activation * 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
      animFrameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    })
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [createParticles])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
