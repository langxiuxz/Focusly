<template>
  <button
    class="clock-btn"
    :class="{ 'clock-btn--done': clocked }"
    :disabled="clocked"
    @click="$emit('clock')"
  >
    <span v-if="clocked" class="clock-btn__check">✓</span>
    {{ clocked ? '今日已打卡' : '立即打卡' }}
  </button>
</template>

<script setup>
// 打卡按钮：已打卡则禁用并展示状态（重复打卡拦截在 Phase 5 处理）
defineProps({
  clocked: { type: Boolean, default: false }
})
defineEmits(['clock'])
</script>

<style scoped>
.clock-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: 600;
  background: var(--color-primary);
  color: #fff;
  box-shadow: var(--shadow-sm);
  transition: background var(--transition-base), transform 0.08s ease;
}

.clock-btn:hover {
  background: var(--color-primary-dark);
}

.clock-btn:active {
  transform: scale(0.97);
}

.clock-btn--done {
  background: var(--color-success);
  cursor: default;
}

.clock-btn--done:hover {
  background: var(--color-success);
}

.clock-btn__check {
  font-weight: 700;
}
</style>
