"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/app/lib/utils"
import { Play } from "lucide-react"

interface WheelProps {
  items: string[]
  onSpinEnd: (result: string) => void
  spinText: string
  spinningText: string
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 80%, 55%)",
  "hsl(0, 84%, 60%)",
  "hsl(199, 89%, 48%)",
  "hsl(340, 82%, 52%)",
  "hsl(160, 70%, 45%)",
]

// PERF-005: Generate SVG segments once and cache them
interface WheelSegment {
  path: string
  text: string
  color: string
  textX: number
  textY: number
  textRotation: number
}

function generateWheelSegments(items: string[]): WheelSegment[] {
  if (items.length === 0) return []

  const segmentAngle = 360 / items.length
  return items.map((item, index) => {
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
}

export function Wheel({ items, onSpinEnd, spinText, spinningText }: WheelProps) {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const rotation = useMotionValue(0)
  const rotated = useTransform(rotation, (v) => `${v}deg`)
  const animationRef = React.useRef<ReturnType<typeof animate> | null>(null)

  // PERF-005: Cache segments to avoid recalculating on every render
  const segments = React.useMemo(
    () => generateWheelSegments(items),
    // Only regenerate when items change
    [items.join("|")]
  )

  // PERF-005: Calculate segment angle for winning logic
  const segmentAngle = items.length > 0 ? 360 / items.length : 0

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

  React.useEffect(() => {
    return () => {
      animationRef.current?.stop()
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <p className="text-sm text-muted-foreground text-center px-8">
          请先添加目的地
        </p>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
      {/* Pointer */}
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

      {/* Wheel */}
      <motion.div
        style={{ rotate: rotated }}
        className="w-full h-full rounded-full border-8 border-primary/80 shadow-2xl overflow-hidden"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* PERF-005: Use cached segments */}
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

      {/* Center button */}
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={cn(
          "absolute z-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary text-primary-foreground font-bold shadow-lg flex flex-col items-center justify-center gap-1 transition-all",
          "hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed",
          "border-4 border-background"
        )}
      >
        <Play className="w-6 h-6" />
        <span className="text-xs">
          {isSpinning ? spinningText : spinText}
        </span>
      </button>
    </div>
  )
}
