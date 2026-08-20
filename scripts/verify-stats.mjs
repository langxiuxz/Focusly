/**
 * 统计聚合纯函数验收测试（Node 环境）。
 * 运行：node scripts/verify-stats.mjs
 *
 * 覆盖：无学习记录 / 多条学习记录 / 7天与30天窗口边界 / 趋势补零与排序。
 */
import assert from 'node:assert/strict'
import { aggregateDaily } from '../src/utils/stats.js'

// 固定窗口结束日：2026-08-20（本地时区）
const END = new Date(2026, 7, 20)

const results = []
function test(name, fn) {
  try {
    fn()
    results.push({ name, pass: true })
  } catch (e) {
    results.push({ name, pass: false, error: e.message })
  }
}

// 1. 无学习记录：总时长为 0，趋势全为 0
test('无学习记录', () => {
  const { total, trend } = aggregateDaily([], 7, END)
  assert.equal(total, 0)
  assert.equal(trend.length, 7)
  assert.ok(trend.every((d) => d.studyTime === 0))
})

// 2. 多条学习记录：仅统计窗口内、缺失补 0、旧 → 新排序
test('多条学习记录（近7天窗口）', () => {
  const log = [
    { date: '2026-08-20', minutes: 30 },
    { date: '2026-08-18', minutes: 25 },
    { date: '2026-08-10', minutes: 100 }, // 窗口外
    { date: '2026-08-01', minutes: 50 } // 窗口外
  ]
  const { total, trend } = aggregateDaily(log, 7, END)
  assert.equal(total, 55, '窗口外记录不计入')
  assert.equal(trend.length, 7)
  assert.equal(trend[0].date, '2026-08-14')
  assert.equal(trend[0].studyTime, 0)
  assert.equal(trend[4].date, '2026-08-18')
  assert.equal(trend[4].studyTime, 25)
  assert.equal(trend[6].date, '2026-08-20')
  assert.equal(trend[6].studyTime, 30)
})

// 3. 30 天窗口包含更早记录
test('近30天窗口统计', () => {
  const log = [
    { date: '2026-08-20', minutes: 30 },
    { date: '2026-08-18', minutes: 25 },
    { date: '2026-08-10', minutes: 100 },
    { date: '2026-08-01', minutes: 50 }
  ]
  const { total, trend } = aggregateDaily(log, 30, END)
  assert.equal(total, 205, '30天窗口应计入所有记录')
  assert.equal(trend.length, 30)
})

// 4. 同日多条记录会覆盖为最后一条（实际由 recordFocusSession 累加，此处验证 Map 去重行为）
test('同日记录按日期去重', () => {
  const log = [
    { date: '2026-08-20', minutes: 30 },
    { date: '2026-08-20', minutes: 45 } // 日志应为累加后的 45
  ]
  const { total } = aggregateDaily(log, 7, END)
  assert.equal(total, 45)
})

// ---- 输出 ----
let passCount = 0
for (const r of results) {
  if (r.pass) passCount++
  console.log(`${r.pass ? '✅' : '❌'} ${r.name}${r.pass ? '' : ` —— ${r.error}`}`)
}
console.log(`\n${passCount}/${results.length} 通过`)
if (passCount !== results.length) process.exit(1)
