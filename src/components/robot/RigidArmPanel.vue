<template>
  <div class="rigid-panel">
    <!-- Joint angles chart -->
    <div class="chart-section">
      <h4>关节角度实时曲线</h4>
      <JointAngleChart :arm-id="arm.id" />
    </div>

    <!-- Temperature gauges grid -->
    <div class="chart-section">
      <h4>关节温度</h4>
      <JointTempGauge :arm="arm" />
    </div>

    <!-- Motor status + End effector -->
    <div class="info-row">
      <MotorStatusCards :arm="arm" />
      <div class="ee-panel card">
        <h5>末端执行器</h5>
        <div class="ee-data">
          <div class="ee-row">
            <span>位置 X</span><span class="ee-val">{{ arm.endEffector.x.toFixed(3) }} m</span>
          </div>
          <div class="ee-row">
            <span>位置 Y</span><span class="ee-val">{{ arm.endEffector.y.toFixed(3) }} m</span>
          </div>
          <div class="ee-row">
            <span>位置 Z</span><span class="ee-val">{{ arm.endEffector.z.toFixed(3) }} m</span>
          </div>
          <div class="ee-row">
            <span>夹爪状态</span>
            <el-tag :type="arm.endEffector.gripper === 'open' ? 'success' : 'warning'" size="small">
              {{ arm.endEffector.gripper === 'open' ? '打开' : '闭合' }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import JointAngleChart from './JointAngleChart.vue'
import JointTempGauge from './JointTempGauge.vue'
import MotorStatusCards from './MotorStatusCards.vue'

defineProps({ arm: { type: Object, required: true } })
</script>

<style scoped>
.rigid-panel {
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

.ee-panel h5 {
  font-size: 14px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 12px;
}

.ee-data {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ee-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--s-text-secondary);
}

.ee-val {
  color: var(--s-text-primary);
  font-family: monospace;
  font-weight: 500;
}

@media (max-width: 768px) {
  .info-row { grid-template-columns: 1fr; }
}
</style>
