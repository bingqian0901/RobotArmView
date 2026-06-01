<template>
  <div class="det-canvas-wrap">
    <canvas ref="canvasRef" :width="640" :height="480" class="det-canvas"></canvas>
    <div class="canvas-toolbar">
      <el-button size="small" @click="togglePause">
        {{ paused ? '▶ 继续' : '⏸ 暂停' }}
      </el-button>
      <span class="fps-display" v-if="appStore.mode === 'pro'">~{{ fps }} fps</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDetectionStore } from '@/stores/detection'
import { FRUIT_CLASSES } from '@/utils/constants'

const appStore = useAppStore()
const detStore = useDetectionStore()
const canvasRef = ref(null)
const paused = ref(false)
const fps = ref(0)
let animFrame = null
let lastFrameTime = 0
let frameCount = 0

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  // Background: orchard scene
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.55)
  skyGrad.addColorStop(0, '#1e3a5f')
  skyGrad.addColorStop(1, '#2d5a3f')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)

  // Ground
  ctx.fillStyle = '#2a4a1f'
  ctx.fillRect(0, h * 0.65, w, h * 0.35)

  // Trees
  for (let i = 0; i < 6; i++) {
    const tx = 50 + i * 110
    ctx.fillStyle = '#5d4037'
    ctx.fillRect(tx - 5, h * 0.3, 10, h * 0.4)
    // Canopy
    ctx.fillStyle = '#1e5631'
    ctx.beginPath()
    ctx.ellipse(tx, h * 0.28, 50, 65, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#2d6b3f'
    ctx.beginPath()
    ctx.ellipse(tx - 15, h * 0.2, 35, 45, -0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Detection boxes
  if (!paused.value) {
    detStore.detections.forEach((det) => {
      const cls = det.class_name || det.class || 'apple'
      const info = FRUIT_CLASSES[cls] || { color: '#ef4444', label: cls }
      const box = det.bbox
      const x = box.x1 || box[0] || 100
      const y = box.y1 || box[1] || 100
      const bw = (box.x2 || box[2] || 200) - x
      const bh = (box.y2 || box[3] || 200) - y

      // Box
      ctx.strokeStyle = info.color
      ctx.lineWidth = 2.5
      ctx.setLineDash([])
      ctx.strokeRect(x, y, bw, bh)

      // Glow effect
      ctx.shadowColor = info.color
      ctx.shadowBlur = 8
      ctx.strokeRect(x, y, bw, bh)
      ctx.shadowBlur = 0

      // Label bg
      const text = `${info.label} ${(det.confidence * 100).toFixed(0)}%`
      const metrics = ctx.measureText(text)
      const tw = metrics.width + 12
      ctx.fillStyle = info.color
      ctx.fillRect(x, y - 24, tw, 24)

      // Label text
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 13px "Microsoft YaHei"'
      ctx.fillText(text, x + 6, y - 7)

      // Corner accents
      const cl = 15
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2
      ;[[x, y, 1, 1], [x + bw, y, -1, 1], [x, y + bh, 1, -1], [x + bw, y + bh, -1, -1]]
        .forEach(([cx, cy, dx, dy]) => {
          ctx.beginPath()
          ctx.moveTo(cx, cy + cl * dy)
          ctx.lineTo(cx, cy)
          ctx.lineTo(cx + cl * dx, cy)
          ctx.stroke()
        })
    })
  }

  // FPS
  frameCount++
  const now = performance.now()
  if (now - lastFrameTime >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFrameTime = now
  }

  animFrame = requestAnimationFrame(draw)
}

function togglePause() { paused.value = !paused.value }

onMounted(() => draw())
onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<style scoped>
.det-canvas-wrap {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
}

.det-canvas {
  width: 100%;
  height: auto;
  display: block;
}

.canvas-toolbar {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.fps-display {
  font-size: 12px;
  color: #0f0;
  font-family: monospace;
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
