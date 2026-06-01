<template>
  <div class="det-table-wrap">
    <el-table
      :data="detStore.detections"
      style="width: 100%"
      :size="appStore.mode === 'simple' ? 'default' : 'small'"
      empty-text="暂无检测数据"
      max-height="400"
      stripe
    >
      <el-table-column prop="id" label="ID" width="100" v-if="appStore.mode === 'pro'">
        <template #default="{ row }">
          <span class="mono-text">{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="类别" width="120">
        <template #default="{ row }">
          <el-tag
            :color="fruitColor(row.class_name || row.class)"
            effect="dark"
            size="small"
          >
            {{ fruitLabel(row.class_name || row.class) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="置信度" width="110" sortable prop="confidence">
        <template #default="{ row }">
          <span :style="{ color: confColor(row.confidence) }">
            {{ (row.confidence * 100).toFixed(1) }}%
          </span>
        </template>
      </el-table-column>

      <el-table-column label="成熟度" width="100">
        <template #default="{ row }">
          <el-tag :type="row.ripeness === 'ripe' ? 'success' : 'info'" size="small">
            {{ row.ripeness === 'ripe' ? '成熟' : '未熟' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="位置 3D (x, y, z) m" v-if="appStore.mode === 'pro'">
        <template #default="{ row }">
          <span class="mono-text" v-if="row.position_3d">
            ({{ row.position_3d.x }}, {{ row.position_3d.y }}, {{ row.position_3d.z }})
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column label="BBox" v-if="appStore.mode === 'pro'" width="180">
        <template #default="{ row }">
          <span class="mono-text" v-if="row.bbox">
            [{{ row.bbox.x1 }},{{ row.bbox.y1 }},{{ row.bbox.x2 }},{{ row.bbox.y2 }}]
          </span>
          <span v-else>--</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" fixed="right" v-if="appStore.mode === 'pro'">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="pickFruit(row)">
            采摘
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Simple mode: big pick button per fruit -->
    <div v-if="appStore.mode === 'simple' && detStore.detections.length" class="simple-pick-list">
      <el-button
        v-for="det in detStore.detections.slice(0, 6)"
        :key="det.id"
        type="primary"
        size="large"
        class="simple-pick-btn"
        @click="pickFruit(det)"
      >
        🍎 采摘 {{ fruitLabel(det.class_name || det.class) }}
        <small>({{ (det.confidence * 100).toFixed(0) }}%)</small>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useDetectionStore } from '@/stores/detection'
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES } from '@/utils/constants'

const appStore = useAppStore()
const detStore = useDetectionStore()
const taskStore = useTaskStore()
const router = useRouter()

function fruitLabel(cls) { return FRUIT_CLASSES[cls]?.label || cls }
function fruitColor(cls) { return FRUIT_CLASSES[cls]?.color || '#94a3b8' }
function confColor(c) {
  if (c >= 0.9) return '#22c55e'
  if (c >= 0.7) return '#f59e0b'
  return '#ef4444'
}

function pickFruit(det) {
  taskStore.quickPick(det.class_name || det.class || 'apple')
  router.push('/tasks')
}
</script>

<style scoped>
.det-table-wrap {
  min-height: 100px;
}

.mono-text {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  color: var(--s-text-secondary);
}

.simple-pick-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}

.simple-pick-btn {
  min-width: 140px;
  font-size: 15px !important;
  padding: 16px 20px !important;
  border-radius: 12px !important;
}

.simple-pick-btn small {
  opacity: 0.8;
  margin-left: 4px;
}
</style>
