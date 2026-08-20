/**
 * 计时器配置接口
 */
import request from '@/services/request'

/** 获取计时器配置 GET /timer/config */
export function getTimerConfig() {
  return request({ url: '/timer/config', method: 'get' })
}

/** 保存计时器配置 PUT /timer/config */
export function saveTimerConfig(data) {
  return request({ url: '/timer/config', method: 'put', data })
}
