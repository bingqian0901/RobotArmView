<template>
  <div class="temp-gauges">
    <div
      v-for="(joint, idx) in arm.joints"
      :key="joint.name"
      class="gauge-item"
    >
      <div ref="gaugeRefs" :data-idx="idx" class="gauge-chart" style="width:100%;height:140px"></div>
      <span class="gauge-label">{{ joint.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ arm: { type: Object, required: true } })
const gaugeRefs = ref([])
let charts = []

function makeOption(temp) {
  return {
    series: [{
      type: 'gauge',
      min: 0,
      max: 80,
      radius: '85%',
      center: ['50%', '55%'],
      startAngle: 210,
      endAngle: -30,
      axisLine: {
        show: true,
        lineStyle: {
          width: 12,
          color: [
            [0.3, '#22c55e'],
            [0.6, '#f59e0b'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: {
        show: true,
        length: '65%',
        width: 6,
        itemStyle: { color: '#e2e8f0' },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}°C',
        color: '#e2e8f0',
        fontSize: 14,
        offsetCenter: [0, '65%'],
      },
      data: [{ value: temp }],
    }],
  }
}

function initAll() {
  const doms = document.querySelectorAll(`.gauge-chart[data-idx]`)
  charts.forEach((c) => c?.dispose())
  charts = []
  doms.forEach((dom) => {
    const chart = echarts.init(dom, 'dark')
    const idx = +dom.dataset.idx
    chart.setOption(makeOption(props.arm.joints[idx]?.temperature || 25))
    charts.push(chart)
  })
}

function updateAll() {
  charts.forEach((chart, i) => {
    if (chart && props.arm.joints[i]) {
      chart.setOption(makeOption(props.arm.joints[i].temperature))
    }
  })
}

watch(() => props.arm.joints.map((j) => j.temperature).join(','), () => {
  updateAll()
})

// Resize
let ro = null
onMounted(() => {
  nextTick(() => initAll())
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => charts.forEach((c) => c?.resize()))
    ro.observe(document.querySelector('.temp-gauges'))
  }
})

onUnmounted(() => {
  ro?.disconnect()
  charts.forEach((c) => c?.dispose())
})
</script>

<style scoped>
.temp-gauges {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.gauge-item {
  text-align: center;
}

.gauge-chart {
  min-height: 120px;
}

.gauge-label {
  font-size: 11px;
  color: var(--s-text-secondary);
  margin-top: -8px;
  display: block;
}

@media (max-width: 1024px) {
  .temp-gauges { grid-template-columns: repeat(3, 1fr); }
}
</style>
