// app/page.tsx v3.5.0
"use client"

import * as React from "react"
<<<<<<< HEAD
import { motion } from "motion/react"
=======
import dynamic from "next/dynamic"
>>>>>>> origin/trae/solo-agent-1RTvd8
import { Wheel } from "@/app/components/wheel"
import { AppHeader } from "@/app/components/app-header"
import { useDestination } from "@/app/hooks/use-destination"
import { CHINA_REGIONS } from "@/app/lib/china-data"
import en from "@/app/locales/en"
import zhCN from "@/app/locales/zh-CN"

<<<<<<< HEAD
=======
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
>>>>>>> origin/trae/solo-agent-1RTvd8
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

<<<<<<< HEAD
=======
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
>>>>>>> origin/trae/solo-agent-1RTvd8
  const fetchDestinationDetails = React.useCallback(async (winnerName: string) => {
    setDestinationDetails(null)
    setIsLoadingDetails(true)
    setError(null)

    try {
      const response = await fetch("/api/destination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: winnerName,
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
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to fetch destination details", e)
      }
      setError(lang === "zh-CN" ? "获取目的地详情失败。" : "Failed to fetch details.")
    } finally {
      setIsLoadingDetails(false)
    }
  }, [lang])

  const handleSpinEnd = React.useCallback(async (winnerName: string) => {
    setWinner(winnerName)
    addHistory(winnerName)

    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    })

    fetchDestinationDetails(winnerName).catch(() => {})
  }, [addHistory, fetchDestinationDetails])

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
        />
      </AppHeader>

      <main id="main-content" className="flex-1 container mx-auto px-4 py-6 md:py-10 flex flex-col items-center gap-6">
        <div id="wheel-wrapper" className="w-full max-w-5xl flex flex-col items-center space-y-6">
          <Wheel
            key={`${activeListId}`}
            items={activeList.items}
            onSpinEnd={handleSpinEnd}
            spinText={t.startSpin}
            spinningText={t.spinning}
          />

          {winner && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md mx-auto"
            >
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
            </motion.div>
          )}
        </div>
      </main>

      <footer id="app-footer" className="py-6 border-t text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 Random Destination Wheel v3.5.0 | Data v1.4.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
