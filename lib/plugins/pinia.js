// lib/plugins/pinia.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupPinia (language, targetDir, __dirname) {
  console.log('  📦 配置 Pinia...')

  // 复制模板
  const piniaTemplate = language === 'ts' ? 'pinia-ts' : 'pinia-js'
  const templatePath = path.resolve(__dirname, `../template/${piniaTemplate}`)

  if(!existsSync(templatePath)) {
    throw new Error(`模板不存在: ${templatePath}`)
  }

  await fs.cp(templatePath, targetDir, { recursive: true })
  console.log('    ✅ Pinia 模板复制完成')

  // 修改 main 文件
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!existsSync(mainPath)) {
    throw new Error(`main 文件不存在: ${mainPath}`)
  }

  let content = await fs.readFile(mainPath, 'utf-8')
  content = content.replace(
    '/* __PINIA_IMPORT__ */',
    `import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'`
  )
  content = content.replace('/* __PINIA_USE__ */', 'app.use(createPinia().use(persistedstate))')
  await fs.writeFile(mainPath, content)
  console.log('    ✅ main 文件已更新')
}