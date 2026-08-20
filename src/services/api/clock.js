/**
 * 学习打卡接口（Service 层，统一命名）。
 */
import request from '@/services/request'

export const clockService = {
  /** 获取打卡记录 GET /clock/list */
  getRecords() {
    return request({ url: '/clock/list', method: 'get' })
  },

  /** 提交打卡 POST /clock/add */
  addClock(data) {
    return request({ url: '/clock/add', method: 'post', data })
  }
}
