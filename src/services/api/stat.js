/**
 * 数据统计接口（Service 层，统一命名）。
 *
 * 说明：本项目以 LocalStorage 为真相源，统计在客户端基于每日专注日志聚合；
 * 以下接口为「后端聚合」场景的契约，前端当前采用本地聚合（见 useStats）。
 */
import request from '@/services/request'

export const statService = {
  /** 获取近 7 天统计 GET /stat/week */
  getWeekStats() {
    return request({ url: '/stat/week', method: 'get' })
  },

  /** 获取近 30 天统计 GET /stat/month */
  getMonthStats() {
    return request({ url: '/stat/month', method: 'get' })
  }
}
