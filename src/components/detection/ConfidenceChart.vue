<template>
  <div ref="chartRoot" class="confidence-chart" style="width:100%;height:280px"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useDetectionStore } from '@/stores/detection'
import { FRUIT_CLASSES, CHART_COLORS } from '@/utils/constants'

const detStore = useDetectionStore()
const chartRoot = ref(null)
let chart = null

function buildOption() {
  // Group detections by class
  const byClass = {}
  detStore.detections.forEach((d) => {
    const cls = d.class_name || d.class || 'unknown'
    if (!byClass[cls]) byClass[cls] = []
    byClass[cls].push(d.confidence)
  })

  const classes = Object.keys(byClass)
  const avgConf = classes.map((c) => {
    const vals = byClass[c]
    return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2)
  })
  const counts = classes.map((c) => byClass[c].length)

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        const p = Array.isArray(params) ? params[0] : params
        return `${p.name}<br/>平均置信度: ${(p.value * 100).toFixed(1)}%<br/>检测数: ${counts[p.dataIndex]}`
      },
    },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: classes.map((c) => FRUIT_CLASSES[c]?.label || c),
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLabel: { formatter: (v) => (v * 100).toFixed(0) + '%', color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e2d3d' } },
    },
    series: [{
      type: 'bar',
      data: avgConf.map((v, i) => ({
        value: v,
        itemStyle: {
          color: FRUIT_CLASSES[classes[i]]?.color || CHART_COLORS[i % CHART_COLORS.length],
          borderRadius: [6, 6, 0, 0],
        },
      })),
      barWidth: 40,
      label: {
        show: true,
        position: 'top',
        formatter: (p) => (p.value * 100).toFixed(0) + '%',
        color: '#e2e8f0',
      },
    }],
  }
}

function initChart() {
  if (!chartRoot.value) return
  if (chart) chart.dispose()
  chart = echarts.init(chartRoot.value, 'dark')
  chart.setOption(buildOption())
}

watch(() => detStore.detections.length, () => {
  if (chart) chart.setOption(buildOption())
})

// Resize
let ro = null
onMounted(() => {
  initChart()
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => chart?.resize())
    ro.observe(chartRoot.value)
  }
})

onUnmounted(() => {
  ro?.disconnect()
  chart?.dispose()
})
</script>

<style scoped>
.confidence-chart {
  min-height: 260px;
}
</style>
