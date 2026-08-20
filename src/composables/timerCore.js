/**
 * 番茄计时器核心状态机（纯逻辑，无 Vue / DOM 依赖，可在 Node 中单测）。
 *
 * 状态设计（单一 status，避免多个互相冲突的 boolean）：
 *   mode:      focus | rest          —— 当前模式
 *   status:    idle | running | paused —— 运行状态
 *   remaining: 当前剩余秒数
 *   focusDuration / restDuration:     —— 初始时长（分钟）
 *
 * 「完成」是瞬态事件：remaining 归零时触发 onComplete 回调并切换模式，
 * 不设持久 completed 标志，避免与 status 冲突。
 *
 * 计时稳定性：
 *   - 基于时间戳计算剩余（endAt = now + remaining*1000），每次 tick 用 endAt - now 重算，杜绝漂移；
 *   - 全局单一 timerId，启动前先 clearInterval，杜绝叠加；
 *   - 后台标签页 setInterval 会被浏览器节流，但时间戳保证回到前台立即校准。
 */
import { TIMER_MODE, TIMER_STATUS } from '../constants/index.js'

export function createTimerCore({
  state,
  now = () => Date.now(),
  setIntervalFn = setInterval,
  clearIntervalFn = clearInterval,
  tickMs = 250
}) {
  let timerId = null
  let endAt = null
  let onComplete = null

  /** 当前模式总时长（秒） */
  function totalSeconds() {
    const mins = state.mode === TIMER_MODE.FOCUS ? state.focusDuration : state.restDuration
    return mins * 60
  }

  /** 清空定时器（唯一清除入口） */
  function stopTick() {
    if (timerId !== null) {
      clearIntervalFn(timerId)
      timerId = null
    }
    endAt = null
  }

  /** 根据时间戳重新计算剩余；归零则触发完成 */
  function syncRemaining() {
    if (endAt === null) return
    const remainingMs = endAt - now()
    state.remaining = Math.max(0, Math.ceil(remainingMs / 1000))
    if (remainingMs <= 0) complete()
  }

  /** 完成：切换模式 + 重载倒计时 + 触发回调 */
  function complete() {
    const finished = state.mode
    stopTick()
    if (finished === TIMER_MODE.FOCUS) {
      // 专注结束 → 自动切休息
      state.mode = TIMER_MODE.REST
      state.status = TIMER_STATUS.IDLE
      state.remaining = state.restDuration * 60
    } else {
      // 休息结束 → 切回专注（待开始）
      state.mode = TIMER_MODE.FOCUS
      state.status = TIMER_STATUS.IDLE
      state.remaining = state.focusDuration * 60
    }
    if (onComplete) onComplete(finished)
  }

  /** 启动倒计时（唯一启动入口，先清再启） */
  function beginTick() {
    stopTick()
    endAt = now() + state.remaining * 1000
    state.status = TIMER_STATUS.RUNNING
    timerId = setIntervalFn(syncRemaining, tickMs)
  }

  /** 开始（仅空闲态） */
  function start() {
    if (state.status !== TIMER_STATUS.IDLE) return
    state.remaining = totalSeconds()
    beginTick()
  }

  /** 继续（仅暂停态） */
  function resume() {
    if (state.status !== TIMER_STATUS.PAUSED) return
    beginTick()
  }

  /** 暂停（仅运行态） */
  function pause() {
    if (state.status !== TIMER_STATUS.RUNNING) return
    syncRemaining() // 暂停前校准一次
    stopTick()
    state.status = TIMER_STATUS.PAUSED
  }

  /** 重置：回到专注待开始 */
  function reset() {
    stopTick()
    state.mode = TIMER_MODE.FOCUS
    state.status = TIMER_STATUS.IDLE
    state.remaining = state.focusDuration * 60
  }

  /** 设置时长（空闲态立即生效，运行/暂停态仅保存、下次生效） */
  function setDurations({ focus, rest }) {
    if (focus != null) {
      state.focusDuration = focus
      if (state.status === TIMER_STATUS.IDLE && state.mode === TIMER_MODE.FOCUS) {
        state.remaining = focus * 60
      }
    }
    if (rest != null) {
      state.restDuration = rest
      if (state.status === TIMER_STATUS.IDLE && state.mode === TIMER_MODE.REST) {
        state.remaining = rest * 60
      }
    }
  }

  /** 注册完成回调 */
  function setOnComplete(fn) {
    onComplete = fn
  }

  /** 销毁：清定时器（组件卸载时调用） */
  function dispose() {
    stopTick()
    if (state.status === TIMER_STATUS.RUNNING) {
      state.status = TIMER_STATUS.PAUSED
    }
  }

  return {
    totalSeconds,
    syncRemaining,
    start,
    resume,
    pause,
    reset,
    setDurations,
    setOnComplete,
    dispose
  }
}
