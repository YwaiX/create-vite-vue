// lib/mainFile.js
import fs from 'fs'
import path from 'path'

export async function generateMainFile (features, extraPlugins, language, targetDir) {
  const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
  const mainTplPath = path.join(targetDir, `src/${mainFile}.tpl`)
  if(!fs.existsSync(mainTplPath)) return
  let main = fs.readFileSync(mainTplPath, 'utf-8')

  const replacements = {
    '/* __ROUTER_IMPORT__ */': features.router ? "import router from './router'" : '',
    '/* __PINIA_IMPORT__ */': features.pinia ? "import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'" : '',
    '/* __ELEMENT_IMPORT__ */': features.ui.includes('element')
      ? `import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'`
      : '',
    '/* __VANT_IMPORT__ */': features.ui.includes('vant')
      ? `import Vant from 'vant'
import 'vant/lib/index.css'`
      : '',
    '/* __ROUTER_USE__ */': features.router ? 'app.use(router)' : '',
    '/* __PINIA_USE__ */': features.pinia ? 'app.use(createPinia().use(persistedstate))' : '',
    '/* __ELEMENT_USE__ */': features.ui.includes('element')
      ? `app.use(ElementPlus, { locale: zhCn })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}` : '',
    '/* __VANT_USE__ */': features.ui.includes('vant') ? 'app.use(Vant)' : ''
  }

  function escapeRegExp (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  for(const [placeholder, content] of Object.entries(replacements)) {
    if(content) main = main.replace(placeholder, content)
    else main = main.replace(new RegExp(`^\\s*${escapeRegExp(placeholder)}\\s*$\\n?`, 'gm'), '')
  }

  main = main.replace(/(\s*)const app = createApp\(App\)/, '\n\n$1const app = createApp(App)')
  main = main.replace(/\n{3,}/g, '\n\n')

  fs.writeFileSync(path.join(targetDir, `src/${mainFile}`), main)
  fs.unlinkSync(mainTplPath)
}