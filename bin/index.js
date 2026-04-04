#!/usr/bin/env node
// bin/index.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// === 导入模块 ===
import { cleanMainFile } from '../lib/cleanMain.js'
import { parseExtraPlugins, parseFeatures } from '../lib/features.js'
import { generatePackageJson } from '../lib/package.js'
import { setupPlugins } from '../lib/plugins/index.js'
import { askAutoRoute, askRunDev, chooseFeatures, chooseLanguage, getProjectName } from '../lib/prompts.js'
import { copyBaseTemplate, updateIndexHtml } from '../lib/template.js'
import { checkNodeVersion, detectPackageManager, runCmd } from '../lib/utils.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const requiredVersion = '22.19.0'

  // ===================== 主流程 =====================
  ; (async () => {
    // 1. 检查 Node 版本
    checkNodeVersion(requiredVersion)

    // 2. 获取项目名称
    const projectName = await getProjectName(fs, path)
    const targetDir = path.resolve(process.cwd(), projectName)

    // 3. 选择语言
    const language = await chooseLanguage()

    // 4. 选择功能
    const featureList = await chooseFeatures()

    // 5. 解析功能
    const features = parseFeatures(featureList)
    const extraPlugins = parseExtraPlugins(featureList)
    const enableHttps = featureList.includes('https') || false

    // 6. 询问自动路由
    const autoRoute = await askAutoRoute(features.router)

    // 7. 询问是否运行 dev
    const pkgManager = detectPackageManager()
    const pkgCommands = {
      npm: { install: 'npm install', dev: 'npm run dev' },
      pnpm: { install: 'pnpm install', dev: 'pnpm dev' }
    }
    const runDev = await askRunDev(pkgCommands[pkgManager].dev)

    // 8. 复制基础模板
    await copyBaseTemplate(language, targetDir, __dirname)

    // 9. 更新 index.html
    await updateIndexHtml(projectName, targetDir)

    // 10. 配置插件，并获取已使用的占位符
    const unusedPlaceholders = await setupPlugins(features, extraPlugins, {
      language,
      targetDir,
      autoRoute,
      enableHttps,
      __dirname
    })

    // 11. 清理 main 文件中未使用的占位符
    await cleanMainFile(language, targetDir, unusedPlaceholders)

    // 12. 生成 package.json
    await generatePackageJson(projectName, features, extraPlugins, autoRoute, enableHttps, language, targetDir, pkgManager)

    // 13. 安装依赖
    console.log('\n📦 正在安装依赖...')
    runCmd(pkgCommands[pkgManager].install, targetDir)

    // 14. 启动 dev 或提示完成
    if(runDev) {
      console.log('\n🚀 启动开发服务器...')
      runCmd(pkgCommands[pkgManager].dev, targetDir)
    } else {
      console.log(`\n✅ 项目创建完成`)
      console.log(`👉 cd ${projectName}`)
      console.log(`👉 ${pkgCommands[pkgManager].dev}`)
      if(enableHttps) console.log('🔐 首次启用 HTTPS 会自动生成证书，请稍等...')
    }
  })()