export const TASK_STATUS_ENUM = {
  CLOSE: 0,
  OPEN: 1,
} as const

export const TASK_STATUS_MAP: Record<number, string> = {
  0: '关闭',
  1: '开启',
}

export const TASK_STATUS_OPTIONS = Object.keys(TASK_STATUS_MAP).map((key) => {
  const value = Number(key)
  return {
    label: TASK_STATUS_MAP[value],
    value,
  }
})
