// components/wheel.tsx v2.9.0
"use client"

import * as React from "react"
import { motion, useAnimation } from "motion/react"
import { MapPin } from "lucide-react"

interface WheelProps {
  items: string[]
  onSpinEnd: (winner: string) => void
  spinText?: string
  spinningText?: string
  id?: string
}

export function Wheel({ items, onSpinEnd, spinText = "SPIN", spinningText = "SPINNING...", id }: WheelProps) {
  const [isSpinning, setIsSpinning] = React.useState(false)
  const controls = useAnimation()
  const [rotation, setRotation] = React.useState(0)
  
  // Audio refs
  const spinAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const winAudioRef = React.useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    // Initialize audio on client side
    spinAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3")
    winAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3")
    
    if (spinAudioRef.current) spinAudioRef.current.loop = true
  }, [])

  const spin = async () => {
    if (isSpinning || items.length === 0) return
    setIsSpinning(true)
    
    // Play spin sound
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0
      spinAudioRef.current.play().catch(() => {})
    }

    const spinDuration = 4 // seconds
    const extraSpins = 5 // full rotations
    const randomSegment = Math.floor(Math.random() * items.length)
    
    const segmentAngle = 360 / items.length
    
    // Calculate target rotation to land exactly in the middle of the chosen segment
    const targetRotation = rotation + (360 * extraSpins) + (360 - (randomSegment * segmentAngle + segmentAngle / 2)) - (rotation % 360)

    await controls.start({
      rotate: targetRotation,
      transition: { duration: spinDuration, ease: [0.2, 0.8, 0.2, 1] } // custom ease out
    })

    // Stop spin sound and play win sound
    if (spinAudioRef.current) {
      spinAudioRef.current.pause()
    }
    if (winAudioRef.current) {
      winAudioRef.current.currentTime = 0
      winAudioRef.current.play().catch(() => {})
    }

    setRotation(targetRotation)
    setIsSpinning(false)
    onSpinEnd(items[randomSegment])
  }

  const radius = 150
  const center = 150
  
  const colors = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", "#22c55e", 
    "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6", "#6366f1", 
    "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e"
  ]

  return (
    <div id="wheel-container" className="relative flex flex-col items-center w-full">
      {/* Pointer */}
      <div id="wheel-pointer" className="absolute top-0 z-10 -mt-4 drop-shadow-md">
        <MapPin className="w-8 h-8 md:w-10 md:h-10 fill-primary text-primary-foreground rotate-180" />
      </div>

      <div id="wheel-outer" className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] aspect-square rounded-full overflow-hidden border-4 md:border-8 border-primary shadow-2xl bg-muted">
        <motion.div 
          id="wheel-spinning-part"
          className="w-full h-full"
          animate={controls}
          initial={{ rotate: 0 }}
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <svg viewBox="0 0 300 300" className="w-full h-full">
            {items.length === 0 ? (
              <circle cx={center} cy={center} r={radius} fill="#e5e7eb" />
            ) : items.length === 1 ? (
              <g id="wheel-segment-single">
                <circle cx={center} cy={center} r={radius} fill={colors[0]} />
                <text
                  x={center}
                  y={center - radius * 0.5}
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {items[0]}
                </text>
              </g>
            ) : (
              items.map((item, i) => {
                const angle = 360 / items.length
                const startAngle = i * angle
                const endAngle = (i + 1) * angle
                
                const startX = (center + radius * Math.sin(Math.PI * startAngle / 180)).toFixed(3)
                const startY = (center - radius * Math.cos(Math.PI * startAngle / 180)).toFixed(3)
                const endX = (center + radius * Math.sin(Math.PI * endAngle / 180)).toFixed(3)
                const endY = (center - radius * Math.cos(Math.PI * endAngle / 180)).toFixed(3)
                
                const largeArcFlag = angle > 180 ? 1 : 0
                
                const pathData = [
                  `M ${center} ${center}`,
                  `L ${startX} ${startY}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                  "Z"
                ].join(" ")

                const textAngle = startAngle + angle / 2
                const textRadius = radius * 0.65
                const textX = (center + textRadius * Math.sin(Math.PI * textAngle / 180)).toFixed(3)
                const textY = (center - textRadius * Math.cos(Math.PI * textAngle / 180)).toFixed(3)
                const rotationAngle = (textAngle - 90).toFixed(3)

                return (
                  <g key={i} id={`wheel-segment-${i}`}>
                    <path d={pathData} fill={colors[i % colors.length]} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize={items.length > 15 ? "8" : items.length > 10 ? "10" : "12"}
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${rotationAngle}, ${textX}, ${textY})`}
                    >
                      {item.length > 6 ? item.substring(0, 5) + "..." : item}
                    </text>
                  </g>
                )
              })
            )}
          </svg>
        </motion.div>
      </div>

      <button 
        id="btn-spin"
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="mt-8 px-8 md:px-12 py-3 md:py-4 bg-primary text-primary-foreground rounded-full font-black text-lg md:text-2xl shadow-xl hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 uppercase tracking-widest"
      >
        {isSpinning ? spinningText : spinText}
      </button>
    </div>
  )
}
