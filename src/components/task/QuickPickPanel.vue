<template>
  <div class="quick-pick">
    <h2>🍎 快速采摘</h2>
    <p class="qp-desc">选择目标水果类型，系统将自动分配空闲机械臂执行采摘</p>

    <div class="fruit-buttons">
      <el-button
        v-for="fruit in fruitList"
        :key="fruit.key"
        :color="fruit.color"
        size="large"
        class="fruit-btn"
        :dark="false"
        @click="doPick(fruit.key)"
      >
        <span class="fruit-emoji">{{ fruit.emoji }}</span>
        <span class="fruit-label">{{ fruit.label }}</span>
      </el-button>
    </div>

    <!-- Recently picked -->
    <div class="recent-picks" v-if="recentPicks.length">
      <h4>最近采摘</h4>
      <div class="recent-item" v-for="t in recentPicks" :key="t.id">
        <span>{{ fruitLabel(t.targetClass) }}</span>
        <el-tag :type="t.status === 'completed' ? 'success' : 'danger'" size="small">
          {{ t.status === 'completed' ? '成功' : '失败' }}
        </el-tag>
        <span class="recent-time">{{ formatTime(t.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES } from '@/utils/constants'

const taskStore = useTaskStore()

const fruitList = Object.entries(FRUIT_CLASSES).map(([key, info]) => ({
  key,
  label: info.label,
  color: info.color,
  emoji: { apple: '🍎', orange: '🍊', pear: '🍐', peach: '🍑', lemon: '🍋' }[key] || '🍎',
}))

const recentPicks = computed(() =>
  taskStore.taskHistory.filter((t) => ['completed', 'failed'].includes(t.status)).slice(0, 5)
)

function doPick(targetClass) {
  taskStore.quickPick(targetClass)
}

function fruitLabel(cls) { return FRUIT_CLASSES[cls]?.label || cls }
function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped>
.quick-pick {
  background: var(--s-bg-card);
  border-radius: var(--s-radius-lg);
  box-shadow: var(--s-shadow-lg);
  padding: 28px;
  text-align: center;
}

.quick-pick h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--s-text-primary);
  margin-bottom: 8px;
}

.qp-desc {
  font-size: 14px;
  color: var(--s-text-secondary);
  margin-bottom: 24px;
}

.fruit-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}

.fruit-btn {
  min-width: 130px;
  height: 60px !important;
  font-size: 18px !important;
  border-radius: 14px !important;
  color: #fff !important;
}

.fruit-emoji {
  font-size: 24px;
  margin-right: 8px;
}

.fruit-label {
  font-weight: 600;
}

.recent-picks {
  margin-top: 24px;
  text-align: left;
  border-top: 1px solid var(--s-border);
  padding-top: 18px;
}

.recent-picks h4 {
  font-size: 14px;
  color: var(--s-text-secondary);
  margin-bottom: 10px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  font-size: 14px;
}

.recent-item span:first-child {
  flex: 1;
  color: var(--s-text-primary);
  font-weight: 500;
}

.recent-time {
  font-size: 12px;
  color: var(--s-text-secondary);
  font-family: monospace;
}
</style>
