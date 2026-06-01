<template>
  <div ref="chartRoot" class="heatmap" style="width:100%;height:180px"></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ arm: { type: Object, required: true } })
const chartRoot = ref(null)
let chart = null

function buildOption() {
  const segs = props.arm.segments || []
  // Simulate a 2D deformation heatmap across segments
  const data = segs.map((s, i) => [i, 0, s.bendAngle])
  // Add interpolated points for smoother visual
  for (let x = 0; x < segs.length; x++) {
    data.push([x, 1, (segs[x]?.curvature || 0) * 100])
    data.push([x, 2, props.arm.deformation || 0])
  }

  return {
    tooltip: {
      formatter: (p) => {
        const labels = ['弯曲角 (°)', '曲率 (×100)', '形变 (mm)']
        return `段${p.data[0] + 1} - ${labels[p.data[1]]}: ${p.data[2].toFixed(2)}`
      },
    },
    grid: { left: 10, right: 20, top: 5, bottom: 30 },
    xAxis: {
      type: 'category',
      data: segs.map((s) => s.name),
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: ['弯曲角', '曲率', '形变'],
      axisLabel: { color: '#94a3b8', fontSize: 10 },
    },
    visualMap: {
      min: -50,
      max: 50,
      show: false,
      inRange: { color: ['#22c55e', '#fbbf24', '#ef4444'] },
    },
    series: [{
      type: 'heatmap',
      data,
      label: { show: true, color: '#e2e8f0', fontSize: 10 },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.5)' },
      },
    }],
  }
}

function init() {
  if (!chartRoot.value) return
  chart = echarts.init(chartRoot.value, 'dark')
  chart.setOption(buildOption())
}

watch(
  () => props.arm.segments?.map((s) => s.bendAngle).join(','),
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
