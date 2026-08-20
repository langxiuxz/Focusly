/**
 * 数据统计接口
 */
import request from '@/services/request'

/** 获取近 7 天学习统计 GET /stat/week */
export function getWeekStats() {
  return request({ url: '/stat/week', method: 'get' })
}

/** 获取近 30 天学习统计 GET /stat/month */
export function getMonthStats() {
  return request({ url: '/stat/month', method: 'get' })
}
