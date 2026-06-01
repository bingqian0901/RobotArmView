<template>
  <div class="task-queue">
    <!-- Empty -->
    <div v-if="!taskStore.activeTasks.length" class="empty-queue">
      <el-icon :size="32"><List /></el-icon>
      <span>暂无进行中的任务</span>
    </div>

    <!-- Task cards -->
    <div class="queue-list">
      <div
        v-for="task in taskStore.activeTasks"
        :key="task.id"
        class="queue-item"
        :class="'priority-' + task.priority"
      >
        <div class="qi-header">
          <el-tag :type="statusType(task.status)" size="small">
            {{ statusLabel(task.status) }}
          </el-tag>
          <span class="qi-target">{{ fruitLabel(task.targetClass) }}</span>
          <el-tag v-if="task.priority === 'high'" type="danger" size="small">高优先</el-tag>
        </div>

        <el-progress
          :percentage="Math.round(task.progress)"
          :status="task.progress >= 100 ? 'success' : ''"
          :stroke-width="8"
        />

        <div class="qi-footer">
          <span class="qi-msg">{{ task.message }}</span>
          <el-button
            v-if="['pending', 'assigned'].includes(task.status)"
            link type="danger" size="small"
            @click="taskStore.cancelTask(task.id)"
          >
            取消
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES, TASK_STATUS_MAP } from '@/utils/constants'

const taskStore = useTaskStore()

function statusLabel(s) { return TASK_STATUS_MAP[s]?.label || s }
function statusType(s) {
  if (['assigned', 'moving'].includes(s)) return 'primary'
  if ('picking' === s) return 'warning'
  if ('completed' === s) return 'success'
  if (['failed', 'cancelled'].includes(s)) return 'danger'
  return 'info'
}
function fruitLabel(cls) { return FRUIT_CLASSES[cls]?.label || cls }
</script>

<style scoped>
.task-queue {
  min-height: 80px;
}

.empty-queue {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 30px 0;
  color: var(--s-text-secondary);
  font-size: 14px;
}

.queue-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.queue-item {
  background: var(--s-bg-primary);
  border-radius: 10px;
  padding: 14px;
  border-left: 3px solid var(--s-border);
}

.queue-item.priority-high {
  border-left-color: #ef4444;
}

.qi-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.qi-target {
  flex: 1;
  font-weight: 600;
  font-size: 14px;
  color: var(--s-text-primary);
}

.qi-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.qi-msg {
  font-size: 12px;
  color: var(--s-text-secondary);
}
</style>
