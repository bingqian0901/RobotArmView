import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ---- Default arm factory ----
function createRigidArm(id, name) {
  return {
    id,
    name,
    type: 'rigid',
    status: 'idle',        // idle | moving | picking | error
    joints: Array.from({ length: 6 }, (_, i) => ({
      name: `关节${i + 1}`,
      angle: 0,            // degrees
      velocity: 0,         // deg/s
      torque: 0,           // N·m
      temperature: 25,     // °C
    })),
    endEffector: { x: 0, y: 0, z: 0, gripper: 'open' },  // gripper: open | closed
    motorCurrent: 0,       // A
    motorRPM: 0,
  }
}

function createFlexibleArm(id, name) {
  return {
    id,
    name,
    type: 'flexible',
    status: 'idle',
    segments: Array.from({ length: 8 }, (_, i) => ({
      name: `段${i + 1}`,
      curvature: 0,        // 1/m
      bendAngle: 0,        // degrees
    })),
    tension: Array.from({ length: 3 }, (_, i) => ({
      name: `缆线${i + 1}`,
      force: 0,            // N
    })),
    deformation: 0,        // mm, overall
    endPosition: { x: 0, y: 0, z: 0 },
  }
}

export const useRobotArmStore = defineStore('robotArm', () => {
  // ---- State ----
  const arms = ref({
    rigid_1: createRigidArm('rigid_1', '刚性臂 1'),
    rigid_2: createRigidArm('rigid_2', '刚性臂 2'),
    flexible_1: createFlexibleArm('flexible_1', '柔性臂 1'),
    flexible_2: createFlexibleArm('flexible_2', '柔性臂 2'),
  })

  const armIds = ['rigid_1', 'rigid_2', 'flexible_1', 'flexible_2']

  // ---- Computed ----
  const armList = computed(() => armIds.map((id) => arms.value[id]))

  const statusSummary = computed(() => {
    const summary = { total: 4, idle: 0, moving: 0, picking: 0, error: 0 }
    armIds.forEach((id) => {
      const s = arms.value[id].status
      if (summary[s] !== undefined) summary[s]++
      else summary[s] = 1
    })
    return summary
  })

  // ---- Actions ----
  function updateArmStatus(data) {
    const { arm_id, type, ...statusData } = data
    if (!arms.value[arm_id]) return

    const arm = arms.value[arm_id]

    if (type === 'rigid' && statusData.joints) {
      arm.joints = arm.joints.map((j, i) => ({
        ...j,
        ...(statusData.joints[i] || {}),
      }))
      if (statusData.end_effector) arm.endEffector = { ...arm.endEffector, ...statusData.end_effector }
      if (statusData.motor_current !== undefined) arm.motorCurrent = statusData.motor_current
      if (statusData.motor_rpm !== undefined) arm.motorRPM = statusData.motor_rpm
    } else if (type === 'flexible' && statusData.segments) {
      arm.segments = arm.segments.map((s, i) => ({
        ...s,
        ...(statusData.segments[i] || {}),
      }))
      if (statusData.tension) arm.tension = statusData.tension
      if (statusData.deformation !== undefined) arm.deformation = statusData.deformation
      if (statusData.end_position) arm.endPosition = { ...arm.endPosition, ...statusData.end_position }
    }

    if (statusData.status) arm.status = statusData.status
  }

  function getArm(armId) {
    return arms.value[armId] || null
  }

  return { arms, armIds, armList, statusSummary, updateArmStatus, getArm }
})
