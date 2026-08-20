<template>
  <div class="duration">
    <div class="duration__item">
      <label class="duration__label" for="duration-focus">专注时长</label>
      <div class="duration__field">
        <input
          id="duration-focus"
          class="input"
          :class="{ 'input--error': focusError }"
          type="text"
          inputmode="numeric"
          v-model="focusDraft"
          @blur="commitFocus"
        />
        <span class="duration__unit">分钟</span>
      </div>
      <p v-if="focusError" class="duration__error" role="alert">{{ focusError }}</p>
    </div>

    <div class="duration__item">
      <label class="duration__label" for="duration-rest">休息时长</label>
      <div class="duration__field">
        <input
          id="duration-rest"
          class="input"
          :class="{ 'input--error': restError }"
          type="text"
          inputmode="numeric"
          v-model="restDraft"
          @blur="commitRest"
        />
        <span class="duration__unit">分钟</span>
      </div>
      <p v-if="restError" class="duration__error" role="alert">{{ restError }}</p>
    </div>
  </div>
</template>

<script setup>
// 时长自定义输入（分钟）：本地草稿 + 失焦校验，非法输入友好提示并回退到最近有效值
import { ref } from 'vue'
import { validateDuration } from '@/utils/validators'

const props = defineProps({
  focus: { type: Number, default: 25 }, // 专注时长（分钟）
  rest: { type: Number, default: 5 } // 休息时长（分钟）
})
const emit = defineEmits(['change'])

const focusDraft = ref(props.focus)
const restDraft = ref(props.rest)
const focusError = ref('')
const restError = ref('')

function commitFocus() {
  const { valid, value, message } = validateDuration(focusDraft.value, 'focus')
  if (valid) {
    focusError.value = ''
    focusDraft.value = value // 规范化（整数）
    emit('change', { focus: value, rest: props.rest })
  } else {
    focusError.value = message
    focusDraft.value = props.focus // 回退到最近一次有效值
  }
}

function commitRest() {
  const { valid, value, message } = validateDuration(restDraft.value, 'rest')
  if (valid) {
    restError.value = ''
    restDraft.value = value
    emit('change', { focus: props.focus, rest: value })
  } else {
    restError.value = message
    restDraft.value = props.rest
  }
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

.input--error {
  border-color: var(--color-danger);
}

.duration__error {
  font-size: var(--text-xs);
  color: var(--color-danger);
}

/* 手机端：时长输入纵向排列 */
@media (max-width: 480px) {
  .duration {
    grid-template-columns: 1fr;
  }
}
</style>
