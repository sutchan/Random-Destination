# CHANGELOG

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
