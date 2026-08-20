<template>
  <div ref="chartRef" class="trend-chart"></div>
</template>

<script setup>
// 趋势图：ECharts 柱状图展示近 7/30 天学习时长趋势。
// Phase 3 完成 ECharts 初始化与生命周期管理；真实数据接入在 Phase 6。
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as echarts from 'echarts'

// 品牌主色（与 variables.css 的 --color-primary 保持一致）
const BRAND_COLOR = '#f0654f'
const TEXT_SECONDARY = '#8a94a6'

const props = defineProps({
  data: { type: Array, default: () => [] }, // StatisticItem[] { date, studyTime }
  range: { type: String, default: 'week' }
})

const chartRef = ref(null)
let chart = null

function buildOption() {
  // 空数据占位
  if (!props.data.length) {
    return {
      title: {
        text: '暂无数据，完成打卡后展示趋势',
        left: 'center',
        top: 'middle',
        textStyle: { color: TEXT_SECONDARY, fontSize: 13, fontWeight: 'normal' }
      }
    }
  }
  const labels = props.data.map((d) => d.date.slice(5)) // MM-DD
  const values = props.data.map((d) => d.studyTime)
  return {
    grid: { left: 40, right: 16, top: 24, bottom: 30 },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v) => `${v} 分钟`
    },
    xAxis: {
      type: 'category',
      data: labels,
      axisLabel: { color: TEXT_SECONDARY, fontSize: 11 },
      axisLine: { lineStyle: { color: '#eceff3' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      name: '分钟',
      nameTextStyle: { color: TEXT_SECONDARY },
      axisLabel: { color: TEXT_SECONDARY },
      splitLine: { lineStyle: { color: '#f0f2f5' } }
    },
    series: [
      {
        name: '专注时长',
        type: 'bar',
        data: values,
        barMaxWidth: 20,
        itemStyle: { color: BRAND_COLOR, borderRadius: [4, 4, 0, 0] }
      }
    ]
  }
}

function render() {
  chart?.setOption(buildOption())
}

function handleResize() {
  chart?.resize()
}

onMounted(() => {
  chart = echarts.init(chartRef.value)
  render()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  chart = null
})

// 数据或范围变化时重绘（Phase 6 接入聚合数据后自动刷新）
watch(() => [props.data, props.range], render)
</script>

<style scoped>
.trend-chart {
  width: 100%;
  height: 260px;
}
</style>
