"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/app/lib/utils"
import { Play, Volume2, VolumeX } from "lucide-react"
import { playTick, playSlowTick, playWin, playClick } from "@/app/lib/sounds"

interface WheelProps {
  items: string[]
  onSpinEnd: (result: string) => void
  spinText: string
  spinningText: string
}

<<<<<<< HEAD
// Color palette for items
const ITEM_COLORS = [
  "from-rose-500/20 to-rose-600/10 border-rose-500/30",
  "from-blue-500/20 to-blue-600/10 border-blue-500/30",
  "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
  "from-amber-500/20 to-amber-600/10 border-amber-500/30",
  "from-violet-500/20 to-violet-600/10 border-violet-500/30",
  "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
  "from-pink-500/20 to-pink-600/10 border-pink-500/30",
  "from-teal-500/20 to-teal-600/10 border-teal-500/30",
]

export function Wheel({ items, onSpinEnd, spinText, spinningText }: WheelProps) {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [highlightIndex, setHighlightIndex] = React.useState<number | null>(null)
  const [winnerIndex, setWinnerIndex] = React.useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
=======
// rendering-hoist-jsx: Hoist static constants outside component
const COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 80%, 55%)",
  "hsl(0, 84%, 60%)",
  "hsl(199, 89%, 48%)",
  "hsl(340, 82%, 52%)",
  "hsl(160, 70%, 45%)",
] as const

interface WheelSegment {
  path: string
  text: string
  color: string
  textX: number
  textY: number
  textRotation: number
}

// js-cache-function-results: Cache segment generation results
const segmentCache = new Map<string, WheelSegment[]>()

function generateWheelSegments(items: string[]): WheelSegment[] {
  if (items.length === 0) return []
  const cacheKey = items.join("|")
  const cached = segmentCache.get(cacheKey)
  if (cached) return cached

  const segmentAngle = 360 / items.length
  const result = items.map((item, index) => {
    const startAngle = index * segmentAngle - 90
    const endAngle = startAngle + segmentAngle
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    const x1 = 50 + 48 * Math.cos(startRad)
    const y1 = 50 + 48 * Math.sin(startRad)
    const x2 = 50 + 48 * Math.cos(endRad)
    const y2 = 50 + 48 * Math.sin(endRad)
    const largeArc = segmentAngle > 180 ? 1 : 0
    const pathD = `M 50 50 L ${x1} ${y1} A 48 48 0 ${largeArc} 1 ${x2} ${y2} Z`
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180)
    const textX = 50 + 32 * Math.cos(midAngle)
    const textY = 50 + 32 * Math.sin(midAngle)
    const textRotation = (startAngle + endAngle) / 2 + 90

    return {
      path: pathD,
      text: item.length > 6 ? item.slice(0, 6) + "…" : item,
      color: COLORS[index % COLORS.length],
      textX,
      textY,
      textRotation,
    }
  })

  if (segmentCache.size > 50) {
    segmentCache.clear()
  }
  segmentCache.set(cacheKey, result)
  return result
}

// rerender-memo: Wrap with React.memo
export const Wheel = React.memo(function Wheel({ items, onSpinEnd, spinText, spinningText }: WheelProps) {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const rotation = useMotionValue(0)
  const rotated = useTransform(rotation, (v) => `${v}deg`)
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null)

  // rerender-simple-expression-in-memo: Memoize only when computation is non-trivial
  const segments = React.useMemo(
    () => generateWheelSegments(items),
    [items]
  )

  const segmentAngle = items.length > 0 ? 360 / items.length : 0

  // rerender-move-effect-to-event: Spin logic in event handler, not effect
  const handleSpin = React.useCallback(() => {
    if (isSpinning || items.length === 0) return
    setIsSpinning(true)

    const randomIndex = Math.floor(Math.random() * items.length)
    const targetAngle = 360 * 5 + (360 - (randomIndex * segmentAngle + segmentAngle / 2))
    const currentRotation = rotation.get()
    const targetRotation = currentRotation + targetAngle

    animationRef.current = animate(rotation, targetRotation, {
      duration: 4,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setIsSpinning(false)
        onSpinEnd(items[randomIndex])
      },
    })
  }, [isSpinning, items, onSpinEnd, rotation, segmentAngle])
>>>>>>> origin/trae/solo-agent-1RTvd8

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

