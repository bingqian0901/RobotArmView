import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWebSocketStore = defineStore('websocket', () => {
  // ---- State ----
  const connected = ref(false)
  const reconnectCount = ref(0)
  const latency = ref(0)
  const messageCount = ref(0)
  const lastMessageTime = ref(null)

  // ---- Computed ----
  const connectionLabel = computed(() => {
    if (connected.value) return latency.value > 0 ? `${latency.value}ms` : '已连接'
    return reconnectCount.value > 0 ? `重连中(${reconnectCount.value})` : '未连接'
  })

  const connectionType = computed(() => {
    if (connected.value) return 'success'
    if (reconnectCount.value > 0) return 'warning'
    return 'danger'
  })

  // ---- Actions ----
  function setConnected(val) {
    connected.value = val
    if (val) reconnectCount.value = 0
  }

  function setLatency(ms) {
    latency.value = ms
  }

  function incrementReconnect() {
    reconnectCount.value++
  }

  function recordMessage() {
    messageCount.value++
    lastMessageTime.value = Date.now()
  }

  return {
    connected, reconnectCount, latency, messageCount, lastMessageTime,
    connectionLabel, connectionType,
    setConnected, setLatency, incrementReconnect, recordMessage,
  }
})
