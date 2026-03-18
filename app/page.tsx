// app/page.tsx v3.4.0
"use client"

import * as React from "react"
import { Wheel } from "@/components/wheel"
import { AppHeader } from "@/components/app-header"
import { SettingsSheet } from "@/components/settings-sheet"
import { WinnerCard } from "@/components/winner-card"
import confetti from "canvas-confetti"
import { GoogleGenAI, Type } from "@google/genai"
import { useDestination } from "@/hooks/use-destination"
import { CHINA_REGIONS, ChinaRegion } from "@/lib/china-data"
import { Button } from "@/components/ui/button"
import { ChevronRight, RotateCcw } from "lucide-react"
import en from "@/locales/en"
import zhCN from "@/locales/zh-CN"

const locales = {
  en,
  "zh-CN": zhCN
}

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

  // Hierarchical state
  const [drillDownPath, setDrillDownPath] = React.useState<string[]>([])

  // Compute currentLevelItems based on activeList or drillDownPath
  const currentLevelItems = React.useMemo(() => {
    if (activeListId === "preset-provinces") {
      if (drillDownPath.length === 0) {
        return CHINA_REGIONS.map(r => r.name)
      } else if (drillDownPath.length === 1) {
        const province = CHINA_REGIONS.find(r => r.name === drillDownPath[0])
        return province?.children?.map(c => c.name) || []
      } else if (drillDownPath.length === 2) {
        const province = CHINA_REGIONS.find(r => r.name === drillDownPath[0])
        const city = province?.children?.find(c => c.name === drillDownPath[1])
        return city?.children?.map(co => co.name) || []
      }
      return []
    } else {
      return activeList.items
    }
  }, [activeListId, activeList.items, drillDownPath])

  // Reset drillDownPath when switching away from hierarchical preset
  React.useEffect(() => {
    if (activeListId !== "preset-provinces" && drillDownPath.length > 0) {
      setDrillDownPath([])
    }
  }, [activeListId, drillDownPath.length])

  const handleSpinEnd = async (winnerName: string) => {
    setWinner(winnerName)
    addHistory(winnerName)
    setDestinationDetails(null)
    setIsLoadingDetails(true)
    setError(null)

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const fullPath = [...drillDownPath, winnerName].join(" ")
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a brief introduction (max 100 characters) and a Wikipedia link for the location: ${fullPath}. Return in JSON format with keys: intro, link. Language: ${lang === 'zh-CN' ? 'Chinese' : 'English'}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              link: { type: Type.STRING },
            },
            required: ["intro", "link"],
          },
        },
      });
      
      if (response.text) {
        setDestinationDetails(JSON.parse(response.text));
      }
    } catch (e) {
      console.error("Failed to fetch destination details", e);
      setError(lang === 'zh-CN' ? "获取目的地详情失败。" : "Failed to fetch details.");
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleDrillDown = () => {
    if (winner) {
      setDrillDownPath([...drillDownPath, winner])
      setWinner(null)
      setDestinationDetails(null)
    }
  }

  const resetDrillDown = () => {
    setDrillDownPath([])
    setWinner(null)
    setDestinationDetails(null)
  }

  const canDrillDown = activeListId === "preset-provinces" && drillDownPath.length < 2 && currentLevelItems.length > 0

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

      <main id="main-content" className="flex-1 container mx-auto px-4 py-6 md:py-12 flex flex-col items-center justify-center gap-8">
        <div id="wheel-wrapper" className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
          {drillDownPath.length > 0 && (
            <div id="drill-down-nav" className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={resetDrillDown}>
                <RotateCcw className="w-3 h-3 mr-1" />
                {lang === 'zh-CN' ? '重置' : 'Reset'}
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
              />
              
              {canDrillDown && (
                <Button 
                  id="drill-down-button"
                  onClick={handleDrillDown}
                  className="w-full py-6 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                >
                  {drillDownPath.length === 0 ? (lang === 'zh-CN' ? '进入市级抽签' : 'Spin for City') : (lang === 'zh-CN' ? '进入县级抽签' : 'Spin for County')}
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
