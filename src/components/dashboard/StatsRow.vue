<template>
  <div class="stats-row">
    <div class="stat-card" v-for="stat in statsList" :key="stat.key">
      <div class="stat-icon" :style="{ background: stat.bg }">
        <el-icon :size="appStore.mode === 'simple' ? 28 : 22">
          <component :is="stat.icon" />
        </el-icon>
      </div>
      <div class="stat-info">
        <span class="stat-value" :class="{ large: appStore.mode === 'simple' }">
          {{ stat.value }}
        </span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useDetectionStore } from '@/stores/detection'
import { useTaskStore } from '@/stores/task'
import { useRobotArmStore } from '@/stores/robotArm'

const appStore = useAppStore()
const detStore = useDetectionStore()
const taskStore = useTaskStore()
const armStore = useRobotArmStore()

const statsList = computed(() => {
  const detStats = detStore.stats
  const summary = armStore.statusSummary

  return [
    {
      key: 'detected',
      icon: 'View',
      label: '检测水果数',
      value: detStats.total,
      bg: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
    },
    {
      key: 'picked',
      icon: 'CircleCheck',
      label: '采摘成功',
      value: taskStore.completedCount,
      bg: 'linear-gradient(135deg, #34d399, #10b981)',
    },
    {
      key: 'successRate',
      icon: 'TrendCharts',
      label: '成功率',
      value: taskStore.completedCount + taskStore.failedCount > 0
        ? Math.round((taskStore.completedCount / (taskStore.completedCount + taskStore.failedCount)) * 100) + '%'
        : '--',
      bg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)',
    },
    {
      key: 'armStatus',
      icon: 'Setting',
      label: '机械臂运行',
      value: `${summary.idle}空闲 / ${summary.moving + summary.picking}工作中`,
      bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
    },
  ]
})
</script>

<style scoped>
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--s-text-primary);
}

.stat-value.large {
  font-size: 28px;
}

.stat-label {
  font-size: 13px;
  color: var(--s-text-secondary);
  margin-top: 2px;
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
