/**
 * 番茄计时核心逻辑验收测试（Node 环境，无 Vue/DOM 依赖）。
 * 运行：node scripts/verify-timer.mjs
 *
 * 覆盖 10 项计时稳定性验收用例 + 时长输入校验。
 * 通过注入 now / setInterval / clearInterval，精确模拟真实时间推进与定时器行为，
 * 验证「基于时间戳」的无漂移倒计时与「单一定时器」的稳定性。
 */
import assert from 'node:assert/strict'
import { createTimerCore } from '../src/composables/timerCore.js'
import { validateDuration } from '../src/utils/validators.js'
import { TIMER_MODE, TIMER_STATUS } from '../src/constants/index.js'

const FOCUS = 25 // 默认专注分钟
const REST = 5 // 默认休息分钟

/** 可控时钟：手动推进时间 + 手动触发定时器回调，精确断言定时器数量 */
function createMockClock() {
  let now = 1_000_000
  let seq = 0
  const timers = new Map()
  return {
    now: () => now,
    advance(ms) {
      now += ms
    },
    setInterval(fn) {
      const id = ++seq
      timers.set(id, fn)
      return id
    },
    clearInterval(id) {
      timers.delete(id)
    },
    tick() {
      for (const fn of [...timers.values()]) fn()
    },
    activeCount() {
      return timers.size
    }
  }
}

function freshState() {
  return {
    mode: TIMER_MODE.FOCUS,
    status: TIMER_STATUS.IDLE,
    remaining: FOCUS * 60,
    focusDuration: FOCUS,
    restDuration: REST
  }
}

function makeCore(clock, state = freshState()) {
  return createTimerCore({
    state,
    now: clock.now,
    setIntervalFn: clock.setInterval,
    clearIntervalFn: clock.clearInterval,
    tickMs: 250
  })
}

const results = []
function test(name, fn) {
  try {
    fn()
    results.push({ name, pass: true })
  } catch (e) {
    results.push({ name, pass: false, error: e.message })
  }
}

// 1. 连续点击开始 10 次：只允许一个定时器
test('连续点击开始 10 次仅一个定时器', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  for (let i = 0; i < 10; i++) core.start()
  assert.equal(clock.activeCount(), 1)
  assert.equal(state.status, TIMER_STATUS.RUNNING)
  assert.equal(state.remaining, FOCUS * 60)
})

// 2. 开始 → 暂停 → 继续
test('开始→暂停→继续', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.start()
  clock.advance(1000)
  clock.tick()
  core.pause()
  assert.equal(clock.activeCount(), 0)
  assert.equal(state.status, TIMER_STATUS.PAUSED)
  const remainingAtPause = state.remaining
  clock.advance(3600 * 1000) // 暂停期间时间流逝 1 小时
  core.resume()
  assert.equal(clock.activeCount(), 1)
  assert.equal(state.status, TIMER_STATUS.RUNNING)
  assert.equal(state.remaining, remainingAtPause, '继续后应从暂停点继续，不跳变')
})

// 3. 开始 → 重置
test('开始→重置', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.start()
  clock.advance(1000)
  clock.tick()
  core.reset()
  assert.equal(clock.activeCount(), 0)
  assert.equal(state.status, TIMER_STATUS.IDLE)
  assert.equal(state.mode, TIMER_MODE.FOCUS)
  assert.equal(state.remaining, FOCUS * 60)
})

// 4. 重置 → 开始
test('重置→开始', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.reset()
  core.start()
  assert.equal(clock.activeCount(), 1)
  assert.equal(state.status, TIMER_STATUS.RUNNING)
  assert.equal(state.remaining, FOCUS * 60)
})

// 5. 专注结束：自动切换休息 + 重载休息倒计时 + 触发完成回调
test('专注结束自动切换休息', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  const completed = []
  core.setOnComplete((m) => completed.push(m))
  core.start()
  clock.advance(FOCUS * 60 * 1000)
  clock.tick()
  assert.deepEqual(completed, [TIMER_MODE.FOCUS])
  assert.equal(state.mode, TIMER_MODE.REST)
  assert.equal(state.status, TIMER_STATUS.IDLE)
  assert.equal(state.remaining, REST * 60)
  assert.equal(clock.activeCount(), 0)
})

