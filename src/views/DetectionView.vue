<template>
  <div class="detection-view">
    <!-- Stats summary -->
    <div class="det-stats-row">
      <div class="det-stat" v-for="s in summaryList" :key="s.key">
        <span class="det-stat-val">{{ s.value }}</span>
        <span class="det-stat-label">{{ s.label }}</span>
      </div>
    </div>

    <!-- Pro mode: Detection canvas + confidence chart -->
    <div v-if="appStore.mode === 'pro'" class="det-grid-pro">
      <div class="det-panel">
        <h4>检测画面</h4>
        <DetectionCanvas />
      </div>
      <div class="det-panel">
        <h4>置信度分布</h4>
        <ConfidenceChart />
      </div>
    </div>

    <!-- Detection table (both modes) -->
    <div class="det-panel det-table-panel">
      <div class="panel-header">
        <h4>检测结果列表</h4>
        <span class="panel-count">共 {{ detStore.detections.length }} 项</span>
      </div>
      <DetectionTable />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDetectionStore } from '@/stores/detection'
import DetectionCanvas from '@/components/detection/DetectionCanvas.vue'
import DetectionTable from '@/components/detection/DetectionTable.vue'
import ConfidenceChart from '@/components/detection/ConfidenceChart.vue'

const appStore = useAppStore()
const detStore = useDetectionStore()

const summaryList = computed(() => {
  const s = detStore.stats
  return [
    { key: 'total', label: '检测总数', value: s.total },
    { key: 'avgConf', label: '平均置信度', value: s.avgConfidence ? (s.avgConfidence * 100).toFixed(1) + '%' : '--' },
    { key: 'ripe', label: '成熟果实', value: s.ripe },
    { key: 'unripe', label: '未成熟', value: s.unripe },
  ]
})
</script>

<style scoped>
.detection-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.det-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.det-stat {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 16px;
  text-align: center;
}

.det-stat-val {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--s-accent);
}

.det-stat-label {
  display: block;
  font-size: 13px;
  color: var(--s-text-secondary);
  margin-top: 4px;
}

.det-grid-pro {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.det-panel {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
}

.det-panel h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 14px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-header h4 {
  margin-bottom: 0;
}

.panel-count {
  font-size: 12px;
  color: var(--s-text-secondary);
}

@media (max-width: 768px) {
  .det-stats-row { grid-template-columns: repeat(2, 1fr); }
  .det-grid-pro { grid-template-columns: 1fr; }
}
</style>
