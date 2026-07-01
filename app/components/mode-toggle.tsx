"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/app/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = React.useCallback(() => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9" aria-label="Toggle theme">
        <Sun className="h-4 w-4 opacity-0" />
      </Button>
    )
  }

  const Icon = theme === "dark" ? Moon : theme === "system" ? Monitor : Sun

  return (
    <Button
      id="btn-theme-toggle"
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="w-9 h-9"
      aria-label="Toggle theme"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
