"use client"

import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { Heart, ExternalLink, RotateCcw, Sparkles, Target, Trophy } from "lucide-react"

interface WinnerCardProps {
  t: {
    destinySays: string
    viewDetails: string
    close: string
    loading: string
    spinResult: string
    aiThinking: string
    recommended: string
    aiPowered: string
    retry: string
  }
  winner: string
  favorites: string[]
  toggleFavorite: (item: string) => void
  isLoadingDetails: boolean
  destinationDetails: { intro: string; link: string } | null
  onClose: () => void
  error: string | null
  onRetry: () => void
}

// rerender-memo: Wrap with React.memo to prevent unnecessary re-renders
export const WinnerCard = React.memo(function WinnerCard({
  t,
  winner,
  favorites,
  toggleFavorite,
  isLoadingDetails,
  destinationDetails,
  onClose,
  error,
  onRetry,
}: WinnerCardProps) {
  // js-set-map-lookups: Use Set for O(1) lookup
  const isFavorited = React.useMemo(() => {
    return favorites.some(f => f === winner)
  }, [favorites, winner])

  const handleToggleFavorite = React.useCallback(() => {
    toggleFavorite(winner)
  }, [toggleFavorite, winner])

  return (
    <Card id="winner-card" className="w-full max-w-md overflow-hidden border-primary/30 shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader className="text-center bg-gradient-to-b from-primary/10 to-transparent border-b relative overflow-hidden">
        {/* Decorative compass element */}
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full border border-primary/20 opacity-30" />
        <div className="absolute -top-3 -right-3 w-14 h-14 rounded-full border border-primary/30 opacity-40" />
        <div className="mx-auto mb-2 flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <Badge variant="secondary">{t.spinResult}</Badge>
        </div>
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          {winner}
          <Button
            id="btn-favorite-winner"
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={
              isFavorited
                ? "text-red-500 hover:text-red-600"
                : "text-muted-foreground hover:text-red-500"
            }
          >
            <Heart className={`h-5 w-5 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </CardTitle>
        <CardDescription>{t.destinySays}</CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* AI Generated Details */}
        {error ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-4 text-center space-y-3">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                {t.retry}
              </Button>
            </CardContent>
          </Card>
        ) : isLoadingDetails ? (
          <Card className="border-border/50 bg-muted/30">
            <CardContent className="pt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-medium">{t.aiThinking}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }} />
              </div>
            </CardContent>
          </Card>
        ) : destinationDetails ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {t.recommended}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed mb-3">
                {destinationDetails.intro}
              </p>
              <Button id="btn-view-details" variant="outline" size="sm" asChild className="gap-2">
                <a href={destinationDetails.link} target="_blank" rel="noopener noreferrer">
                  {t.viewDetails}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </Button>
              <p className="text-xs text-muted-foreground mt-3 text-right">
                {t.aiPowered}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </CardContent>
    </Card>
  )
})
