/**
 * 学习打卡接口
 */
import request from '@/services/request'

/** 获取全部打卡记录 GET /clock/list */
export function getClockList() {
  return request({ url: '/clock/list', method: 'get' })
}

/** 提交当日学习打卡 POST /clock/add（Body 为 ClockRecord） */
export function addClock(data) {
  return request({ url: '/clock/add', method: 'post', data })
}
