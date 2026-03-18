// components/winner-card.tsx v2.6.0
"use client"

import * as React from "react"
import Image from "next/image"
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, Heart, ExternalLink, Loader2 
} from "lucide-react"

interface WinnerCardProps {
  t: any
  winner: string
  favorites: string[]
  toggleFavorite: (item: string) => void
  isLoadingDetails: boolean
  destinationDetails: { intro: string; imageKeyword: string; link: string } | null
  travelDays: number
  setTravelDays: (days: number) => void
  budgetInfo: any
  onClose: () => void
}

export function WinnerCard({
  t, winner, favorites, toggleFavorite, isLoadingDetails, destinationDetails,
  travelDays, setTravelDays, budgetInfo, onClose
}: WinnerCardProps) {
  return (
    <Card id="winner-card" className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-lg overflow-hidden border-primary/20">
      <div id="winner-image-container" className="relative h-40 w-full bg-muted">
        {isLoadingDetails ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : destinationDetails ? (
          <Image 
            src={`https://picsum.photos/seed/${destinationDetails.imageKeyword}/600/300`}
            alt={winner}
            fill
            className="object-cover transition-opacity duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
            <MapPin className="w-12 h-12 text-primary/20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Button 
            variant="secondary" 
            size="icon" 
            className="h-10 w-10 rounded-full bg-background/90 backdrop-blur-md shadow-md hover:scale-105 transition-transform"
            onClick={() => toggleFavorite(winner)}
            id="btn-favorite-winner"
          >
            <Heart className={`h-5 w-5 ${favorites.includes(winner) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
          </Button>
        </div>
      </div>
      
      <CardHeader className="text-center py-4 space-y-2">
        <CardDescription className="text-xs uppercase tracking-[0.2em] font-bold text-muted-foreground">{t.spinResult}:</CardDescription>
        <CardTitle className="text-3xl font-black text-primary tracking-tight">
          {winner}
        </CardTitle>
        {destinationDetails && (
          <p className="text-sm text-muted-foreground px-6 italic leading-relaxed">
            &ldquo;{destinationDetails.intro}&rdquo;
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 py-2">
        <Separator className="opacity-50" />
        
        <div id="budget-controls" className="flex items-center justify-between py-1">
          <Label htmlFor="days" className="text-sm font-semibold">{t.travelDays}</Label>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setTravelDays(Math.max(1, travelDays - 1))}
              id="btn-days-minus"
            >
              -
            </Button>
            <Input 
              id="days" 
              type="number" 
              min={1} 
              value={travelDays} 
              onChange={(e) => setTravelDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-12 text-center h-8 font-bold"
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setTravelDays(travelDays + 1)}
              id="btn-days-plus"
            >
              +
            </Button>
          </div>
        </div>
        
        <div id="budget-details" className="space-y-2 bg-muted/30 p-4 rounded-xl text-xs sm:text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t.transport} ¥{budgetInfo.transport} | {t.accommodation} ¥{budgetInfo.accommodation} | {t.food} ¥{budgetInfo.food}</span>
          </div>
          <Separator className="my-2 opacity-30" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-muted-foreground">{t.totalBudget}</span>
            <span className="font-black text-xl text-primary">¥{budgetInfo.total}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-6 flex gap-3 px-6">
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
