// lib/template.js
import fs from 'fs'
import path from 'path'

export function copyBaseTemplate (language, targetDir, __dirname) {
  const baseTemplate = language === 'ts' ? 'base-ts' : 'base-js'
  fs.cpSync(path.resolve(__dirname, `../template/${baseTemplate}`), targetDir, { recursive: true })
}

export function updateIndexHtml (projectName, targetDir) {
  const indexPath = path.join(targetDir, 'index.html')
  if(!fs.existsSync(indexPath)) return
  const indexContent = fs.readFileSync(indexPath, 'utf-8')
  fs.writeFileSync(indexPath, indexContent.replace(/<title>.*<\/title>/, `<title>${projectName}</title>`))
}

export function copyOptionalTemplates (features, extraPlugins, language, targetDir, __dirname) {
  const copy = name => {
    fs.cpSync(path.resolve(__dirname, `../template/${name}`), targetDir, { recursive: true })
  }
  features.router && copy(language === 'ts' ? 'router-ts' : 'router-js')
  features.pinia && copy(language === 'ts' ? 'pinia-ts' : 'pinia-js')
  features.axios && copy(language === 'ts' ? 'axios-ts' : 'axios-js')
  for(const plugin of extraPlugins) {
    const templateName = `${plugin}-${language === 'ts' ? 'ts' : 'js'}`
    const templatePath = path.resolve(__dirname, `../template/${templateName}`)
    if(fs.existsSync(templatePath)) copy(templateName)
  }
}