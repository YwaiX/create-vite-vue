// lib/plugins/autoRoute.js
import fs from 'fs'
import path from 'path'

export function setupAutoRoute (language, targetDir) {
  setupRouter(language, targetDir)
  setupVite(language, targetDir)
}

// ================= router =================
function setupRouter (language, targetDir) {
  const routerIndexPath = path.join(
    targetDir,
    `src/router/index.${language === 'ts' ? 'ts' : 'js'}`
  )

  const content = `import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

routes.unshift({ path: '/', redirect: '/home' })

export default createRouter({ history: createWebHistory(), routes })`

  fs.writeFileSync(routerIndexPath, content)
}

// ================= vite =================
function setupVite (language, targetDir) {
  const viteConfigPath = path.join(
    targetDir,
    `vite.config.${language === 'ts' ? 'ts' : 'js'}`
  )

  if(!fs.existsSync(viteConfigPath)) return

  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

  // import fs
  if(!viteConfig.includes("import fs from 'fs'")) {
    viteConfig = `import fs from 'fs'\n${viteConfig}`
  }

  // import Pages
  if(!viteConfig.includes("vite-plugin-pages")) {
    viteConfig = viteConfig.replace(
      /(import .*?from .*?\n)/,
      `$1import Pages from 'vite-plugin-pages'\n`
    )
  }

  // 插件注入
  if(!viteConfig.includes("Pages({")) {
    viteConfig = viteConfig.replace(
      /plugins:\s*\[/,
      `plugins: [\n    Pages({
      dirs: 'src/views',
      extensions: ['vue'],
      exclude: ['**/_*.vue'],
      async extendRoute(route) {
        const componentPath = path.resolve(process.cwd(), route.component.slice(1))
        const dirPath = path.dirname(componentPath)
        const metaFile = path.resolve(dirPath, 'meta.json')
        if(fs.existsSync(metaFile)) {
          try {
            const metaContent = fs.readFileSync(metaFile, 'utf-8')
            const meta = JSON.parse(metaContent)
            route.meta = { ...(route.meta || {}), ...meta }
          } catch(err) {
            console.warn(\`加载 \${metaFile} 失败:\`, err)
          }
        }
        return { ...route }
      }
    }),`
    )
  }

  fs.writeFileSync(viteConfigPath, viteConfig)
}