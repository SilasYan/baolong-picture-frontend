export const MENU_POSITION_ENUM = {
  TOP: 1,
  LEFT: 2,
  OTHER: 3
} as const

export const MENU_POSITION_MAP: Record<number, string> = {
  1: '顶部',
  2: '左侧',
  3: '其他',
}

export const MENU_POSITION_OPTIONS = Object.keys(MENU_POSITION_MAP).map((key) => {
  const value = Number(key)
  return {
    label: MENU_POSITION_MAP[value],
    value,
  }
})
