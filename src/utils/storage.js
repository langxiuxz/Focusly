/**
 * LocalStorage 安全统一封装（storage.get / set / remove）。
 * 统一 JSON 序列化，处理配额超限 / 数据损坏 / 隐私模式禁用等异常，
 * 保证「接口返回」与「本地缓存」可直接互换，且不因存储异常导致页面报错。
 *
 * 业务代码一律通过本封装访问本地缓存，禁止散落的 localStorage.setItem(...)。
 */
const PREFIX = 'focusly:'

const storage = {
  /**
   * 读取缓存
   * @param {string} key 存储 key
   * @param {*} fallback 读取失败或不存在时的默认值
   * @returns {*} 解析后的值
   */
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key)
      if (raw === null) return fallback
      return JSON.parse(raw)
    } catch (e) {
      console.warn(`[storage] 读取 ${key} 失败，使用默认值`, e)
      return fallback
    }
  },

  /**
   * 写入缓存
   * @param {string} key 存储 key
   * @param {*} value 待写入值（自动 JSON 序列化）
   * @returns {boolean} 是否写入成功
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.warn(`[storage] 写入 ${key} 失败`, e)
      return false
    }
  },

  /**
   * 删除缓存
   * @param {string} key 存储 key
   */
  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.warn(`[storage] 删除 ${key} 失败`, e)
    }
  },

  /**
   * 按前缀清空本项目缓存
   * @param {string} prefix key 前缀
   */
  clearByPrefix(prefix = PREFIX) {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(prefix))
      keys.forEach((k) => localStorage.removeItem(k))
    } catch (e) {
      console.warn('[storage] 清空失败', e)
    }
  }
}

export default storage
