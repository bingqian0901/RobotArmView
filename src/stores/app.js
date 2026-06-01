import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAppStore = defineStore('app', () => {
  // ---- State ----
  const mode = ref(localStorage.getItem('app-mode') || 'simple') // 'simple' | 'pro'
  const sidebarCollapsed = ref(false)
  const alertMessages = ref([])
  let alertId = 0

  // ---- Watch: persist mode preference & toggle pro-mode class on <html> ----
  watch(mode, (val) => {
    localStorage.setItem('app-mode', val)
    document.documentElement.classList.toggle('pro-mode', val === 'pro')
  }, { immediate: true })

  // ---- Actions ----
  function toggleMode() {
    mode.value = mode.value === 'simple' ? 'pro' : 'simple'
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function addAlert(level, message, duration = 5000) {
    const id = ++alertId
    alertMessages.value.push({ id, level, message, ts: Date.now() })
    if (duration > 0) {
      setTimeout(() => removeAlert(id), duration)
    }
  }

  function removeAlert(id) {
    const idx = alertMessages.value.findIndex((a) => a.id === id)
    if (idx !== -1) alertMessages.value.splice(idx, 1)
  }

  function clearAlerts() {
    alertMessages.value = []
  }

  return {
    mode, sidebarCollapsed, alertMessages,
    toggleMode, toggleSidebar, addAlert, removeAlert, clearAlerts,
  }
})
