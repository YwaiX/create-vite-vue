// lib/plugins/tailwind.js
import fs from 'fs'
import path from 'path'

export function setupTailwind (targetDir) {
  const stylePath = path.join(targetDir, 'src/style.css')
  if(!fs.existsSync(stylePath)) return

  const original = fs.readFileSync(stylePath, 'utf-8')

  if(!original.includes('@import "tailwindcss";')) {
    fs.writeFileSync(stylePath, `@import "tailwindcss";\n${original}`)
  }
}