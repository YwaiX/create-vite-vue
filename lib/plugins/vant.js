// lib/plugins/vant.js
import { configurationMain } from "../utils"


/**
 * 配置 Vant
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupVant (language, targetDir, __dirname) {
  console.log('  📱 配置 Vant...')

  // 修改 main 文件
  const vantImport = `import Vant from 'vant'\nimport 'vant/lib/index.css'`
  const vantUSE = 'app.use(Vant)'
  let array = [
    {
      template: '/* __VANT_IMPORT__ */',
      content: vantImport
    },
    {
      template: '/* __VANT_USE__ */',
      content: vantUSE
    }
  ]
  configurationMain(language, targetDir, array)
  console.log('    ✅ main 文件已更新')
}