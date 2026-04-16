// lib/plugins/tailwind.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { copyTemplate } from '../utils'

/**
 * 配置 Tailwind CSS
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupTailwind (language, targetDir, __dirname) {
  console.log('  🎨 配置 Tailwind CSS...')

  // 复制模板
  const tailwindTemplate = language === 'ts' ? 'tailwind-ts' : 'tailwind-js'
  await copyTemplate(tailwindTemplate, targetDir, __dirname)
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