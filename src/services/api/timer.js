/**
 * 计时器配置接口（Service 层，统一命名）。
 */
import request from '@/services/request'

export const timerService = {
  /** 获取计时器配置 GET /timer/config */
  getConfig() {
    return request({ url: '/timer/config', method: 'get' })
  },

  /** 保存计时器配置 PUT /timer/config */
  saveConfig(data) {
    return request({ url: '/timer/config', method: 'put', data })
  }
}
