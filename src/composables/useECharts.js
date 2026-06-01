import { onMounted, onUnmounted, ref, shallowRef } from 'vue'
import * as echarts from 'echarts'

export function useECharts(options = {}) {
  const chartRef = shallowRef(null)
  const chartInstance = shallowRef(null)
  const resizeObserver = ref(null)

  function initChart(dom) {
    if (!dom) return
    chartInstance.value = echarts.init(dom, options.theme || 'dark')
    if (options.option) {
      chartInstance.value.setOption(options.option)
    }
    // Auto-resize
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver.value = new ResizeObserver(() => {
        chartInstance.value?.resize()
      })
      resizeObserver.value.observe(dom)
    } else {
      window.addEventListener('resize', handleResize)
    }
  }

  function setOption(option, notMerge = false) {
    if (!chartInstance.value) return
    chartInstance.value.setOption(option, notMerge)
  }

  function handleResize() {
    chartInstance.value?.resize()
  }

  function dispose() {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect()
      resizeObserver.value = null
    }
    window.removeEventListener('resize', handleResize)
    chartInstance.value?.dispose()
    chartInstance.value = null
  }

  return { chartRef, chartInstance, initChart, setOption, dispose }
}
