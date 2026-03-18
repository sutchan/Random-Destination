// components/wheel.tsx v3.1.0
"use client"

import * as React from "react"
import { motion, useAnimation, useMotionValue, animate } from "motion/react"
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
  const rotationValue = useMotionValue(0)
  const [displayRotation, setDisplayRotation] = React.useState(0)
  const [pointerJitter, setPointerJitter] = React.useState(0)
  
  // Audio refs
  const tickAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const winAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const lastTickRef = React.useRef<number>(0)

  React.useEffect(() => {
    // Initialize audio on client side
    tickAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/133/133-preview.mp3")
    winAudioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3")
    
    if (tickAudioRef.current) {
      tickAudioRef.current.volume = 0.5
    }
  }, [])

  const spin = async () => {
    if (isSpinning || items.length === 0) return
    setIsSpinning(true)
    
    const spinDuration = 8 // seconds
    const extraSpins = 10 // full rotations
    const randomSegment = Math.floor(Math.random() * items.length)
    
    const segmentAngle = 360 / items.length
    const currentRotation = rotationValue.get()
    
    // Calculate target rotation
    const targetRotation = currentRotation + (360 * extraSpins) + (360 - (randomSegment * segmentAngle + segmentAngle / 2)) - (currentRotation % 360)

    lastTickRef.current = Math.floor(currentRotation / segmentAngle)

    await animate(rotationValue, targetRotation, {
      duration: spinDuration,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => {
        setDisplayRotation(v)
        const currentTick = Math.floor(v / segmentAngle)
        if (currentTick !== lastTickRef.current) {
          if (tickAudioRef.current) {
            const sound = tickAudioRef.current.cloneNode() as HTMLAudioElement
            sound.volume = 0.3
            sound.play().catch(() => {})
          }
          lastTickRef.current = currentTick
          // Add pointer jitter
          setPointerJitter(prev => prev === 5 ? -5 : 5)
          setTimeout(() => setPointerJitter(0), 50)
        }
      }
    })

    // Play win sound
    if (winAudioRef.current) {
      winAudioRef.current.currentTime = 0
      winAudioRef.current.play().catch(() => {})
    }

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
      <motion.div 
        id="wheel-pointer" 
        className="absolute top-0 z-20 -mt-4 drop-shadow-xl"
        animate={{ rotate: pointerJitter }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <MapPin className="w-10 h-10 md:w-12 md:h-12 fill-primary text-primary-foreground" />
      </motion.div>

      <div id="wheel-outer" className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] aspect-square rounded-full overflow-hidden border-4 md:border-12 border-primary shadow-[0_0_50px_rgba(0,0,0,0.2)] bg-muted">
        {/* Glossy Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-black/10 rounded-full" />
        
        <motion.div 
          id="wheel-spinning-part"
          className="w-full h-full"
          style={{ rotate: displayRotation, originX: 0.5, originY: 0.5 }}
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
                const textRadius = radius * 0.85
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

        {/* Center Cap */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-primary rounded-full z-20 shadow-lg border-4 border-primary-foreground/20 flex items-center justify-center">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-primary-foreground rounded-full opacity-50" />
        </div>
      </div>

      <button 
        id="btn-spin"
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="mt-8 px-10 md:px-16 py-4 md:py-5 bg-primary text-primary-foreground rounded-full font-black text-xl md:text-3xl shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-primary/90 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 uppercase tracking-widest border-b-4 border-black/20"
      >
        {isSpinning ? spinningText : spinText}
      </button>
    </div>
  )
}
