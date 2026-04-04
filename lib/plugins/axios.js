// lib/plugins/axios.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupAxios (language, targetDir, __dirname) {
  console.log('  🌐 配置 Axios...')

  // 复制模板
  const axiosTemplate = language === 'ts' ? 'axios-ts' : 'axios-js'
  const templatePath = path.resolve(__dirname, `../template/${axiosTemplate}`)

  if(!existsSync(templatePath)) {
    throw new Error(`模板不存在: ${templatePath}`)
  }

  await fs.cp(templatePath, targetDir, { recursive: true })
  console.log('    ✅ Axios 模板复制完成')
}