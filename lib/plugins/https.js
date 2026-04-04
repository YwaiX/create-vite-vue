// lib/plugins/https.js
import fs from 'fs'
import path from 'path'

export function setupHttps (targetDir) {
  const viteConfigPathTs = path.join(targetDir, 'vite.config.ts')
  const viteConfigPathJs = path.join(targetDir, 'vite.config.js')

  const viteConfigPath = fs.existsSync(viteConfigPathTs)
    ? viteConfigPathTs
    : viteConfigPathJs

  if(!viteConfigPath || !fs.existsSync(viteConfigPath)) return

  let viteConfig = fs.readFileSync(viteConfigPath, 'utf-8')

  // ================== 1. 注入 import ==================
  if(!viteConfig.includes("vite-plugin-mkcert")) {
    viteConfig = viteConfig.replace(
      /(import .*?from .*?\n)/,
      `$1import mkcert from 'vite-plugin-mkcert'\n`
    )
  }

  // ================== 2. 注入插件 ==================
  if(!viteConfig.includes('mkcert()')) {
    viteConfig = viteConfig.replace(
      /plugins:\s*\[/,
      `plugins: [\n    mkcert(),`
    )
  }

  fs.writeFileSync(viteConfigPath, viteConfig)

  // ================== 3. 提示 ==================
  console.log('🔐 已启用 HTTPS（mkcert）')
  console.log('👉 首次运行会自动生成本地证书，请稍等...')
}