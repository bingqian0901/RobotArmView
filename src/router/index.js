import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: '总览仪表盘' },
  },
  {
    path: '/detection',
    name: 'Detection',
    component: () => import('@/views/DetectionView.vue'),
    meta: { title: '目标检测' },
  },
  {
    path: '/arms',
    name: 'RobotArm',
    component: () => import('@/views/RobotArmView.vue'),
    meta: { title: '机械臂状态' },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/TaskView.vue'),
    meta: { title: '任务管理' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Update document title on route change
router.beforeEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} - 果园采摘机器人`
    : '果园智能采摘机器人监控系统'
})

export default router
