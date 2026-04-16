// lib/template.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { copyTemplate } from './utils'

/**
 * 复制基础模板到目标目录
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function copyBaseTemplate (language, targetDir, __dirname) {
  const baseTemplate = language === 'ts' ? 'base-ts' : 'base-js'
  await copyTemplate(baseTemplate, targetDir, __dirname)

  // 重命名 main 文件（去掉 .tpl 后缀）
  const mainTplPath = path.join(targetDir, `src/main.${language === 'ts' ? 'ts' : 'js'}.tpl`)
  const mainPath = path.join(targetDir, `src/main.${language === 'ts' ? 'ts' : 'js'}`)

  if(existsSync(mainTplPath)) {
    await fs.rename(mainTplPath, mainPath)
  }

  // 重命名 package.json（去掉 .tpl 后缀）
  const pkgTplPath = path.join(targetDir, 'package.json.tpl')
  const pkgPath = path.join(targetDir, 'package.json')

  if(existsSync(pkgTplPath)) {
    await fs.rename(pkgTplPath, pkgPath)
  }

  console.log('  ✅ 基础模板复制完成')
}

/**
 * 更新 index.html 中的标题
 * @param {string} projectName - 项目名称
 * @param {string} targetDir - 目标目录
 */
export async function updateIndexHtml (projectName, targetDir) {
  const indexPath = path.join(targetDir, 'index.html')
  if(!existsSync(indexPath)) return

  const indexContent = await fs.readFile(indexPath, 'utf-8')
  await fs.writeFile(indexPath, indexContent.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`))
  console.log('  ✅ index.html 更新完成')
}