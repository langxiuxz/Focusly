/**
 * 每日专注记录（独立功能，单一真相源）。
 *
 * 数据形态：log = [{ date: 'YYYY-MM-DD', minutes }]
 * 番茄钟完成一次专注 → recordFocusSession 累加当日分钟数；
 * 打卡（useClock）与统计（useStats）均从本记录读取，避免重复数据源。
 */
import { reactive } from 'vue'
import storage from '@/utils/storage'
import { formatDate } from '@/utils/date'
import { STORAGE_KEYS } from '@/constants'

const state = reactive({
  todayMinutes: 0,
  log: []
})

function load() {
  const saved = storage.get(STORAGE_KEYS.STUDY_LOG, [])
  state.log = Array.isArray(saved) ? saved : []
}

function syncToday() {
  const today = formatDate()
  const entry = state.log.find((e) => e.date === today)
  state.todayMinutes = entry ? entry.minutes : 0
}

function persist() {
  storage.set(STORAGE_KEYS.STUDY_LOG, state.log)
}

/** 记录一次完成的专注（累加今日分钟数） */
export function recordFocusSession(minutes) {
  if (!minutes || minutes <= 0) return
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
