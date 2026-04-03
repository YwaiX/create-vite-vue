// lib/utils.js
import { execSync } from 'child_process'
import fs from 'fs'

export function checkNodeVersion (requiredVersion) {
  const currentVersion = process.version.replace('v', '')
  if(compareVersion(currentVersion, requiredVersion) < 0) {
    console.error(`❌ Node.js 版本过低`)
    console.error(`当前版本: ${currentVersion}`)
    console.error(`最低要求: ${requiredVersion}`)
    console.error(`请升级 Node.js 后再运行`)
    process.exit(1)
  }
}

export function compareVersion (v1, v2) {
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

export function detectPackageManager () {
  const userAgent = process.env.npm_config_user_agent || ''
  if(userAgent.startsWith('pnpm')) return 'pnpm'
  if(userAgent.startsWith('npm')) return 'npm'
  if(fs.existsSync('pnpm-lock.yaml')) return 'pnpm'
  return 'npm'
}

export function runCmd (cmd, cwd = process.cwd()) {
  execSync(cmd, { cwd, stdio: 'inherit' })
}