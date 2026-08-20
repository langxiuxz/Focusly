/**
 * 统计聚合纯函数（无 Vue / DOM 依赖，可在 Node 中单测）。
 * 输入「每日专注日志」，输出指定天数窗口的累计时长与按日趋势。
 */
import { getRecentDates } from './date.js'

/**
 * 聚合每日专注日志为指定天数窗口
 * @param {Array<{date:string, minutes:number}>} log 每日专注日志
 * @param {number} days 窗口天数（含今日）
 * @param {Date} end 窗口结束日（默认今天）
 * @returns {{ total: number, trend: Array<{date:string, studyTime:number}> }} 累计时长与按日趋势（旧 → 新）
 */
export function aggregateDaily(log, days, end = new Date()) {
  const dates = getRecentDates(days, end)
  const byDate = new Map((log || []).map((e) => [e.date, e.minutes]))
  let total = 0
  const trend = dates.map((date) => {
    const studyTime = byDate.get(date) ?? 0
    total += studyTime
    return { date, studyTime }
  })
  return { total, trend }
}
