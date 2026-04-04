// lib/features.js
export function parsePlugins (featureList) {
  return {
    // 核心插件
    router: featureList.includes('router'),
    pinia: featureList.includes('pinia'),
    axios: featureList.includes('axios'),

    // UI 插件
    elementPlus: featureList.includes('element'),
    vant: featureList.includes('vant'),

    // 工具插件
    vueuse: featureList.includes('vueuse'),
    lodash: featureList.includes('lodash'),
    dayjs: featureList.includes('dayjs'),
    mitt: featureList.includes('mitt'),

    // 样式插件
    tailwind: featureList.includes('tailwind'),

    // 开发工具
    https: featureList.includes('https')
  }
}