// lib/package.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

/**
 * 生成 package.json 文件
 * @param {string} projectName - 项目名称
 * @param {PluginsConfig} plugins - 插件配置对象
 * @param {boolean} autoRoute - 是否启用自动路由
 * @param {boolean} enableHttps - 是否启用 HTTPS
 * @param {'ts' | 'js'} language - 项目语言
 * @param {string} targetDir - 目标目录
 * @param {PackageManager} pkgManager - 包管理器类型
 */
export async function generatePackageJson (projectName, plugins, autoRoute, enableHttps, language, targetDir, pkgManager) {
  const pkgPath = path.join(targetDir, 'package.json')

  if(!existsSync(pkgPath)) {
    throw new Error(`package.json 不存在: ${pkgPath}`)
  }

  let pkgContent = await fs.readFile(pkgPath, 'utf-8')

  const optionalDeps = {}

  if(plugins.router) optionalDeps['vue-router'] = '^5.0.3'
  if(plugins.pinia) {
    optionalDeps['pinia'] = '^3.0.4'
    optionalDeps['pinia-plugin-persistedstate'] = '^4.7.1'
  }
  if(plugins.axios) optionalDeps['axios'] = '^1.13.6'
  if(plugins.elementPlus) {
    optionalDeps['element-plus'] = '^2.13.5'
    optionalDeps['@element-plus/icons-vue'] = '^2.3.2'
  }
  if(plugins.vant) optionalDeps['vant'] = '^4.9.22'
  if(plugins.vueuse) optionalDeps['@vueuse/core'] = '^14.2.1'
  if(plugins.dayjs) optionalDeps['dayjs'] = '^1.11.20'
  if(plugins.lodash) optionalDeps['lodash'] = '^4.17.23'
  if(plugins.tailwind) {
    optionalDeps['tailwindcss'] = '^4.2.2'
    optionalDeps['@tailwindcss/postcss'] = '^4.2.2'
    optionalDeps['postcss'] = '^8.5.8'
  }
  if(plugins.mitt) optionalDeps['mitt'] = '^3.0.1'
  if(enableHttps) optionalDeps['vite-plugin-mkcert'] = '^1.17.10'
  if(autoRoute) optionalDeps['vite-plugin-pages'] = '^0.33.3'

  const depsKeys = Object.keys(optionalDeps)
  let depsStr = ''

  if(depsKeys.length > 0) {
    depsStr = ',\n' + depsKeys.map(k => `    "${k}": "${optionalDeps[k]}"`).join(',\n')
  }

  pkgContent = pkgContent.replace('__PROJECT_NAME__', projectName)
  pkgContent = pkgContent.replace('__OPTIONAL_DEP__', depsStr)

  const pkgObj = JSON.parse(pkgContent)

  if(pkgManager === 'pnpm' && plugins.vant) {
    pkgObj.pnpm = { overrides: { "@vant/use": "^1.0.0", "@vant/popperjs": "^1.0.0" } }
  }

  await fs.writeFile(pkgPath, JSON.stringify(pkgObj, null, 2))
  console.log('  ✅ package.json 生成完成')
}