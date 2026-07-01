// hooks/use-destination.ts v3.5.0
import * as React from "react"

export type DestinationList = {
  id: string;
  name: string;
  items: string[];
  isPreset: boolean;
}

function isValidDestinationList(obj: unknown): obj is DestinationList {
  if (typeof obj !== "object" || obj === null) return false
  const o = obj as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.name === "string" &&
    Array.isArray(o.items) &&
    o.items.every(item => typeof item === "string") &&
    typeof o.isPreset === "boolean"
  )
}

function isValidStringArray(obj: unknown): obj is string[] {
  return Array.isArray(obj) && obj.every(item => typeof item === "string")
}

function isValidLang(obj: unknown): obj is "en" | "zh-CN" {
  return obj === "en" || obj === "zh-CN"
}

export const PRESETS: DestinationList[] = [
  {
    id: "preset-provinces",
    name: "中国行政区划 (省/市/县)",
    items: [
      "北京", "天津", "河北", "山西", "内蒙古", "辽宁", "吉林", "黑龙江",
      "上海", "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南",
      "湖北", "湖南", "广东", "广西", "海南", "重庆", "四川", "贵州",
      "云南", "西藏", "陕西", "甘肃", "青海", "宁夏", "新疆", "台湾",
      "香港", "澳门"
    ],
    isPreset: true
  },
  {
    id: "preset-cities",
    name: "市级抽签 (主要城市)",
    items: [
      "北京", "上海", "广州", "深圳", "成都", "重庆", "杭州", "西安", "武汉", "苏州",
      "南京", "天津", "郑州", "长沙", "东莞", "佛山", "宁波", "青岛", "沈阳", "合肥",
      "昆明", "福州", "无锡", "厦门", "哈尔滨", "长春", "南昌", "济南", "大连", "贵阳",
      "温州", "石家庄", "泉州", "南宁", "金华", "常州", "珠海", "惠州", "嘉兴", "南通"
    ],
    isPreset: true
  },
  {
    id: "preset-counties",
    name: "县级抽签 (特色县城)",
    items: [
      "阳朔县", "凤凰县", "婺源县", "大理市", "腾冲市", "敦煌市", "平遥县", "江孜县",
      "亚丁县", "布尔津县", "塔什库尔干县", "理塘县", "墨脱县", "扎达县", "普兰县",
      "康定市", "香格里拉市", "延吉市", "图们市", "珲春市", "满洲里市", "二连浩特市",
      "瑞丽市", "河口县", "凭祥市", "东兴市", "漠河市", "抚远市", "黑河市", "伊宁市"
    ],
    isPreset: true
  },
  {
    id: "preset-tier1",
    name: "一线城市",
    items: ["北京", "上海", "广州", "深圳"],
    isPreset: true
  }
]

// js-cache-storage: Cache localStorage reads to avoid repeated I/O
const storageCache = new Map<string, string | null>()

function getCachedStorage(key: string): string | null {
  if (storageCache.has(key)) {
    return storageCache.get(key) ?? null
  }
  const value = localStorage.getItem(key)
  storageCache.set(key, value)
  return value
}

function setCachedStorage(key: string, value: string) {
  storageCache.set(key, value)
  localStorage.setItem(key, value)
}

export function useDestination() {
  const [lists, setLists] = React.useState<DestinationList[]>(PRESETS)
  const [activeListId, setActiveListId] = React.useState<string>(PRESETS[0].id)
  const [favorites, setFavorites] = React.useState<string[]>([])
  const [history, setHistory] = React.useState<string[]>([])
  const [lang, setLang] = React.useState<"en" | "zh-CN">("zh-CN")

  // rerender-lazy-state-init: Lazy load from localStorage only on mount
  const isInitialized = React.useRef(false)

  React.useEffect(() => {
    if (isInitialized.current) return
    isInitialized.current = true

    try {
      const savedLang = getCachedStorage("app-lang")
      if (savedLang && isValidLang(savedLang)) {
        setLang(savedLang)
      }

      const savedLists = getCachedStorage("destination-lists")
      if (savedLists) {
        const parsed = JSON.parse(savedLists)
        if (Array.isArray(parsed)) {
          const customLists = parsed.filter(
            (item): item is DestinationList =>
              !item.isPreset && isValidDestinationList(item)
          )
          setLists([...PRESETS, ...customLists])
        }
      }

      const savedActiveId = getCachedStorage("active-list-id")
      if (savedActiveId && typeof savedActiveId === "string") {
        setActiveListId(savedActiveId)
      }

      const savedFavorites = getCachedStorage("destination-favorites")
      if (savedFavorites && isValidStringArray(JSON.parse(savedFavorites))) {
        setFavorites(JSON.parse(savedFavorites))
      }

      const savedHistory = getCachedStorage("destination-history")
      if (savedHistory && isValidStringArray(JSON.parse(savedHistory))) {
        setHistory(JSON.parse(savedHistory))
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load from localStorage:", e)
      }
      setLists(PRESETS)
      setActiveListId(PRESETS[0].id)
      setFavorites([])
      setHistory([])
    }
  }, [])

  // client-localstorage-schema: Debounce localStorage writes to reduce I/O
  const persistTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    if (!isInitialized.current) return

    if (persistTimer.current) {
      clearTimeout(persistTimer.current)
    }

    persistTimer.current = setTimeout(() => {
      const persistable = lists.map(l =>
        l.isPreset ? { id: l.id, name: l.name, items: [], isPreset: true } : l
      )
      setCachedStorage("destination-lists", JSON.stringify(persistable))
      setCachedStorage("active-list-id", activeListId)
      setCachedStorage("destination-favorites", JSON.stringify(favorites))
      setCachedStorage("destination-history", JSON.stringify(history))
      setCachedStorage("app-lang", lang)
    }, 300)

    return () => {
      if (persistTimer.current) {
        clearTimeout(persistTimer.current)
      }
    }
  }, [lists, activeListId, favorites, history, lang])

  const activeList = React.useMemo(
    () => lists.find(l => l.id === activeListId) || PRESETS[0],
    [lists, activeListId]
  )

  // rerender-functional-setstate: Use functional setState for stable callbacks
  const updateActiveListItems = React.useCallback((newItems: string[]) => {
    setLists(prev => {
      const target = prev.find(l => l.id === activeListId)
      if (!target || target.isPreset) return prev
      return prev.map(list =>
        list.id === activeListId ? { ...list, items: newItems } : list
      )
    })
  }, [activeListId])

  // js-set-map-lookups: Use Set for O(1) membership checks
  const toggleFavorite = React.useCallback((item: string) => {
    setFavorites(prev => {
      const favSet = new Set(prev)
      if (favSet.has(item)) {
        favSet.delete(item)
      } else {
        favSet.add(item)
      }
      return Array.from(favSet)
    })
  }, [])

  const addHistory = React.useCallback((item: string) => {
    setHistory(prev => [item, ...prev.filter(h => h !== item)].slice(0, 50))
  }, [])

  // rerender-derived-state-no-effect: Derive isFavorited via helper, not state
  const isFavorited = React.useCallback(
    (item: string) => favorites.some(f => f === item),
    [favorites]
  )

  return {
    lists, setLists,
    activeListId, setActiveListId,
    activeList,
    favorites, setFavorites, toggleFavorite, isFavorited,
    history, setHistory, addHistory,
    lang, setLang,
    updateActiveListItems
  }
}
