<template>
  <div class="flexible-panel">
    <!-- Bending curvature chart -->
    <div class="chart-section">
      <h4>各段弯曲曲率</h4>
      <BendingCurveChart :arm="arm" />
    </div>

    <!-- Tension gauges + Deformation -->
    <div class="info-row">
      <TensionGauge :arm="arm" />

      <div class="deform-section card">
        <h5>整体形变量</h5>
        <div class="deform-value">{{ arm.deformation?.toFixed(2) || '--' }} mm</div>
        <DeformationHeatmap :arm="arm" />
      </div>
    </div>

    <!-- End position -->
    <div class="end-pos card">
      <h5>末端位置</h5>
      <div class="ep-row">
        <div class="ep-item">
          <span class="ep-label">X</span>
          <span class="ep-val">{{ arm.endPosition.x.toFixed(3) }} m</span>
        </div>
        <div class="ep-item">
          <span class="ep-label">Y</span>
          <span class="ep-val">{{ arm.endPosition.y.toFixed(3) }} m</span>
        </div>
        <div class="ep-item">
          <span class="ep-label">Z</span>
          <span class="ep-val">{{ arm.endPosition.z.toFixed(3) }} m</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BendingCurveChart from './BendingCurveChart.vue'
import TensionGauge from './TensionGauge.vue'
import DeformationHeatmap from './DeformationHeatmap.vue'

defineProps({ arm: { type: Object, required: true } })
</script>

<style scoped>
.flexible-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-section {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
}

.chart-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 14px;
}

.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.deform-section h5,
.end-pos h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 12px;
}

.deform-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--s-accent);
  font-family: monospace;
  margin-bottom: 12px;
}

.end-pos {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
}

.ep-row {
  display: flex;
  gap: 24px;
}

.ep-item {
  text-align: center;
}

.ep-label {
  display: block;
  font-size: 12px;
  color: var(--s-text-secondary);
  margin-bottom: 4px;
}

.ep-val {
  font-size: 16px;
  font-weight: 600;
  color: var(--s-text-primary);
  font-family: monospace;
}

@media (max-width: 768px) {
  .info-row { grid-template-columns: 1fr; }
}
</style>
