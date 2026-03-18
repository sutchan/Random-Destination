// components/settings-sheet.tsx v2.6.0
"use client"

import * as React from "react"
import { 
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  X, Plus, MapPin, Trash2, Edit2, Save, Settings2, Heart, HeartOff, Star, History 
} from "lucide-react"
import { DestinationList } from "@/hooks/use-destination"

interface SettingsSheetProps {
  t: any
  lists: DestinationList[]
  activeListId: string
  setActiveListId: (id: string) => void
  activeList: DestinationList
  favorites: string[]
  toggleFavorite: (item: string) => void
  history: string[]
  setHistory: (history: string[]) => void
  onAdd: (item: string) => void
  onRemove: (item: string) => void
  onCreateList: (name: string) => void
  onDeleteList: () => void
  onUpdateListName: (name: string) => void
}

export function SettingsSheet({
  t, lists, activeListId, setActiveListId, activeList,
  favorites, toggleFavorite, history, setHistory,
  onAdd, onRemove, onCreateList, onDeleteList, onUpdateListName
}: SettingsSheetProps) {
  const [newItem, setNewItem] = React.useState("")
  const [newListName, setNewListName] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditingName, setIsEditingName] = React.useState(false)
  const [editingName, setEditingName] = React.useState("")

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newItem.trim()) {
      onAdd(newItem.trim())
      setNewItem("")
    }
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" size="sm" id="btn-settings" />}>
        <Settings2 className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">{t.settings}</span>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto" id="settings-sheet">
        <SheetHeader className="mb-6">
          <SheetTitle>{t.manageDestinations}</SheetTitle>
          <SheetDescription>{t.manageDesc}</SheetDescription>
        </SheetHeader>
        
        <div id="settings-content" className="space-y-6">
          {/* Favorites */}
          <div id="favorites-section" className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <h3 className="font-bold">{t.myFavorites} ({favorites.length})</h3>
            </div>
            <div id="favorites-list" className="flex flex-wrap gap-2 p-3 border rounded-md bg-yellow-50/30 dark:bg-yellow-950/10">
              {favorites.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2 text-center w-full">{t.noFavorites}</p>
              ) : (
                favorites.map((item, idx) => (
                  <Badge key={`${item}-${idx}`} variant="outline" className="text-sm py-1 px-3 border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20 dark:border-yellow-800">
                    {item}
                    <button onClick={() => toggleFavorite(item)} className="ml-2 hover:text-destructive focus:outline-none">
                      <HeartOff className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* History */}
          <div id="history-section" className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" />
              <h3 className="font-bold">{t.history} ({history.length})</h3>
              {history.length > 0 && (
                <Button variant="ghost" size="sm" className="h-6 text-[10px] ml-auto" onClick={() => setHistory([])} id="btn-clear-history">
                  {t.clear}
                </Button>
              )}
            </div>
            <div id="history-list" className="flex flex-col gap-1 max-h-[200px] overflow-y-auto p-2 border rounded-md bg-muted/20">
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground p-2 text-center">{t.noHistory}</p>
              ) : (
                history.map((item, idx) => (
                  <div key={`${item}-${idx}`} className="flex items-center justify-between p-1 hover:bg-muted/50 rounded text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {item}
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleFavorite(item)}>
                      <Heart className={`w-3 h-3 ${favorites.includes(item) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* List Settings */}
          <div id="list-settings-section" className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4" />
              <h3 className="font-bold">{t.listSettings}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Select value={activeListId} onValueChange={(val) => val && setActiveListId(val)}>
                <SelectTrigger className="flex-1" id="select-list-trigger">
                  <SelectValue placeholder={t.selectList} />
                </SelectTrigger>
                <SelectContent id="select-list-content">
                  {lists.map(list => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.name} {list.isPreset && `(${t.preset})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger render={<Button variant="outline" size="icon" id="btn-create-list" />}>
                  <Plus className="h-4 w-4" />
                </DialogTrigger>
                <DialogContent id="create-list-dialog">
                  <DialogHeader>
                    <DialogTitle>{t.createList}</DialogTitle>
                    <DialogDescription>{t.createListDesc}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">{t.listName}</Label>
                      <Input 
                        id="name" 
                        value={newListName} 
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder={t.listNamePlaceholder} 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => { onCreateList(newListName); setIsCreateDialogOpen(false); setNewListName(""); }} disabled={!newListName.trim()} id="btn-confirm-create">{t.create}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {!activeList.isPreset && (
                <Button variant="destructive" size="icon" onClick={onDeleteList} id="btn-delete-list">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <Separator />

          {/* Items Management */}
          <div id="items-management-section" className="space-y-4">
            <div className="flex items-center justify-between">
              {isEditingName && !activeList.isPreset ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editingName} 
                    onChange={(e) => setEditingName(e.target.value)} 
                    className="h-8 w-48"
                    id="input-edit-list-name"
                  />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { onUpdateListName(editingName); setIsEditingName(false); }} id="btn-save-list-name">
                    <Save className="h-4 w-4 text-primary" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditingName(false)} id="btn-cancel-edit-name">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{t.currentList}: {activeList.name} ({activeList.items.length})</h4>
                  {!activeList.isPreset && (
                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => { setEditingName(activeList.name); setIsEditingName(true); }} id="btn-edit-list-name">
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              {activeList.isPreset && (
                <Badge variant="outline" className="text-xs">{t.presetNoEdit}</Badge>
              )}
            </div>

            {!activeList.isPreset && (
              <form onSubmit={handleAddSubmit} className="flex gap-2" id="form-add-item">
                <Input 
                  placeholder={t.addItemPlaceholder} 
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  maxLength={10}
                  id="input-new-item"
                />
                <Button type="submit" disabled={!newItem.trim()} id="btn-add-item">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.add}
                </Button>
              </form>
            )}

            <div id="items-list" className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-3 border rounded-md bg-muted/30">
              {activeList.items.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2">{t.emptyList}</p>
              ) : (
                activeList.items.map((item) => (
                  <Badge key={item} variant="secondary" className="text-sm py-1 px-3 flex items-center gap-1">
                    <button onClick={() => toggleFavorite(item)} className="mr-1 hover:scale-110 transition-transform focus:outline-none">
                      <Heart className={`w-3 h-3 ${favorites.includes(item) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                    </button>
                    {item}
                    {!activeList.isPreset && (
                      <button onClick={() => onRemove(item)} className="ml-2 hover:text-destructive focus:outline-none">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
