// app/components/wheel.tsx v3.5.0
"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "motion/react"
import { cn } from "@/app/lib/utils"
import { Play, Volume2, VolumeX } from "lucide-react"
import { playClick, playWin } from "@/app/lib/sounds"

interface WheelProps {
  items: string[]
  onSpinEnd: (result: string) => void
  spinText: string
  spinningText: string
}

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
      text: item.length > 6 ? item.slice(0, 6) + "\u2026" : item,
      color: COLORS[index % COLORS.length],
      textX,
      textY,
      textRotation,
    }
  })

  // 防止缓存无限增长
  if (segmentCache.size > 50) {
    segmentCache.clear()
  }
  segmentCache.set(cacheKey, result)
  return result
}

// rerender-memo: Wrap with React.memo
export const Wheel = React.memo(function Wheel({ items, onSpinEnd, spinText, spinningText }: WheelProps) {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
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
    if (soundEnabled) playClick()
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
        if (soundEnabled) playWin()
        onSpinEnd(items[randomIndex])
      },
    })
  }, [isSpinning, items, onSpinEnd, rotation, segmentAngle, soundEnabled])

  // 组件卸载时取消动画
  React.useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.stop()
      }
    }
  }, [])

  // rendering-conditional-render: Use early return, not && for conditionals
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
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center gap-6">
      {/* 音效开关 */}
      <div className="absolute top-2 right-2 z-30">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-full bg-background/80 backdrop-blur border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
          title={soundEnabled ? "关闭音效" : "开启音效"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* SVG 转盘 */}
      <div className="relative flex items-center justify-center w-72 h-72 md:w-96 md:h-96">
        {/* 指针指示器 */}
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
      </div>

      {/* 旋转按钮 */}
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
  )
})
