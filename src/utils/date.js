/**
 * 日期处理工具：统一使用「本地时区」，
 * 避免 toISOString 按 UTC 偏移导致「今天」判定错位一天。
 */

/**
 * 格式化日期为 YYYY-MM-DD（本地时区）
 * @param {Date} date
 * @returns {string} 如 2026-08-20
 */
export function formatDate(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 生成从结束日期往前推 N 天的连续日期数组（含结束日，旧 → 新）
 * @param {number} days 天数
 * @param {Date} end 结束日期（默认今天）
 * @returns {string[]} 如 ['2026-08-14', ..., '2026-08-20']
 */
export function getRecentDates(days, end = new Date()) {
  const result = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)
    result.push(formatDate(d))
  }
  return result
}

/**
 * 根据 YYYY-MM-DD 返回星期（本地时区，避免 new Date('YYYY-MM-DD') 的 UTC 偏移）
 * @param {string} dateStr 如 '2026-08-20'
 * @returns {string} 如 '四'
 */
export function getWeekday(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return ['日', '一', '二', '三', '四', '五', '六'][dt.getDay()]
}
