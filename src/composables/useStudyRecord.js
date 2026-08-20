/**
 * 学习记录领域状态（module 级 reactive 单例）。
 * 负责「今日累计专注时长」的记录与持久化，是后续打卡（studyTime）与统计的原始数据源。
 */
import { reactive } from 'vue'
import { getStorage, setStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import { formatDate } from '@/utils/date'

const state = reactive({
  todayMinutes: 0, // 今日累计专注分钟
  date: formatDate() // 记录所属日期
})

// 初始化：本地读取；跨天清零
function init() {
  const saved = getStorage(STORAGE_KEYS.TODAY_STUDY, null)
  const today = formatDate()
  if (saved && saved.date === today) {
    state.todayMinutes = saved.minutes
  } else {
    state.todayMinutes = 0
    state.date = today
  }
}

function persist() {
  setStorage(STORAGE_KEYS.TODAY_STUDY, { date: state.date, minutes: state.todayMinutes })
}

/**
 * 独立的数据处理函数：记录一次完成的专注周期。
 * @param {number} minutes 本次专注时长（分钟）
 */
export function recordFocusSession(minutes) {
  const today = formatDate()
  if (state.date !== today) {
    // 跨天重置
    state.date = today
    state.todayMinutes = 0
  }
  state.todayMinutes += minutes
  persist()
}

init()

export default function useStudyRecord() {
  return { state, recordFocusSession }
}
