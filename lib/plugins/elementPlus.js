// lib/plugins/elementPlus.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupElementPlus (language, targetDir, __dirname) {
  console.log('  🎨 配置 Element Plus...')

  // 修改 main 文件
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!existsSync(mainPath)) {
    throw new Error(`main 文件不存在: ${mainPath}`)
  }

  let content = await fs.readFile(mainPath, 'utf-8')
  content = content.replace(
    '/* __ELEMENT_IMPORT__ */',
    `import ElementPlus from 'element-plus'\nimport zhCn from 'element-plus/es/locale/lang/zh-cn'\nimport 'element-plus/dist/index.css'\nimport * as ElementPlusIconsVue from '@element-plus/icons-vue'`
  )
  content = content.replace(
    '/* __ELEMENT_USE__ */',
    `app.use(ElementPlus, { locale: zhCn })\nfor (const [key, component] of Object.entries(ElementPlusIconsVue)) {\n  app.component(key, component)\n}`
  )
  await fs.writeFile(mainPath, content)
  console.log('    ✅ main 文件已更新')
}