// app/page.tsx v3.5.0
"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Wheel } from "@/app/components/wheel"
import { AppHeader } from "@/app/components/app-header"
import { useDestination } from "@/app/hooks/use-destination"
import { CHINA_REGIONS } from "@/app/lib/china-data"
import { Button } from "@/app/components/ui/button"
import { ChevronRight, RotateCcw } from "lucide-react"
import en from "@/app/locales/en"
import zhCN from "@/app/locales/zh-CN"

// bundle-dynamic-imports: Lazy load heavy components to reduce initial bundle size
const SettingsSheet = dynamic(() => import("@/app/components/settings-sheet").then(m => ({ default: m.SettingsSheet })), {
  ssr: false,
})
const WinnerCard = dynamic(() => import("@/app/components/winner-card").then(m => ({ default: m.WinnerCard })), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md h-48 bg-muted/30 rounded-xl animate-pulse" />
  ),
})

// PERF-001: Move locales outside component to prevent recreation on each render
const locales = {
  en,
  "zh-CN": zhCN
} as const

// js-index-maps: Build Map for repeated province/city lookups (O(1) vs O(n))
const provinceMap = new Map(CHINA_REGIONS.map(r => [r.name, r]))

export default function Page() {
  const {
    lists, setLists, activeListId, setActiveListId, activeList,
    favorites, toggleFavorite, history, setHistory, addHistory,
    lang, setLang, updateActiveListItems
  } = useDestination()

  const t = locales[lang]

  const [winner, setWinner] = React.useState<string | null>(null)
  const [destinationDetails, setDestinationDetails] = React.useState<{ intro: string; link: string } | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [drillDownPath, setDrillDownPath] = React.useState<string[]>([])

  // rerender-derived-state-no-effect: Derive currentLevelItems during render, not effects
  const currentLevelItems = React.useMemo(() => {
    if (activeListId === "preset-provinces") {
      if (drillDownPath.length === 0) {
        return CHINA_REGIONS.map(r => r.name)
      } else if (drillDownPath.length === 1) {
        const province = provinceMap.get(drillDownPath[0])
        return province?.children?.map(c => c.name) || []
      } else if (drillDownPath.length === 2) {
        const province = provinceMap.get(drillDownPath[0])
        const cityMap = new Map(province?.children?.map(c => [c.name, c]) || [])
        const city = cityMap.get(drillDownPath[1])
        return city?.children?.map(co => co.name) || []
      }
      return []
    } else {
      return activeList.items
    }
  }, [activeListId, activeList.items, drillDownPath])

  React.useEffect(() => {
    if (activeListId !== "preset-provinces" && drillDownPath.length > 0) {
      setDrillDownPath([])
    }
  }, [activeListId, drillDownPath.length])

  // rerender-functional-setstate: Memoize lang toggle
  const toggleLang = React.useCallback(() => {
    setLang(prev => prev === "zh-CN" ? "en" : "zh-CN")
  }, [setLang])

  // PERF-002: useCallback for fetch function
  const fetchDestinationDetails = React.useCallback(async (winnerName: string) => {
    setDestinationDetails(null)
    setIsLoadingDetails(true)
    setError(null)

    try {
      // SEC-001: Use API route instead of direct Gemini API call
      const response = await fetch("/api/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: [...drillDownPath, winnerName].join(" "),
          language: lang,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch details")
      }

      const data = await response.json()
      setDestinationDetails(data)
    } catch (e) {
      // SEC-004: Conditional logging for production safety
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch destination details", e)
      }
      setError(lang === "zh-CN" ? "获取目的地详情失败。" : "Failed to fetch details.")
    } finally {
      setIsLoadingDetails(false)
    }
  }, [drillDownPath, lang])

  // PERF-002: useCallback for spin handler
  const handleSpinEnd = React.useCallback(async (winnerName: string) => {
    setWinner(winnerName)
    addHistory(winnerName)

    // PERF-004: Dynamic import confetti to reduce initial bundle size
    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    fetchDestinationDetails(winnerName).catch(() => {
      // Error already handled in fetchDestinationDetails
    })
  }, [addHistory, fetchDestinationDetails])

  // PERF-002: useCallback for drill down handler
  const handleDrillDown = React.useCallback(() => {
    if (winner) {
      setDrillDownPath(prev => [...prev, winner])
      setWinner(null)
      setDestinationDetails(null)
    }
  }, [winner])

  // PERF-002: useCallback for reset handler
  const resetDrillDown = React.useCallback(() => {
    setDrillDownPath([])
    setWinner(null)
    setDestinationDetails(null)
  }, [])

  const canDrillDown = activeListId === "preset-provinces" && drillDownPath.length < 2 && currentLevelItems.length > 0

  return (
    <div id="app-container" className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader
        title={t.title}
        shortTitle={t.shortTitle}
        lang={lang}
        onLangToggle={toggleLang}
      >
        <SettingsSheet
          t={t}
          lists={lists}
          activeListId={activeListId}
          setActiveListId={setActiveListId}
          activeList={activeList}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          history={history}
          setHistory={setHistory}
          onAdd={(item) => !activeList.items.includes(item) && updateActiveListItems([...activeList.items, item])}
          onRemove={(item) => updateActiveListItems(activeList.items.filter(i => i !== item))}
          onCreateList={(name) => {
            const newList = { id: `custom-${Date.now()}`, name, items: [], isPreset: false }
            setLists([...lists, newList])
            setActiveListId(newList.id)
          }}
          onDeleteList={() => {
            if (!activeList.isPreset) {
              const newLists = lists.filter(l => l.id !== activeListId)
              setLists(newLists)
              setActiveListId(newLists[0].id)
            }
          }}
          onUpdateListName={(name) => setLists(lists.map(l => l.id === activeListId ? { ...l, name } : l))}
          chinaRegions={CHINA_REGIONS}
          triggerId="btn-settings"
        />
      </AppHeader>

      <main id="main-content" className="flex-1 container mx-auto px-4 py-6 md:py-12 flex flex-col items-center justify-center gap-8">
        <div id="wheel-wrapper" className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
          {drillDownPath.length > 0 && (
            <div id="drill-down-nav" className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={resetDrillDown}>
                <RotateCcw className="w-3 h-3 mr-1" />
                {lang === "zh-CN" ? "重置" : "Reset"}
              </Button>
              {drillDownPath.map((name, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3 h-3" />
                  <span className={i === drillDownPath.length - 1 ? "text-foreground" : ""}>{name}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          <Wheel
            key={`${activeListId}-${drillDownPath.join("-")}`}
            items={currentLevelItems}
            onSpinEnd={handleSpinEnd}
            spinText={t.startSpin}
            spinningText={t.spinning}
          />

          {winner && (
            <div className="flex flex-col items-center gap-4 w-full max-w-md">
              <WinnerCard
                t={t}
                winner={winner}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                isLoadingDetails={isLoadingDetails}
                destinationDetails={destinationDetails}
                onClose={() => setWinner(null)}
                error={error}
                onRetry={() => winner && fetchDestinationDetails(winner)}
              />

              {canDrillDown && (
                <Button
                  id="drill-down-button"
                  onClick={handleDrillDown}
                  className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  {drillDownPath.length === 0 ? (lang === "zh-CN" ? "进入市级抽签" : "Spin for City") : (lang === "zh-CN" ? "进入县级抽签" : "Spin for County")}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <footer id="app-footer" className="py-6 border-t text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 Random Destination Wheel v3.4.0 | Data v1.4.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
