<template>
  <div class="summary">
    <div class="summary__item">
      <span class="summary__value">{{ summary.today }}<i class="summary__unit">分钟</i></span>
      <span class="summary__label">今日专注</span>
    </div>
    <div class="summary__item">
      <span class="summary__value">{{ summary.week }}<i class="summary__unit">分钟</i></span>
      <span class="summary__label">近7天</span>
    </div>
    <div class="summary__item">
      <span class="summary__value">{{ summary.month }}<i class="summary__unit">分钟</i></span>
      <span class="summary__label">近30天</span>
    </div>
    <div class="summary__item">
      <span
        class="summary__value summary__value--status"
        :class="{ 'summary__value--clocked': clocked }"
      >
        {{ clocked ? '已打卡' : '未打卡' }}
      </span>
      <span class="summary__label">今日打卡</span>
    </div>
  </div>
</template>

<script setup>
// 汇总卡片：今日 / 近7天 / 近30天累计专注时长 + 今日打卡状态
defineProps({
  summary: { type: Object, default: () => ({ today: 0, week: 0, month: 0 }) },
  clocked: { type: Boolean, default: false }
})
</script>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.summary__value {
  font-family: var(--font-num);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-primary);
}

.summary__unit {
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-text-secondary);
  font-style: normal;
  margin-left: 2px;
}

/* 打卡状态：非数字，用普通字体，绿色/灰色区分 */
.summary__value--status {
  font-family: var(--font-main);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
}

.summary__value--clocked {
  color: var(--color-success);
}

.summary__label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

@media (max-width: 480px) {
  .summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary__value {
    font-size: 20px;
  }
}
</style>
