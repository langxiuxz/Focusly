<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-mask" @click.self="$emit('cancel')">
        <div class="modal" role="dialog" aria-modal="true">
          <h3 class="modal__title">{{ title }}</h3>
          <p class="modal__body">{{ message }}</p>
          <div class="modal__actions">
            <button class="btn btn--ghost" @click="$emit('cancel')">取消</button>
            <button class="btn btn--danger" @click="$emit('confirm')">确定</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
// 确认弹窗：用于「一键清空任务」「删除任务」等不可逆操作
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '' }
})
defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.modal-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1001;
  padding: 20px;
}

.modal {
  width: 100%;
  max-width: 320px;
  background: var(--color-card);
  border-radius: var(--radius-card);
  padding: 20px;
}

.modal__title {
  font-size: 16px;
  margin-bottom: 8px;
}

.modal__body {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 20px;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
