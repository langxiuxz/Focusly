<template>
  <div class="task-list">
    <ul v-if="tasks.length" class="task-list__items">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </ul>
    <p v-else class="empty-state">暂无任务，添加一个开始专注吧～</p>

    <button
      v-if="tasks.length"
      class="btn btn--ghost btn--block task-list__clear"
      @click="$emit('clear')"
    >
      一键清空
    </button>
  </div>
</template>

<script setup>
// 任务列表：渲染任务项 + 一键清空
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: { type: Array, default: () => [] }
})
defineEmits(['toggle', 'edit', 'delete', 'clear'])
</script>

<style scoped>
.task-list__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-list__clear {
  margin-top: 12px;
}
</style>
