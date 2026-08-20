<template>
  <li class="task-item" :class="{ 'task-item--done': isDone }">
    <button
      class="task-item__toggle"
      :aria-label="isDone ? '标记为未完成' : '标记为已完成'"
      @click="$emit('toggle', task.id)"
    >
      <span v-if="isDone" class="task-item__check">✓</span>
    </button>

    <div class="task-item__body">
      <p class="task-item__content">{{ task.content }}</p>
      <p v-if="task.description" class="task-item__desc">{{ task.description }}</p>
    </div>

    <div class="task-item__actions">
      <button class="task-item__btn" @click="$emit('edit', task)">编辑</button>
      <button class="task-item__btn task-item__btn--danger" @click="$emit('delete', task.id)">
        删除
      </button>
    </div>
  </li>
</template>

<script setup>
// 单条任务：状态切换（置灰 + 划线）、编辑、删除
import { computed } from 'vue'
import { TASK_STATUS } from '@/constants'

const props = defineProps({
  task: { type: Object, required: true }
})
defineEmits(['toggle', 'edit', 'delete'])

const isDone = computed(() => props.task.status === TASK_STATUS.DONE)
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.task-item:hover {
  border-color: var(--color-text-light);
}

.task-item__toggle {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 2px solid var(--color-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  transition: background var(--transition-fast), border-color var(--transition-fast);
}

.task-item__toggle:hover {
  border-color: var(--color-success);
}

/* 已完成：勾选框变绿 */
.task-item--done .task-item__toggle {
  background: var(--color-success);
  border-color: var(--color-success);
}

.task-item__check {
  line-height: 1;
}

.task-item__body {
  flex: 1;
  min-width: 0;
}

.task-item__content {
  font-size: var(--text-md);
  word-break: break-all;
  transition: color var(--transition-fast);
}

.task-item__desc {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  word-break: break-all;
}

/* 已完成：文字置灰 + 删除线（明显但不过度） */
.task-item--done .task-item__content {
  color: var(--color-text-light);
  text-decoration: line-through;
}

.task-item__actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.task-item__btn {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.task-item__btn:hover {
  color: var(--color-primary);
}

.task-item__btn--danger:hover {
  color: var(--color-danger);
}
</style>
