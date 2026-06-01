<template>
  <div ref="chartRoot" class="joint-chart" style="width:100%;height:300px"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useRobotArmStore } from '@/stores/robotArm'
import { CHART_COLORS } from '@/utils/constants'

const props = defineProps({ armId: { type: String, required: true } })
const armStore = useRobotArmStore()
const chartRoot = ref(null)
let chart = null
const MAX_POINTS = 60

// Rolling history
const history = ref([])

// Collect data on each arm update
let unwatch = null

function buildOption() {
  const arm = armStore.arms[props.armId]
  if (!arm || arm.type !== 'rigid') return {}

  const jointNames = arm.joints.map((j) => j.name)
  const series = arm.joints.map((j, i) => ({
    name: j.name,
    type: 'line',
    smooth: true,
    showSymbol: false,
    lineStyle: { width: 2 },
    itemStyle: { color: CHART_COLORS[i % CHART_COLORS.length] },
    data: history.value.map((h) => h[i]),
  }))

  return {
    tooltip: { trigger: 'axis' },
    legend: {
      data: jointNames,
      bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 11 },
    },
    grid: { left: 50, right: 20, top: 10, bottom: 40 },
    xAxis: {
      type: 'category',
      show: false,
      data: history.value.map((_, i) => i),
    },
    yAxis: {
      type: 'value',
      name: '角度 (°)',
      min: -180,
      max: 180,
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e2d3d' } },
    },
    series,
  }
}

function updateChart() {
  const arm = armStore.arms[props.armId]
  if (!arm || arm.type !== 'rigid') return

  // Push current angles to history
  history.value.push(arm.joints.map((j) => j.angle))
  if (history.value.length > MAX_POINTS) history.value.shift()

  if (chart) chart.setOption(buildOption(), true)
}

function init() {
  if (!chartRoot.value) return
  chart = echarts.init(chartRoot.value, 'dark')
  // Pre-fill history
  const arm = armStore.arms[props.armId]
  if (arm) {
    for (let i = 0; i < 20; i++) {
      history.value.push(arm.joints.map((j) => j.angle + (Math.random() - 0.5) * 5))
    }
  }
  chart.setOption(buildOption())
}

let ro = null
onMounted(() => {
  init()
  // Watch arm status updates
  unwatch = watch(
    () => armStore.arms[props.armId]?.joints?.map((j) => j.angle).join(','),
    () => updateChart()
  )
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => chart?.resize())
    ro.observe(chartRoot.value)
  }
})

onUnmounted(() => {
  unwatch?.()
  ro?.disconnect()
  chart?.dispose()
})
</script>
