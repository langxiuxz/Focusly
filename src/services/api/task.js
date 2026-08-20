/**
 * 学习任务接口（Service 层，统一命名）。
 */
import request from '@/services/request'

export const taskService = {
  /** 获取任务列表 GET /task/list */
  getTasks() {
    return request({ url: '/task/list', method: 'get' })
  },

  /** 新增任务 POST /task/add */
  addTask(data) {
    return request({ url: '/task/add', method: 'post', data })
  },

  /** 更新任务 PUT /task/update */
  updateTask(data) {
    return request({ url: '/task/update', method: 'put', data })
  },

  /** 删除任务 DELETE /task/delete?id=xxx */
  deleteTask(id) {
    return request({ url: '/task/delete', method: 'delete', params: { id } })
  }
}
