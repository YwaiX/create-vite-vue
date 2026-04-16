// lib/plugins/autoRoute.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

/**
 * 设置自动路由（vite-plugin-pages）
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 */
export async function setupAutoRoute (language, targetDir) {
  console.log('  🚀 配置自动路由...')

  // 修改 router/index 文件
  const routerIndexPath = path.join(targetDir, `src/router/index.${language === 'ts' ? 'ts' : 'js'}`)

  // 确保文件存在
  if(!existsSync(routerIndexPath)) {
    throw new Error(`router/index.js 不存在，请确保已选择 Router 插件且模板复制成功`)
  }

  const content = `import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

routes.unshift({ path: '/', redirect: '/home' })

export default createRouter({ history: createWebHistory(), routes })`

  await fs.writeFile(routerIndexPath, content)
  console.log('    ✅ router/index.js 已更新')

  // 修改 vite.config
  const viteConfigPathTs = path.join(targetDir, 'vite.config.ts')
  const viteConfigPathJs = path.join(targetDir, 'vite.config.js')
  const viteConfigPath = existsSync(viteConfigPathTs) ? viteConfigPathTs : viteConfigPathJs

  if(!viteConfigPath || !existsSync(viteConfigPath)) {
    throw new Error(`vite.config 文件不存在`)
  }

  let viteConfig = await fs.readFile(viteConfigPath, 'utf-8')

  if(!viteConfig.includes("import fs from 'fs'")) {
    viteConfig = `import fs from 'fs'\n${viteConfig}`
  }

  if(!viteConfig.includes("vite-plugin-pages")) {
    viteConfig = viteConfig.replace(/(import .*?from .*?\n)/, `$1import Pages from 'vite-plugin-pages'\n`)
  }

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

  await fs.writeFile(viteConfigPath, viteConfig)
  console.log('    ✅ vite.config 已更新')
}