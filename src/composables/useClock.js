/**
 * 每日学习打卡领域状态（module 级 reactive 单例）。
 *
 * ClockRecord 结构：{ date: 'YYYY-MM-DD', studyTime: 分钟, createTime }，date 唯一（一天只能打卡一次）。
 * 打卡时读取 useStudyRecord 的「今日累计专注时长」作为快照，与专注记录单一数据源打通。
 */
import { reactive } from 'vue'
import { STORAGE_KEYS } from '@/constants'
import { formatDate } from '@/utils/date'
import { readWithFallback, writeWithFallback } from '@/services/mock/adapter'
import { getClockList } from '@/services/api/clock'
import useStudyRecord from './useStudyRecord'
import useToast from './useToast'

const state = reactive({
  records: [], // ClockRecord[]
  todayClocked: false // 今日是否已打卡
})

const { state: studyState } = useStudyRecord()
const { show } = useToast()

function syncTodayClocked() {
  const today = formatDate()
  state.todayClocked = state.records.some((r) => r.date === today)
}

/** 加载打卡记录 */
async function loadClocks() {
  const data = await readWithFallback(getClockList, STORAGE_KEYS.CLOCKS, [])
  state.records = Array.isArray(data) ? data : []
  syncTodayClocked()
  return state.records
}

/** 今日打卡：一天仅一次，重复打卡友好提示；保存当天累计专注时长快照 */
async function clockIn() {
  const today = formatDate()
  if (state.todayClocked) {
    show('今天已经打过卡啦')
    return false
  }
  const record = {
    date: today,
    studyTime: studyState.todayMinutes,
    createTime: Date.now()
  }
  state.records.push(record)
  state.todayClocked = true
  await writeWithFallback(STORAGE_KEYS.CLOCKS, state.records, {
    url: '/clock/add',
    method: 'post',
    data: record
  })
  show('打卡成功')
  return true
}

loadClocks()

export default function useClock() {
  return { state, loadClocks, clockIn }
}
