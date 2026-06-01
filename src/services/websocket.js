// WebSocket service — handles raw connection, auto-reconnect, heartbeat.
// Message routing to Pinia stores is done in the mock / ws handler layer.

const DEFAULT_URL = 'ws://localhost:8080/ws'
const HEARTBEAT_INTERVAL = 30000
const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000]

export function createWebSocketService(url = DEFAULT_URL) {
  let ws = null
  let reconnectIdx = 0
  let heartbeatTimer = null
  let reconnectTimer = null
  let pingSentAt = 0

  const listeners = {
    open: [],
    close: [],
    message: [],
    error: [],
  }

  function on(event, fn) {
    listeners[event]?.push(fn)
  }
  function off(event, fn) {
    listeners[event] = listeners[event]?.filter((f) => f !== fn)
  }
  function emit(event, data) {
    listeners[event]?.forEach((fn) => fn(data))
  }

  function connect() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return

    try {
      ws = new WebSocket(url)
    } catch (e) {
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      reconnectIdx = 0
      emit('open')
      startHeartbeat()
    }

    ws.onclose = () => {
      stopHeartbeat()
      emit('close')
      scheduleReconnect()
    }

    ws.onerror = (e) => {
      emit('error', e)
    }

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data)
        if (msg.type === 'pong') {
          pingSentAt = 0
          emit('latency', Date.now() - pingSentAt)
        }
        emit('message', msg)
      } catch {
        // ignore malformed messages
      }
    }
  }

  function disconnect() {
    stopHeartbeat()
    clearTimeout(reconnectTimer)
    reconnectIdx = RECONNECT_DELAYS.length // prevent reconnect
    if (ws) {
      ws.onclose = null // avoid triggering reconnect
      ws.close()
      ws = null
    }
  }

  function send(type, data = {}) {
    if (!ws || ws.readyState !== WebSocket.OPEN) return false
    ws.send(JSON.stringify({ type, data }))
    return true
  }

  function startHeartbeat() {
    stopHeartbeat()
    heartbeatTimer = setInterval(() => {
      pingSentAt = Date.now()
      send('ping', { timestamp: pingSentAt })
    }, HEARTBEAT_INTERVAL)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  function scheduleReconnect() {
    if (reconnectIdx >= RECONNECT_DELAYS.length) {
      emit('maxReconnect')
      return
    }
    const delay = RECONNECT_DELAYS[reconnectIdx]
    reconnectIdx++
    emit('reconnecting', reconnectIdx)
    clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(() => connect(), delay)
  }

  return { connect, disconnect, send, on, off }
}
