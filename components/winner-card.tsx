// components/winner-card.tsx v4.0.0 (Designer Edition)
"use client"

import * as React from "react"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, ExternalLink, Loader2, Compass, Sparkles 
} from "lucide-react"
import { motion } from "motion/react"

interface WinnerCardProps {
  t: any
  winner: string
  favorites: string[]
  toggleFavorite: (item: string) => void
  isLoadingDetails: boolean
  destinationDetails: { intro: string; link: string } | null
  onClose: () => void
  onRetry?: () => void
  error?: string | null
}

export function WinnerCard({
  t, winner, favorites, toggleFavorite, isLoadingDetails, destinationDetails,
  onClose, onRetry, error
}: WinnerCardProps) {
  const isFavorited = favorites.includes(winner)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Card id="winner-card" className="w-full max-w-md shadow-2xl overflow-hidden border-primary/20 bg-background/80 backdrop-blur-2xl relative">
        {/* Premium Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
        </div>
        
        {/* Decorative Background Icon */}
        <div className="absolute -bottom-16 -right-16 opacity-[0.04] pointer-events-none">
          <Compass className="w-72 h-72 rotate-12" />
        </div>

        <CardHeader className="text-center py-10 space-y-4 relative z-10">
          {/* Sparkles Animation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-2"
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </motion.div>
          
          {/* Favorite Button */}
          <motion.div 
            className="absolute top-6 right-6"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-12 w-12 rounded-full transition-all duration-300 ${isFavorited ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-primary/10'}`}
              onClick={() => toggleFavorite(winner)}
              id="btn-favorite-winner"
            >
              <motion.div
                animate={isFavorited ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Heart className={`h-6 w-6 transition-all duration-300 ${isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
              </motion.div>
            </Button>
          </motion.div>
          
          <CardDescription className="text-xs uppercase tracking-[0.4em] font-extrabold text-primary/70 mb-2">
            {t.spinResult}
          </CardDescription>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", delay: 0.15 }}
          >
            <CardTitle className="text-6xl md:text-7xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tighter">
              {winner}
            </CardTitle>
          </motion.div>
          
          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-10 h-10 text-primary/50" />
              </motion.div>
            </div>
          ) : error ? (
            <div className="px-8 py-6 space-y-4">
              <p className="text-lg text-destructive/80 italic leading-relaxed font-medium">
                {error}
              </p>
              {onRetry && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="sm" onClick={onRetry} className="text-sm font-semibold border-destructive/20 hover:border-destructive/40 hover:bg-destructive/5">
                    {t.retry}
                  </Button>
                </motion.div>
              )}
            </div>
          ) : destinationDetails && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="px-8 py-4"
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/10">
                <p className="text-lg text-foreground/80 italic leading-relaxed font-medium">
                  &ldquo;{destinationDetails.intro}&rdquo;
                </p>
              </div>
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="py-4 relative z-10 px-10">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </CardContent>

        <CardFooter className="pt-6 pb-12 flex gap-4 px-8 relative z-10">
          {destinationDetails && (
            <a href={destinationDetails.link} target="_blank" rel="noopener noreferrer" className="flex-1">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="w-full font-bold h-14 rounded-2xl border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all" id="btn-view-details">
                  <ExternalLink className="w-5 h-5 mr-2" />
                  {t.viewDetails}
                </Button>
              </motion.div>
            </a>
          )}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
            <Button variant="default" className="w-full font-bold h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" onClick={onClose} id="btn-close-winner">
              {t.close}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
