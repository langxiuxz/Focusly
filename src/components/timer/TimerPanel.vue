<template>
  <section class="timer-panel card">
    <div class="timer-panel__head">
      <div>
        <h2 class="section-title">番茄专注</h2>
        <p class="section-desc">设定时长，开启一段专注</p>
      </div>
    </div>

    <TimerDial
      :remaining="state.remaining"
      :total="totalSeconds"
      :phase="state.phase"
      :mode-label="phaseLabel"
    />

    <TimerControls
      :running="state.running"
      @start="start"
      @pause="pause"
      @reset="reset"
    />

    <DurationInput
      :study="state.studyDuration"
      :rest="state.restDuration"
      @change="setDurations"
    />
  </section>
</template>

<script setup>
// 计时区容器：组合表盘 / 控制按钮 / 时长输入，数据统一来自 useTimer
import useTimer from '@/composables/useTimer'
import TimerDial from './TimerDial.vue'
import TimerControls from './TimerControls.vue'
import DurationInput from './DurationInput.vue'

const { state, phaseLabel, totalSeconds, setDurations, start, pause, reset } = useTimer()
</script>

<style scoped>
.timer-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
}

.timer-panel__head {
  display: flex;
  justify-content: center;
}
</style>
