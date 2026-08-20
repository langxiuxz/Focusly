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
      <template v-if="editing">
        <input
          class="input task-item__edit"
          v-model="draft"
          type="text"
          maxlength="60"
          @keyup.enter="save"
          @keyup.esc="cancel"
        />
      </template>
      <template v-else>
        <p class="task-item__content">{{ task.content }}</p>
        <p v-if="task.description" class="task-item__desc">{{ task.description }}</p>
      </template>
    </div>

    <div class="task-item__actions">
      <template v-if="editing">
        <button class="task-item__btn" @click="save">保存</button>
        <button class="task-item__btn" @click="cancel">取消</button>
      </template>
      <template v-else>
        <button class="task-item__btn" @click="startEdit">编辑</button>
        <button class="task-item__btn task-item__btn--danger" @click="$emit('delete', task.id)">
          删除
        </button>
      </template>
    </div>
  </li>
</template>

<script setup>
// 单条任务：状态切换（置灰 + 划线）、内联编辑、删除
import { computed, ref } from 'vue'
import { TASK_STATUS } from '@/constants'

const props = defineProps({
  task: { type: Object, required: true }
})
const emit = defineEmits(['toggle', 'update', 'delete'])

const isDone = computed(() => props.task.status === TASK_STATUS.DONE)

const editing = ref(false)
const draft = ref('')

function startEdit() {
  draft.value = props.task.content
  editing.value = true
}

function save() {
  const text = draft.value.trim()
  if (!text) return // 空任务禁止保存
  emit('update', { id: props.task.id, content: text })
  editing.value = false
}

function cancel() {
  editing.value = false
}
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

.task-item__edit {
  padding: 6px 10px;
  font-size: var(--text-md);
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
