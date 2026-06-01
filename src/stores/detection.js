import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDetectionStore = defineStore('detection', () => {
  // ---- State ----
  const detections = ref([])        // current frame detections
  const imageFrameId = ref(null)
  const history = ref([])           // last N frames (pro mode)
  const MAX_HISTORY = 50

  // ---- Computed ----
  const stats = computed(() => {
    if (!detections.value.length) {
      return { total: 0, ripe: 0, unripe: 0, avgConfidence: 0, byClass: {} }
    }
    const byClass = {}
    let ripe = 0
    let unripe = 0
    let confSum = 0

    detections.value.forEach((d) => {
      const cls = d.class_name || d.class || 'unknown'
      byClass[cls] = (byClass[cls] || 0) + 1
      confSum += d.confidence || 0
      if (d.ripeness === 'ripe') ripe++
      else if (d.ripeness === 'unripe') unripe++
    })

    return {
      total: detections.value.length,
      ripe,
      unripe,
      avgConfidence: +(confSum / detections.value.length).toFixed(2),
      byClass,
    }
  })

  // ---- Actions ----
  function updateDetections(data) {
    imageFrameId.value = data.frame_id || null
    detections.value = data.detections || []

    // Append to history (pro mode uses this)
    history.value.push({
      frameId: data.frame_id,
      timestamp: data.timestamp || Date.now(),
      detections: [...detections.value],
      stats: { ...stats.value },
    })
    if (history.value.length > MAX_HISTORY) {
      history.value = history.value.slice(-MAX_HISTORY)
    }
  }

  function clearAll() {
    detections.value = []
    imageFrameId.value = null
    history.value = []
  }

  return { detections, imageFrameId, history, stats, updateDetections, clearAll }
})
