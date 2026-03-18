// components/winner-card.tsx v2.7.0
"use client"

import * as React from "react"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Heart, ExternalLink, Loader2 
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
    <Card id="winner-card" className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-lg overflow-hidden border-primary/20">
      <CardHeader className="text-center py-6 space-y-2 relative">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-full hover:bg-accent transition-colors"
            onClick={() => toggleFavorite(winner)}
            id="btn-favorite-winner"
          >
            <Heart className={`h-5 w-5 ${favorites.includes(winner) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>
        <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">{t.spinResult}:</CardDescription>
        <CardTitle className="text-4xl font-black text-primary tracking-tight">
          {winner}
        </CardTitle>
        {isLoadingDetails ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : destinationDetails && (
          <p className="text-sm text-muted-foreground px-6 italic leading-relaxed">
            &ldquo;{destinationDetails.intro}&rdquo;
          </p>
        )}
      </CardHeader>

      <CardContent className="py-2">
        <Separator className="opacity-50" />
      </CardContent>

      <CardFooter className="pt-2 pb-8 flex gap-3 px-6">
        {destinationDetails && (
          <a href={destinationDetails.link} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full font-bold h-10" id="btn-view-details">
              <ExternalLink className="w-4 h-4 mr-2" />
              {t.viewDetails}
            </Button>
          </a>
        )}
        <Button variant="default" className="flex-1 font-bold h-10" onClick={onClose} id="btn-close-winner">
          {t.close}
        </Button>
      </CardFooter>
    </Card>
  )
}
