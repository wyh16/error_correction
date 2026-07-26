# UI Showcase

独立的组件库展示项目，用于集中预览主应用 `frontend/src/components/base` 下的全部 Base 组件（Headless UI + Tailwind 实现）。

## 特性

- 参考主流组件库文档站（Element Plus / Naive UI）的布局：左侧组件清单、每个组件一个文档页、演示块带标题说明、页面底部附 API 表格。
- 全部 65 个组件的 API 文档（Props / Emits / Slots）维护在 `src/api-docs.ts`，按组件源码整理。
- 指南区：快速上手（引入方式、技术栈、约定）、主题定制（主题色 / 深浅色 / CSS 变量原理）。
- 演练场（`#/playground`）：实时调整 Button、Tag、Alert、Progress、Avatar 的 Props 并生成模板代码。
- 场景示例（`#/patterns`）：登录表单、数据看板、列表工具栏、设置分组等组合模式。
- 演示块支持「查看代码」折叠（`DemoBlock` 的 `code` prop）。
- `Ctrl+K` 打开命令面板可快速跳转任意组件页（基于 BaseCommandPalette 自举实现）。
- 组件源码零拷贝：通过 Vite 别名 `@ -> ../frontend/src` 直接复用主应用组件，主应用改动实时反映在展示页。
- 关系密切的组件（如 Radio 与 RadioGroup）合并在同一文档页，目录定义在 `src/catalog.ts`。
- hash 路由（`#/button`），刷新和分享链接保持当前页面。
- 支持明暗主题和主题色切换，与主应用的 `useTheme` 逻辑一致。

## 启动

```bash
npm install
npm run dev
```

默认端口 5175（`http://localhost:5175/`）。

## 注意

- 本项目依赖 `../frontend` 的源码存在；Tailwind 的 `content` 配置也会扫描该目录。
- Font Awesome 图标通过 CDN 引入（与主应用一致），离线时图标不显示但不影响布局。