// 6. 休息结束：可继续专注 + 触发完成回调
test('休息结束可继续专注', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  const completed = []
  core.setOnComplete((m) => completed.push(m))
  core.start() // 专注
  clock.advance(FOCUS * 60 * 1000)
  clock.tick()
  core.start() // 休息
  assert.equal(state.mode, TIMER_MODE.REST)
  clock.advance(REST * 60 * 1000)
  clock.tick()
  assert.deepEqual(completed, [TIMER_MODE.FOCUS, TIMER_MODE.REST])
  assert.equal(state.mode, TIMER_MODE.FOCUS)
  assert.equal(state.status, TIMER_STATUS.IDLE)
  assert.equal(state.remaining, FOCUS * 60)
})

// 7. 修改时间后开始
test('修改时间后开始', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.setDurations({ focus: 30, rest: 10 })
  assert.equal(state.remaining, 30 * 60, '空闲态修改专注时长立即生效')
  core.start()
  assert.equal(state.remaining, 30 * 60)
  assert.equal(state.focusDuration, 30)
  assert.equal(state.restDuration, 10)
})

// 8. 页面刷新：全新模块初始化应无幽灵定时器、回到待开始
test('页面刷新（重新初始化）无幽灵定时器', () => {
  const clock = createMockClock()
  const state = freshState()
  makeCore(clock, state)
  assert.equal(clock.activeCount(), 0)
  assert.equal(state.status, TIMER_STATUS.IDLE)
  assert.equal(state.mode, TIMER_MODE.FOCUS)
  assert.equal(state.remaining, FOCUS * 60)
})

// 9. 切换页面 / 组件卸载：dispose 清理定时器
test('组件卸载 dispose 清理定时器', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.start()
  assert.equal(clock.activeCount(), 1)
  core.dispose()
  assert.equal(clock.activeCount(), 0)
  assert.equal(state.status, TIMER_STATUS.PAUSED)
})

// 10. 长时间运行：时间戳法无漂移
test('长时间运行无漂移（时间戳法）', () => {
  const clock = createMockClock()
  const state = freshState()
  const core = makeCore(clock, state)
  core.start()
  clock.advance(5 * 60 * 1000) // 漏掉中间所有 tick，直接跳 5 分钟
  clock.tick()
  assert.equal(state.remaining, FOCUS * 60 - 5 * 60, '剩余时间按真实时间戳计算，不漏秒')
  clock.advance(20 * 60 * 1000)
  clock.tick()
  assert.equal(state.mode, TIMER_MODE.REST, '到达 25 分钟后完成专注')
})

// ---- 时长输入校验 ----
test('校验：空值禁止', () => {
  const r = validateDuration('', 'focus')
  assert.equal(r.valid, false)
  assert.equal(r.message, '专注时长不能为空')
})

test('校验：非数字禁止', () => {
  const r = validateDuration('abc', 'focus')
  assert.equal(r.valid, false)
  assert.equal(r.message, '专注时长必须为数字')
})

test('校验：小于等于 0 禁止', () => {
  assert.equal(validateDuration('0', 'focus').valid, false)
  assert.equal(validateDuration('-5', 'rest').valid, false)
  assert.equal(validateDuration('0', 'rest').message, '休息时长必须大于 0')
})

test('校验：范围限制与合法值', () => {
  assert.equal(validateDuration('30', 'focus').valid, true)
  assert.equal(validateDuration('30', 'focus').value, 30)
  assert.equal(validateDuration('200', 'focus').valid, false)
  assert.equal(validateDuration('61', 'rest').valid, false)
})

// ---- 输出结果 ----
let passCount = 0
for (const r of results) {
  if (r.pass) passCount++
  console.log(`${r.pass ? '✅' : '❌'} ${r.name}${r.pass ? '' : ` —— ${r.error}`}`)
}
console.log(`\n${passCount}/${results.length} 通过`)
if (passCount !== results.length) process.exit(1)
