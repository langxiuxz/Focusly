/**
 * 输入校验工具：前端容错，禁止非法数据录入（与后端 Mock 校验规则一致）。
 * 使用相对路径导入 constants，便于在 Node 环境无构建直接单测。
 */
import { TIMER_RANGE, TASK_LIMIT } from '../constants/index.js'

/**
 * 校验并规范化时长输入
 * @param {*} raw 用户输入（字符串/数字）
 * @param {'focus'|'rest'} type 时长类型
 * @returns {{ valid: boolean, value: number, message: string }}
 */
export function validateDuration(raw, type) {
  const range = TIMER_RANGE[type]
  const label = type === 'focus' ? '专注时长' : '休息时长'
  const fallback = type === 'focus' ? 25 : 5

  if (raw === '' || raw === null || raw === undefined) {
    return { valid: false, value: fallback, message: `${label}不能为空` }
  }
  const num = Number(raw)
  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return { valid: false, value: fallback, message: `${label}必须为数字` }
  }
  if (num <= 0) {
    return { valid: false, value: fallback, message: `${label}必须大于 0` }
  }
  const intVal = Math.floor(num)
  if (intVal < range.min || intVal > range.max) {
    return {
      valid: false,
      value: fallback,
      message: `${label}需在 ${range.min}-${range.max} 分钟之间`
    }
  }
  return { valid: true, value: intVal, message: '' }
}

/**
 * 校验任务名称
 * @param {string} content 任务名称
 * @returns {{ valid: boolean, message: string }}
 */
export function validateTaskContent(content) {
  const text = String(content ?? '').trim()
  if (!text) return { valid: false, message: '任务名称不能为空' }
  if (text.length > TASK_LIMIT.contentMax) {
    return { valid: false, message: `任务名称不能超过 ${TASK_LIMIT.contentMax} 字` }
  }
  return { valid: true, message: '' }
}
