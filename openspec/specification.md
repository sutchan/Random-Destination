# Random Destination Wheel Specification v3.4.0

## 1. Overview
A Next.js web application that lets users spin a customizable wheel to randomly select a travel destination. Integrates Gemini AI to provide destination insights and supports hierarchical (province → city → county) random selection. Includes PWA support, multi-language UI, theme switching, list management, favorites, and history.

## 2. Core Features
- **Wheel Component**: SVG spinning wheel with customizable segments, pointer indicator, sound effects, and confetti celebration.
- **Hierarchical Drawing**: Three-level drill-down (province → city → county) based on a complete China administrative divisions dataset (v1.4.0).
- **Destination Management**: Preset lists (provinces, tier-1 cities, major cities, featured counties) and user-created custom lists with full CRUD.
- **Regional Browser**: A browse tab in settings to explore the administrative tree and add locations to custom lists.
- **AI Integration**: Gemini 3 Flash generates short destination introductions and Wikipedia links with JSON schema enforcement.
- **Persistence**: LocalStorage saves user lists, active list id, favorites, spin history, and UI language.
- **i18n**: Bilingual support (English / Simplified Chinese) with runtime toggle.
- **Robustness**: AI request error boundary with retry, JSON parse guards, and graceful fallback UI.
- **Dark / Light Mode**: System-aware theme toggle via next-themes.
- **PWA**: next-pwa integration with manifest.json and offline caching for installable experience.
- **Sound Effects**: Segment ticking sound during spin and a win sound when stopped.

## 3. Technical Stack
- **Framework**: Next.js 15+ (App Router), React 19.
- **Styling**: Tailwind CSS 4 with shadcn/ui (base-nova).
- **Animations**: motion (framer-motion), canvas-confetti.
- **Icons**: Lucide React.
- **AI SDK**: @google/genai (Gemini 3 Flash).
- **PWA**: next-pwa.
- **Themes**: next-themes.

## 4. UI / UX
- Responsive design (mobile-first, tablet, desktop).
- Semantic IDs on all major containers for testing and debugging.
- Sticky backdrop-blurred header with language and theme toggles.
- Glass-morphism winner card with decorative compass element.
- Right-side slide-in settings sheet with tabs (List / Browse).
- Keyboard-accessible buttons and focus outlines.

## 5. Project Structure
```
app/
  layout.tsx          # Root layout, metadata, theme provider
  page.tsx            # Main page: wheel, drill-down, winner card
  globals.css         # Tailwind + theme variables + textures
components/
  app-header.tsx      # Top bar with logo + language + settings + theme
  settings-sheet.tsx  # Lists, items, favorites, history, region browser
  wheel.tsx           # SVG wheel, spin animation, sound effects
  winner-card.tsx     # Result card with AI details
  mode-toggle.tsx     # Light / dark mode toggle
  theme-provider.tsx  # next-themes provider wrapper
  ui/                 # shadcn/ui primitives
hooks/
  use-destination.ts  # List / favorite / history state + persistence
lib/
  utils.ts            # cn() class merger
  china-data.ts       # Administrative regions tree v1.4.0
locales/
  en.ts               # English strings
  zh-CN.ts            # Simplified Chinese strings
openspec/
  specification.md    # This document
public/
  manifest.json       # PWA manifest
  sw.js               # Service worker (generated)
```

## 6. Semantic IDs
| Element | ID |
| --- | --- |
| App container | `app-container` |
| App header | `app-header` |
| Logo wrapper | `logo-container` |
| Language toggle button | `btn-lang-toggle` |
| Settings trigger button | `btn-settings` |
| Settings sheet | `settings-sheet` |
| Favorites section | `favorites-section` |
| Favorites list | `favorites-list` |
| History section | `history-section` |
| History list | `history-list` |
| Clear history | `btn-clear-history` |
| List settings section | `list-settings-section` |
| List select trigger | `select-list-trigger` |
| Create list dialog | `create-list-dialog` |
| Items management section | `items-management-section` |
| Wheel wrapper | `wheel-wrapper` |
| Wheel container | `wheel-container` |
| Wheel pointer | `wheel-pointer` |
| Wheel outer frame | `wheel-outer` |
| Wheel spinning part | `wheel-spinning-part` |
| Wheel segments | `wheel-segment-N` / `wheel-segment-single` |
| Spin button | `btn-spin` |
| Drill-down nav | `drill-down-nav` |
| Drill-down button | `drill-down-button` |
| Winner card | `winner-card` |
| Favorite winner button | `btn-favorite-winner` |
| View details button | `btn-view-details` |
| Close winner button | `btn-close-winner` |
| App footer | `app-footer` |
| Root body | `root-body` |

## 7. Data / State
- **Lists** (`DestinationList[]`): id, name, items[], isPreset.
- **Active list id** (`string`): pointer to the currently selected list.
- **Favorites** (`string[]`): user-curated favorite destinations.
- **History** (`string[]`): last 50 spin results, most recent first.
- **Language** (`"en" | "zh-CN"`): runtime UI language.
- **Drill-down path** (`string[]`): province → city navigation stack.
- **China regions** (`ChinaRegion[]`): static tree of provinces / cities / counties.

All mutable state is persisted under the following LocalStorage keys:
- `destination-lists`, `active-list-id`, `destination-favorites`, `destination-history`, `app-lang`.

## 8. AI Integration Contract
- **Model**: `gemini-3-flash-preview` (via `@google/genai`).
- **Prompt**: Request a short intro (≤100 chars) + Wikipedia link for a full path like `"广东 广州 天河区"`. Language mirrors current UI language.
- **Response**: JSON `{ intro: string, link: string }` with JSON schema enforcement.
- **Error handling**: catch → set error state → show retry button.

## 9. Build / Deploy
- Framework output: `standalone`.
- PWA cache destination: `public/`.
- `npm run build` → `npm start` for production server.
- `npm run dev` for local development.

## 10. Versioning
- App version: **v3.4.0** (file headers, HTML title, metadata.json, CHANGELOG, and footer).
- Data version: **v1.4.0** (china-data.ts header + footer notice).
- SemVer policy: bump patch for fixes, minor for new features, major for breaking changes.
