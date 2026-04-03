// lib/viteConfig.js
import fs from 'fs'
import path from 'path'

export function configureVite (language, autoRoute, enableHttps, targetDir) {
  const viteConfigPath = path.join(targetDir, `vite.config.${language === 'ts' ? 'ts' : 'js'}`)
  if(!fs.existsSync(viteConfigPath)) return
  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

  // mkcert
  if(enableHttps && !viteConfig.includes("vite-plugin-mkcert")) {
    viteConfig = viteConfig.replace(/(import .*?from .*?\n)/, `$1import mkcert from 'vite-plugin-mkcert'\n`)
    viteConfig = viteConfig.replace(/plugins:\s*\[/, `plugins: [\n    mkcert(),`)
  }

  // 自动路由
  if(autoRoute) {
    if(!viteConfig.includes("import fs from 'fs'")) viteConfig = `import fs from 'fs'\n${viteConfig}`
    if(!viteConfig.includes("import Pages from 'vite-plugin-pages'")) viteConfig = viteConfig.replace(/(import .*?from .*?\n)/, `$1import Pages from 'vite-plugin-pages'\n`)
    if(!viteConfig.includes("Pages({")) viteConfig = viteConfig.replace(/plugins:\s*\[/, `plugins: [\n    Pages({\n      dirs: 'src/views',\n      extensions: ['vue'],\n      exclude: ['**/_*.vue'],\n      async extendRoute(route) {\n        const componentPath = path.resolve(process.cwd(), route.component.slice(1))\n        const dirPath = path.dirname(componentPath)\n        const metaFile = path.resolve(dirPath, 'meta.json')\n        if(fs.existsSync(metaFile)) {\n          try {\n            const metaContent = fs.readFileSync(metaFile, 'utf-8')\n            const meta = JSON.parse(metaContent)\n            route.meta = { ...(route.meta || {}), ...meta }\n          } catch(err) {\n            console.warn(\`加载 \${metaFile} 失败:\`, err)\n          }\n        }\n        return { ...route }\n      }\n    }),`)
  }

  fs.writeFileSync(viteConfigPath, viteConfig)
}