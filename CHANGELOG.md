# CHANGELOG

## [3.1.0]
### Added
- **转盘视觉重塑**: 添加了中轴盖、拟物化光影遮罩，并实现了指针在转盘转动时的“逐格抖动”动画，视听同步感更强。
- **氛围感背景**: 引入了动态径向渐变背景与极简微点网格纹理，提升了整体设计的工业感与深度。
- **精致结果卡片**: 强化了结果弹窗的毛玻璃（Glassmorphism）效果，并添加了指南针装饰元素，视觉层次更丰富。

## [3.0.5]
### Changed
- 转盘动画优化: 将转盘转动时长从 4 秒增加至 8 秒，并增加初始转动圈数，使抽签过程更具悬念和仪式感。

## [3.0.4]
### Changed
- 音效交互优化: 将循环播放的背景音效改为“逐格触发”模式。现在转盘每转过一个目的地格子，都会触发一次清脆的叮当声，听感更加真实且具有节奏感。

## [3.0.3]
### Fixed
- 修复了在切换非层级抽签列表时可能导致的无限循环渲染问题 (Maximum update depth exceeded)。
- 优化了层级抽签项的计算逻辑，使用 `useMemo` 提升性能。

## [3.0.2]
### Changed
- 音效深度优化: 将转盘音效替换为更高频、更清脆的八音盒铃声 (High-pitched Tinkle)，彻底消除低沉感。

## [3.0.1]
### Changed
- 音效优化: 将转盘转动音效替换为更清脆的八音盒/铃声效果 (Music Box/Tinkle)，提升听觉质感。

## [3.0.0]
### Added
- 层级抽签 (Drill-down Spinning): 支持“省 -> 市 -> 县”三级联动抽签。
- 行政区划数据: 引入了 `lib/china-data.ts`，包含主要省份及其下属市县。
- 导航面包屑: 新增抽签路径导航，支持一键重置回省级。
- AI 深度集成: 抽签详情现在会根据完整的行政路径（如“广东 广州 天河区”）生成更精准的介绍。

## [2.9.1]
### Changed
- 音效优化: 将转盘转动音效替换为更清脆的齿轮/棘轮音 (Ratchet Sound)，提升机械感。

## [2.9.0]
### Added
- PWA 支持: 集成了 `next-pwa`，生成了 `manifest.json` 并配置了离线支持，满足 PWABuilder 要求。
- 音效体验: 为大转盘增加了转动音效和中奖音效，提升交互沉浸感。
- 图标配置: 为 PWA 配置了自适应图标和启动页。

## [2.8.1]
### Added
- 抽签分级: 新增省级、市级、县级预设抽签列表，覆盖全国省份、主要城市及特色县城。
- 列表同步: 优化了预设列表的更新机制，确保用户能及时获取最新的预设数据。

## [2.7.0]
### Changed
- 简化 UI: 去除了地区的照片和预算估算信息，使界面更加简洁。
- AI 优化: 优化了 AI 生成目的地简介的 Prompt。
- 版本更新: 同步更新所有文件版本号。

## [2.6.0]
### Added
- 代码重构: 将 `app/page.tsx` 拆分为多个组件和自定义 Hook (`useDestination`, `AppHeader`, `SettingsSheet`, `WinnerCard`)。
- 性能优化: 减少了主组件的渲染负担。
- 视觉优化: 优化了中奖卡片的布局和动画。

## [2.5.0]
### Added
- 国际化支持 (i18n): 新增 `locales/` 目录。
- 鲁棒性增强: 优化了 AI 请求失败时的错误处理。
- 规范文档: 新增 `openspec/specification.md`。
- 语义化 ID: 进一步完善了组件 ID。

### Changed
- 同步并更新所有文件的版本号至 v2.5.0。
- 更新 README 文档以包含新功能说明。

## [2.4.0]
### Added
- Github-compliant README and README_CN with cross-links.
- SEO and GEO metadata in layout.
- Semantic IDs to all major containers for debugging.
- Standardized file header comments.

### Changed
- Optimized responsive design for desktop, tablet, and mobile.
- Incremented version to v2.4.0.

## [2.3.0]
### Added
- AI-powered destination insights using Gemini 3 Flash.
- Travel budget estimation.
- History and favorites management.

## [2.2.0]
### Added
- Multiple destination lists (Presets and Custom).
- Local storage persistence.
- Theme toggle (Dark/Light mode).

## [2.1.0]
### Added
- Basic spinning wheel functionality.
- Destination management.
