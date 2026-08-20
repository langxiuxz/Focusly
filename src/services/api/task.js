/**
 * 学习任务接口
 */
import request from '@/services/request'

/** 获取任务列表 GET /task/list */
export function getTaskList() {
  return request({ url: '/task/list', method: 'get' })
}

/** 新增学习任务 POST /task/add（Body 为完整 Task 对象） */
export function addTask(data) {
  return request({ url: '/task/add', method: 'post', data })
}

/** 更新任务状态/内容 PUT /task/update（Body 为完整 Task 对象） */
export function updateTask(data) {
  return request({ url: '/task/update', method: 'put', data })
}

/** 删除单条任务 DELETE /task/delete?id=xxx（参数放 Query，不在 Body） */
export function deleteTask(id) {
  return request({ url: '/task/delete', method: 'delete', params: { id } })
}
