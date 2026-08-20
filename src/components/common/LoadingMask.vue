<template>
  <Transition name="fade">
    <div v-if="visible" class="loading-mask">
      <div class="loading-mask__spinner"></div>
      <p class="loading-mask__text">加载中...</p>
    </div>
  </Transition>
</template>

<script setup>
// 全局加载遮罩：订阅 request.js 的 loading 计数（有请求进行中即显示）
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoadingChange } from '@/services/request'

const visible = ref(false)
let unsubscribe = null

onMounted(() => {
  unsubscribe = onLoadingChange((loading) => (visible.value = loading))
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<style scoped>
.loading-mask {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 999;
}

.loading-mask__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-primary-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-mask__text {
  margin-top: 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
