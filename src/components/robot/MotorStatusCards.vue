<template>
  <div class="motor-cards card">
    <h5>电机状态</h5>
    <div class="motor-grid">
      <div class="motor-item">
        <span class="motor-label">电流</span>
        <span class="motor-value">{{ arm.motorCurrent?.toFixed(2) || '--' }} A</span>
        <el-progress
          :percentage="Math.min(100, ((arm.motorCurrent || 0) / 10) * 100)"
          :stroke-width="6"
          :show-text="false"
          color="#f59e0b"
        />
      </div>
      <div class="motor-item">
        <span class="motor-label">转速</span>
        <span class="motor-value">{{ arm.motorRPM || '--' }} RPM</span>
        <el-progress
          :percentage="Math.min(100, ((arm.motorRPM || 0) / 5000) * 100)"
          :stroke-width="6"
          :show-text="false"
          color="#3b82f6"
        />
      </div>
    </div>

    <!-- Torque bars -->
    <div class="torque-section">
      <span class="torque-title">关节扭矩 (N·m)</span>
      <div v-for="j in arm.joints" :key="j.name" class="torque-row">
        <span class="torque-label">{{ j.name }}</span>
        <div class="torque-bar-wrap">
          <div
            class="torque-bar"
            :style="{
              width: Math.min(100, (Math.abs(j.torque || 0) / 5) * 100) + '%',
              background: j.torque > 3 ? '#ef4444' : '#22d3ee',
            }"
          ></div>
        </div>
        <span class="torque-val">{{ (j.torque || 0).toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ arm: { type: Object, required: true } })
</script>

<style scoped>
.motor-cards h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 14px;
}

.motor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 18px;
}

.motor-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.motor-label {
  font-size: 12px;
  color: var(--s-text-secondary);
}

.motor-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--s-text-primary);
  font-family: monospace;
}

.torque-section {
  border-top: 1px solid var(--s-border);
  padding-top: 14px;
}

.torque-title {
  font-size: 12px;
  color: var(--s-text-secondary);
  display: block;
  margin-bottom: 10px;
}

.torque-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.torque-label {
  font-size: 11px;
  color: var(--s-text-secondary);
  width: 42px;
  flex-shrink: 0;
}

.torque-bar-wrap {
  flex: 1;
  height: 8px;
  background: var(--s-bg-primary);
  border-radius: 4px;
  overflow: hidden;
}

.torque-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.torque-val {
  font-size: 11px;
  color: var(--s-text-primary);
  font-family: monospace;
  width: 40px;
  text-align: right;
}
</style>
