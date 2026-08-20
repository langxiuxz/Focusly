/**
 * Mock + LocalStorage 双层数据适配器（核心）。
 *
 * 总原则：LocalStorage 是真相源，Mock 是「优先尝试的通道」。
 *  - 读：优先请求接口，成功则同步写回本地；失败则读本地兜底。
 *  - 写：先乐观落本地，再尝试同步接口；失败则进入待同步队列，联网后重放。
 *
 * 背景：Apifox 普通 Mock 是静态的（POST 不真入库），因此远端永远不反向覆盖本地。
 */
import request from '@/services/request'
import { getStorage, setStorage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

/**
 * 读操作：接口优先 + 本地兜底
 * @param {Function} apiFn 接口请求函数
 * @param {string} storageKey 本地缓存 key
 * @param {*} fallback 默认值
 * @returns {Promise<*>} 数据
 */
export async function readWithFallback(apiFn, storageKey, fallback) {
  try {
    const data = await apiFn()
    setStorage(storageKey, data) // 成功后同步最新数据到本地缓存
    return data
  } catch (e) {
    console.warn(`[adapter] 接口读取失败，降级本地缓存：${storageKey}`, e.message)
    return getStorage(storageKey, fallback)
  }
}

/**
 * 写操作：本地乐观更新 + 待同步队列
 * @param {string} storageKey 本地缓存 key
 * @param {*} newData 更新后的完整本地数据
 * @param {object} syncConfig 待同步的请求配置（{ url, method, data?, params? }）
 * @returns {Promise<*>} 本地更新后的数据
 */
export async function writeWithFallback(storageKey, newData, syncConfig) {
  // 1. 先乐观落本地，保证即时可用、刷新不丢
  setStorage(storageKey, newData)

  // 2. 记录待同步操作
  const pending = getStorage(STORAGE_KEYS.PENDING_SYNC, [])
  pending.push(syncConfig)
  setStorage(STORAGE_KEYS.PENDING_SYNC, pending)

  // 3. 尝试同步远端（失败静默，保留待同步队列）
  try {
    await request(syncConfig)
  } catch (e) {
    console.warn(`[adapter] 远端同步失败，保留待同步队列：${syncConfig.url}`, e.message)
  }

  return newData
}

/**
 * 重放待同步队列（联网恢复 / 下次启动时调用）
 * 重放成功的操作出队，失败的保留等待下次。
 */
export async function replayPendingSync() {
  const pending = getStorage(STORAGE_KEYS.PENDING_SYNC, [])
  if (!pending.length) return

  const remaining = []
  for (const item of pending) {
    try {
      await request(item)
    } catch (e) {
      remaining.push(item)
    }
  }
  setStorage(STORAGE_KEYS.PENDING_SYNC, remaining)
}
