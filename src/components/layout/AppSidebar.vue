<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed, 'pro-mode': appStore.mode === 'pro' }">
    <!-- Logo area -->
    <div class="logo-area" @click="$router.push('/')">
      <el-icon :size="28"><Apple /></el-icon>
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">采摘机器人</span>
    </div>

    <!-- Navigation -->
    <el-menu
      :default-active="activeMenu"
      :collapse="appStore.sidebarCollapsed"
      :background-color="menuBg"
      :text-color="menuText"
      :active-text-color="menuActive"
      router
      class="nav-menu"
    >
      <el-menu-item index="/">
        <el-icon><Odometer /></el-icon>
        <template #title>总览仪表盘</template>
      </el-menu-item>

      <el-menu-item index="/detection">
        <el-icon><View /></el-icon>
        <template #title>目标检测</template>
      </el-menu-item>

      <el-menu-item index="/arms">
        <el-icon><Setting /></el-icon>
        <template #title>机械臂状态</template>
      </el-menu-item>

      <el-menu-item index="/tasks">
        <el-icon><List /></el-icon>
        <template #title>任务管理</template>
      </el-menu-item>
    </el-menu>

    <!-- Collapse toggle at bottom -->
    <div class="sidebar-footer" @click="appStore.toggleSidebar()">
      <el-icon :size="18">
        <DArrowLeft v-if="!appStore.sidebarCollapsed" />
        <DArrowRight v-else />
      </el-icon>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'

const route = useRoute()
const appStore = useAppStore()

const activeMenu = computed(() => route.path)

const menuBg = computed(() => appStore.mode === 'pro' ? '#141e2b' : '#ffffff')
const menuText = computed(() => appStore.mode === 'pro' ? '#94a3b8' : '#4b5563')
const menuActive = computed(() => appStore.mode === 'pro' ? '#22d3ee' : '#10b981')
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 220px;
  background: var(--s-bg-sidebar);
  border-right: 1px solid var(--s-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.3s;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px;
  cursor: pointer;
  color: var(--s-accent);
  white-space: nowrap;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--s-text-primary);
}

.nav-menu {
  flex: 1;
  border-right: none !important;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  border-top: 1px solid var(--s-border);
  cursor: pointer;
  color: var(--s-text-secondary);
  transition: color 0.2s;
}

.sidebar-footer:hover {
  color: var(--s-accent);
}

/* Override Element Plus menu collapse styles */
.el-menu--collapse {
  width: 64px;
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar:not(.collapsed) {
    transform: translateX(0);
    width: 220px;
  }
}
</style>
