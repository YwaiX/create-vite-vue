#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// === 导入模块 ===
import { parseExtraPlugins, parseFeatures } from '../lib/features.js'
import { generateMainFile } from '../lib/mainFile.js'
import { generatePackageJson } from '../lib/package.js'
import { askAutoRoute, askRunDev, chooseFeatures, chooseLanguage, getProjectName } from '../lib/prompts.js'
import { configureRouter } from '../lib/router.js'
import { appendTailwind, copyBaseTemplate, copyOptionalTemplates, updateIndexHtml } from '../lib/template.js'
import { checkNodeVersion, detectPackageManager, runCmd } from '../lib/utils.js'
import { configureVite } from '../lib/viteConfig.js'

// ===================== 常量 =====================
const requiredVersion = '22.19.0'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const pkgManager = detectPackageManager()

const pkgCommands = {
  npm: { install: 'npm install', dev: 'npm run dev' },
  pnpm: { install: 'pnpm install', dev: 'pnpm dev' }
}

  // ===================== 主流程 =====================
  ; (async () => {
    checkNodeVersion(requiredVersion)

    const projectName = await getProjectName(fs, path)
    const targetDir = path.resolve(process.cwd(), projectName)

    const language = await chooseLanguage()
    const featureList = await chooseFeatures()
    const features = parseFeatures(featureList)
    const extraPlugins = parseExtraPlugins(featureList)

    const autoRoute = await askAutoRoute(features.router)
    const enableHttps = featureList.includes('https') || false
    const runDev = await askRunDev(pkgCommands[pkgManager].dev)

    // 模板文件处理
    copyBaseTemplate(language, targetDir, __dirname)
    updateIndexHtml(projectName, targetDir)
    appendTailwind(extraPlugins, targetDir)
    copyOptionalTemplates(features, extraPlugins, language, targetDir, __dirname)

    // 生成 main 文件
    await generateMainFile(features, extraPlugins, language, targetDir)

    // package.json
    generatePackageJson(projectName, features, extraPlugins, autoRoute, enableHttps, language, targetDir, pkgManager)

    // 配置 vite
    configureVite(language, autoRoute, enableHttps, targetDir)

    // 配置 router
    configureRouter(features.router, autoRoute, language, targetDir)

    // 安装依赖
    runCmd(pkgCommands[pkgManager].install, targetDir)

    // 启动 dev 或提示完成
    if(runDev) runCmd(pkgCommands[pkgManager].dev, targetDir)
    else {
      console.log(`\n✅ 项目创建完成`)
      console.log(`👉 cd ${projectName}`)
      console.log(`👉 ${pkgCommands[pkgManager].dev}`)
      if(enableHttps) console.log('🔐 首次启用 HTTPS 会自动生成证书，请稍等...')
    }
  })()