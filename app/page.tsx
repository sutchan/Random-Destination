// app/page.tsx v2.6.0
"use client"

import * as React from "react"
import { Wheel } from "@/components/wheel"
import { AppHeader } from "@/components/app-header"
import { SettingsSheet } from "@/components/settings-sheet"
import { WinnerCard } from "@/components/winner-card"
import confetti from "canvas-confetti"
import { GoogleGenAI, Type } from "@google/genai"
import { useDestination } from "@/hooks/use-destination"
import en from "@/locales/en"
import zhCN from "@/locales/zh-CN"

const locales = {
  en,
  "zh-CN": zhCN
}

const BUDGET_DATA: Record<string, { transport: number, accommodation: number, food: number }> = {
  "北京": { transport: 1000, accommodation: 500, food: 200 },
  "上海": { transport: 1000, accommodation: 600, food: 250 },
  "广州": { transport: 800, accommodation: 400, food: 200 },
  "深圳": { transport: 900, accommodation: 500, food: 200 },
  "三亚": { transport: 1500, accommodation: 800, food: 300 },
  "成都": { transport: 800, accommodation: 300, food: 150 },
  "重庆": { transport: 800, accommodation: 300, food: 150 },
  "杭州": { transport: 800, accommodation: 400, food: 200 },
  "西安": { transport: 800, accommodation: 300, food: 150 },
  "厦门": { transport: 1000, accommodation: 500, food: 200 },
  "丽江": { transport: 1200, accommodation: 400, food: 150 },
  "香港": { transport: 1500, accommodation: 800, food: 400 },
  "澳门": { transport: 1200, accommodation: 800, food: 300 },
  "台湾": { transport: 1500, accommodation: 500, food: 200 },
  "西藏": { transport: 2000, accommodation: 400, food: 150 },
  "新疆": { transport: 2000, accommodation: 400, food: 150 },
  "海南": { transport: 1500, accommodation: 600, food: 250 },
}

const DEFAULT_BUDGET = { transport: 600, accommodation: 250, food: 150 }

export default function Page() {
  const {
    lists, setLists, activeListId, setActiveListId, activeList,
    favorites, toggleFavorite, history, setHistory, addHistory,
    lang, setLang, updateActiveListItems
  } = useDestination()

  const t = locales[lang]
  
  const [winner, setWinner] = React.useState<string | null>(null)
  const [travelDays, setTravelDays] = React.useState<number>(3)
  const [destinationDetails, setDestinationDetails] = React.useState<{ intro: string; imageKeyword: string; link: string } | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSpinEnd = async (winner: string) => {
    setWinner(winner)
    addHistory(winner)
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
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a brief introduction (max 100 characters), a representative image search keyword, and a Wikipedia link for the city: ${winner}. Return in JSON format with keys: intro, imageKeyword, link. Language: ${lang === 'zh-CN' ? 'Chinese' : 'English'}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              intro: { type: Type.STRING },
              imageKeyword: { type: Type.STRING },
              link: { type: Type.STRING },
            },
            required: ["intro", "imageKeyword", "link"],
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

  const getBudget = (destination: string, days: number) => {
    const budget = BUDGET_DATA[destination] || DEFAULT_BUDGET
    const transport = budget.transport
    const accommodation = budget.accommodation * days
    const food = budget.food * days
    const total = transport + accommodation + food
    return { transport, accommodation, food, total }
  }

  const budgetInfo = winner ? getBudget(winner, travelDays) : null

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
        />
      </AppHeader>

      <main id="main-content" className="flex-1 container mx-auto px-4 py-6 md:py-12 flex flex-col items-center justify-center gap-8">
        <div id="wheel-wrapper" className="w-full max-w-4xl flex flex-col items-center justify-center space-y-8">
          <Wheel 
            items={activeList.items} 
            onSpinEnd={handleSpinEnd} 
            spinText={t.startSpin}
            spinningText={t.spinning}
          />
          
          {winner && budgetInfo && (
            <WinnerCard 
              t={t}
              winner={winner}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isLoadingDetails={isLoadingDetails}
              destinationDetails={destinationDetails}
              travelDays={travelDays}
              setTravelDays={setTravelDays}
              budgetInfo={budgetInfo}
              onClose={() => setWinner(null)}
            />
          )}
        </div>
      </main>

      <footer id="app-footer" className="py-6 border-t text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 Random Destination Wheel v2.6.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
