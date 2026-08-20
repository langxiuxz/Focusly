<template>
  <section class="task-panel card">
    <div class="task-panel__head">
      <div>
        <h2 class="section-title">学习任务</h2>
        <p class="section-desc">管理你的学习目标</p>
      </div>
      <span class="task-panel__count">{{ state.tasks.length }}</span>
    </div>

    <TaskInput @add="addTask" />
    <TaskList
      :tasks="state.tasks"
      @toggle="toggleTask"
      @edit="editTask"
      @delete="removeTask"
      @clear="clearTasks"
    />
  </section>
</template>

<script setup>
// 任务区容器：数据统一来自 useTask
import useTask from '@/composables/useTask'
import TaskInput from './TaskInput.vue'
import TaskList from './TaskList.vue'

const { state, addTask, toggleTask, removeTask, clearTasks } = useTask()

// 编辑任务（Phase 4 接入编辑态）
function editTask(task) {
  console.log('[TaskPanel] 编辑任务（Phase 4 实现）', task)
}
</script>

<style scoped>
.task-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.task-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-panel__count {
  min-width: 28px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: 600;
  text-align: center;
}
</style>
