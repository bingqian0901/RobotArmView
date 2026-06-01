<template>
  <div class="camera-preview" :class="{ 'pro-mode': appStore.mode === 'pro' }">
    <canvas ref="canvasRef" class="cam-canvas" :width="canvasW" :height="canvasH"></canvas>

    <!-- Detection overlay info -->
    <div class="cam-overlay-info" v-if="appStore.mode === 'pro'">
      <span>Frame: {{ detStore.imageFrameId || '--' }}</span>
      <span>检测: {{ detStore.stats.total }} 个</span>
    </div>

    <!-- No detection placeholder -->
    <div v-if="!detStore.detections.length" class="cam-placeholder">
      <el-icon :size="40"><VideoCamera /></el-icon>
      <span>等待检测数据...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDetectionStore } from '@/stores/detection'
import { FRUIT_CLASSES } from '@/utils/constants'

const appStore = useAppStore()
const detStore = useDetectionStore()
const canvasRef = ref(null)
const canvasW = ref(480)
const canvasH = ref(320)
let animFrame = null

// Draw orchard scene + detection boxes
function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Background — sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6)
  skyGrad.addColorStop(0, appStore.mode === 'pro' ? '#1a2a3a' : '#87ceeb')
  skyGrad.addColorStop(1, appStore.mode === 'pro' ? '#1e3a2f' : '#c8e6c9')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)

  // Ground
  ctx.fillStyle = appStore.mode === 'pro' ? '#1a3320' : '#8d6e63'
  ctx.fillRect(0, h * 0.7, w, h * 0.3)

  // Tree trunks
  ctx.fillStyle = appStore.mode === 'pro' ? '#4a3728' : '#5d4037'
  for (let i = 0; i < 5; i++) {
    const tx = w * 0.15 + i * w * 0.18
    ctx.fillRect(tx - 6, h * 0.25, 12, h * 0.5)
  }

  // Canopy (circles)
  for (let i = 0; i < 5; i++) {
    const cx = w * 0.15 + i * w * 0.18
    const cy = h * 0.23
    ctx.fillStyle = appStore.mode === 'pro' ? '#1e4a2a' : '#2e7d32'
    ctx.beginPath()
    ctx.ellipse(cx, cy, 45, 60, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = appStore.mode === 'pro' ? '#2a5e38' : '#388e3c'
    ctx.beginPath()
    ctx.ellipse(cx - 15, cy - 10, 30, 40, -0.3, 0, Math.PI * 2)
    ctx.fill()
  }

  // Detection boxes
  const detections = detStore.detections
  detections.forEach((det) => {
    const cls = det.class_name || det.class || 'apple'
    const colors = FRUIT_CLASSES[cls] || { color: '#ef4444' }
    const box = det.bbox
    const x = box.x1 || box[0] || 100
    const y = box.y1 || box[1] || 100
    const bw = (box.x2 || box[2] || 180) - x
    const bh = (box.y2 || box[3] || 180) - y

    // Scale bbox to canvas
    const sx = (x / 640) * w
    const sy = (y / 480) * h
    const sw = (bw / 640) * w
    const sh = (bh / 480) * h

    ctx.strokeStyle = colors.color
    ctx.lineWidth = 2
    ctx.strokeRect(sx, sy, sw, sh)

    // Label background
    ctx.fillStyle = colors.color
    const label = `${FRUIT_CLASSES[cls]?.label || cls} ${(det.confidence * 100).toFixed(0)}%`
    const textW = ctx.measureText(label).width + 8
    ctx.fillRect(sx, sy - 20, textW, 20)

    // Label text
    ctx.fillStyle = '#fff'
    ctx.font = '12px Microsoft YaHei'
    ctx.fillText(label, sx + 4, sy - 5)
  })

  animFrame = requestAnimationFrame(draw)
}

onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      canvasW.value = canvasRef.value.parentElement?.clientWidth || 480
      canvasH.value = 320
    }
    draw()
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.camera-preview {
  position: relative;
  border-radius: var(--s-radius);
  overflow: hidden;
  background: #000;
}

.cam-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.cam-overlay-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 10px;
  border-radius: 4px;
  font-family: monospace;
}

.cam-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.3);
  font-size: 14px;
}
</style>
