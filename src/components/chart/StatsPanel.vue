<template>
  <section class="stats-panel card">
    <div class="stats-panel__head">
      <div>
        <h2 class="section-title">数据统计</h2>
        <p class="section-desc">回顾你的专注成果</p>
      </div>
      <div class="stats-panel__range">
        <button
          class="range-btn"
          :class="{ 'range-btn--active': state.range === 'week' }"
          @click="setRange('week')"
        >
          近7天
        </button>
        <button
          class="range-btn"
          :class="{ 'range-btn--active': state.range === 'month' }"
          @click="setRange('month')"
        >
          近30天
        </button>
      </div>
    </div>

    <StatsSummary :summary="state.summary" />
    <TrendChart :data="state.trend" :range="state.range" />
  </section>
</template>

<script setup>
// 统计看板容器：汇总卡片 + 趋势图，数据统一来自 useStats
import useStats from '@/composables/useStats'
import StatsSummary from './StatsSummary.vue'
import TrendChart from './TrendChart.vue'

const { state, setRange } = useStats()
</script>

<style scoped>
.stats-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stats-panel__range {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--color-bg);
  border-radius: var(--radius-full);
}

.range-btn {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  transition: background var(--transition-base), color var(--transition-base);
}

.range-btn--active {
  background: var(--color-card);
  color: var(--color-primary);
  font-weight: 600;
  box-shadow: var(--shadow-sm);
}

@media (max-width: 480px) {
  .stats-panel__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
