<template>
  <form class="task-input" @submit.prevent="onSubmit">
    <input
      v-model="content"
      class="input"
      type="text"
      placeholder="添加学习任务..."
      maxlength="60"
    />
    <input
      v-model="description"
      class="input"
      type="text"
      placeholder="简要描述（可选）"
      maxlength="160"
    />
    <button class="btn btn--block" type="submit">添加任务</button>
  </form>
</template>

<script setup>
// 任务新增输入：任务名称（必填）+ 简要描述（可选）。禁止空任务提交
import { ref } from 'vue'

const emit = defineEmits(['add'])
const content = ref('')
const description = ref('')

function onSubmit() {
  if (!content.value.trim()) return // 空任务拦截
  emit('add', { content: content.value.trim(), description: description.value.trim() })
  content.value = ''
  description.value = ''
}
</script>

<style scoped>
.task-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
