/**
 * 每日学习打卡领域状态（module 级 reactive 单例）。
 *
 * ClockRecord 结构：{ date, studyTime, createTime }
 *   date 为 YYYY-MM-DD（唯一键）
 *
 * Phase 2 仅建立状态结构与接口；打卡逻辑在 Phase 5 实现。
 */
import { reactive } from 'vue'

const state = reactive({
  records: [], // ClockRecord[]
  todayClocked: false, // 今日是否已打卡
  todayStudyTime: 0 // 今日累计专注时长（分钟）
})

export default function useClock() {
  /** 加载打卡记录 TODO(Phase 5): readWithFallback(getClockList, STORAGE_KEYS.CLOCKS, []) */
  async function loadClocks() {}

  /** 提交当日打卡 TODO(Phase 5): 取 todayStudyTime 快照 + 重复打卡拦截 */
  async function clockIn() {}

  return { state, loadClocks, clockIn }
}
