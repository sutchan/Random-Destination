"use client"

import * as React from "react"
import { Settings, Languages } from "lucide-react"
import { cn } from "@/app/lib/utils"
import { Button } from "@/app/components/ui/button"

interface AppHeaderProps {
  title: string
  shortTitle: string
  lang: string
  onLangToggle: () => void
  children?: React.ReactNode
}

export function AppHeader({
  title,
  shortTitle,
  lang,
  onLangToggle,
  children,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            {shortTitle.charAt(0)}
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold leading-none md:text-base">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLangToggle}
            className="gap-2"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{lang === "zh-CN" ? "中文" : "EN"}</span>
          </Button>
          {children}
        </div>
      </div>
    </header>
  )
}
