<template>
  <TransitionGroup name="alert-slide" tag="div" class="alert-banner-wrap">
    <div
      v-for="alert in appStore.alertMessages.slice(0, 3)"
      :key="alert.id"
      class="alert-banner"
      :class="'level-' + alert.level"
    >
      <el-icon :size="16">
        <WarningFilled v-if="alert.level === 'warn' || alert.level === 'error'" />
        <InfoFilled v-else />
      </el-icon>
      <span class="alert-text">{{ alert.message }}</span>
      <el-button link :size="'small'" @click="appStore.removeAlert(alert.id)">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
const appStore = useAppStore()
</script>

<style scoped>
.alert-banner-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: -4px;
}

.alert-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
}

.alert-banner.level-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.alert-banner.level-warn {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
.alert-banner.level-info {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.alert-text {
  flex: 1;
}

/* Transition */
.alert-slide-enter-active,
.alert-slide-leave-active {
  transition: all 0.3s ease;
}
.alert-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.alert-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
