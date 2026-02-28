// request.d.ts

declare global {
  /**
   * HTTP 请求方法类型
   */
  type HttpMethod =
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'PATCH'
    | 'HEAD'
    | 'OPTIONS'
    | 'CONNECT'
    | 'TRACE'

  /**
   * 请求配置对象（Axios 风格）
   */
  interface RequestConfig<T = any> {
    /** 请求方法，默认 GET */
    method?: HttpMethod
    /** 请求 URL */
    url: string
    /** 基础 URL，会自动拼接到 url 前面 */
    baseURL?: string
    /** URL 查询参数（GET 请求的参数） */
    params?: Record<string, any>
    /** 请求体数据（POST、PUT、PATCH 等请求的参数） */
    data?: T
    /** 请求超时时间（毫秒），0 表示不超时 */
    timeout?: number
    /** 超时错误消息 */
    timeoutErrorMessage?: string
    /** 是否携带跨域凭证（cookies） */
    withCredentials?: boolean
    /** 响应数据类型 */
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'
    /** 响应编码 */
    responseEncoding?: string
    /** 自定义请求头 */
    headers?: Record<string, string>
    /** HTTP 基础认证 */
    auth?: {
      username: string
      password: string
    }
    /** 代理配置 */
    proxy?: {
      host: string
      port: number
      protocol?: string
      auth?: string
    }
    /** 响应内容最大长度 */
    maxContentLength?: number
    /** 请求体最大长度 */
    maxBodyLength?: number
    /** 最大重定向次数 */
    maxRedirects?: number
    /** Unix Socket 路径 */
    socketPath?: string
    /** Node.js HTTP Agent */
    httpAgent?: any
    /** Node.js HTTPS Agent */
    httpsAgent?: any
    /** 是否自动解压响应 */
    decompress?: boolean
    /** 自定义状态码验证函数 */
    validateStatus?: (status: number) => boolean
    /** 参数序列化函数 */
    paramsSerializer?: (params: any) => string
    /** 请求数据转换函数 */
    transformRequest?: ((data: any, headers: any) => any) | Array<(data: any, headers: any) => any>
    /** 响应数据转换函数 */
    transformResponse?: ((data: any, headers: any, status: number) => any) | Array<(data: any, headers: any, status: number) => any>
    /** 上传进度事件回调 */
    onUploadProgress?: (progressEvent: any) => void
    /** 下载进度事件回调 */
    onDownloadProgress?: (progressEvent: any) => void
    /** 取消令牌 */
    cancelToken?: any
    /** CSRF token cookie 名称 */
    xsrfCookieName?: string
    /** CSRF token header 名称 */
    xsrfHeaderName?: string
    /** 请求适配器 */
    adapter?: (config: RequestConfig) => any
    /** AbortSignal（用于取消请求） */
    signal?: AbortSignal
    /** 是否使用不安全的 HTTP 解析器 */
    insecureHTTPParser?: boolean
    /** 过渡性配置 */
    transitional?: {
      /** 是否静默 JSON 解析错误 */
      silentJSONParsing?: boolean
      /** 是否强制 JSON 解析 */
      forcedJSONParsing?: boolean
      /** 是否澄清超时错误 */
      clarifyTimeoutError?: boolean
    }
    /** 代理连接回调 */
    onProxyConnect?: (proxyReq: any, req: any, res: any) => void
    /** 代理错误回调 */
    onProxyError?: (err: Error, req: any, res: any) => void
    /** 代理响应回调 */
    onProxyResponse?: (proxyRes: any, req: any, res: any) => void
    /** 方法名称（用于拦截器） */
    methodName?: string
  }

  /**
   * Axios 响应对象
   */
  interface AxiosResponse<T = any> {
    /** 响应数据 */
    data: T
    /** HTTP 状态码 */
    status: number
    /** HTTP 状态文本 */
    statusText: string
    /** 响应头 */
    headers: Record<string, string>
    /** 请求配置 */
    config: RequestConfig<T>
    /** 原始请求对象 */
    request?: XMLHttpRequest
  }

  /**
   * Axios 错误对象
   */
  interface AxiosError<T = any> extends Error {
    /** 错误代码 */
    code?: string
    /** 响应对象（如果收到响应） */
    response?: AxiosResponse<T>
    /** 请求配置 */
    config?: RequestConfig<T>
    /** 原始请求对象 */
    request?: XMLHttpRequest
    /** 是否为 Axios 错误 */
    isAxiosError: boolean
  }
}
export { }

