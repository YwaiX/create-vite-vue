import axios from 'axios'
import { addPendingRequest, removePendingRequest } from './requestCache'

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么

    try {
      addPendingRequest(config)
    } catch(error) {
      throw error
    }
    return config
  },
  // 对请求错误做些什么
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    removePendingRequest(response.config)

    // 对响应数据做点什么
    return response.data
  },
  error => {
    // 即使是错误(包括网络错误)也要清理
    if(error.config) {
      removePendingRequest(error.config)
    }
    // 判断是否是重复请求被取消
    if(error.canceled) {
      return Promise.reject(error)
    }

    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default service