<<<<<<< HEAD
  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightIndex !== null && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({
        behavior: isSpinning ? "auto" : "smooth",
        block: "center",
        inline: "center",
      })
    }
  }, [highlightIndex, isSpinning])

  const handleSpin = React.useCallback(() => {
    if (isSpinning || items.length === 0) return
    if (soundEnabled) playClick()

    setIsSpinning(true)
    setWinnerIndex(null)

    const totalItems = items.length
    // Pick random winner
    const winnerIndex = Math.floor(Math.random() * totalItems)

    // Animation phases: fast -> medium -> slow -> final
    const phases = [
      { count: 30, baseInterval: 40 },   // Fast phase
      { count: 20, baseInterval: 80 },   // Medium phase
      { count: 15, baseInterval: 150 },  // Slow phase
      { count: 10, baseInterval: 250 },  // Very slow
      { count: 5, baseInterval: 400 },   // Almost done
    ]

    let currentIndex = Math.floor(Math.random() * totalItems)
    let phaseIndex = 0
    let countInPhase = 0

    const tick = () => {
      const phase = phases[phaseIndex]
      if (!phase) {
        // Done!
        setHighlightIndex(winnerIndex)
        setWinnerIndex(winnerIndex)
        setIsSpinning(false)
        if (soundEnabled) playWin()
        onSpinEnd(items[winnerIndex])
        return
      }

      // Move to next random item (but steer toward winner in last phases)
      if (phaseIndex >= 3 && countInPhase > phase.count * 0.6) {
        // In final phase, steer toward winner
        const dist = winnerIndex - currentIndex
        const step = dist === 0 ? 0 : dist > 0 ? 1 : -1
        currentIndex = (currentIndex + step + totalItems) % totalItems
      } else {
        // Random jump
        const jump = Math.floor(Math.random() * Math.max(3, Math.floor(totalItems / 10))) + 1
        currentIndex = (currentIndex + jump) % totalItems
      }

      setHighlightIndex(currentIndex)

      // Play sound
      if (soundEnabled) {
        if (phaseIndex >= 3) {
          playSlowTick()
        } else {
          playTick()
        }
      }

      countInPhase++
      if (countInPhase >= phase.count) {
        phaseIndex++
        countInPhase = 0
      }

      // Add slight randomness to interval
      const jitter = phase.baseInterval * 0.2 * (Math.random() - 0.5)
      timerRef.current = setTimeout(tick, phase.baseInterval + jitter)
    }

    // Start the animation
    timerRef.current = setTimeout(tick, 50)
  }, [isSpinning, items, onSpinEnd, soundEnabled])

=======
  // rendering-conditional-render: Use ternary, not && for conditionals
>>>>>>> origin/trae/solo-agent-1RTvd8
  if (items.length === 0) {
    return (
      <div className="relative flex items-center justify-center w-full max-w-4xl h-64 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <p className="text-sm text-muted-foreground text-center px-8">
          请先添加目的地
        </p>
      </div>
    )
  }

  return (
<<<<<<< HEAD
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Sound toggle */}
      <div className="absolute top-2 right-2 z-30">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
          title={soundEnabled ? "关闭音效" : "开启音效"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Grid of items */}
      <div
        ref={gridRef}
=======
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
        <div
          className="w-0 h-0"
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: "20px solid hsl(var(--primary))",
          }}
        />
      </div>

      {/* rendering-animate-svg-wrapper: Animate div wrapper, not SVG element */}
      <motion.div
        style={{ rotate: rotated }}
        className="w-full h-full rounded-full border-8 border-primary/80 shadow-2xl overflow-hidden"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="hsl(var(--background))"
                strokeWidth="0.5"
              />
              <text
                x={segment.textX}
                y={segment.textY}
                fill="white"
                fontSize={items.length > 8 ? "3" : "3.8"}
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${segment.textRotation} ${segment.textX} ${segment.textY})`}
                className="select-none drop-shadow-sm"
              >
                {segment.text}
              </text>
            </g>
          ))}
        </svg>
      </motion.div>

      <button
        onClick={handleSpin}
        disabled={isSpinning}
>>>>>>> origin/trae/solo-agent-1RTvd8
        className={cn(
          "wheel-grid relative w-full max-h-[60vh] overflow-auto rounded-2xl border border-border/50 bg-muted/10 p-3",
          isSpinning && "ring-2 ring-primary/50"
        )}
        style={{ scrollBehavior: "auto" }}
      >
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
          {items.map((item, index) => {
            const colorClass = ITEM_COLORS[index % ITEM_COLORS.length]
            const isHighlighted = highlightIndex === index
            const isWinner = winnerIndex !== null && index === winnerIndex

            return (
              <div
                key={`${item}-${index}`}
                ref={el => { itemRefs.current[index] = el }}
                className={cn(
                  "relative px-1.5 py-2 rounded-lg border text-center text-xs font-medium",
                  "transition-all duration-150 cursor-default select-none overflow-hidden",
                  "bg-gradient-to-br",
                  isWinner
                    ? "from-primary/40 to-primary/20 border-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30 z-10"
                    : isHighlighted
                      ? cn(colorClass, "border-primary/60 scale-105 shadow-md text-foreground")
                      : cn(colorClass, "text-muted-foreground hover:text-foreground")
                )}
              >
                {isHighlighted && !isWinner && (
                  <div className="absolute inset-0 bg-primary/10 rounded-lg transition-opacity duration-150" />
                )}
                <span className="relative z-[1] truncate block">
                  {item.length > 6 ? item.slice(0, 5) + "…" : item}
                </span>
                {isWinner && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Spin button */}
      <div className="flex justify-center mt-6">
        <motion.button
          onClick={handleSpin}
          disabled={isSpinning}
          whileHover={{ scale: isSpinning ? 1 : 1.05 }}
          whileTap={{ scale: isSpinning ? 1 : 0.95 }}
          className={cn(
            "relative px-10 py-4 rounded-2xl font-bold text-lg shadow-xl",
            "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
            "disabled:opacity-70 disabled:cursor-not-allowed",
            "border-2 border-primary/50",
            "flex items-center gap-3"
          )}
        >
          <Play className={cn("w-6 h-6", isSpinning && "animate-pulse")} />
          <span>{isSpinning ? spinningText : spinText}</span>
          {isSpinning && (
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-primary"
              animate={{ opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>
      </div>
    </div>
  )
})
