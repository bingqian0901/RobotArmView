<template>
  <div class="dashboard">
    <!-- Alert Banner -->
    <AlertBanner />

    <!-- Stats Row -->
    <StatsRow />

    <!-- Main grid: Arm overview + Camera + Tasks -->
    <div class="dash-grid">
      <!-- Arm Overview Cards (takes 2/3 width) -->
      <div class="dash-section dash-arms">
        <div class="section-header">
          <h3>机械臂状态</h3>
          <el-tag v-if="appStore.mode === 'pro'" size="small">
            共 {{ armStore.statusSummary.total }} 臂
          </el-tag>
        </div>
        <ArmOverviewCards />
      </div>

      <!-- Camera Preview + Task Progress side panel -->
      <div class="dash-section dash-side">
        <div class="section-header">
          <h3>相机预览</h3>
        </div>
        <CameraPreview />
      </div>

      <div class="dash-section dash-tasks">
        <div class="section-header">
          <h3>采摘任务</h3>
        </div>
        <TaskProgress />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useRobotArmStore } from '@/stores/robotArm'
import ArmOverviewCards from '@/components/dashboard/ArmOverviewCards.vue'
import CameraPreview from '@/components/dashboard/CameraPreview.vue'
import StatsRow from '@/components/dashboard/StatsRow.vue'
import AlertBanner from '@/components/dashboard/AlertBanner.vue'
import TaskProgress from '@/components/dashboard/TaskProgress.vue'

const appStore = useAppStore()
const armStore = useRobotArmStore()
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dash-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.dash-section {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
}

.dash-arms {
  grid-row: 1 / 3;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--s-text-primary);
}

@media (max-width: 1024px) {
  .dash-grid {
    grid-template-columns: 1fr;
  }
  .dash-arms {
    grid-row: auto;
  }
}
</style>
