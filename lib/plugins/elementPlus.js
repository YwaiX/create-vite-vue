// lib/plugins/elementPlus.js
import { configurationMain } from "../utils"

/**
 * 配置 Element Plus
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {string} __dirname - 当前模块目录路径
 */
export async function setupElementPlus (language, targetDir, __dirname) {
  console.log('  🎨 配置 Element Plus...')

  // 修改 main 文件
  const elementPlusImport = `import ElementPlus from 'element-plus'\nimport zhCn from 'element-plus/es/locale/lang/zh-cn'\nimport 'element-plus/dist/index.css'\nimport * as ElementPlusIconsVue from '@element-plus/icons-vue'`
  const elementPlusUse = `app.use(ElementPlus, { locale: zhCn })\nfor (const [key, component] of Object.entries(ElementPlusIconsVue)) {\n  app.component(key, component)\n}`
  let array = [
    {
      template: '/* __ELEMENT_IMPORT__ */',
      content: elementPlusImport
    },
    {
      template: '/* __ELEMENT_USE__ */',
      content: elementPlusUse
    }
  ]
  configurationMain(language, targetDir, array)
  console.log('    ✅ main 文件已更新')
}