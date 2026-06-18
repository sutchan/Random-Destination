# 项目安全与 React 最佳实践审查报告

**项目**: Random Destination Wheel v3.4.0  
**审查日期**: 2026-06-17  
**技术栈**: Next.js 15 + React 19 + TypeScript + Tailwind CSS

---

## 执行摘要

本报告对 Random Destination Wheel 项目进行了全面的安全审查和 React 性能优化审查。整体代码质量良好，但发现 **3 个高风险安全问题** 和 **5 个中等性能优化建议**。

---

## 一、安全审查报告

### 🔴 高风险 (Critical)

#### [SEC-001] API 密钥在前端暴露
**文件**: `app/page.tsx:72`
**影响**: 攻击者可获取 Gemini API 密钥，产生未经授权的费用
```typescript
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
```
**建议**: 将 AI 调用移到 API 路由 (`app/api/`) 中，使用服务器端密钥

#### [SEC-002] 外部链接缺少安全属性
**文件**: `components/winner-card.tsx`
**影响**: 可能遭受反向钓鱼攻击 (reverse tabnabbing)
```typescript
<a href={destinationDetails.link} target="_blank" ...>
```
**建议**: 添加 `rel="noopener noreferrer"`
```typescript
<a href={destinationDetails.link} target="_blank" rel="noopener noreferrer">
```

#### [SEC-003] 环境配置文件缺失
**文件**: `.env.local`
**影响**: 缺少 API 密钥配置模板，可能导致配置错误
**建议**: 确保 `.env.example` 包含所有必需的环境变量模板

---

### 🟡 中风险 (Medium)

#### [SEC-004] 生产环境日志泄露敏感信息
**文件**: `app/page.tsx:94`
**影响**: 生产环境中可能输出敏感错误信息
```typescript
console.error("Failed to fetch destination details", e);
```
**建议**: 使用条件性日志或日志服务
```typescript
if (process.env.NODE_ENV === 'development') {
  console.error("Failed to fetch destination details", e);
}
```

#### [SEC-005] localStorage 数据缺乏验证
**文件**: `hooks/use-destination.ts:70-91`
**影响**: 可能解析恶意构造的 localStorage 数据
**建议**: 添加 Schema 验证
```typescript
import { z } from 'zod'

const destinationListSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.string()),
  isPreset: z.boolean()
})
```

---

### 🟢 低风险 (Low)

#### [SEC-006] 缺少内容安全策略 (CSP)
**文件**: `app/layout.tsx`
**建议**: 添加 CSP meta 标签或 Next.js 安全 headers 配置

---

## 二、React 性能审查报告

### 🔴 关键性能问题 (CRITICAL)

#### [PERF-001] 每次渲染重新创建 locales 对象
**文件**: `app/page.tsx:18-21`
**影响**: 不必要的内存分配和 GC 压力
```typescript
const locales = {
  en,
  "zh-CN": zhCN
}
```
**建议**: 移到组件外部
```typescript
const locales = { en, "zh-CN": zhCN } as const

export default function Page() {
  // 使用 locales[lang]
}
```

#### [PERF-002] 未使用 useCallback 优化回调函数
**文件**: `app/page.tsx`
**影响**: 子组件可能因回调引用变化而重新渲染
```typescript
const handleSpinEnd = async (winnerName: string) => { ... }
const handleDrillDown = () => { ... }
const resetDrillDown = () => { ... }
```
**建议**: 使用 useCallback 包裹
```typescript
const handleSpinEnd = useCallback(async (winnerName: string) => { ... }), [])
const handleDrillDown = useCallback(() => { ... }), [winner])
```

---

### 🟡 中等优化建议 (MEDIUM)

#### [PERF-003] currentLevelItems 计算可优化
**文件**: `app/page.tsx:41-57`
**问题**: CHINA_REGIONS.find 在嵌套循环中可能低效
**建议**: 使用 useMemo 但当前实现已合理

#### [PERF-004] confetti 库应延迟加载
**文件**: `app/page.tsx:9`
**影响**: 首屏加载不必要的大库
```typescript
import confetti from "canvas-confetti"
```
**建议**: 使用动态导入
```typescript
const confetti = (await import("canvas-confetti")).default
```

#### [PERF-005] Wheel 组件 SVG 重新生成
**文件**: `components/wheel.tsx:89-130`
**问题**: 每次渲染 SVG path 重新计算
**建议**: 考虑使用 `useMemo` 缓存 SVG segments

#### [PERF-006] useEffect 缺少 lint 依赖检查
**文件**: `hooks/use-destination.ts:94-102`
```typescript
React.useEffect(() => {
  // persistence logic
}, [lists, activeListId, favorites, history, lang]) // ✅ 正确
```
**状态**: 此处已正确配置 ✅

---

## 三、修复优先级

### 立即修复 (P0)
1. [SEC-001] API 路由重构 - 保护 Gemini API 密钥
2. [SEC-002] 添加外部链接安全属性
3. [PERF-001] locales 对象移到组件外

### 高优先级 (P1)
4. [SEC-004] 条件化 console.error
5. [PERF-002] 使用 useCallback 优化回调

### 中优先级 (P2)
6. [PERF-004] confetti 动态导入
7. [SEC-005] 添加 localStorage 数据验证
8. [SEC-006] 配置 CSP

---

## 四、总结

| 类别 | 高风险 | 中风险 | 低风险 |
|------|--------|--------|--------|
| 安全 | 3 | 2 | 1 |
| 性能 | 2 | 4 | 0 |

**总体评估**: 代码结构清晰，安全意识良好。主要改进方向是 API 密钥保护和性能优化。实施上述建议将显著提升应用的安全性和用户体验。

---

*报告生成时间: 2026-06-17*
