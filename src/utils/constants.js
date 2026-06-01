// Fruit classes (YOLO11 labels for orchard scenario)
export const FRUIT_CLASSES = {
  apple: { label: '苹果', color: '#ef4444', ripeColor: '#dc2626', unripeColor: '#86efac' },
  orange: { label: '橙子', color: '#f97316', ripeColor: '#ea580c', unripeColor: '#bbf7d0' },
  pear: { label: '梨', color: '#eab308', ripeColor: '#ca8a04', unripeColor: '#fef08a' },
  peach: { label: '桃子', color: '#f472b6', ripeColor: '#db2777', unripeColor: '#fbcfe8' },
  lemon: { label: '柠檬', color: '#a3e635', ripeColor: '#65a30d', unripeColor: '#d9f99d' },
}

// Arm IDs and labels
export const ARM_LIST = [
  { id: 'rigid_1', label: '刚性臂 1', type: 'rigid' },
  { id: 'rigid_2', label: '刚性臂 2', type: 'rigid' },
  { id: 'flexible_1', label: '柔性臂 1', type: 'flexible' },
  { id: 'flexible_2', label: '柔性臂 2', type: 'flexible' },
]

// Arm status labels
export const ARM_STATUS_MAP = {
  idle: { label: '空闲', color: '#22c55e' },
  moving: { label: '运动中', color: '#3b82f6' },
  picking: { label: '采摘中', color: '#f59e0b' },
  error: { label: '异常', color: '#ef4444' },
}

// Task status labels
export const TASK_STATUS_MAP = {
  pending: { label: '等待中', color: '#94a3b8' },
  assigned: { label: '已分配', color: '#3b82f6' },
  moving: { label: '移动中', color: '#8b5cf6' },
  picking: { label: '采摘中', color: '#f59e0b' },
  completed: { label: '已完成', color: '#22c55e' },
  failed: { label: '失败', color: '#ef4444' },
  cancelled: { label: '已取消', color: '#6b7280' },
}

// ECharts color palette (dark theme friendly)
export const CHART_COLORS = [
  '#22d3ee', '#a78bfa', '#f472b6', '#fbbf24',
  '#34d399', '#60a5fa', '#fb923c', '#e879f9',
]
