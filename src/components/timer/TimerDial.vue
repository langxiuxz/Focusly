<template>
  <div class="dial" :class="dialClass" role="timer" :aria-label="`剩余 ${display}`">
    <svg class="dial__svg" viewBox="0 0 200 200" aria-hidden="true">
      <circle class="dial__track" cx="100" cy="100" :r="RADIUS" />
      <circle
        class="dial__progress"
        cx="100"
        cy="100"
        :r="RADIUS"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <div class="dial__center">
      <span class="dial__mode">{{ modeLabel }}</span>
      <span class="dial__time">{{ display }}</span>
    </div>
  </div>
</template>

<script setup>
// 可视化表盘：SVG 环形进度 + 中央倒计时。颜色随模式/状态变化
import { computed } from 'vue'
import { formatSeconds } from '@/utils/format'

const RADIUS = 88
const circumference = 2 * Math.PI * RADIUS

const props = defineProps({
  remaining: { type: Number, default: 0 }, // 剩余秒数
  total: { type: Number, default: 1 }, // 当前会话总秒数
  mode: { type: String, default: 'focus' }, // focus | rest
  status: { type: String, default: 'idle' }, // idle | running | paused
  modeLabel: { type: String, default: '待开始' } // 专注 / 休息 / 待开始
})

const display = computed(() => formatSeconds(props.remaining))

// 剩余占比（0~1），环形随剩余时间递减
const progress = computed(() => {
  if (props.total <= 0) return 0
  return Math.min(1, Math.max(0, props.remaining / props.total))
})

const dashOffset = computed(() => circumference * (1 - progress.value))

// 颜色：休息 → 薄荷；专注待开始 → 灰；专注运行/暂停 → 番茄（默认）
const dialClass = computed(() => {
  if (props.mode === 'rest') return 'dial--rest'
  if (props.status === 'idle') return 'dial--idle'
  return ''
})
</script>

<style scoped>
.dial {
  position: relative;
  width: 264px;
  height: 264px;
  margin: 0 auto;
}

.dial__svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* 环形从 12 点方向开始 */
}

.dial__track {
  fill: none;
  stroke: var(--color-border);
  stroke-width: 10;
}

.dial__progress {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s linear, stroke var(--transition-base);
}

.dial--rest .dial__progress {
  stroke: var(--color-rest);
}

.dial--idle .dial__progress {
  stroke: var(--color-border);
}

.dial__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.dial__mode {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-primary);
}

.dial--rest .dial__mode {
  color: var(--color-rest);
}

.dial--idle .dial__mode {
  color: var(--color-text-secondary);
}

.dial__time {
  font-family: var(--font-num);
  font-size: 58px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--color-text);
}

/* 手机端：表盘略微缩小，仍是视觉中心 */
@media (max-width: 480px) {
  .dial {
    width: 220px;
    height: 220px;
  }

  .dial__time {
    font-size: 48px;
  }
}
</style>
