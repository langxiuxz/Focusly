<template>
  <div class="home">
    <!-- 顶部区域 -->
    <HeaderBar />

    <!-- 主体：计时 / 任务 + 打卡 / 统计 -->
    <main class="home__main">
      <TimerPanel />
      <div class="home__mid">
        <TaskPanel />
        <ClockPanel />
      </div>
      <StatsPanel />
    </main>

    <!-- 全局加载遮罩 -->
    <LoadingMask />

    <!-- 全局轻提示（计时结束等提醒） -->
    <AppToast />
  </div>
</template>

<script setup>
// 主视图：纵向组合五大分区（顶部 / 计时 / 任务 / 打卡 / 统计），仅做布局组合
import HeaderBar from '@/components/common/HeaderBar.vue'
import TimerPanel from '@/components/timer/TimerPanel.vue'
import TaskPanel from '@/components/task/TaskPanel.vue'
import ClockPanel from '@/components/clock/ClockPanel.vue'
import StatsPanel from '@/components/chart/StatsPanel.vue'
import LoadingMask from '@/components/common/LoadingMask.vue'
import AppToast from '@/components/common/AppToast.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.home__main {
  flex: 1;
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 24px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 任务与打卡在桌面/平板端并排 */
.home__mid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

/* 平板竖屏 / 小屏：任务、打卡纵向排列 */
@media (max-width: 768px) {
  .home__main {
    padding: 20px 16px 32px;
  }

  .home__mid {
    grid-template-columns: 1fr;
  }
}

/* 手机端：紧凑间距，计时器仍为视觉中心 */
@media (max-width: 480px) {
  .home__main {
    padding: 16px 12px 28px;
    gap: 16px;
  }

  .home__mid {
    gap: 16px;
  }
}
</style>
