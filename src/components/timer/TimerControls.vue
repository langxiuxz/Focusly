<template>
  <div class="controls">
    <button v-if="!running" class="btn btn--lg btn--block" @click="$emit('start')">开始</button>
    <button v-else class="btn btn--ghost btn--lg btn--block" @click="$emit('pause')">暂停</button>
    <button class="btn btn--ghost btn--block" @click="$emit('reset')">重置</button>
  </div>
</template>

<script setup>
// 计时控制：开始 / 暂停 / 重置（running 控制开始与暂停按钮切换）
defineProps({
  running: { type: Boolean, default: false }
})
defineEmits(['start', 'pause', 'reset'])
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
