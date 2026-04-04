// lib/plugins/https.js
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'

export async function setupHttps (targetDir) {
  console.log('  🔐 配置 HTTPS...')

  const viteConfigPathTs = path.join(targetDir, 'vite.config.ts')
  const viteConfigPathJs = path.join(targetDir, 'vite.config.js')
  const viteConfigPath = existsSync(viteConfigPathTs) ? viteConfigPathTs : viteConfigPathJs

  if(!viteConfigPath || !existsSync(viteConfigPath)) {
    throw new Error(`vite.config 文件不存在`)
  }

  let viteConfig = await fs.readFile(viteConfigPath, 'utf-8')

  // 注入 import
  if(!viteConfig.includes("vite-plugin-mkcert")) {
    viteConfig = viteConfig.replace(/(import .*?from .*?\n)/, `$1import mkcert from 'vite-plugin-mkcert'\n`)
  }

  // 注入插件
  if(!viteConfig.includes('mkcert()')) {
    viteConfig = viteConfig.replace(/plugins:\s*\[/, `plugins: [\n    mkcert(),`)
  }

  await fs.writeFile(viteConfigPath, viteConfig)
  console.log('    ✅ vite.config 已更新')
  console.log('🔐 已启用 HTTPS（mkcert）')
  console.log('👉 首次运行会自动生成本地证书，请稍等...')
}