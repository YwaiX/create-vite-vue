// lib/plugins/vant.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupVant (language, targetDir, __dirname) {
  console.log('  📱 配置 Vant...')

  // 修改 main 文件
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!existsSync(mainPath)) {
    throw new Error(`main 文件不存在: ${mainPath}`)
  }

  let content = await fs.readFile(mainPath, 'utf-8')
  content = content.replace(
    '/* __VANT_IMPORT__ */',
    `import Vant from 'vant'\nimport 'vant/lib/index.css'`
  )
  content = content.replace('/* __VANT_USE__ */', 'app.use(Vant)')
  await fs.writeFile(mainPath, content)
  console.log('    ✅ main 文件已更新')
}