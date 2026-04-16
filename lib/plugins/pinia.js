// lib/plugins/pinia.js
import { configurationMain } from "../utils"

/**
 * 配置 Pinia
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupPinia (language, targetDir, __dirname) {
  console.log('  📦 配置 Pinia...')

  // 复制模板
  const piniaTemplate = language === 'ts' ? 'pinia-ts' : 'pinia-js'
  await copyTemplate(piniaTemplate, targetDir, __dirname)
  console.log('    ✅ Pinia 模板复制完成')

  // 修改 main 文件
  const piniaImport = `import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'`
  const piniaUse = 'app.use(createPinia().use(persistedstate))'
  let array = [
    {
      template: '/* __PINIA_IMPORT__ */',
      content: piniaImport
    },
    {
      template: '/* __PINIA_USE__ */',
      content: piniaUse
    }
  ]
  configurationMain(language, targetDir, array)
  console.log('    ✅ main 文件已更新')
}