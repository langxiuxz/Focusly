/**
 * 数字 / 时间格式化工具。
 */

/**
 * 秒数格式化为 HH:MM:SS 或 MM:SS
 * @param {number} totalSeconds 总秒数
 * @returns {string}
 */
export function formatSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}
