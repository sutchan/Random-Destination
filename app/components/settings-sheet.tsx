"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet"
import { Button } from "@/app/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { Separator } from "@/app/components/ui/separator"
import {
  Settings,
  Heart,
  History,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Trash,
  MapPin,
  Compass,
  List,
  ChevronRight,
} from "lucide-react"
import type { DestinationList } from "@/app/hooks/use-destination"
import type { Region } from "@/app/lib/china-data"

interface SettingsSheetProps {
  t: {
    settings: string
    manageDestinations: string
    manageDesc: string
    myFavorites: string
    noFavorites: string
    history: string
    clear: string
    noHistory: string
    listSettings: string
    selectList: string
    createList: string
    createListDesc: string
    listName: string
    listNamePlaceholder: string
    create: string
    preset: string
    delete: string
    currentList: string
    presetNoEdit: string
    addItemPlaceholder: string
    add: string
    emptyList: string
    browseRegions: string
    all: string
    switchToList: string
  }
  lists: DestinationList[]
  activeListId: string
  setActiveListId: (id: string) => void
  activeList: DestinationList
  favorites: string[]
  toggleFavorite: (item: string) => void
  history: string[]
  setHistory: (items: string[]) => void
  onAdd: (item: string) => void
  onRemove: (item: string) => void
  onCreateList: (name: string) => void
  onDeleteList: () => void
  onUpdateListName: (name: string) => void
  chinaRegions: Region[]
  triggerId?: string
}

type TabType = "list" | "browse"

