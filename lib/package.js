// lib/package.js
import fs from 'fs'
import path from 'path'

export function generatePackageJson (projectName, features, extraPlugins, autoRoute, enableHttps, language, targetDir, pkgManager) {
  const pkgTpl = path.join(targetDir, 'package.json.tpl')
  if(!fs.existsSync(pkgTpl)) return
  let pkg = fs.readFileSync(pkgTpl, 'utf-8')

  const optionalDeps = {}
  if(features.router) optionalDeps['vue-router'] = '^5.0.3'
  if(features.pinia) {
    optionalDeps['pinia'] = '^3.0.4'
    optionalDeps['pinia-plugin-persistedstate'] = '^4.7.1'
  }
  if(features.axios) optionalDeps['axios'] = '^1.13.6'
  if(features.ui.includes('element')) {
    optionalDeps['element-plus'] = '^2.13.5'
    optionalDeps['@element-plus/icons-vue'] = '^2.3.2'
  }
  if(features.ui.includes('vant')) optionalDeps['vant'] = '^4.9.22'
  if(extraPlugins.includes('vueuse')) optionalDeps['@vueuse/core'] = '^14.2.1'
  if(extraPlugins.includes('dayjs')) optionalDeps['dayjs'] = '^1.11.20'
  if(extraPlugins.includes('lodash')) optionalDeps['lodash'] = '^4.17.23'
  if(extraPlugins.includes('tailwind')) {
    optionalDeps['tailwindcss'] = '^4.2.2'
    optionalDeps['@tailwindcss/postcss'] = '^4.2.2'
    optionalDeps['postcss'] = '^8.5.8'
  }
  if(extraPlugins.includes('mitt')) optionalDeps['mitt'] = '^3.0.1'
  if(enableHttps) optionalDeps['vite-plugin-mkcert'] = '^1.17.10'
  if(autoRoute) optionalDeps['vite-plugin-pages'] = '^0.33.3'

  const keys = Object.keys(optionalDeps)
  const depsStr = keys.length ? ',\n' + keys.map(k => `    "${k}": "${optionalDeps[k]}"`).join(',\n') : ''
  pkg = pkg.replace('__PROJECT_NAME__', projectName).replace('__OPTIONAL_DEP__', depsStr)

  const pkgObj = JSON.parse(pkg)
  if(pkgManager === 'pnpm' && features.ui.includes('vant')) {
    pkgObj.pnpm = { overrides: { "@vant/use": "^1.0.0", "@vant/popperjs": "^1.0.0" } }
  }

  fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgObj, null, 2))
  fs.unlinkSync(pkgTpl)
}