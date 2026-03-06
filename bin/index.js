#!/usr/bin/env node
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'
import { fileURLToPath } from 'url'

// 检测 Node 版本
const requiredVersion = '22.19.0'

function compareVersion (v1, v2) {
  const a = v1.split('.').map(Number)
  const b = v2.split('.').map(Number)

  for(let i = 0; i < Math.max(a.length, b.length); i++) {
    const n1 = a[i] || 0
    const n2 = b[i] || 0
    if(n1 > n2) return 1
    if(n1 < n2) return -1
  }
  return 0
}

const currentVersion = process.version.replace('v', '')

if(compareVersion(currentVersion, requiredVersion) < 0) {
  console.error(`❌ Node.js 版本过低`)
  console.error(`当前版本: ${currentVersion}`)
  console.error(`最低要求: ${requiredVersion}`)
  console.error(`请升级 Node.js 后再运行`)
  process.exit(1)
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

  ; (async () => {
    // 1️⃣ 输入项目名
    let projectName
    while(true) {
      const res = await prompts({
        type: 'text',
        name: 'projectName',
        message: '📦 项目名称',
        validate: v => v ? true : '项目名不能为空'
      })
      projectName = res.projectName
      if(!projectName) process.exit(1)

      const targetDir = path.resolve(process.cwd(), projectName)
      if(fs.existsSync(targetDir)) {
        console.log('❌ 目录已存在，请重新输入')
        continue
      }
      break
    }

    const targetDir = path.resolve(process.cwd(), projectName)

    // 选择语言
    const { language } = await prompts({
      type: 'select',
      name: 'language',
      message: '请选择项目语言',
      choices: [
        { title: 'JavaScript', value: 'js' },
        { title: 'TypeScript', value: 'ts' }
      ]
    })

    // 2️⃣ 功能选择（多选）
    const { featureList } = await prompts({
      type: 'multiselect',
      name: 'featureList',
      message: '请选择基础功能（↑↓选择，空格确认，回车完成）',
      instructions: false,
      choices: [
        { title: 'Vue Router', value: 'router' },
        { title: 'Pinia（含持久化）', value: 'pinia' },
        { title: 'Axios', value: 'axios' },
        { title: 'Element Plus（PC UI）', value: 'element' },
        { title: 'Vant（Mobile UI）', value: 'vant' },
        { title: 'VueUse（实用 Composition API）', value: 'vueuse' },
        { title: 'Lodash（工具库）', value: 'lodash' },
        { title: 'Day.js（日期处理）', value: 'dayjs' },
        { title: 'Tailwind CSS（原子化 CSS）', value: 'tailwind' }
      ]
    })

    // 转换成原来的结构（保证后面代码基本不用动）
    const features = {
      router: featureList?.includes('router') || false,
      pinia: featureList?.includes('pinia') || false,
      axios: featureList?.includes('axios') || false,
      ui: featureList?.filter(v => ['element', 'vant'].includes(v)) || []
    }

    const extraPlugins = featureList?.filter(v =>
      ['vueuse', 'lodash', 'dayjs', 'tailwind'].includes(v)
    ) || []

    // 询问是否开启自动路由
    let autoRoute = false
    if(features.router) {
      const { enableAutoRoute } = await prompts({
        type: 'toggle',
        name: 'enableAutoRoute',
        message: '是否开启自动配置路由（vite-plugin-pages）？',
        initial: false,
        active: '是',
        inactive: '否'
      })
      autoRoute = enableAutoRoute
    }

    // 3️⃣ 是否立即运行 dev
    const { runDev } = await prompts({
      type: 'select',
      name: 'runDev',
      message: '是否立即运行 npm run dev？',
      choices: [{ title: 'Yes', value: true }, { title: 'No', value: false }]
    })

    // 4️⃣ 拷贝 base 模板
    const baseTemplate = language === 'ts' ? 'base-ts' : 'base-js'
    fs.cpSync(
      path.resolve(__dirname, `../template/${baseTemplate}`),
      targetDir,
      { recursive: true }
    )

    // 替换 index.html 的 title
    const indexPath = path.join(targetDir, 'index.html')
    if(fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf-8')
      fs.writeFileSync(
        indexPath,
        indexContent.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`)
      )
    }

    // 追加 Tailwind CSS 导入
    if(extraPlugins.includes('tailwind')) {
      const stylePath = path.join(targetDir, 'src/style.css')
      const original = fs.readFileSync(stylePath, 'utf-8')
      if(!original.startsWith('@import "tailwindcss";')) {
        fs.writeFileSync(stylePath, `@import "tailwindcss";\n${original}`)
      }
    }

    // 5️⃣ 拷贝可选模板（基础功能）
    const copy = name => {
      fs.cpSync(path.resolve(__dirname, `../template/${name}`), targetDir, { recursive: true })
    }
    features.router && copy(language === 'ts' ? 'router-ts' : 'router-js')
    features.pinia && copy(language === 'ts' ? 'pinia-ts' : 'pinia-js')
    features.axios && copy(language === 'ts' ? 'axios-ts' : 'axios-js')

    // 拷贝增强插件模板
    for(const plugin of extraPlugins) {
      const templateName = `${plugin}-${language === 'ts' ? 'ts' : 'js'}`
      const templatePath = path.resolve(__dirname, `../template/${templateName}`)
      if(fs.existsSync(templatePath)) {
        fs.cpSync(templatePath, targetDir, { recursive: true })
      }
    }

    // 6️⃣ 生成 main.js / main.ts
    const mainFile = language === 'ts' ? 'main.ts' : 'main.js'
    const mainTplPath = path.join(targetDir, `src/${mainFile}.tpl`)
    let main = fs.readFileSync(mainTplPath, 'utf-8')

    const replacements = {
      '/* __ROUTER_IMPORT__ */': features.router ? "import router from './router'" : '',
      '/* __PINIA_IMPORT__ */': features.pinia
        ? "import { createPinia } from 'pinia'\nimport persistedstate from 'pinia-plugin-persistedstate'"
        : '',
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
      '/* __PINIA_USE__ */': features.pinia
        ? 'app.use(createPinia().use(persistedstate))'
        : '',
      '/* __ELEMENT_USE__ */': features.ui.includes('element')
        ? `app.use(ElementPlus, { locale: zhCn })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}`
        : '',
      '/* __VANT_USE__ */': features.ui.includes('vant')
        ? 'app.use(Vant)'
        : ''
    }

    function escapeRegExp (str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    for(const [placeholder, content] of Object.entries(replacements)) {
      if(content) {
        main = main.replace(placeholder, content)
      } else {
        const re = new RegExp(`^\\s*${escapeRegExp(placeholder)}\\s*$\\n?`, 'gm')
        main = main.replace(re, '')
      }
    }

    main = main.replace(/(\s*)const app = createApp\(App\)/, '\n\n$1const app = createApp(App)')
    main = main.replace(/\n{3,}/g, '\n\n')

    fs.writeFileSync(path.join(targetDir, `src/${mainFile}`), main)
    fs.unlinkSync(mainTplPath)

    // 7️⃣ 生成 package.json
    const pkgTpl = path.join(targetDir, 'package.json.tpl')
    if(fs.existsSync(pkgTpl)) {
      let pkg = fs.readFileSync(pkgTpl, 'utf-8')

      const optionalDeps = {}
      if(features.router) optionalDeps['vue-router'] = '^5.0.3'
      if(features.pinia) {
        optionalDeps['pinia'] = '^3.0.4'
        optionalDeps['pinia-plugin-persistedstate'] = '^4.7.1'
      }
      if(features.axios) optionalDeps['axios'] = '^1.13.6'
      if(features.ui.includes('element')) {
        optionalDeps['element-plus'] = '^2.13.3'
        optionalDeps['@element-plus/icons-vue'] = '^2.3.2'
      }
      if(features.ui.includes('vant')) {
        optionalDeps['vant'] = '^4.9.22'
      }
      // 增强插件依赖
      if(extraPlugins.includes('vueuse')) optionalDeps['@vueuse/core'] = '^14.2.1'
      if(extraPlugins.includes('dayjs')) optionalDeps['dayjs'] = '^1.11.19'
      if(extraPlugins.includes('lodash')) optionalDeps['lodash'] = '^4.17.23'
      if(autoRoute) optionalDeps['vite-plugin-pages'] = '^0.33.3'

      let depsStr = ''
      const keys = Object.keys(optionalDeps)
      if(keys.length > 0) {
        depsStr = ',\n' + keys.map(k => `    "${k}": "${optionalDeps[k]}"`).join(',\n')
      }

      pkg = pkg
        .replace('__PROJECT_NAME__', projectName)
        .replace('__OPTIONAL_DEP__', depsStr)

      fs.writeFileSync(path.join(targetDir, 'package.json'), pkg)
      fs.unlinkSync(pkgTpl)
    }

    // 8️⃣ 配置自动路由
    if(autoRoute) {
      const viteConfigPath = path.join(targetDir, `vite.config.${language === 'ts' ? 'ts' : 'js'}`)
      if(fs.existsSync(viteConfigPath)) {
        let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')
        if(!viteConfig.includes("import fs from 'fs'")) {
          viteConfig = `import fs from 'fs'\n${viteConfig}`
        }
        // 确保顶部 import Pages
        if(!viteConfig.includes("import Pages from 'vite-plugin-pages'")) {
          viteConfig = viteConfig.replace(/(import .*?from .*?\n)/, `$1import Pages from 'vite-plugin-pages'\n`)
        }
        viteConfig = viteConfig.replace(/plugins:\s*\[/, `plugins: [
    Pages({
      dirs: 'src/views',
      extensions: ['vue'],
      exclude: ['**/_*.vue'],
      async extendRoute(route) {
        const componentPath = path.resolve(process.cwd(), route.component.slice(1))
        const dirPath = path.dirname(componentPath)
        const metaFile = path.resolve(dirPath, 'meta.json')
        if(fs.existsSync(metaFile)) {
          try {
            const metaContent = fs.readFileSync(metaFile, 'utf-8')
            const meta = JSON.parse(metaContent)
            route.meta = { ...(route.meta || {}), ...meta }
          } catch(err) {
            console.warn(\`加载 \${metaFile} 失败:\`, err)
          }
        }
        return { ...route }
      }
    }),`)
        fs.writeFileSync(viteConfigPath, viteConfig)
      }

      // 创建 Home/meta.json
      const homeMetaPath = path.join(targetDir, 'src/views/home/meta.json')
      if(!fs.existsSync(homeMetaPath)) {
        fs.writeFileSync(homeMetaPath, JSON.stringify({ title: '首页' }, null, 2))
      }
      if(language === 'ts') {
        // 生成 types 目录
        const typesDir = path.join(targetDir, 'src/types')
        if(!fs.existsSync(typesDir)) fs.mkdirSync(typesDir, { recursive: true })

        // 创建 vite-plugin-pages.d.ts
        const vitePagesDtsPath = path.join(typesDir, 'vite-plugin-pages.d.ts')
        const vitePagesDtsContent = `declare module '~pages' {
  import type { RouteRecordRaw } from 'vue-router'
  const routes: RouteRecordRaw[]
  export default routes
}
`
        fs.writeFileSync(vitePagesDtsPath, vitePagesDtsContent)
      }

    }

    // 9️⃣ 替换 router/index.js
    if(features.router) {
      const routerIndexPath = path.join(targetDir, `src/router/index.${language === 'ts' ? 'ts' : 'js'}`)
      if(autoRoute) {
        fs.writeFileSync(
          routerIndexPath,
          `import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

routes.unshift({
  path: '/',
  redirect: '/home'
})

export default createRouter({
  history: createWebHistory(),
  routes
})
`
        )
      } else {
        fs.writeFileSync(
          routerIndexPath,
          `import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/home/index.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
`
        )
      }
    }

    // 1️⃣0️⃣ 安装依赖
    console.log('📦 安装依赖中...')
    let installCmd = 'npm install'

    if(extraPlugins.includes('tailwind')) {
      installCmd += ' tailwindcss @tailwindcss/postcss postcss'
    }

    execSync(installCmd, { cwd: targetDir, stdio: 'inherit' })

    // 1️⃣1️⃣ 运行 dev
    if(runDev) {
      console.log('🚀 启动开发服务器...')
      execSync('npm run dev', { cwd: targetDir, stdio: 'inherit' })
    } else {
      console.log(`\n✅ 项目创建完成\n👉 cd ${projectName}\n👉 npm run dev\n`)
    }
  })()