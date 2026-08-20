/**
 * 全局常量集中管理，消除魔法字符串。
 * 存储 key 与接口返回的数据结构保持一致，保证接口数据 / 本地缓存可直接互换。
 */

// ---------- LocalStorage 存储 key ----------
export const STORAGE_KEYS = {
  TIMER_CONFIG: 'focusly:timerConfig', // 计时器配置
  TASKS: 'focusly:tasks', // 学习任务列表
  CLOCKS: 'focusly:clocks', // 打卡记录列表
  TODAY_STUDY: 'focusly:todayStudyTime', // 今日累计专注时长（分钟）
  PENDING_SYNC: 'focusly:pendingSync' // 待同步操作队列
}

// ---------- 计时器默认值 ----------
export const TIMER_DEFAULT = {
  focusDuration: 25, // 默认专注时长（分钟）
  restDuration: 5 // 默认休息时长（分钟）
}

// 时长输入范围（与后端 Mock 校验一致）
export const TIMER_RANGE = {
  focus: { min: 1, max: 180 }, // 专注时长范围（分钟）
  rest: { min: 1, max: 60 } // 休息时长范围（分钟）
}

// 计时模式
export const TIMER_MODE = {
  FOCUS: 'focus', // 专注
  REST: 'rest' // 休息
}

// 计时运行状态（单一状态，避免多个互相冲突的 boolean）
export const TIMER_STATUS = {
  IDLE: 'idle', // 待开始
  RUNNING: 'running', // 运行中
  PAUSED: 'paused' // 已暂停
}

// ---------- 任务状态 ----------
export const TASK_STATUS = {
  TODO: '0', // 未完成（字符串，非数字）
  DONE: '1' // 已完成
}

// 任务内容长度限制（与后端 Mock 校验一致）
export const TASK_LIMIT = {
  contentMax: 60,
  descriptionMax: 160
}

// ---------- 统计 ----------
export const STAT_RANGE = {
  WEEK: 'week', // 近 7 天
  MONTH: 'month' // 近 30 天
}
