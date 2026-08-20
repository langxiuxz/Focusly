<template>
  <div class="duration">
    <label class="duration__item">
      <span class="duration__label">学习时长</span>
      <div class="duration__field">
        <input
          class="input"
          type="number"
          :value="study"
          min="1"
          max="180"
          @change="onStudyChange"
        />
        <span class="duration__unit">分钟</span>
      </div>
    </label>

    <label class="duration__item">
      <span class="duration__label">休息时长</span>
      <div class="duration__field">
        <input
          class="input"
          type="number"
          :value="rest"
          min="1"
          max="60"
          @change="onRestChange"
        />
        <span class="duration__unit">分钟</span>
      </div>
    </label>
  </div>
</template>

<script setup>
// 时长自定义输入（单位分钟）。容错校验在 Phase 4 由 validators 处理
const props = defineProps({
  study: { type: Number, default: 25 },
  rest: { type: Number, default: 5 }
})
const emit = defineEmits(['change'])

function onStudyChange(e) {
  emit('change', { study: Number(e.target.value), rest: props.rest })
}

function onRestChange(e) {
  emit('change', { study: props.study, rest: Number(e.target.value) })
}
</script>

<style scoped>
.duration {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.duration__item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.duration__label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.duration__field {
  position: relative;
}

.duration__field .input {
  padding-right: 48px; /* 为「分钟」单位留出空间 */
}

.duration__unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

/* 手机端：时长输入纵向排列 */
@media (max-width: 480px) {
  .duration {
    grid-template-columns: 1fr;
  }
}
</style>
