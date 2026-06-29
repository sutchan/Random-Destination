"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/app/lib/utils"
import { Play, Volume2, VolumeX } from "lucide-react"
import { playTick, playSlowTick, playWin, playClick } from "@/app/lib/sounds"

interface WheelProps {
  items: string[]
  onSpinEnd: (result: string) => void
  spinText: string
  spinningText: string
}

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
  const [winner, setWinner] = React.useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const gridRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Scroll highlighted item into view
  React.useEffect(() => {
    if (highlightIndex !== null && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      })
    }
  }, [highlightIndex])

  const handleSpin = React.useCallback(() => {
    if (isSpinning || items.length === 0) return
    if (soundEnabled) playClick()

    setIsSpinning(true)
    setWinner(null)

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
        setWinner(items[winnerIndex])
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
            const isWinner = winner !== null && items[index] === winner

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
                <AnimatePresence>
                  {isHighlighted && !isWinner && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                    />
                  )}
                </AnimatePresence>
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
}
