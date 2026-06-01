<template>
  <div class="task-form card">
    <h4>下发采摘任务</h4>
    <el-form :model="form" label-position="top" @submit.prevent="submit">
      <el-form-item label="目标水果">
        <el-select v-model="form.targetClass" placeholder="选择水果类型" style="width:100%">
          <el-option
            v-for="f in fruitOptions"
            :key="f.key"
            :label="f.label"
            :value="f.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="分配机械臂">
        <el-select v-model="form.armId" placeholder="自动分配" style="width:100%">
          <el-option label="自动分配" value="auto" />
          <el-option
            v-for="arm in armOptions"
            :key="arm.id"
            :label="arm.label"
            :value="arm.id"
            :disabled="arm.status !== 'idle'"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="优先级">
        <el-radio-group v-model="form.priority">
          <el-radio-button value="low">低</el-radio-button>
          <el-radio-button value="normal">普通</el-radio-button>
          <el-radio-button value="high">高</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-button type="primary" @click="submit" :loading="submitting" style="width:100%">
        下发任务
      </el-button>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useTaskStore } from '@/stores/task'
import { useRobotArmStore } from '@/stores/robotArm'
import { FRUIT_CLASSES } from '@/utils/constants'

const taskStore = useTaskStore()
const armStore = useRobotArmStore()

const submitting = ref(false)
const form = reactive({
  targetClass: 'apple',
  armId: 'auto',
  priority: 'normal',
})

const fruitOptions = Object.entries(FRUIT_CLASSES).map(([key, info]) => ({
  key,
  label: info.label,
}))

const armOptions = computed(() =>
  armStore.armList.map((a) => ({
    id: a.id,
    label: a.name,
    status: a.status,
  }))
)

function submit() {
  submitting.value = true
  taskStore.createTask({
    targetClass: form.targetClass,
    armId: form.armId,
    priority: form.priority,
  })
  setTimeout(() => { submitting.value = false }, 600)
}
</script>

<style scoped>
.task-form h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--s-text-primary);
  margin-bottom: 14px;
}
</style>
