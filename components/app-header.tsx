// components/app-header.tsx v2.6.0
"use client"

import * as React from "react"
import { MapPin, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

interface AppHeaderProps {
  title: string
  shortTitle: string
  lang: "en" | "zh-CN"
  onLangToggle: () => void
  children?: React.ReactNode
}

export function AppHeader({ title, shortTitle, lang, onLangToggle, children }: AppHeaderProps) {
  return (
    <header id="app-header" className="border-b sticky top-0 bg-background/80 backdrop-blur-md z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div id="logo-container" className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight hidden sm:block">{title}</h1>
          <h1 className="text-xl font-bold tracking-tight sm:hidden">{shortTitle}</h1>
        </div>
        <div id="header-actions" className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onLangToggle}
            id="btn-lang-toggle"
            title={lang === "zh-CN" ? "Switch to English" : "切换至中文"}
          >
            <Languages className="h-4 w-4" />
          </Button>
          {children}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
