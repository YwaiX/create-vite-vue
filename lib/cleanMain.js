// lib/cleanMain.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

/**
 * 清理 main 文件中未使用的占位符
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标项目目录路径
 * @param {UnusedPlaceholders} unusedPlaceholders - 未使用的占位符集合
 */
export async function cleanMainFile (language, targetDir, unusedPlaceholders) {
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainPath = path.join(targetDir, `src/${mainFile}`)

  if(!existsSync(mainPath)) {
    console.log('  ⚠️ main 文件不存在，跳过清理')
    return
  }

  let content = await fs.readFile(mainPath, 'utf-8')

  // 直接删除所有未使用的占位符
  const allUnused = [...unusedPlaceholders.import, ...unusedPlaceholders.use]

  for(const placeholder of allUnused) {
    const regex = new RegExp(`^\\s*${escapeRegExp(placeholder)}\\s*$\\n?`, 'gm')
    content = content.replace(regex, '')
  }

  // 清理多余空行
  content = content.replace(/\n{3,}/g, '\n\n')
  content = content.replace(/^\n+/, '')
  content = content.replace(/\n+$/, '\n')

  await fs.writeFile(mainPath, content)
  console.log('  🧹 已清理未使用的占位符')
}

/**
 * 转义正则表达式中的特殊字符
 * @param {string} str - 需要转义的字符串
 * @returns {string} 转义后的字符串
 */
function escapeRegExp (str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}