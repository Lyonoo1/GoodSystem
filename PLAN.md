## GPT_WEB 项目初始化与后台骨架计划

### 目标产物
- 启动 `pnpm dev` 后得到一个可用的管理后台骨架：
  - 左侧**侧边栏菜单（一级/二级）**（基于路由静态配置生成）。
  - 顶部栏右侧显示**登录人信息**（本地 mock：localStorage + Vuex），支持退出登录。
  - 路由守卫：未登录跳转登录页；登录后回到目标页。
  - 示例页面：Dashboard、列表页、表单页、404。

### 技术栈
- Vue 3 + Vite（纯 JS：`.js` / `.vue`）
- Element Plus
- Vue Router 4
- Vuex 4
- axios（预埋 API 层）

### 生成方式
- 使用 Vite 官方脚手架在 `GPT_WEB/` 内生成项目骨架，然后在其上进行改造。

### 依赖对齐说明
- 按你提供的 `package.json` 依赖对齐后，为了保证当前环境可安装/可启动，已**暂时移除**以下私有依赖（因为在当前 npm 源上 404）：\n  - `@la64.05/no-console`\n  - `@la64.05/mmjtrack`\n- 你后续提供私有 registry 后，我可以再把它们加回并配置 `.npmrc`。

### 已实现的关键模块（对应文件）
- **登录态与用户信息（mock）**：`src/store/modules/user.js`、`src/utils/auth.js`
- **布局**（侧边栏 + 顶部栏 + 面包屑 + 内容区）：`src/layouts/AdminLayout.vue`
- **侧边栏菜单（一级二级）**：`src/layouts/components/Sidebar.vue` + `src/utils/menu.js`
- **右上角登录人信息**：`src/layouts/components/HeaderBar.vue`
- **路由与守卫**：`src/router/index.js`、`src/router/guards.js`
- **示例页面**：`src/pages/*`
- **构建健康检查文件**：`health.html`

### 验收方式
- 安装：`pnpm install`
- 开发：`pnpm dev`（默认 `http://localhost:8080/`）
- 验收点：
  - 未登录访问 `/` 自动跳 `/login`
  - 登录后进入后台布局，侧边栏二级菜单可用，面包屑正确
  - 右上角展示用户信息，退出回到登录页

