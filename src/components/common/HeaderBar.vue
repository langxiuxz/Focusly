<template>
  <header class="header">
    <div class="header__inner">
      <div class="header__brand">
        <span class="header__logo" aria-hidden="true">🍅</span>
        <div class="header__text">
          <h1 class="header__title">Focusly</h1>
          <p class="header__subtitle">番茄时钟 · 专注学习打卡</p>
        </div>
      </div>
      <p class="header__date">{{ today }}</p>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/date'

// 当日日期（本地时区）
const today = computed(() => formatDate())
</script>

<style scoped>
.header {
  background: var(--color-card);
  border-bottom: 1px solid var(--color-border);
}

.header__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header__logo {
  font-size: 28px;
  line-height: 1;
}

.header__title {
  font-size: var(--text-xl);
  font-weight: 700;
  letter-spacing: 0.5px;
}

.header__subtitle {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: 1px;
}

.header__date {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}
</style>
