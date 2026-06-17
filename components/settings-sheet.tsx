"use client"

import * as React from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
} from "lucide-react"
import type { DestinationList } from "@/hooks/use-destination"
import type { Region } from "@/lib/china-data"

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
}

export function SettingsSheet({
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
}: SettingsSheetProps) {
  const [newItem, setNewItem] = React.useState("")
  const [newListName, setNewListName] = React.useState("")
  const [editingListName, setEditingListName] = React.useState(false)
  const [tempListName, setTempListName] = React.useState(activeList.name)

  React.useEffect(() => {
    setTempListName(activeList.name)
  }, [activeList.name])

  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem("")
    }
  }

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName.trim())
      setNewListName("")
    }
  }

  const handleRenameList = () => {
    if (tempListName.trim()) {
      onUpdateListName(tempListName.trim())
      setEditingListName(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t.settings}>
          <Settings className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t.manageDestinations}
          </SheetTitle>
          <SheetDescription>{t.manageDesc}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Favorites */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-red-500" />
              <h3 className="font-semibold text-sm">{t.myFavorites}</h3>
              <Badge variant="secondary">{favorites.length}</Badge>
            </div>
            {favorites.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.noFavorites}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
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
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <h3 className="font-semibold text-sm">{t.history}</h3>
                <Badge variant="secondary">{history.length}</Badge>
              </div>
              {history.length > 0 && (
                <Button
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
              <div className="flex flex-wrap gap-2">
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
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4" />
              <h3 className="font-semibold text-sm">{t.listSettings}</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.selectList}</Label>
                <Select value={activeListId} onValueChange={setActiveListId}>
                  <SelectTrigger>
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
              <Card>
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
                            onClick={() => {
                              setEditingListName(false)
                              setTempListName(activeList.name)
                            }}
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
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{t.createList}</CardTitle>
                  <CardDescription>{t.createListDesc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
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
      </SheetContent>
    </Sheet>
  )
}
