<template>
  <div class="robot-view">
    <!-- Simple mode: just overview cards -->
    <template v-if="appStore.mode === 'simple'">
      <div class="simple-arm-grid">
        <div
          v-for="arm in armStore.armList"
          :key="arm.id"
          class="simple-arm-card"
          :class="`status-${arm.status}`"
        >
          <div class="sac-icon">
            <el-icon :size="40"><component :is="arm.type === 'rigid' ? 'Setting' : 'Connection'" /></el-icon>
          </div>
          <div class="sac-name">{{ arm.name }}</div>
          <div class="sac-type">{{ arm.type === 'rigid' ? '刚性臂 (6-DOF)' : '柔性臂 (连续体)' }}</div>
          <el-tag :color="statusColor(arm.status)" effect="dark" size="large">
            {{ statusLabel(arm.status) }}
          </el-tag>
          <div class="sac-quick-data">
            <template v-if="arm.type === 'rigid'">
              <span>末端: ({{ arm.endEffector.x.toFixed(1) }}, {{ arm.endEffector.y.toFixed(1) }}, {{ arm.endEffector.z.toFixed(1) }})</span>
            </template>
            <template v-else>
              <span>形变: {{ arm.deformation }}mm | 端点: ({{ arm.endPosition.x.toFixed(1) }}, {{ arm.endPosition.y.toFixed(1) }})</span>
            </template>
          </div>
        </div>
      </div>
    </template>

    <!-- Pro mode: tabbed detailed view -->
    <template v-else>
      <ArmTabSelector v-model="activeArmId" />

      <div class="arm-detail" v-if="activeArm">
        <!-- Arm info header -->
        <div class="arm-info-bar">
          <span class="arm-info-name">{{ activeArm.name }}</span>
          <el-tag :color="statusColor(activeArm.status)" effect="dark">
            {{ statusLabel(activeArm.status) }}
          </el-tag>
          <span class="arm-info-type">{{ activeArm.type === 'rigid' ? '刚性机械臂 (6 自由度)' : '柔性机械臂 (连续体)' }}</span>
        </div>

        <!-- Render rigid or flexible panel -->
        <RigidArmPanel v-if="activeArm.type === 'rigid'" :arm="activeArm" />
        <FlexibleArmPanel v-else :arm="activeArm" />
      </div>

      <div v-else class="empty-state">
        <el-icon :size="48"><Setting /></el-icon>
        <p>请选择机械臂查看详情</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRobotArmStore } from '@/stores/robotArm'
import { ARM_STATUS_MAP } from '@/utils/constants'
import ArmTabSelector from '@/components/robot/ArmTabSelector.vue'
import RigidArmPanel from '@/components/robot/RigidArmPanel.vue'
import FlexibleArmPanel from '@/components/robot/FlexibleArmPanel.vue'

const appStore = useAppStore()
const armStore = useRobotArmStore()
const activeArmId = ref('rigid_1')

const activeArm = computed(() => armStore.arms[activeArmId.value] || null)

function statusColor(s) { return ARM_STATUS_MAP[s]?.color || '#94a3b8' }
function statusLabel(s) { return ARM_STATUS_MAP[s]?.label || s }
</script>

<style scoped>
.robot-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Simple mode */
.simple-arm-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.simple-arm-card {
  background: var(--s-bg-card);
  border-radius: var(--s-radius-lg);
  box-shadow: var(--s-shadow-lg);
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 3px solid transparent;
}

.simple-arm-card.status-error { border-color: #ef4444; }
.simple-arm-card.status-moving { border-color: #3b82f6; }
.simple-arm-card.status-picking { border-color: #f59e0b; }

.sac-icon { color: var(--s-accent); }
.sac-name { font-size: 20px; font-weight: 700; color: var(--s-text-primary); }
.sac-type { font-size: 14px; color: var(--s-text-secondary); }
.sac-quick-data {
  font-size: 13px;
  color: var(--s-text-secondary);
  font-family: monospace;
  margin-top: 4px;
}

/* Pro mode */
.arm-info-bar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
}

.arm-info-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--s-text-primary);
}

.arm-info-type {
  font-size: 13px;
  color: var(--s-text-secondary);
  margin-left: auto;
}

.empty-state {
  text-align: center;
  padding: 60px 0;
  color: var(--s-text-secondary);
}

@media (max-width: 768px) {
  .simple-arm-grid { grid-template-columns: 1fr; }
}
</style>
