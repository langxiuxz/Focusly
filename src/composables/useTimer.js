/**
 * 计时器领域状态（核心，module 级 reactive 单例）。
 *
 * 状态机：idle --开始--> study(running) --归零--> rest --归零--> study(待开始)
 *   phase: idle | study | rest
 *   running: 是否在倒计时中
 *
 * Phase 3 仅提供状态与派生值（阶段标识、阶段总时长）；
 * 倒计时 tick、时间戳差值法（漂移免疫）、定时器生命周期在 Phase 4 实现。
 */
import { reactive, computed } from 'vue'
import { TIMER_PHASE, TIMER_DEFAULT } from '@/constants'

const state = reactive({
  phase: TIMER_PHASE.IDLE, // idle | study | rest
  running: false, // 是否在倒计时中
  studyDuration: TIMER_DEFAULT.studyDuration, // 学习时长（分钟）
  restDuration: TIMER_DEFAULT.restDuration, // 休息时长（分钟）
  remaining: TIMER_DEFAULT.studyDuration * 60 // 剩余秒数（展示用）
})

export default function useTimer() {
  /** 阶段中文标识（专注 / 休息 / 待开始） */
  const phaseLabel = computed(() => {
    switch (state.phase) {
      case TIMER_PHASE.STUDY:
        return '专注'
      case TIMER_PHASE.REST:
        return '休息'
      default:
        return '待开始'
    }
  })

  /** 当前阶段总时长（秒），用于表盘环形进度 */
  const totalSeconds = computed(() => {
    const mins = state.phase === TIMER_PHASE.REST ? state.restDuration : state.studyDuration
    return mins * 60
  })

  /**
   * 设置时长配置
   * TODO(Phase 4): 走 writeWithFallback 保存配置 + 校验
   */
  function setDurations({ study, rest }) {
    if (study != null) {
      state.studyDuration = study
      if (!state.running) state.remaining = study * 60
    }
    if (rest != null) state.restDuration = rest
  }

  /** 开始计时 TODO(Phase 4): 时间戳差值法倒计时 */
  function start() {
    // Phase 4 实现：endAt = Date.now() + remaining*1000；startTick()
  }

  /** 暂停计时 TODO(Phase 4) */
  function pause() {
    // Phase 4 实现：clearInterval + 保留 remaining
  }

  /** 重置：恢复初始设定时长（纯状态操作） */
  function reset() {
    state.phase = TIMER_PHASE.IDLE
    state.running = false
    state.remaining = state.studyDuration * 60
  }

  return { state, phaseLabel, totalSeconds, setDurations, start, pause, reset }
}
