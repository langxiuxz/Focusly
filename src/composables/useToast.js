/**
 * 全局轻提示（module 级 reactive 单例）。
 * 任意模块调用 useToast().show(msg) 即可在唯一的 AppToast 上显示。
 */
import { reactive } from 'vue'

const state = reactive({
  visible: false,
  message: ''
})

let timer = null

/** 显示提示，duration 毫秒后自动隐藏 */
function show(message, duration = 2500) {
  state.message = message
  state.visible = true
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    state.visible = false
  }, duration)
}

export default function useToast() {
  return { state, show }
}
