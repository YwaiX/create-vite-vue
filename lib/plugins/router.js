// lib/plugins/router.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupRouter (language, targetDir, __dirname) {
  console.log('  🛤️ 配置 Router...')

  // 复制模板
  const routerTemplate = language === 'ts' ? 'router-ts' : 'router-js'
  const templatePath = path.resolve(__dirname, `../template/${routerTemplate}`)
  if(!existsSync(templatePath)) {
    throw new Error(`模板不存在: ${templatePath}`)
  }

  await fs.cp(templatePath, targetDir, { recursive: true })
  console.log('    ✅ Router 模板复制完成')

  // 修改 main 文件
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!existsSync(mainPath)) {
    throw new Error(`main 文件不存在: ${mainPath}`)
  }

  let content = await fs.readFile(mainPath, 'utf-8')
  content = content.replace('/* __ROUTER_IMPORT__ */', "import router from './router'")
  content = content.replace('/* __ROUTER_USE__ */', 'app.use(router)')
  await fs.writeFile(mainPath, content)
  console.log('    ✅ main 文件已更新')
}