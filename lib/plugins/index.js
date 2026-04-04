// lib/plugins/index.js
import { setupAutoRoute } from './autoRoute.js'
import { setupHttps } from './https.js'
import { setupTailwind } from './tailwind.js'

export function setupPlugins (features, extraPlugins, context) {
  const { language, targetDir, autoRoute, enableHttps } = context

  // Tailwind
  if(extraPlugins.includes('tailwind')) {
    setupTailwind(targetDir)
  }

  // HTTPS
  if(enableHttps) {
    setupHttps(targetDir)
  }

  // 自动路由
  if(features.router && autoRoute) {
    setupAutoRoute(language, targetDir)
  }
}