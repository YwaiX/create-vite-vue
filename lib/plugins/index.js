// lib/plugins/index.js
import { setupAutoRoute } from './autoRoute.js'
import { setupAxios } from './axios.js'
import { setupElementPlus } from './elementPlus.js'
import { setupHttps } from './https.js'
import { setupPinia } from './pinia.js'
import { setupRouter } from './router.js'
import { setupTailwind } from './tailwind.js'
import { setupVant } from './vant.js'

export async function setupPlugins (features, extraPlugins, context) {
  const { language, targetDir, autoRoute, enableHttps, __dirname } = context

  // 收集未使用的占位符
  const unusedPlaceholders = {
    import: [],
    use: []
  }

  console.log('\n🔌 配置插件...')

  // Router（先复制模板，再配置自动路由）
  if(features.router) {
    await setupRouter(language, targetDir, __dirname)
    if(autoRoute) await setupAutoRoute(language, targetDir)
  } else {
    unusedPlaceholders.import.push('/* __ROUTER_IMPORT__ */')
    unusedPlaceholders.use.push('/* __ROUTER_USE__ */')
  }

  // Pinia
  if(features.pinia) {
    await setupPinia(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __PINIA_IMPORT__ */')
    unusedPlaceholders.use.push('/* __PINIA_USE__ */')
  }

  // Element Plus
  if(features.ui.includes('element')) {
    await setupElementPlus(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __ELEMENT_IMPORT__ */')
    unusedPlaceholders.use.push('/* __ELEMENT_USE__ */')
  }

  // Vant
  if(features.ui.includes('vant')) {
    await setupVant(language, targetDir, __dirname)
  } else {
    unusedPlaceholders.import.push('/* __VANT_IMPORT__ */')
    unusedPlaceholders.use.push('/* __VANT_USE__ */')
  }

  // Axios
  if(features.axios) {
    await setupAxios(language, targetDir, __dirname)
  }

  // Tailwind
  if(extraPlugins.includes('tailwind')) {
    await setupTailwind(language, targetDir, __dirname)
  }

  // HTTPS
  if(enableHttps) {
    await setupHttps(targetDir)
  }

  return unusedPlaceholders
}