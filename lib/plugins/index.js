// lib/plugins/index.js
import { setupAutoRoute } from './autoRoute.js'
import { setupAxios } from './axios.js'
import { setupElementPlus } from './elementPlus.js'
import { setupHttps } from './https.js'
import { setupPinia } from './pinia.js'
import { setupRouter } from './router.js'
import { setupTailwind } from './tailwind.js'
import { setupVant } from './vant.js'

/**
 * 配置所有选中的插件
 * @param {PluginsConfig} plugins - 插件配置对象
 * @param {PluginContext} context - 上下文对象
 * @returns {Promise<UnusedPlaceholders>} 未使用的占位符集合
 */
export async function setupPlugins (plugins, context) {
  const { language, targetDir, autoRoute, enableHttps, __dirname } = context

  // 收集未使用的占位符
  const unusedPlaceholders = {
    import: [],
    use: []
  }

  console.log('\n🔌 配置插件...')

  // Router
  if(plugins.router) {
    await setupRouter(language, targetDir, __dirname)
    if(autoRoute) await setupAutoRoute(language, targetDir)
  } else {
    unusedPlaceholders.import.push('/* __ROUTER_IMPORT__ */')
    unusedPlaceholders.use.push('/* __ROUTER_USE__ */')
  }

  // Pinia
  if(plugins.pinia) {
    await setupPinia(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __PINIA_IMPORT__ */')
    unusedPlaceholders.use.push('/* __PINIA_USE__ */')
  }

  // Element Plus
  if(plugins.elementPlus) {
    await setupElementPlus(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __ELEMENT_IMPORT__ */')
    unusedPlaceholders.use.push('/* __ELEMENT_USE__ */')
  }

  // Vant
  if(plugins.vant) {
    await setupVant(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __VANT_IMPORT__ */')
    unusedPlaceholders.use.push('/* __VANT_USE__ */')
  }

  // Axios
  if(plugins.axios) {
    await setupAxios(language, targetDir, __dirname)
  }

  // Tailwind
  if(plugins.tailwind) {
    await setupTailwind(language, targetDir, __dirname)
  }

  // HTTPS
  if(plugins.https) {
    await setupHttps(targetDir)
  }

  return unusedPlaceholders
}