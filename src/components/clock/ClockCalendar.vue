<template>
  <div class="calendar">
    <div class="calendar__grid">
      <div
        v-for="day in days"
        :key="day.date"
        class="calendar__cell"
        :class="{
          'calendar__cell--clocked': day.clocked,
          'calendar__cell--today': day.isToday
        }"
        :title="`${day.date} ${day.clocked ? '已打卡' : '未打卡'}`"
      >
        <span class="calendar__weekday">{{ day.weekday }}</span>
        <span class="calendar__num">{{ day.dayNum }}</span>
      </div>
    </div>
    <p class="calendar__legend">
      <i class="calendar__dot"></i> 已打卡
    </p>
  </div>
</template>

<script setup>
// 打卡状态展示：近期日历 + 已打卡日期高亮
import { computed } from 'vue'
import { formatDate, getRecentDates, getWeekday } from '@/utils/date'

const props = defineProps({
  records: { type: Array, default: () => [] } // ClockRecord[]，含 date 字段
})

const days = computed(() => {
  const clockedSet = new Set(props.records.map((r) => r.date))
  const today = formatDate()
  return getRecentDates(14).map((d) => ({
    date: d,
    dayNum: Number(d.slice(8, 10)),
    weekday: getWeekday(d),
    clocked: clockedSet.has(d),
    isToday: d === today
  }))
})
</script>

<style scoped>
.calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 6px 0;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
}

.calendar__weekday {
  font-size: 10px;
  color: var(--color-text-light);
}

.calendar__num {
  font-size: var(--text-sm);
  font-weight: 500;
}

/* 已打卡高亮 */
.calendar__cell--clocked {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.calendar__cell--clocked .calendar__weekday {
  color: var(--color-primary);
}

/* 今天描边 */
.calendar__cell--today {
  border-color: var(--color-primary);
}

.calendar__legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.calendar__dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary-light);
}
</style>
