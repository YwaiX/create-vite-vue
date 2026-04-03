// lib/router.js
import fs from 'fs'
import path from 'path'

export function configureRouter (routerEnabled, autoRoute, language, targetDir) {
  if(!routerEnabled) return
  const routerIndexPath = path.join(targetDir, `src/router/index.${language === 'ts' ? 'ts' : 'js'}`)
  const content = autoRoute
    ? `import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

routes.unshift({ path: '/', redirect: '/home' })

export default createRouter({ history: createWebHistory(), routes })`
    : `import { createRouter, createWebHistory } from 'vue-router'

const routes = [ { path: '/', component: () => import('@/views/home/index.vue') } ]

export default createRouter({ history: createWebHistory(), routes })`
  fs.writeFileSync(routerIndexPath, content)
}