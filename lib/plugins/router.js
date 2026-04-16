// lib/plugins/router.js
import { configurationMain, copyTemplate } from '../utils'

/**
 * 配置 Vue Router
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupRouter (language, targetDir, __dirname) {
  console.log('  🛤️ 配置 Router...')

  // 复制模板
  const routerTemplate = language === 'ts' ? 'router-ts' : 'router-js'
  await copyTemplate(routerTemplate, targetDir, __dirname)
  console.log('    ✅ Router 模板复制完成')

  // 修改 main 文件
  const routerImport = "import router from './router'"
  const routerUse = 'app.use(router)'
  let array = [
    {
      template: '/* __ROUTER_IMPORT__ */',
      content: routerImport
    },
    {
      template: '/* __ROUTER_USE__ */',
      content: routerUse
    }
  ]
  configurationMain(language, targetDir, array)
  console.log('    ✅ main 文件已更新')
}