/**
 * 学习任务领域状态（module 级 reactive 单例）。
 *
 * Task 结构：{ id, content, description, status, createTime }
 *   status 为字符串 "0"(未完成) / "1"(已完成)
 *
 * Phase 2 仅建立状态结构与接口；CRUD 与双层数据联动在 Phase 4 实现。
 */
import { reactive } from 'vue'

const state = reactive({
  tasks: [], // Task[]
  loading: false
})

export default function useTask() {
  /** 加载任务列表 TODO(Phase 4): readWithFallback(getTaskList, STORAGE_KEYS.TASKS, []) */
  async function loadTasks() {}

  /** 新增任务 TODO(Phase 4) */
  async function addTask() {}

  /** 切换完成状态 TODO(Phase 4) */
  async function toggleTask() {}

  /** 编辑任务内容 TODO(Phase 4) */
  async function updateTask() {}

  /** 删除单条任务 TODO(Phase 4) */
  async function removeTask() {}

  /** 一键清空任务 TODO(Phase 4): 循环调用 removeTask */
  async function clearTasks() {}

  return { state, loadTasks, addTask, toggleTask, updateTask, removeTask, clearTasks }
}
