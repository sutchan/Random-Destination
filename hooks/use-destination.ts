// hooks/use-destination.ts v2.8.1
import * as React from "react"

export type DestinationList = {
  id: string;
  name: string;
  items: string[];
  isPreset: boolean;
}

export const PRESETS: DestinationList[] = [
  {
    id: "preset-provinces",
    name: "省级抽签 (全国省份)",
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

export function useDestination() {
  const [lists, setLists] = React.useState<DestinationList[]>(PRESETS)
  const [activeListId, setActiveListId] = React.useState<string>(PRESETS[0].id)
  const [favorites, setFavorites] = React.useState<string[]>([])
  const [history, setHistory] = React.useState<string[]>([])
  const [lang, setLang] = React.useState<"en" | "zh-CN">("zh-CN")

  React.useEffect(() => {
    const savedLang = localStorage.getItem('app-lang') as "en" | "zh-CN"
    if (savedLang) setLang(savedLang)
    
    const savedLists = localStorage.getItem('destination-lists')
    const savedActiveId = localStorage.getItem('active-list-id')
    const savedFavorites = localStorage.getItem('destination-favorites')
    const savedHistory = localStorage.getItem('destination-history')
    
    if (savedLists) {
      try {
        const parsed = JSON.parse(savedLists)
        if (Array.isArray(parsed)) {
          // Filter out old presets and replace with current ones
          const customLists = parsed.filter(l => !l.isPreset)
          setLists([...PRESETS, ...customLists])
        }
      } catch (e) {}
    }
    if (savedActiveId) setActiveListId(savedActiveId)
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites)
        if (Array.isArray(parsed)) setFavorites(parsed)
      } catch (e) {}
    }
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed)) setHistory(parsed)
      } catch (e) {}
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('destination-lists', JSON.stringify(lists))
    localStorage.setItem('active-list-id', activeListId)
    localStorage.setItem('destination-favorites', JSON.stringify(favorites))
    localStorage.setItem('destination-history', JSON.stringify(history))
    localStorage.setItem('app-lang', lang)
  }, [lists, activeListId, favorites, history, lang])

  const activeList = lists.find(l => l.id === activeListId) || PRESETS[0]

  const updateActiveListItems = (newItems: string[]) => {
    setLists(prev => prev.map(list => 
      list.id === activeListId ? { ...list, items: newItems } : list
    ))
  }

  const toggleFavorite = (item: string) => {
    setFavorites(prev => prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item])
  }

  const addHistory = (item: string) => {
    setHistory(prev => [item, ...prev].slice(0, 50))
  }

  return {
    lists, setLists,
    activeListId, setActiveListId,
    activeList,
    favorites, setFavorites, toggleFavorite,
    history, setHistory, addHistory,
    lang, setLang,
    updateActiveListItems
  }
}
