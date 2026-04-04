// lib/plugins/tailwind.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupTailwind (language, targetDir, __dirname) {
  console.log('  🎨 配置 Tailwind CSS...')

  // 复制模板
  const tailwindTemplate = language === 'ts' ? 'tailwind-ts' : 'tailwind-js'
  const templatePath = path.resolve(__dirname, `../template/${tailwindTemplate}`)

  if(!existsSync(templatePath)) {
    throw new Error(`模板不存在: ${templatePath}`)
  }

  await fs.cp(templatePath, targetDir, { recursive: true })
  console.log('    ✅ Tailwind 模板复制完成')

  // 更新 style.css
  const stylePath = path.join(targetDir, 'src/style.css')
  if(!existsSync(stylePath)) {
    throw new Error(`style.css 不存在: ${stylePath}`)
  }

  const original = await fs.readFile(stylePath, 'utf-8')
  if(!original.includes('@import "tailwindcss";')) {
    await fs.writeFile(stylePath, `@import "tailwindcss";\n${original}`)
    console.log('    ✅ style.css 已更新')
  }
}