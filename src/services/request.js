/**
 * Axios 通用请求封装。
 * - 统一 baseURL / timeout（从 .env 读取）
 * - 请求拦截器：全局 loading 计数
 * - 响应拦截器：解包统一响应 { code, msg, data }，统一错误处理
 * - 网络异常 / 超时统一抛错，供上层（mock/adapter）做本地兜底
 */
import axios from 'axios'

// 全局 loading 计数（>0 表示有请求进行中）
let pendingCount = 0
// loading 状态订阅者（由 LoadingMask 等组件注册）
const loadingListeners = new Set()

function setLoading(flag) {
  pendingCount = Math.max(0, pendingCount + (flag ? 1 : -1))
  loadingListeners.forEach((fn) => fn(pendingCount > 0))
}

/** 订阅 loading 状态变化，返回取消订阅函数 */
export function onLoadingChange(fn) {
  loadingListeners.add(fn)
  return () => loadingListeners.delete(fn)
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 基础地址 /api（未配置 Mock 时同源 /api）
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 3000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    setLoading(true)
    return config
  },
  (error) => {
    setLoading(false)
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    setLoading(false)
    const res = response.data
    // 统一响应结构校验：code 必须是数字 200（非字符串 "200"）
    if (res && typeof res.code === 'number' && res.code === 200) {
      return res.data
    }
    // 业务失败（如重复打卡 code 500）：抛出带 msg 的错误，由调用方处理
    return Promise.reject(new Error(res?.msg || '请求失败'))
  },
  (error) => {
    setLoading(false)
    // 网络错误 / 超时 / CORS / HTTP 非 2xx：统一封装后抛出，供本地兜底
    const msg =
      error.code === 'ECONNABORTED'
        ? '请求超时'
        : error.response?.data?.msg || error.message || '网络异常'
    return Promise.reject(new Error(msg))
  }
)

/**
 * 通用请求函数
 * @param {object} config axios 配置
 * @returns {Promise<any>} 直接返回解包后的 data
 */
export default function request(config) {
  return instance.request(config)
}
