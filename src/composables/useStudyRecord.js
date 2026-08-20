/**
 * 学习记录领域状态（module 级 reactive 单例）。
 *
 * 数据源：每日专注日志 log = [{ date: 'YYYY-MM-DD', minutes }]，date 唯一。
 * 每次完成专注周期由 recordFocusSession 累加当日分钟数；
 * 打卡（useClock）与统计（useStats）均从此单一数据源读取，避免重复数据源。
 */
import { reactive } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import { formatDate } from '@/utils/date'

const state = reactive({
  todayMinutes: 0, // 今日累计专注分钟（派生，便于读取）
  log: [] // 每日专注日志 [{ date, minutes }]
})

function load() {
  const saved = getStorage(STORAGE_KEYS.STUDY_LOG, [])
  state.log = Array.isArray(saved) ? saved : []
}

function syncToday() {
  const today = formatDate()
  const entry = state.log.find((e) => e.date === today)
  state.todayMinutes = entry ? entry.minutes : 0
}

function persist() {
  setStorage(STORAGE_KEYS.STUDY_LOG, state.log)
}

/**
 * 独立的数据处理函数：记录一次完成的专注周期。
 * @param {number} minutes 本次专注时长（分钟）
 */
export function recordFocusSession(minutes) {
  const today = formatDate()
  let entry = state.log.find((e) => e.date === today)
  if (!entry) {
    entry = { date: today, minutes: 0 }
    state.log.push(entry)
  }
  entry.minutes += minutes
  state.todayMinutes = entry.minutes
  persist()
}

load()
syncToday()

export default function useStudyRecord() {
  return { state, recordFocusSession }
}
