<template>
  <div class="arm-cards" :class="{ 'pro-grid': appStore.mode === 'pro' }">
    <div
      v-for="arm in armStore.armList"
      :key="arm.id"
      class="arm-card"
      :class="[`status-${arm.status}`, { 'is-pro': appStore.mode === 'pro' }]"
      @click="$router.push('/arms')"
    >
      <!-- Simple mode: large card -->
      <template v-if="appStore.mode === 'simple'">
        <div class="arm-icon">
          <el-icon :size="36">
            <component :is="arm.type === 'rigid' ? 'Setting' : 'Connection'" />
          </el-icon>
        </div>
        <div class="arm-body">
          <div class="arm-name">{{ arm.name }}</div>
          <div class="arm-type-tag">{{ arm.type === 'rigid' ? '刚性臂' : '柔性臂' }}</div>
        </div>
        <el-tag
          :color="statusColor(arm.status)"
          effect="dark"
          size="default"
          class="arm-status-tag"
        >
          {{ statusLabel(arm.status) }}
        </el-tag>
      </template>

      <!-- Pro mode: compact detail -->
      <template v-else>
        <div class="pro-arm-header">
          <el-icon :size="20">
            <component :is="arm.type === 'rigid' ? 'Setting' : 'Connection'" />
          </el-icon>
          <span class="pro-arm-name">{{ arm.name }}</span>
          <el-tag :color="statusColor(arm.status)" effect="dark" size="small">
            {{ statusLabel(arm.status) }}
          </el-tag>
        </div>
        <div class="pro-arm-detail">
          <template v-if="arm.type === 'rigid'">
            <div class="mini-row" v-for="j in arm.joints.slice(0, 3)" :key="j.name">
              <span class="mini-label">{{ j.name }}</span>
              <span class="mini-val">{{ j.angle }}°</span>
            </div>
          </template>
          <template v-else>
            <div class="mini-row">
              <span class="mini-label">形变量</span>
              <span class="mini-val">{{ arm.deformation }}mm</span>
            </div>
            <div class="mini-row">
              <span class="mini-label">最大曲率</span>
              <span class="mini-val">{{ maxCurvature(arm) }}</span>
            </div>
          </template>
        </div>
        <!-- Mini sparkline placeholder -->
        <div class="pro-sparkline">
          <div class="spark-dot" v-for="i in 20" :key="i"
            :style="{ height: (10 + Math.random() * 20) + 'px' }"
          ></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRobotArmStore } from '@/stores/robotArm'
import { ARM_STATUS_MAP } from '@/utils/constants'

const appStore = useAppStore()
const armStore = useRobotArmStore()

function statusColor(s) { return ARM_STATUS_MAP[s]?.color || '#94a3b8' }
function statusLabel(s) { return ARM_STATUS_MAP[s]?.label || s }
function maxCurvature(arm) {
  if (!arm.segments?.length) return '--'
  return Math.max(...arm.segments.map((s) => s.curvature)).toFixed(3) + ' /m'
}
</script>

<style scoped>
.arm-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.arm-cards.pro-grid {
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.arm-card {
  background: var(--s-bg-primary);
  border-radius: var(--s-radius);
  padding: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.25s;
}

.arm-card:hover {
  border-color: var(--s-accent);
  transform: translateY(-2px);
  box-shadow: var(--s-shadow-lg);
}

.arm-card.status-error {
  border-color: #ef4444;
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: #ef4444; }
  50% { border-color: transparent; }
}

/* Simple mode */
.arm-card:not(.is-pro) {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 18px;
}

.arm-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--s-bg-card);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--s-accent);
}

.arm-body {
  flex: 1;
  min-width: 0;
}

.arm-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--s-text-primary);
}

.arm-type-tag {
  font-size: 12px;
  color: var(--s-text-secondary);
  margin-top: 4px;
}

.arm-status-tag {
  flex-shrink: 0;
}

/* Pro mode */
.arm-card.is-pro {
  padding: 12px 14px;
}

.pro-arm-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.pro-arm-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  color: var(--s-text-primary);
}

.pro-arm-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}

.mini-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.mini-label { color: var(--s-text-secondary); }
.mini-val { color: var(--s-text-primary); font-family: monospace; }

.pro-sparkline {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 30px;
}

.spark-dot {
  flex: 1;
  background: var(--s-accent);
  opacity: 0.6;
  border-radius: 1px;
  min-width: 4px;
}

@media (max-width: 640px) {
  .arm-cards {
    grid-template-columns: 1fr;
  }
}
</style>
