/**
 * 学习任务领域状态（module 级 reactive 单例）。
 *
 * Task 结构：{ id, content, description, status, createTime }
 *   status 为字符串 "0"(未完成) / "1"(已完成)
 *
 * LocalStorage 为真相源；读走 readWithFallback，写走 writeWithFallback（双层数据）。
 */
import { reactive } from 'vue'
import { setStorage } from '@/utils/storage'
import { STORAGE_KEYS, TASK_STATUS } from '@/constants'
import { readWithFallback, writeWithFallback } from '@/services/mock/adapter'
import { getTaskList } from '@/services/api/task'
import useToast from './useToast'

const state = reactive({
  tasks: [], // Task[]
  loading: false
})

const { show } = useToast()

function genId() {
  return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6)
}

function persist(syncConfig) {
  return writeWithFallback(STORAGE_KEYS.TASKS, state.tasks, syncConfig)
}

/** 加载任务列表 */
async function loadTasks() {
  state.loading = true
  try {
    const data = await readWithFallback(getTaskList, STORAGE_KEYS.TASKS, [])
    state.tasks = Array.isArray(data) ? data : []
  } finally {
    state.loading = false
  }
  return state.tasks
}

/** 新增任务（禁止空任务） */
async function addTask({ content, description = '' }) {
  const text = String(content ?? '').trim()
  if (!text) {
    show('任务名称不能为空')
    return null
  }
  const task = {
    id: genId(),
    content: text,
    description: String(description ?? '').trim(),
    status: TASK_STATUS.TODO,
    createTime: Date.now()
  }
  state.tasks.push(task)
  await persist({ url: '/task/add', method: 'post', data: task })
  return task
}

/** 切换完成状态 */
async function toggleTask(id) {
  const task = state.tasks.find((t) => t.id === id)
  if (!task) return
  task.status = task.status === TASK_STATUS.DONE ? TASK_STATUS.TODO : TASK_STATUS.DONE
  await persist({ url: '/task/update', method: 'put', data: task })
}

/** 编辑任务内容 */
async function updateTask({ id, content }) {
  const text = String(content ?? '').trim()
  if (!text) {
    show('任务名称不能为空')
    return
  }
  const task = state.tasks.find((t) => t.id === id)
  if (!task) return
  task.content = text
  await persist({ url: '/task/update', method: 'put', data: task })
}

/** 删除单条任务 */
async function removeTask(id) {
  state.tasks = state.tasks.filter((t) => t.id !== id)
  await persist({ url: '/task/delete', method: 'delete', params: { id } })
}

/** 一键清空任务（无批量删除接口，直接本地清空） */
async function clearTasks() {
  state.tasks = []
  setStorage(STORAGE_KEYS.TASKS, [])
}

loadTasks()

export default function useTask() {
  return { state, loadTasks, addTask, toggleTask, updateTask, removeTask, clearTasks }
}
