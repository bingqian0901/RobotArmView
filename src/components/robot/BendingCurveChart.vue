<template>
  <div ref="chartRoot" class="bending-chart" style="width:100%;height:250px"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { CHART_COLORS } from '@/utils/constants'

const props = defineProps({ arm: { type: Object, required: true } })
const chartRoot = ref(null)
let chart = null

function buildOption() {
  const segs = props.arm.segments || []
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: 55, right: 20, top: 10, bottom: 30 },
    xAxis: {
      type: 'category',
      data: segs.map((s) => s.name),
      axisLabel: { color: '#94a3b8' },
    },
    yAxis: [
      {
        type: 'value',
        name: '曲率 (1/m)',
        axisLabel: { color: '#94a3b8' },
        splitLine: { lineStyle: { color: '#1e2d3d' } },
      },
      {
        type: 'value',
        name: '弯曲角 (°)',
        axisLabel: { color: '#94a3b8' },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '曲率',
        type: 'bar',
        data: segs.map((s) => ({
          value: s.curvature,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#22d3ee' },
              { offset: 1, color: '#0891b2' },
            ]),
            borderRadius: [6, 6, 0, 0],
          },
        })),
        barWidth: 30,
      },
      {
        name: '弯曲角',
        type: 'line',
        yAxisIndex: 1,
        data: segs.map((s) => s.bendAngle),
        smooth: true,
        lineStyle: { color: '#fbbf24', width: 2 },
        itemStyle: { color: '#fbbf24' },
      },
    ],
  }
}

function init() {
  if (!chartRoot.value) return
  chart = echarts.init(chartRoot.value, 'dark')
  chart.setOption(buildOption())
}

watch(
  () => props.arm.segments?.map((s) => s.curvature).join(','),
  () => { if (chart) chart.setOption(buildOption()) }
)

let ro = null
onMounted(() => {
  init()
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
