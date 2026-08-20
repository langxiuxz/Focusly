<template>
  <section class="clock-panel card">
    <div class="clock-panel__head">
      <div>
        <h2 class="section-title">每日打卡</h2>
        <p class="section-desc">记录今天的学习</p>
      </div>
      <span
        class="clock-panel__status"
        :class="{ 'clock-panel__status--done': state.todayClocked }"
      >
        {{ state.todayClocked ? '已打卡' : '未打卡' }}
      </span>
    </div>

    <div class="clock-panel__today">
      <span class="clock-panel__today-label">今日专注</span>
      <span class="clock-panel__today-value">
        {{ study.todayMinutes }}<i class="clock-panel__unit">分钟</i>
      </span>
    </div>

    <ClockButton :clocked="state.todayClocked" @clock="clockIn" />

    <div class="clock-panel__recent">
      <p class="clock-panel__recent-title">最近打卡</p>
      <ClockCalendar :records="state.records" />
    </div>
  </section>
</template>

<script setup>
// 打卡区容器：今日状态 + 打卡按钮 + 最近打卡记录，数据统一来自 useClock
import useClock from '@/composables/useClock'
import useStudyRecord from '@/composables/useStudyRecord'
import ClockButton from './ClockButton.vue'
import ClockCalendar from './ClockCalendar.vue'

const { state, clockIn } = useClock()
// 今日累计专注时长来自学习记录领域（useStudyRecord），随每次完成专注周期实时刷新
const { state: study } = useStudyRecord()
</script>

<style scoped>
.clock-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.clock-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.clock-panel__status {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: 600;
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.clock-panel__status--done {
  background: var(--color-success-light);
  color: var(--color-success);
}

.clock-panel__today {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.clock-panel__today-label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.clock-panel__today-value {
  font-family: var(--font-num);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.clock-panel__unit {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-secondary);
  font-style: normal;
  margin-left: 4px;
}

.clock-panel__recent-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}
</style>
