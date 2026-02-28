const pendingRequests = new Map()

/**
 * 生成请求唯一kaey
 * @param {RequestConfig} config 请求配置对象
 * 注意：只适用于可序列化的 params 和 data（如普通对象）
 */
function generateReqKey (config) {
  const { method, url, params, data } = config
  return [
    method,
    url,
    JSON.stringify(params),
    JSON.stringify(data)
  ].join('&')
}

/**
 * 添加pending请求,并自动取消请求
 * @param {RequestConfig} config 请求配置对象
 */
export function addPendingRequest (config) {
  // 获取请求key
  const requestKey = generateReqKey(config)
  config.__requestKey = requestKey
  // 如果存在相同请求,取消当前请求
  if (pendingRequests.has(requestKey)) {
    const controller = pendingRequests.get(requestKey)
    controller.abort()
    pendingRequests.delete(requestKey)
  }

  //否则为本次请求创建新的AbortController
  const controller = new AbortController()
  // 绑定 signal 到 axios 配置
  config.signal = controller.signal
  pendingRequests.set(requestKey, controller)
}

/**
 * 移除已完成/失败/取消的请求
 * @param {RequestConfig} config 请求配置对象
 */
export function removePendingRequest (config) {
  const requestKey = config.__requestKey
  if (requestKey) {
    pendingRequests.delete(requestKey)
  }
}
