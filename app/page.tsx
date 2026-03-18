// app/page.tsx v2.7.0
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
        contents: `Provide a brief introduction (max 100 characters) and a Wikipedia link for the city: ${winner}. Return in JSON format with keys: intro, link. Language: ${lang === 'zh-CN' ? 'Chinese' : 'English'}.`,
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
          
          {winner && (
            <WinnerCard 
              t={t}
              winner={winner}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              isLoadingDetails={isLoadingDetails}
              destinationDetails={destinationDetails}
              onClose={() => setWinner(null)}
            />
          )}
        </div>
      </main>

      <footer id="app-footer" className="py-6 border-t text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© 2026 Random Destination Wheel v2.7.0. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
