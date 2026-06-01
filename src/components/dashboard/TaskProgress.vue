<template>
  <div class="task-progress">
    <!-- Active tasks -->
    <div v-if="taskStore.activeTasks.length" class="active-tasks">
      <div
        v-for="task in taskStore.activeTasks"
        :key="task.id"
        class="task-item"
      >
        <div class="task-header">
          <el-tag :type="taskStatusType(task.status)" size="small">
            {{ taskStatusLabel(task.status) }}
          </el-tag>
          <span class="task-target">{{ fruitLabel(task.targetClass) }}</span>
          <el-button
            v-if="task.status === 'pending'"
            link
            type="danger"
            size="small"
            @click="taskStore.cancelTask(task.id)"
          >
            取消
          </el-button>
        </div>
        <el-progress
          :percentage="Math.round(task.progress)"
          :status="task.progress >= 100 ? 'success' : ''"
          :stroke-width="appStore.mode === 'simple' ? 14 : 10"
        />
        <div class="task-msg">{{ task.message }}</div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-tasks">
      <el-icon :size="36"><CoffeeCup /></el-icon>
      <p>暂无进行中的任务</p>
      <el-button type="primary" @click="$router.push('/tasks')">
        前往下发任务
      </el-button>
    </div>

    <!-- Recent history (pro mode) -->
    <div v-if="appStore.mode === 'pro' && taskStore.taskHistory.slice(0, 3).length" class="recent-history">
      <h4>最近任务</h4>
      <div
        v-for="h in taskStore.taskHistory.slice(0, 3)"
        :key="h.id"
        class="history-item"
      >
        <span class="h-target">{{ fruitLabel(h.targetClass) }}</span>
        <el-tag :type="taskStatusType(h.status)" size="small">
          {{ taskStatusLabel(h.status) }}
        </el-tag>
        <span class="h-time">{{ formatTime(h.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES, TASK_STATUS_MAP } from '@/utils/constants'

const appStore = useAppStore()
const taskStore = useTaskStore()

function taskStatusLabel(s) { return TASK_STATUS_MAP[s]?.label || s }
function taskStatusType(s) {
  if (s === 'completed') return 'success'
  if (s === 'failed' || s === 'cancelled') return 'danger'
  if (s === 'picking') return 'warning'
  return ''
}
function fruitLabel(cls) { return FRUIT_CLASSES[cls]?.label || cls }

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.task-progress {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.active-tasks {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.task-item {
  background: var(--s-bg-primary);
  border-radius: 10px;
  padding: 14px;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.task-target {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: var(--s-text-primary);
}

.task-msg {
  font-size: 12px;
  color: var(--s-text-secondary);
  margin-top: 8px;
}

.empty-tasks {
  text-align: center;
  padding: 30px 0;
  color: var(--s-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.recent-history {
  border-top: 1px solid var(--s-border);
  padding-top: 14px;
}

.recent-history h4 {
  font-size: 13px;
  color: var(--s-text-secondary);
  margin-bottom: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  font-size: 13px;
}

.h-target {
  flex: 1;
  font-weight: 500;
  color: var(--s-text-primary);
}

.h-time {
  font-size: 12px;
  color: var(--s-text-secondary);
  font-family: monospace;
}
</style>
