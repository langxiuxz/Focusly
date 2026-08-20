<template>
  <Transition name="toast">
    <div v-if="state.visible" class="toast" role="status">{{ state.message }}</div>
  </Transition>
</template>

<script setup>
// 全局轻提示：读取 useToast 单例状态，任何模块调用 useToast().show() 即可在此显示
import useToast from '@/composables/useToast'

const { state } = useToast()
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-text);
  color: #fff;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 14px;
  box-shadow: var(--shadow-card);
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
