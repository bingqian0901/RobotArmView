<template>
  <div class="app-layout" :class="{ 'pro-mode-layout': appStore.mode === 'pro' }">
    <AppSidebar />
    <div class="main-area" :class="{ collapsed: appStore.sidebarCollapsed }">
      <AppHeader />
      <main class="content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useAppStore } from '@/stores/app'
import { useWebSocketStore } from '@/stores/websocket'
import { startMockEngine } from '@/utils/mock'

const appStore = useAppStore()
const wsStore = useWebSocketStore()

onMounted(() => {
  // Auto-start mock engine when no real WebSocket is available
  // In production, connect to real WS first; fallback to mock
  if (!wsStore.connected) {
    startMockEngine()
  }
})
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--s-bg-primary);
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 220px;
  transition: margin-left 0.3s;
  min-width: 0;
}

.main-area.collapsed {
  margin-left: 64px;
}

.content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px;
}

/* Route transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .main-area {
    margin-left: 0 !important;
  }
  .content {
    padding: 12px;
  }
}
</style>
