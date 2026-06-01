import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTaskStore = defineStore('task', () => {
  // ---- State ----
  const activeTasks = ref([])
  const taskHistory = ref([])
  const taskIdCounter = ref(0)

  // ---- Computed ----
  const currentTask = computed(() => activeTasks.value[0] || null)

  const activeCount = computed(() => activeTasks.value.length)
  const completedCount = computed(() => taskHistory.value.filter((t) => t.status === 'completed').length)
  const failedCount = computed(() => taskHistory.value.filter((t) => t.status === 'failed').length)

  // ---- Actions ----
  function createTask({ targetClass, armId, priority = 'normal' }) {
    const task = {
      id: `task_${++taskIdCounter.value}_${Date.now()}`,
      targetClass,
      armId: armId || 'auto',
      priority,
      status: 'pending',
      progress: 0,
      message: '等待分配机械臂...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    activeTasks.value.push(task)
    return task
  }

  function quickPick(targetClass) {
    return createTask({ targetClass, armId: 'auto', priority: 'normal' })
  }

  function updateTaskStatus(data) {
    const { task_id, status, progress, message } = data
    let task = activeTasks.value.find((t) => t.id === task_id)
    if (!task) {
      // find in history
      task = taskHistory.value.find((t) => t.id === task_id)
      if (!task) return
    }

    task.status = status
    task.progress = progress ?? task.progress
    task.message = message || task.message
    task.updatedAt = new Date().toISOString()

    // Move to history when terminal
    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      activeTasks.value = activeTasks.value.filter((t) => t.id !== task_id)
      taskHistory.value.unshift(task)
      if (taskHistory.value.length > 200) taskHistory.value = taskHistory.value.slice(0, 200)
    }
  }

  function cancelTask(taskId) {
    const task = activeTasks.value.find((t) => t.id === taskId)
    if (task) {
      task.status = 'cancelled'
      task.message = '任务已取消'
      task.updatedAt = new Date().toISOString()
      activeTasks.value = activeTasks.value.filter((t) => t.id !== taskId)
      taskHistory.value.unshift(task)
    }
  }

  function clearHistory() {
    taskHistory.value = []
  }

  return {
    activeTasks, taskHistory, currentTask,
    activeCount, completedCount, failedCount,
    createTask, quickPick, updateTaskStatus, cancelTask, clearHistory,
  }
})
