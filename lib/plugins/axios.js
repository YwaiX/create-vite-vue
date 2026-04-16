// lib/plugins/axios.js
import { copyTemplate } from '../utils'

/**
 * 配置 Axios
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupAxios (language, targetDir, __dirname) {
  console.log('  🌐 配置 Axios...')

  // 复制模板
  const axiosTemplate = language === 'ts' ? 'axios-ts' : 'axios-js'
  await copyTemplate(axiosTemplate, targetDir, __dirname)
  console.log('    ✅ Axios 模板复制完成')
}