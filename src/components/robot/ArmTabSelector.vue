<template>
  <div class="arm-tabs">
    <div
      v-for="arm in armStore.armList"
      :key="arm.id"
      class="arm-tab"
      :class="{ active: modelValue === arm.id, ['status-' + arm.status]: true }"
      @click="$emit('update:modelValue', arm.id)"
    >
      <el-icon :size="18">
        <component :is="arm.type === 'rigid' ? 'Setting' : 'Connection'" />
      </el-icon>
      <span class="tab-label">{{ arm.name }}</span>
      <span class="tab-dot" :style="{ background: statusColor(arm.status) }"></span>
    </div>
  </div>
</template>

<script setup>
import { useRobotArmStore } from '@/stores/robotArm'
import { ARM_STATUS_MAP } from '@/utils/constants'

defineProps({ modelValue: { type: String, required: true } })
defineEmits(['update:modelValue'])

const armStore = useRobotArmStore()
function statusColor(s) { return ARM_STATUS_MAP[s]?.color || '#94a3b8' }
</script>

<style scoped>
.arm-tabs {
  display: flex;
  gap: 4px;
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  padding: 4px;
}

.arm-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--s-text-secondary);
  transition: all 0.2s;
  position: relative;
}

.arm-tab:hover {
  color: var(--s-text-primary);
  background: var(--s-bg-primary);
}

.arm-tab.active {
  color: var(--s-accent);
  background: var(--s-bg-primary);
  font-weight: 600;
}

.tab-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tab-label {
  font-size: 14px;
}
</style>
