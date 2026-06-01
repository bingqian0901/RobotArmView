<template>
  <div class="task-history card">
    <div class="th-header">
      <h4>历史任务</h4>
      <el-button link type="primary" size="small" @click="taskStore.clearHistory()" :disabled="!taskStore.taskHistory.length">
        清空记录
      </el-button>
    </div>

    <el-table
      :data="paginatedData"
      style="width:100%"
      size="small"
      empty-text="暂无历史记录"
      max-height="500"
    >
      <el-table-column label="目标" width="90">
        <template #default="{ row }">
          <span class="fw-500">{{ fruitLabel(row.targetClass) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">
            {{ statusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="机械臂" width="100">
        <template #default="{ row }">
          <span>{{ row.armId === 'auto' ? '自动' : row.armId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="消息" min-width="140">
        <template #default="{ row }">
          <span class="text-secondary">{{ row.message }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" width="100">
        <template #default="{ row }">
          <span class="time-text">{{ formatTime(row.updatedAt) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="th-pagination" v-if="taskStore.taskHistory.length > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="taskStore.taskHistory.length"
        layout="prev, pager, next"
        size="small"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES, TASK_STATUS_MAP } from '@/utils/constants'

const taskStore = useTaskStore()
const currentPage = ref(1)
const pageSize = 10

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return taskStore.taskHistory.slice(start, start + pageSize)
})

function statusLabel(s) { return TASK_STATUS_MAP[s]?.label || s }
function statusType(s) {
  if ('completed' === s) return 'success'
  if (['failed', 'cancelled'].includes(s)) return 'danger'
  return 'info'
}
function fruitLabel(cls) { return FRUIT_CLASSES[cls]?.label || cls }
function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.task-history h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 0;
}

.th-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fw-500 { font-weight: 500; }
.text-secondary { color: var(--s-text-secondary); font-size: 12px; }
.time-text { font-family: monospace; font-size: 12px; color: var(--s-text-secondary); }

.th-pagination {
  display: flex;
  justify-content: center;
  margin-top: 14px;
}
</style>
