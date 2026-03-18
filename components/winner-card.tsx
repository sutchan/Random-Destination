// components/winner-card.tsx v3.1.0
"use client"

import * as React from "react"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, ExternalLink, Loader2, Compass 
} from "lucide-react"

interface WinnerCardProps {
  t: any
  winner: string
  favorites: string[]
  toggleFavorite: (item: string) => void
  isLoadingDetails: boolean
  destinationDetails: { intro: string; link: string } | null
  onClose: () => void
}

export function WinnerCard({
  t, winner, favorites, toggleFavorite, isLoadingDetails, destinationDetails,
  onClose
}: WinnerCardProps) {
  return (
    <Card id="winner-card" className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 shadow-2xl overflow-hidden border-primary/10 bg-background/60 backdrop-blur-xl relative">
      {/* Decorative Background Icon */}
      <div className="absolute -bottom-12 -right-12 opacity-[0.03] pointer-events-none">
        <Compass className="w-64 h-64 rotate-12" />
      </div>

      <CardHeader className="text-center py-8 space-y-3 relative z-10">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-primary/5 transition-colors"
            onClick={() => toggleFavorite(winner)}
            id="btn-favorite-winner"
          >
            <Heart className={`h-5 w-5 ${favorites.includes(winner) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>
        <CardDescription className="text-xs uppercase tracking-[0.3em] font-black text-primary/60">{t.spinResult}:</CardDescription>
        <CardTitle className="text-5xl font-black text-primary tracking-tighter drop-shadow-sm">
          {winner}
        </CardTitle>
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
          </div>
        ) : destinationDetails && (
          <div className="px-6 py-2">
            <p className="text-base text-muted-foreground italic leading-relaxed font-medium">
              &ldquo;{destinationDetails.intro}&rdquo;
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="py-2 relative z-10">
        <Separator className="bg-primary/5" />
      </CardContent>

      <CardFooter className="pt-4 pb-10 flex gap-4 px-8 relative z-10">
        {destinationDetails && (
          <a href={destinationDetails.link} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full font-black h-12 rounded-xl border-primary/10 hover:bg-primary/5" id="btn-view-details">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t.viewDetails}
            </Button>
          </a>
        )}
        <Button variant="default" className="flex-1 font-black h-12 rounded-xl shadow-lg hover:shadow-xl transition-all" onClick={onClose} id="btn-close-winner">
          {t.close}
        </Button>
      </CardFooter>
    </Card>
  )
}
