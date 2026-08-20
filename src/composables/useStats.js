/**
 * 数据统计领域状态（module 级 reactive 单例）。
 *
 * StatisticItem 结构：{ date, studyTime }
 *  - 接口返回连续日期、缺失补 0、旧 → 新
 *  - 兜底时由 ClockRecord 本地聚合出相同结构
 *
 * Phase 2 仅建立状态结构与接口；聚合与图表联动在 Phase 6 实现。
 */
import { reactive } from 'vue'
import { STAT_RANGE } from '@/constants'

const state = reactive({
  range: STAT_RANGE.WEEK, // week(近7天) | month(近30天)
  summary: { today: 0, week: 0, month: 0 }, // 汇总卡片数据
  trend: [] // StatisticItem[]
})

export default function useStats() {
  /** 加载统计 TODO(Phase 6): /stat/week|month 接口 + 本地聚合兜底 */
  async function loadStats() {}

  /** 切换统计范围（近 7 天 / 近 30 天） */
  function setRange(range) {
    state.range = range
  }

  return { state, loadStats, setRange }
}
