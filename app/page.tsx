// app/page.tsx v3.5.0
"use client"

import * as React from "react"
import { motion } from "motion/react"
import { Wheel } from "@/app/components/wheel"
import { AppHeader } from "@/app/components/app-header"
import { SettingsSheet } from "@/app/components/settings-sheet"
import { WinnerCard } from "@/app/components/winner-card"
import { useDestination } from "@/app/hooks/use-destination"
import { CHINA_REGIONS } from "@/app/lib/china-data"
import en from "@/app/locales/en"
import zhCN from "@/app/locales/zh-CN"

const locales = {
  en,
  "zh-CN": zhCN
} as const

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
        onLangToggle={() => setLang(lang === "zh-CN" ? "en" : "zh-CN")}
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