export const SettingsSheet = React.memo(function SettingsSheet({
  t,
  lists,
  activeListId,
  setActiveListId,
  activeList,
  favorites,
  toggleFavorite,
  history,
  setHistory,
  onAdd,
  onRemove,
  onCreateList,
  onDeleteList,
  onUpdateListName,
  chinaRegions,
  triggerId,
}: SettingsSheetProps) {
  const [newItem, setNewItem] = React.useState("")
  const [newListName, setNewListName] = React.useState("")
  const [editingListName, setEditingListName] = React.useState(false)
  const [tempListName, setTempListName] = React.useState(activeList.name)
  const [activeTab, setActiveTab] = React.useState<TabType>("list")
  const [browseLevel, setBrowseLevel] = React.useState<0 | 1 | 2>(0)
  const [browsePath, setBrowsePath] = React.useState<string[]>([])

  React.useEffect(() => {
    setTempListName(activeList.name)
  }, [activeList.name])

  const handleAdd = React.useCallback(() => {
    setNewItem(prev => {
      const trimmed = prev.trim()
      if (trimmed) {
        onAdd(trimmed)
      }
      return ""
    })
  }, [onAdd])

  const handleCreateList = React.useCallback(() => {
    setNewListName(prev => {
      const trimmed = prev.trim()
      if (trimmed) {
        onCreateList(trimmed)
      }
      return ""
    })
  }, [onCreateList])

  const handleRenameList = React.useCallback(() => {
    setTempListName(prev => {
      const trimmed = prev.trim()
      if (trimmed) {
        onUpdateListName(trimmed)
        setEditingListName(false)
      }
      return prev
    })
  }, [onUpdateListName])

  const handleCancelRename = React.useCallback(() => {
    setEditingListName(false)
    setTempListName(activeList.name)
  }, [activeList.name])

  const handleKeyDownAdd = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd()
  }, [handleAdd])

  const handleKeyDownCreate = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCreateList()
  }, [handleCreateList])

  // js-index-maps: Build lookup maps for browse navigation
  const provinceMap = React.useMemo(() => {
    const m = new Map<string, Region>()
    chinaRegions.forEach(r => m.set(r.name, r))
    return m
  }, [chinaRegions])

  const browseItems = React.useMemo(() => {
    if (browseLevel === 0) {
      return chinaRegions.map(r => ({ name: r.name, hasChildren: (r.children?.length || 0) > 0 }))
    } else if (browseLevel === 1) {
      const province = provinceMap.get(browsePath[0])
      return province?.children?.map(c => ({ name: c.name, hasChildren: (c.children?.length || 0) > 0 })) || []
    } else {
      const province = provinceMap.get(browsePath[0])
      const cityMap = new Map(province?.children?.map(c => [c.name, c]) || [])
      const city = cityMap.get(browsePath[1])
      return city?.children?.map(co => ({ name: co.name, hasChildren: false })) || []
    }
  }, [browseLevel, browsePath, provinceMap, chinaRegions])

  const handleBrowseDrillDown = React.useCallback((name: string) => {
    if (browseLevel < 2) {
      setBrowsePath(prev => [...prev, name])
      setBrowseLevel(prev => (prev + 1) as 0 | 1 | 2)
    }
  }, [browseLevel])

  const handleBrowseBack = React.useCallback(() => {
    if (browseLevel > 0) {
      setBrowsePath(prev => prev.slice(0, -1))
      setBrowseLevel(prev => (prev - 1) as 0 | 1 | 2)
    }
  }, [browseLevel])

  const handleBrowseReset = React.useCallback(() => {
    setBrowsePath([])
    setBrowseLevel(0)
  }, [])

  const handleAddFromBrowse = React.useCallback((name: string) => {
    if (!activeList.isPreset) {
      onAdd(name)
    }
  }, [activeList.isPreset, onAdd])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button id={triggerId} variant="ghost" size="icon" aria-label={t.settings}>
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent id="settings-sheet" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.manageDestinations}
          </SheetTitle>
          <SheetDescription>{t.manageDesc}</SheetDescription>
        </SheetHeader>

        {/* Tabs */}
        <div className="flex gap-2 mt-6 mb-4 p-1 bg-muted rounded-lg">
          <Button
            variant={activeTab === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("list")}
            className="flex-1 gap-2"
          >
            <List className="h-4 w-4" />
            {t.listSettings}
          </Button>
          <Button
            variant={activeTab === "browse" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("browse")}
            className="flex-1 gap-2"
          >
            <Compass className="h-4 w-4" />
            {t.browseRegions}
          </Button>
        </div>

        {activeTab === "list" ? (
          <div className="space-y-8">
            {/* Favorites */}
            <section id="favorites-section">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-red-500" />
                <h3 className="font-semibold text-sm">{t.myFavorites}</h3>
                <Badge variant="secondary">{favorites.length}</Badge>
              </div>
              {favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noFavorites}</p>
              ) : (
                <div id="favorites-list" className="flex flex-wrap gap-2">
                  {favorites.map((fav) => (
                    <Button
                      key={fav}
                      variant="secondary"
                      size="sm"
                      onClick={() => toggleFavorite(fav)}
                      className="gap-2"
                    >
                      {fav}
                      <X className="h-3 w-3 opacity-60" />
                    </Button>
                  ))}
                </div>
              )}
            </section>

            <Separator />

            {/* History */}
            <section id="history-section">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <h3 className="font-semibold text-sm">{t.history}</h3>
                  <Badge variant="secondary">{history.length}</Badge>
                </div>
                {history.length > 0 && (
                  <Button
                    id="btn-clear-history"
                    variant="ghost"
                    size="sm"
                    onClick={() => setHistory([])}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    {t.clear}
                  </Button>
                )}
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noHistory}</p>
              ) : (
                <div id="history-list" className="flex flex-wrap gap-2">
                  {history.slice(0, 20).map((item, i) => (
                    <Badge key={`${item}-${i}`} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              )}
            </section>

            <Separator />

            {/* List Settings */}
            <section id="list-settings-section">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4" />
                <h3 className="font-semibold text-sm">{t.listSettings}</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.selectList}</Label>
                  <Select value={activeListId} onValueChange={setActiveListId}>
                    <SelectTrigger id="select-list-trigger">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          <span className="flex items-center gap-2">
                            {list.name}
                            {list.isPreset && (
                              <Badge variant="secondary" className="text-[10px] h-4 px-1">
                                {t.preset}
                              </Badge>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Current List */}
                <Card id="items-management-section">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {editingListName ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={tempListName}
                              onChange={(e) => setTempListName(e.target.value)}
                              className="h-8 w-40"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleRenameList}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelRename}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <CardTitle className="text-base">{activeList.name}</CardTitle>
                        )}
                      </div>
                      {activeList.isPreset ? (
                        <Badge variant="secondary">{t.preset}</Badge>
                      ) : (
                        <div className="flex items-center gap-1">
                          {!editingListName && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingListName(true)}
                                className="h-7 w-7"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={onDeleteList}
                                className="h-7 w-7 hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      {activeList.items.length} {t.currentList}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {activeList.isPreset ? (
                      <p className="text-sm text-muted-foreground">
                        {t.presetNoEdit}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          value={newItem}
                          onChange={(e) => setNewItem(e.target.value)}
                          onKeyDown={handleKeyDownAdd}
                          placeholder={t.addItemPlaceholder}
                          className="h-9"
                        />
                        <Button onClick={handleAdd} size="sm">
                          <Plus className="h-4 w-4" />
                          {t.add}
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                      {activeList.items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t.emptyList}</p>
                      ) : (
                        activeList.items.map((item) => (
                          <div key={item} className="flex items-center gap-1">
                            <Badge variant="outline" className="gap-2 pr-1">
                              {item}
                              {!activeList.isPreset && (
                                <button
                                  onClick={() => onRemove(item)}
                                  className="ml-1 opacity-60 hover:opacity-100 hover:text-destructive"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Create New List */}
                <Card id="create-list-dialog">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{t.createList}</CardTitle>
                    <CardDescription>{t.createListDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2">
                    <Input
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      onKeyDown={handleKeyDownCreate}
                      placeholder={t.listNamePlaceholder}
                      className="h-9"
                    />
                    <Button onClick={handleCreateList} size="sm">
                      <Plus className="h-4 w-4" />
                      {t.create}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Browse breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBrowseReset}
                className="h-7 px-2 text-xs"
                disabled={browseLevel === 0}
              >
                {t.all}
              </Button>
              {browsePath.map((name, i) => (
                <React.Fragment key={i}>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setBrowsePath(prev => prev.slice(0, i + 1))
                      setBrowseLevel((i + 1) as 0 | 1 | 2)
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    {name}
                  </Button>
                </React.Fragment>
              ))}
            </div>

            {/* Back button */}
            {browseLevel > 0 && (
              <Button variant="outline" size="sm" onClick={handleBrowseBack} className="gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </Button>
            )}

            {/* Browse list */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {browseItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {item.hasChildren && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleBrowseDrillDown(item.name)}
                        className="h-7 w-7"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleAddFromBrowse(item.name)}
                      className="h-7 w-7"
                      disabled={activeList.isPreset}
                      title={activeList.isPreset ? t.switchToList : ""}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {!activeList.isPreset && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                {t.switchToList}
              </p>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
})
