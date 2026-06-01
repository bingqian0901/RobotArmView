<template>
  <header class="app-header" :class="{ 'pro-mode': appStore.mode === 'pro' }">
    <!-- Left: hamburger (mobile) + breadcrumb -->
    <div class="header-left">
      <el-icon class="hamburger" :size="22" @click="appStore.toggleSidebar()">
        <Fold />
      </el-icon>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="currentTitle">{{ currentTitle }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- Right: items -->
    <div class="header-right">
      <!-- Connection status -->
      <el-tag
        :type="wsStore.connectionType"
        size="small"
        effect="dark"
        class="conn-tag"
      >
        {{ wsStore.connectionLabel }}
      </el-tag>

      <!-- Clock -->
      <span class="clock">{{ clock }}</span>

      <!-- Mode toggle -->
      <div class="mode-switch">
        <span :class="{ active: appStore.mode === 'simple' }">简洁</span>
        <el-switch
          :model-value="appStore.mode === 'pro'"
          @change="appStore.toggleMode()"
          size="small"
          :active-color="appStore.mode === 'pro' ? '#22d3ee' : '#10b981'"
        />
        <span :class="{ active: appStore.mode === 'pro' }">专业</span>
      </div>

      <!-- Alert bell -->
      <el-badge :value="appStore.alertMessages.length" :hidden="!appStore.alertMessages.length">
        <el-icon :size="20" class="alert-bell" @click="showAlerts = true">
          <Bell />
        </el-icon>
      </el-badge>
    </div>

    <!-- Alert Dialog -->
    <el-dialog v-model="showAlerts" title="系统告警" width="480px" :close-on-click-modal="false">
      <div v-if="!appStore.alertMessages.length" class="empty-alerts">暂无告警</div>
      <div v-else class="alert-list">
        <div
          v-for="alert in appStore.alertMessages"
          :key="alert.id"
          class="alert-item"
          :class="'level-' + alert.level"
        >
          <el-tag :type="alert.level === 'error' ? 'danger' : alert.level === 'warn' ? 'warning' : 'info'" size="small">
            {{ alert.level === 'error' ? '错误' : alert.level === 'warn' ? '警告' : '信息' }}
          </el-tag>
          <span class="alert-msg">{{ alert.message }}</span>
          <el-button link type="danger" @click="appStore.removeAlert(alert.id)">✕</el-button>
        </div>
      </div>
      <template #footer>
        <el-button @click="appStore.clearAlerts()" :disabled="!appStore.alertMessages.length">
          清空全部
        </el-button>
      </template>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useWebSocketStore } from '@/stores/websocket'

const route = useRoute()
const appStore = useAppStore()
const wsStore = useWebSocketStore()

const showAlerts = ref(false)
const clock = ref('')
let clockTimer = null

const currentTitle = computed(() => route.meta?.title || '')

function updateClock() {
  const now = new Date()
  clock.value = now.toLocaleTimeString('zh-CN', { hour12: false })
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(clockTimer)
})
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 20px;
  background: var(--s-bg-card);
  border-bottom: 1px solid var(--s-border);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.hamburger {
  cursor: pointer;
  color: var(--s-text-secondary);
}
.hamburger:hover {
  color: var(--s-accent);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.conn-tag {
  font-size: 12px;
}

.clock {
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  color: var(--s-text-secondary);
  min-width: 70px;
  text-align: center;
}

.mode-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--s-text-secondary);
}

.mode-switch span.active {
  color: var(--s-accent);
  font-weight: 600;
}

.alert-bell {
  cursor: pointer;
  color: var(--s-text-secondary);
}
.alert-bell:hover {
  color: var(--s-accent);
}

.empty-alerts {
  text-align: center;
  padding: 30px;
  color: var(--s-text-secondary);
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background: var(--s-bg-primary);
}

.alert-msg {
  flex: 1;
  font-size: 14px;
}

@media (max-width: 768px) {
  .mode-switch span {
    display: none;
  }
}
</style>
