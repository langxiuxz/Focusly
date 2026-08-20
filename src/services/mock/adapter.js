/**
 * Mock + LocalStorage 双层数据适配器（核心）。
 *
 * 一致性策略（避免两套数据源互相覆盖）：
 *   - LocalStorage 为真相源；写操作先乐观落本地，再尝试同步接口。
 *   - 读操作本地优先：本地已有数据直接返回；本地为空时尝试接口播种（接口成功 → 本地）。
 *   - 接口不可用（超时/网络/错误/Mock 不可用）自动降级本地，并一次性提示用户。
 *   - 写失败进入待同步队列，下次启动重放（本地 → 接口）。
 */
import request from '@/services/request'
import storage from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'
import useToast from '@/composables/useToast'

const { show } = useToast()

// 一次性离线提示：避免每条请求失败都弹 toast
let offlineNotified = false
function notifyOffline(reason) {
  if (offlineNotified) return
  offlineNotified = true
  console.warn(`[adapter] 接口不可用，已切换本地模式：${reason}`)
  show('服务暂不可用，已切换本地模式，数据不会丢失')
}

// 进行中的读请求去重（同 key 并发读只发一次，避免重复请求）
const inflightReads = new Map()

/**
 * 读操作：本地优先 + 接口播种 + 本地兜底。
 * @param {Function} apiFn Service 层读方法（如 taskService.getTasks）
 * @param {string} storageKey 本地缓存 key
 * @param {*} fallback 接口失败且本地无数据时的默认值
 */
export async function readWithFallback(apiFn, storageKey, fallback) {
  const local = storage.get(storageKey, null)
  if (local !== null) return local // 本地已有数据：本地即真相源，直接返回

  if (inflightReads.has(storageKey)) return inflightReads.get(storageKey)
  const pending = (async () => {
    try {
      const data = await apiFn()
      storage.set(storageKey, data) // 接口成功 → 同步本地
      return data
    } catch (e) {
      notifyOffline(e.message)
      return fallback
    } finally {
      inflightReads.delete(storageKey)
    }
  })()
  inflightReads.set(storageKey, pending)
  return pending
}

// 短时间重复提交去重（同接口 + 同参数在窗口期内只发一次）
const recentWrites = new Map()
const WRITE_DEDUP_MS = 500
function dedupKey(cfg) {
  const body = cfg.data ?? cfg.params ?? ''
  return `${cfg.method} ${cfg.url} ${JSON.stringify(body)}`
}

/**
 * 写操作：本地乐观更新 + 接口同步 + 失败入队待重放。
 * @param {string} storageKey 本地缓存 key
 * @param {*} newData 完整的最新数据（落本地）
 * @param {object|null} syncConfig axios 请求配置（对应 Service 层写方法；null = 纯本地操作）
 */
export async function writeWithFallback(storageKey, newData, syncConfig) {
  // 1. 先乐观落本地（本地即真相源，刷新不丢）
  storage.set(storageKey, newData)
  if (!syncConfig) return newData // 纯本地操作（如清空）

  // 2. 短时间重复提交去重
  const key = dedupKey(syncConfig)
  const now = Date.now()
  for (const [k, t] of recentWrites) {
    if (now - t >= WRITE_DEDUP_MS) recentWrites.delete(k)
  }
  if (recentWrites.has(key) && now - recentWrites.get(key) < WRITE_DEDUP_MS) {
    return newData
  }
  recentWrites.set(key, now)

  // 3. 尝试同步接口
  try {
    await request(syncConfig)
  } catch (e) {
    // 失败：进入待同步队列，联网后由 replayPendingSync 重放
    const pending = storage.get(STORAGE_KEYS.PENDING_SYNC, [])
    pending.push(syncConfig)
    storage.set(STORAGE_KEYS.PENDING_SYNC, pending)
    notifyOffline(e.message)
  }
  return newData
}

/**
 * 重放待同步队列（应用启动时调用；成功出队，失败保留）。
 * 对应「恢复同步：LocalStorage → 接口」。
 */
export async function replayPendingSync() {
  const pending = storage.get(STORAGE_KEYS.PENDING_SYNC, [])
  if (!pending.length) return
  const remaining = []
  for (const item of pending) {
    try {
      await request(item)
    } catch (e) {
      remaining.push(item)
    }
  }
  storage.set(STORAGE_KEYS.PENDING_SYNC, remaining)
}
