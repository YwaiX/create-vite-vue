// types/global.d.ts

/**
 * 插件配置对象
 */
interface PluginsConfig {
  router: boolean
  pinia: boolean
  axios: boolean
  elementPlus: boolean
  vant: boolean
  vueuse: boolean
  lodash: boolean
  dayjs: boolean
  mitt: boolean
  tailwind: boolean
  https: boolean
}

/**
 * 未使用的占位符集合
 */
interface UnusedPlaceholders {
  import: string[]
  use: string[]
}

/**
 * 插件上下文对象
 */
interface PluginContext {
  language: 'ts' | 'js'
  targetDir: string
  autoRoute: boolean
  enableHttps: boolean
  __dirname: string
}

/**
 * main 文件配置项
 */
interface ConfigurationItem {
  template: string
  content: string
}

/**
 * 包管理器类型
 */
type PackageManager = 'npm' | 'pnpm'

/**
 * 可选依赖版本映射
 */
interface OptionalDeps {
  'vue-router'?: string
  'pinia'?: string
  'pinia-plugin-persistedstate'?: string
  'axios'?: string
  'element-plus'?: string
  '@element-plus/icons-vue'?: string
  'vant'?: string
  '@vueuse/core'?: string
  'dayjs'?: string
  'lodash'?: string
  'tailwindcss'?: string
  '@tailwindcss/postcss'?: string
  'postcss'?: string
  'mitt'?: string
  'vite-plugin-mkcert'?: string
  'vite-plugin-pages'?: string
}