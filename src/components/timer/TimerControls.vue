<template>
  <div class="controls">
    <!-- 待开始 → 开始；运行 → 暂停；暂停 → 继续（由单一 status 决定，无冲突 boolean） -->
    <button v-if="status === 'idle'" class="btn btn--lg btn--block" @click="$emit('start')">
      开始
    </button>
    <button
      v-else-if="status === 'running'"
      class="btn btn--ghost btn--lg btn--block"
      @click="$emit('pause')"
    >
      暂停
    </button>
    <button v-else class="btn btn--lg btn--block" @click="$emit('resume')">继续</button>

    <button class="btn btn--ghost btn--block" @click="$emit('reset')">重置</button>
  </div>
</template>

<script setup>
// 计时控制：开始 / 暂停 / 继续 / 重置（status 单一状态驱动按钮切换）
defineProps({
  status: { type: String, default: 'idle' } // idle | running | paused
})
defineEmits(['start', 'pause', 'resume', 'reset'])
</script>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
