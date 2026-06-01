<template>
  <div class="tension-gauges card">
    <h5>驱动线缆张力</h5>
    <div class="tension-grid">
      <div
        v-for="(t, idx) in arm.tension"
        :key="t.name"
        class="tension-item"
      >
        <span class="t-label">{{ t.name }}</span>
        <div ref="tRefs" :data-idx="idx" class="t-gauge" style="width:100%;height:120px"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({ arm: { type: Object, required: true } })
const tRefs = ref([])
let charts = []

function makeOption(force) {
  const pct = Math.min(100, (force / 30) * 100)
  return {
    series: [{
      type: 'gauge',
      min: 0,
      max: 30,
      radius: '80%',
      center: ['50%', '55%'],
      startAngle: 200,
      endAngle: -20,
      axisLine: {
        lineStyle: {
          width: 10,
          color: [
            [0.4, '#22c55e'],
            [0.7, '#f59e0b'],
            [1, '#ef4444'],
          ],
        },
      },
      pointer: { length: '60%', width: 5, itemStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value} N',
        color: '#e2e8f0',
        fontSize: 13,
        offsetCenter: [0, '60%'],
      },
      data: [{ value: force }],
    }],
  }
}

function initAll() {
  const doms = document.querySelectorAll('.t-gauge[data-idx]')
  charts.forEach((c) => c?.dispose())
  charts = []
  doms.forEach((dom) => {
    const chart = echarts.init(dom, 'dark')
    const idx = +dom.dataset.idx
    chart.setOption(makeOption(props.arm.tension[idx]?.force || 0))
    charts.push(chart)
  })
}

function updateAll() {
  charts.forEach((chart, i) => {
    if (chart && props.arm.tension[i]) {
      chart.setOption(makeOption(props.arm.tension[i].force))
    }
  })
}

watch(
  () => props.arm.tension?.map((t) => t.force).join(','),
  () => updateAll()
)

let ro = null
onMounted(() => {
  nextTick(() => initAll())
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => charts.forEach((c) => c?.resize()))
    ro.observe(document.querySelector('.tension-gauges'))
  }
})

onUnmounted(() => {
  ro?.disconnect()
  charts.forEach((c) => c?.dispose())
})
</script>

<style scoped>
.tension-gauges h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 12px;
}

.tension-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.tension-item {
  text-align: center;
}

.t-gauge {
  min-height: 100px;
}

.t-label {
  font-size: 11px;
  color: var(--s-text-secondary);
}
</style>
