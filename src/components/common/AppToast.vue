<template>
  <Transition name="toast">
    <div v-if="show" class="toast" role="status">{{ message }}</div>
  </Transition>
</template>

<script setup>
// 轻提示：由父组件通过 show/message 控制显隐（文字提醒复用，如计时结束、重复打卡等）
defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
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
  border-radius: var(--radius-btn);
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
