<template>
  <div class="task-view">
    <!-- Simple mode: Quick pick + active tasks -->
    <template v-if="appStore.mode === 'simple'">
      <QuickPickPanel />
      <div class="task-section" v-if="taskStore.activeTasks.length">
        <h4>进行中的任务</h4>
        <TaskQueue />
      </div>
    </template>

    <!-- Pro mode: Full task management -->
    <template v-else>
      <div class="pro-task-grid">
        <!-- Left column: create + active -->
        <div class="pro-task-left">
          <TaskForm />
          <div class="task-section">
            <h4>任务队列 ({{ taskStore.activeTasks.length }})</h4>
            <TaskQueue />
          </div>
        </div>
        <!-- Right column: history -->
        <div class="pro-task-right">
          <TaskHistory />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useTaskStore } from '@/stores/task'
import QuickPickPanel from '@/components/task/QuickPickPanel.vue'
import TaskForm from '@/components/task/TaskForm.vue'
import TaskQueue from '@/components/task/TaskQueue.vue'
import TaskHistory from '@/components/task/TaskHistory.vue'

const appStore = useAppStore()
const taskStore = useTaskStore()
</script>

<style scoped>
.task-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.task-section {
  background: var(--s-bg-card);
  border-radius: var(--s-radius);
  box-shadow: var(--s-shadow);
  padding: 18px;
}

.task-section h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 14px;
}

.pro-task-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pro-task-left,
.pro-task-right {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 1024px) {
  .pro-task-grid {
    grid-template-columns: 1fr;
  }
}
</style>
