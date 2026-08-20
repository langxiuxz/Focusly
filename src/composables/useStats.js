/**
 * 数据统计领域状态（module 级 reactive 单例）。
 *
 * 聚合自单一数据源：每日专注日志（useStudyRecord）+ 打卡记录（useClock）。
 * summary / trend / todayClocked 均为 computed，专注记录或打卡记录变化后自动更新。
 */
import { reactive, computed } from 'vue'
import { STAT_RANGE } from '@/constants'
import { formatDate } from '@/utils/date'
import { aggregateDaily } from '@/utils/stats'
import useStudyRecord from './useStudyRecord'
import useClock from './useClock'

const state = reactive({
  range: STAT_RANGE.WEEK // week(近7天) | month(近30天)
})

const { state: studyState } = useStudyRecord()
const { state: clockState } = useClock()

/** 汇总卡片：今日 / 近7天 / 近30天累计专注时长 */
const summary = computed(() => {
  const today = formatDate()
  const todayEntry = studyState.log.find((e) => e.date === today)
  return {
    today: todayEntry ? todayEntry.minutes : 0,
    week: aggregateDaily(studyState.log, 7).total,
    month: aggregateDaily(studyState.log, 30).total
  }
})

/** 当前范围趋势（旧 → 新，缺失补 0） */
const trend = computed(() => {
  const days = state.range === STAT_RANGE.MONTH ? 30 : 7
  return aggregateDaily(studyState.log, days).trend
})

/** 今日是否打卡 */
const todayClocked = computed(() => clockState.todayClocked)

/** 切换统计范围（近 7 天 / 近 30 天） */
function setRange(range) {
  state.range = range
}

export default function useStats() {
  return { state, summary, trend, todayClocked, setRange }
}
