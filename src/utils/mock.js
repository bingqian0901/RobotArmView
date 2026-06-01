// Mock engine — simulates WebSocket pushes when no real backend is connected.
// Drives all Pinia stores so the UI works standalone for demo & development.

import { useAppStore } from '@/stores/app'
import { useWebSocketStore } from '@/stores/websocket'
import { useDetectionStore } from '@/stores/detection'
import { useRobotArmStore } from '@/stores/robotArm'
import { useTaskStore } from '@/stores/task'
import { FRUIT_CLASSES } from './constants'

const FRUIT_KEYS = Object.keys(FRUIT_CLASSES)
const ARM_IDS = ['rigid_1', 'rigid_2', 'flexible_1', 'flexible_2']
const RIGID_JOINT_NAMES = ['基座', '肩部', '肘部', '腕部1', '腕部2', '腕部3']

let timers = []
let frameId = 0

// ---- Random helpers ----
function rnd(min, max) { return +(min + Math.random() * (max - min)).toFixed(2) }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

// ---- Detection mock ----
function generateDetections() {
  const count = Math.floor(rnd(0, 8))
  const dets = []
  for (let i = 0; i < count; i++) {
    const cls = pick(FRUIT_KEYS)
    dets.push({
      id: `det_${frameId}_${i}`,
      class_name: cls,
      confidence: +rnd(0.5, 0.99).toFixed(2),
      ripeness: Math.random() > 0.3 ? 'ripe' : 'unripe',
      bbox: {
        x1: rnd(10, 400),
        y1: rnd(10, 380),
        x2: rnd(150, 620),
        y2: rnd(150, 460),
      },
      position_3d: {
        x: rnd(-1.5, 2.5),
        y: rnd(0.3, 3.0),
        z: rnd(0.5, 4.0),
      },
    })
  }
  return dets
}

// ---- Rigid arm mock ----
function generateRigidJoints(prevJoints) {
  return prevJoints.map((j, i) => {
    // Simulate smooth joint motion
    const baseAngles = [0, 30, -45, 15, -20, 0]
    const noise = rnd(-3, 3)
    return {
      name: j.name,
      angle: +clamp((baseAngles[i] + noise + (j.angle || 0)) / 2 + rnd(-1, 1), -180, 180).toFixed(1),
      velocity: +rnd(0, 5).toFixed(2),
      torque: +rnd(0, 3).toFixed(2),
      temperature: +clamp((j.temperature || 25) + rnd(-0.3, 0.3), 20, 70).toFixed(1),
    }
  })
}

// ---- Flexible arm mock ----
function generateFlexibleSegments(prevSegments) {
  return prevSegments.map((s, i) => ({
    name: s.name,
    curvature: +rnd(0, 0.5).toFixed(3),
    bendAngle: +rnd(-30, 30).toFixed(1),
  }))
}

function generateFlexibleTension(prevTension) {
  return prevTension.map((t) => ({
    name: t.name,
    force: +clamp((t.force || 10) + rnd(-1, 1), 0, 30).toFixed(2),
  }))
}

// ---- Arm status rotation ----
function rotateArmStatus(arm) {
  if (arm.status === 'error') return 'error'  // error sticks
  const states = ['idle', 'idle', 'idle', 'moving', 'moving', 'picking']
  return pick(states)
}

// ---- Main tick — fires at intervals depending on mode ----
export function startMockEngine() {
  stopMockEngine()
  const appStore = useAppStore()
  const wsStore = useWebSocketStore()
  const detStore = useDetectionStore()
  const armStore = useRobotArmStore()
  const taskStore = useTaskStore()

  // Mark as connected for mock mode
  wsStore.setConnected(true)
  wsStore.setLatency(rnd(5, 30))

  // Detection ticks (every 500ms)
  timers.push(setInterval(() => {
    frameId++
    detStore.updateDetections({
      frame_id: `frame_${String(frameId).padStart(5, '0')}`,
      timestamp: new Date().toISOString(),
      detections: generateDetections(),
    })
  }, 500))

  // Arm status ticks (every 300ms for pro, 1000ms for simple)
  function tickArms() {
    const interval = appStore.mode === 'pro' ? 300 : 1000
    ARM_IDS.forEach((armId) => {
      const arm = armStore.arms[armId]
      const newStatus = rotateArmStatus(arm)

      if (arm.type === 'rigid') {
        armStore.updateArmStatus({
          arm_id: armId,
          type: 'rigid',
          status: newStatus,
          joints: generateRigidJoints(arm.joints),
          end_effector: {
            x: +rnd(-1.5, 2.5).toFixed(3),
            y: +rnd(0.3, 3.0).toFixed(3),
            z: +rnd(0.5, 4.0).toFixed(3),
            gripper: newStatus === 'picking' ? 'closed' : 'open',
          },
          motor_current: +rnd(0.5, 5).toFixed(2),
          motor_rpm: +rnd(0, 3000).toFixed(0),
        })
      } else {
        armStore.updateArmStatus({
          arm_id: armId,
          type: 'flexible',
          status: newStatus,
          segments: generateFlexibleSegments(arm.segments),
          tension: generateFlexibleTension(arm.tension),
          deformation: +rnd(0, 15).toFixed(2),
          end_position: {
            x: +rnd(-1.5, 2.5).toFixed(3),
            y: +rnd(0.3, 3.0).toFixed(3),
            z: +rnd(0.5, 4.0).toFixed(3),
          },
        })
      }
    })
    // Re-schedule with correct interval (handles mode change)
    timers.push(setTimeout(() => tickArms(), interval))
  }
  tickArms()

  // Simulate task lifecycle every 8-15 seconds
  function tickTasks() {
    const targets = FRUIT_KEYS
    const task = taskStore.quickPick(pick(targets))
    task.status = 'moving'
    task.message = '机械臂正在接近目标...'
    task.progress = 10

    // Simulate progress updates
    const updateTimer = setInterval(() => {
      if (!taskStore.activeTasks.find((t) => t.id === task.id)) {
        clearInterval(updateTimer)
        return
      }
      if (task.progress >= 100) {
        taskStore.updateTaskStatus({
          task_id: task.id,
          status: Math.random() > 0.15 ? 'completed' : 'failed',
          progress: 100,
          message: Math.random() > 0.15 ? '采摘成功' : '采摘失败：果实脱落',
        })
        clearInterval(updateTimer)
        return
      }
      task.progress = Math.min(100, task.progress + rnd(15, 30))
      if (task.progress < 40) {
        task.status = 'moving'
        task.message = '机械臂正在接近目标...'
      } else if (task.progress < 80) {
        task.status = 'picking'
        task.message = '正在抓取果实...'
      } else {
        task.message = '正在放置果实...'
      }
    }, 1500)

    timers.push(updateTimer)
    timers.push(setTimeout(() => tickTasks(), rnd(8000, 15000)))
  }
  tickTasks()

  // System alerts (occasional)
  timers.push(setInterval(() => {
    if (Math.random() < 0.15) {
      const alerts = [
        { level: 'warn', message: '柔性臂 2 缆线张力接近阈值' },
        { level: 'warn', message: '刚性臂 1 关节 3 温度偏高 (62°C)' },
        { level: 'info', message: '检测到新的成熟果实区域' },
        { level: 'error', message: '相机 2 帧率下降，请检查连接' },
      ]
      const a = pick(alerts)
      appStore.addAlert(a.level, a.message, 6000)
    }
  }, 12000))
}

export function stopMockEngine() {
  timers.forEach((t) => {
    clearInterval(t)
    clearTimeout(t)
  })
  timers = []
  frameId = 0
}
