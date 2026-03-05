# ⚡ create-vite-vue

🚀 一个开箱即用的 Vue 3 项目快速生成工具  
基于 Vite 构建，支持按需组合常用技术栈，直接生成可落地的项目结构。

---

## ✨ 特性一览

- ⚡ 基于 Vite + Vue 3，启动快、构建快
- 📜 支持 JavaScript / TypeScript 自由选择
- 🧭 可选集成 Vue Router（支持动态参数路由）
- 🗂️ 可选集成 Pinia（含持久化）
- 📡 内置 Axios 请求方案
- 🖥️ / 📱 支持 Element Plus / Vant
- 🧰 常用工具库可选：VueUse / Lodash / Day.js
- 🧩 结构清晰，适合直接写业务
- 🔧 内置 Vite 配置优化构建输出和资源路径
- 🌐 本地及网络访问启动日志显示
- 📝 自定义 Banner 插件显示项目信息
- 🎨 可选集成 Tailwind CSS（通过 postcss 配置）

---

## 🧩 技术栈

⚡ Vite  
🟢 Vue 3  
📜 JavaScript / 🔷 TypeScript  
🧭 Vue Router  
🗂️ Pinia  
📡 Axios  
🖥️ Element Plus / 📱 Vant  
🧰 VueUse · Lodash · Day.js  
🎨 Tailwind CSS  

---

## 📦 生成后的项目包含什么？

根据你的选择，工具会自动生成一个标准化 Vue 3 项目结构，主要包括：

### 基础内容（必选）

- 项目入口页面
- src 源码目录
- 项目启动入口文件
- 根组件与默认欢迎页
- 全局样式文件
- Vite 配置文件
- 依赖管理文件（已自动注入所选功能）
- 路径别名配置（@ 指向 src）
- postcss.config.mjs（Tailwind CSS 配置，可选）

这些内容已经帮你处理好基础配置，可直接开始开发，无需清理模板代码。

---

## 📁 项目目录结构说明

project-name
├─ public/                   —— 公共静态资源目录  
│  └─ favicon.ico  
├─ src/  
│  ├─ api/                   —— 接口请求封装目录  
│  ├─ assets/                —— 图片、字体等静态资源  
│  ├─ components/            —— 公共组件目录  
│  ├─ router/                —— 路由配置（可选）  
│  ├─ stores/                —— Pinia 状态管理（可选）  
│  ├─ types/                 —— 类型声明文件  
│  ├─ utils/                 —— 工具方法、请求封装  
│  ├─ views/                 —— 页面级组件（路由页面）  
│  │  └─ home/               —— 示例页面文件夹
│  │     ├─ index.vue         —— 默认首页 /home
│  │     ├─ meta.json         —— 页面 meta 信息
│  │     └─ [id]/             —— 动态参数路由示例
│  │         └─ [name].vue    —— 路由 /home/:id/:name
│  ├─ App.vue                —— 根组件  
│  ├─ main.js / main.ts      —— 项目启动入口  
│  └─ style.css              —— 全局样式文件  
├─ index.html                —— 项目入口页面  
├─ jsconfig.json / tsconfig.json —— 路径别名与编译配置  
├─ package.json              —— 项目依赖与脚本配置  
├─ postcss.config.mjs        —— Tailwind CSS 配置文件（可选）  
├─ README.md                 —— 项目说明文档  
└─ vite.config.ts            —— Vite 开发与构建配置  

### 目录说明（白话版）

- **public**：放不会被打包处理的静态资源  
- **assets**：项目中使用的图片、字体等资源  
- **components**：可复用的通用组件  
- **views**：页面级组件，通常与路由一一对应  
- **router**：统一管理页面路由规则  
- **stores**：全局状态管理目录  
- **utils**：请求封装、工具方法等公共逻辑  
- **api**：接口请求封装目录  
- **types**：TypeScript 类型定义  
- **postcss.config.mjs**：Tailwind CSS 配置，可根据需求修改  
- **README.md**：项目说明文档

---

## ⚙️ 使用方式

1. 创建项目  
```bash
npm create vite-vue@latest
```

2. 进入项目目录  
```bash
cd 项目名
```

3. 安装依赖  (已自动执行可省略)  
```bash
npm install
```

4. 启动开发环境  
```bash
npm run dev
```

> 如果在创建时选择了「立即运行」，工具会自动执行启动命令。

---

## 🌐 技术栈官网链接

- [Vite](https://vitejs.dev/)
- [Vue 3](https://vuejs.org/)
- [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)
- [TypeScript](https://www.typescriptlang.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Element Plus](https://element-plus.org/)
- [Vant](https://vant-contrib.gitee.io/vant/)
- [VueUse](https://vueuse.org/)
- [Lodash](https://lodash.com/)
- [Day.js](https://day.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🔧 常见需要调整的地方（具体文件示例）

### 1️⃣ 接口请求地址

文件：`src/utils/request.ts`  `src/utils/request.js`  
```ts
import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 修改为你的接口地址
  timeout: 10000,
});

// 示例请求
export const getUserList = () => request.get('/users');

export default service;
```

> 🔹 根据实际业务修改 `baseURL` 和各个接口方法。  

---

### 2️⃣ 本地代理配置

文件：`vite.config.ts`  `vite.config.js`  
```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 修改为后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

> 🔹 如果接口路径前有 `/api` 前缀，可通过代理去掉  
> 🔹 根据本地后端环境调整 `target`  

---

### 3️⃣ 路由结构（支持动态参数）

文件：`src/router/index.ts`  `src/router/index.js`  
```ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'  // 自动生成的路由

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

> 🔹 页面文件夹结构示例：
```text
src/views/home/
├─ index.vue          -> /home
└─ [id]/[name].vue    -> /home/:id/:name
```

> 🔹 获取路由参数：
```ts
import { useRoute } from 'vue-router'
const route = useRoute()
console.log(route.params.id)
console.log(route.params.name)
```

---

### 4️⃣ 页面内容与样式

文件示例：`src/views/home/index.vue`  
```vue
<template>
  <div class="home-container">
    <h1>欢迎来到项目首页</h1>
    <p>这里可以根据业务需求修改页面内容和样式</p>
  </div>
</template>

<script setup lang="ts">
// 可引入接口数据
// import { getUserList } from '@/api'
</script>

<style scoped>
.home-container {
  padding: 20px;
}
</style>
```

> 🔹 根据实际业务修改 HTML、样式、以及调用接口逻辑  

---

## 🎯 适用场景

- Vue 3 新手快速上手
- 后台管理系统
- 中小型 Web 项目
- 练手项目 / 毕设 / 实战项目
- 不想每次重复配置环境的开发者

---

## 📄 License

MIT License

