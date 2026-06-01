// components/wheel.tsx v4.0.0 (Designer Edition)
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
  const [winnerIndex, setWinnerIndex] = React.useState<number | null>(null)
  
  const lastTickRef = React.useRef<number>(0)

  const spin = async () => {
    if (isSpinning || items.length === 0) return
    setIsSpinning(true)
    setWinnerIndex(null)
    
    const spinDuration = 6.5 // seconds - faster and more exciting
    const extraSpins = 8 // full rotations
    const randomSegment = Math.floor(Math.random() * items.length)
    
    const segmentAngle = 360 / items.length
    const currentRotation = rotationValue.get()
    
    // Calculate target rotation with perfect alignment
    const targetRotation = currentRotation + (360 * extraSpins) + (360 - (randomSegment * segmentAngle + segmentAngle / 2)) - (currentRotation % 360)

    lastTickRef.current = Math.floor(currentRotation / segmentAngle)

    await animate(rotationValue, targetRotation, {
      duration: spinDuration,
      ease: [0.15, 0.85, 0.2, 1], // Perfect bounce ease
      onUpdate: (v) => {
        setDisplayRotation(v)
        const currentTick = Math.floor(v / segmentAngle)
        if (currentTick !== lastTickRef.current) {
          lastTickRef.current = currentTick
          // Add pointer jitter
          setPointerJitter(prev => prev === 4 ? -4 : 4)
          setTimeout(() => setPointerJitter(0), 60)
        }
      },
    })

    setWinnerIndex(randomSegment)
    setIsSpinning(false)
    onSpinEnd(items[randomSegment])
  }

  const radius = 150
  const center = 150
  
  // Premium color palette - vibrant yet harmonious
  const premiumColors = [
    "#8B5CF6", "#EC4899", "#F43F5E", "#F97316", "#F59E0B", "#84CC16",
    "#10B981", "#06B6D4", "#3B82F6", "#6366F1", "#A855F7", "#DB2777",
    "#DC2626", "#EA580C", "#CA8A04", "#65A30D", "#059669", "#0891B2",
    "#2563EB", "#7C3AED"
  ]

  return (
    <div id="wheel-container" className="relative flex flex-col items-center w-full">
      {/* Premium Pointer */}
      <motion.div 
        id="wheel-pointer" 
        className="absolute top-0 z-30 -mt-2"
        animate={{ rotate: pointerJitter, y: isSpinning ? [0, -8, 0] : 0 }}
        transition={{ type: "spring", stiffness: 600, damping: 12 }}
      >
        <div className="relative">
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-8 bg-primary/30 blur-md" />
          <div className="relative">
            <MapPin className="w-12 h-12 md:w-16 md:h-16 fill-primary text-white drop-shadow-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Premium Wheel Container */}
      <div id="wheel-outer" className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[520px] lg:max-w-[600px] aspect-square">
        {/* Outer Glow Ring */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-20 blur-3xl" />
        
        {/* Main Wheel */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-8 md:border-12 border-white shadow-[0_20px_60px_rgba(139,92,246,0.3)] bg-white">
          {/* Inner Shadow Ring */}
          <div className="absolute inset-0 z-20 pointer-events-none rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.15)]" />
          
          {/* Glossy Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full" />
            <div className="absolute bottom-0 left-1/2 w-32 h-16 bg-gradient-to-t from-black/10 to-transparent rounded-b-full -translate-x-1/2" />
          </div>
          
          <motion.div 
            id="wheel-spinning-part"
            className="w-full h-full"
            style={{ rotate: displayRotation, originX: 0.5, originY: 0.5 }}
          >
            <svg viewBox="0 0 300 300" className="w-full h-full">
              {items.length === 0 ? (
                <g>
                  <circle cx={center} cy={center} r={radius} fill="#f3f4f6" />
                  <text x={center} y={center} fill="#9ca3af" fontSize="14" fontWeight="600" textAnchor="middle" dominantBaseline="middle">
                    Add some items!
                  </text>
                </g>
              ) : items.length === 1 ? (
                <g id="wheel-segment-single">
                  <circle cx={center} cy={center} r={radius} fill={premiumColors[0]} />
                  <circle cx={center} cy={center} r={radius - 15} fill="white" opacity="0.1" />
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
                  const isWinner = winnerIndex === i
                  
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
                  const textRadius = radius * 0.8
                  const textX = (center + textRadius * Math.sin(Math.PI * textAngle / 180)).toFixed(3)
                  const textY = (center - textRadius * Math.cos(Math.PI * textAngle / 180)).toFixed(3)
                  const rotationAngle = (textAngle - 90).toFixed(3)

                  return (
                    <g key={i} id={`wheel-segment-${i}`}>
                      <path 
                        d={pathData} 
                        fill={premiumColors[i % premiumColors.length]} 
                        stroke="rgba(255,255,255,0.35)" 
                        strokeWidth="1.5" 
                      />
                      {/* Inner highlight ring */}
                      <path 
                        d={`M ${center} ${center} L ${(center + (radius - 25) * Math.sin(Math.PI * startAngle / 180)).toFixed(3)} ${(center - (radius - 25) * Math.cos(Math.PI * startAngle / 180)).toFixed(3)} A ${radius - 25} ${radius - 25} 0 ${largeArcFlag} 1 ${(center + (radius - 25) * Math.sin(Math.PI * endAngle / 180)).toFixed(3)} ${(center - (radius - 25) * Math.cos(Math.PI * endAngle / 180)).toFixed(3)} Z`}
                        fill="rgba(255,255,255,0.12)"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize={items.length > 15 ? "9" : items.length > 10 ? "11" : "13"}
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${rotationAngle}, ${textX}, ${textY})`}
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}
                      >
                        {item.length > 7 ? item.substring(0, 6) + "…" : item}
                      </text>
                    </g>
                  )
                })
              )}
            </svg>
          </motion.div>

          {/* Premium Center Cap */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25">
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute inset-0 -m-3 rounded-full bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.15)]" />
              {/* Main cap */}
              <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary via-purple-600 to-purple-700 shadow-[0_6px_25px_rgba(139,92,246,0.5)] flex items-center justify-center overflow-hidden">
                {/* Inner shine */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                <div className="relative w-5 h-5 md:w-7 md:h-7 rounded-full bg-white shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Spin Button */}
      <motion.button 
        id="btn-spin"
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        whileHover={!isSpinning && items.length > 0 ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isSpinning && items.length > 0 ? { scale: 0.97, y: 1 } : {}}
        className={`mt-10 px-12 md:px-20 py-5 md:py-6 rounded-full font-black text-xl md:text-4xl uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${isSpinning || items.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-[length:200%_100%] animate-[gradient_3s_linear_infinite]" />
        
        {/* Shine effect */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
        
        {/* Bottom shadow */}
        <div className="absolute -bottom-1 left-4 right-4 h-3 bg-black/25 blur-md rounded-full" />
        
        {/* Text */}
        <span className="relative text-white drop-shadow-lg">
          {isSpinning ? spinningText : spinText}
        </span>
        
        {/* Border highlight */}
        <div className="absolute inset-0 rounded-full border-2 border-white/30 pointer-events-none" />
      </motion.button>
      
      {/* Keyframe animation for gradient */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
