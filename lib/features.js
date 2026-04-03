// lib/features.js
export function parseFeatures (featureList) {
  return {
    router: featureList.includes('router'),
    pinia: featureList.includes('pinia'),
    axios: featureList.includes('axios'),
    ui: featureList.filter(v => ['element', 'vant'].includes(v))
  }
}

export function parseExtraPlugins (featureList) {
  return featureList.filter(v => ['vueuse', 'lodash', 'dayjs', 'tailwind', 'mitt', 'https'].includes(v))
}