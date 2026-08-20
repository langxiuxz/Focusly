/**
 * 计时器领域状态（module 级 reactive 单例）。
 *
 * 状态设计（单一 status，避免多个互相冲突的 boolean）：
 *   mode: focus | rest                 —— 当前模式
 *   status: idle | running | paused    —— 运行状态
 *   remaining: 当前剩余秒数
 *   focusDuration / restDuration:      —— 初始时长（分钟）
 *
 * 「完成」是瞬态事件：归零 → 切换模式 + 记录专注 + 提示，不设持久 completed 标志。
 * 计时核心（时间戳差值法 / 单一定时器 / 生命周期清理）见 timerCore.js。
 */
import { reactive, computed } from 'vue'
import { createTimerCore } from './timerCore'
import { TIMER_MODE, TIMER_STATUS, TIMER_DEFAULT, STORAGE_KEYS } from '@/constants'
import storage from '@/utils/storage'
import { readWithFallback, writeWithFallback } from '@/services/mock/adapter'
import { timerService } from '@/services/api/timer'
import useToast from './useToast'
import { recordFocusSession } from './useStudyRecord'

// 计时配置以 LocalStorage 为真相源（Mock 为静态，避免其反向覆盖用户自定义时长）。
// 同步读本地，保证首屏立即渲染；异步部分通过双层适配器播种/兜底。
function loadConfig() {
  const saved = storage.get(STORAGE_KEYS.TIMER_CONFIG, null)
  return {
    focusDuration: saved?.focusDuration ?? TIMER_DEFAULT.focusDuration,
    restDuration: saved?.restDuration ?? TIMER_DEFAULT.restDuration
  }
}

const { focusDuration, restDuration } = loadConfig()

const state = reactive({
  mode: TIMER_MODE.FOCUS,
  status: TIMER_STATUS.IDLE,
  remaining: focusDuration * 60,
  focusDuration,
  restDuration
})

const { show } = useToast()

// 计时核心：注入 reactive state，内部持有唯一定时器
const core = createTimerCore({ state })

// 接口播种/兜底：本地为空时从接口读取配置（本地优先，成功后同步回本地）
readWithFallback(timerService.getConfig, STORAGE_KEYS.TIMER_CONFIG, TIMER_DEFAULT).then((cfg) => {
  const f = Number(cfg?.focusDuration)
  const r = Number(cfg?.restDuration)
  if (f && r) core.setDurations({ focus: f, rest: r })
})

// 会话快照：开始专注/休息时捕获，保证运行中修改时长不影响当前会话的记录与进度
let sessionTotalSeconds = focusDuration * 60 // 当前会话总时长（秒）
let focusSessionMinutes = focusDuration // 当前专注会话时长（分钟）

// 完成回调：专注 → 记录学习数据 + 提示休息；休息 → 提示继续专注
core.setOnComplete((finishedMode) => {
  if (finishedMode === TIMER_MODE.FOCUS) {
    recordFocusSession(focusSessionMinutes)
    show('专注结束，休息一下吧')
  } else {
    show('休息结束，继续专注吧')
  }
})

/** 阶段中文标识（专注 / 休息 / 待开始） */
const modeLabel = computed(() => {
  if (state.mode === TIMER_MODE.REST) return '休息'
  return state.status === TIMER_STATUS.IDLE ? '待开始' : '专注'
})

/** 当前会话总时长（秒），用于表盘环形进度；运行/暂停态用会话快照，空闲态用配置 */
const totalSeconds = computed(() => {
  if (state.status !== TIMER_STATUS.IDLE) return sessionTotalSeconds
  const mins = state.mode === TIMER_MODE.REST ? state.restDuration : state.focusDuration
  return mins * 60
})

/** 设置时长：空闲态立即生效；运行/暂停态仅保存、下次生效。并持久化配置（本地 + 接口） */
function setDurations({ focus, rest }) {
  core.setDurations({ focus, rest })
  const config = {
    focusDuration: state.focusDuration,
    restDuration: state.restDuration
  }
  writeWithFallback(STORAGE_KEYS.TIMER_CONFIG, config, {
    url: '/timer/config',
    method: 'put',
    data: config
  })
}

/** 开始：捕获本次会话时长（供记录与进度快照），再启动倒计时 */
function start() {
  sessionTotalSeconds =
    (state.mode === TIMER_MODE.REST ? state.restDuration : state.focusDuration) * 60
  if (state.mode === TIMER_MODE.FOCUS) focusSessionMinutes = state.focusDuration
  core.start()
}

function pause() {
  core.pause()
}

function resume() {
  core.resume()
}

function reset() {
  core.reset()
}

/** 清理定时器（组件卸载时由 TimerPanel 调用） */
function dispose() {
  core.dispose()
}

// 标签页重新可见时立即校准一次（时间戳法本身无漂移，此处仅为即时刷新显示）
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') core.syncRemaining()
  })
}

export default function useTimer() {
  return {
    state,
    modeLabel,
    totalSeconds,
    setDurations,
    start,
    pause,
    resume,
    reset,
    dispose
  }
}
