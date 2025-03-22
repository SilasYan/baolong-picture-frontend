export const PIC_REVIEW_STATUS_ENUM = {
  REVIEWING: 0,
  PASS: 1,
  REJECT: 2,
}

export const PIC_INTERACTION_TYPE_ENUM = {
  LIKE: 0,
  COLLECT: 1,
}

export const PIC_SHEAR_STATUS_ENUM = {
  SHEAR: 0,
  NOT_SHEAR: 1,
}

export const PIC_FORMAT_STATUS_MAP = {
  jpg: 'JPG',
  png: 'PNG',
  gif: 'GIF',
  other: '其他',
}

export const PIC_REVIEW_STATUS_MAP = {
  0: '待审核',
  1: '通过',
  2: '拒绝',
}

export const PIC_STATUS_TAG_COLOR = {
  0: '#f50',
  1: '#87d068',
  2: '#616060',
}

export const PIC_FORMAT_STATUS_OPTIONS = Object.keys(PIC_FORMAT_STATUS_MAP).map((key) => {
  return {
    label: PIC_FORMAT_STATUS_MAP[key],
    value: key,
  }
})

export const PIC_REVIEW_STATUS_OPTIONS = Object.keys(PIC_REVIEW_STATUS_MAP).map((key) => {
  return {
    label: PIC_REVIEW_STATUS_MAP[key],
    value: key,
  }
})

export const PICTURE_EDIT_MESSAGE_TYPE_ENUM = {
  INFO: 'INFO',
  ERROR: 'ERROR',
  ENTER_EDIT: 'ENTER_EDIT',
  EXIT_EDIT: 'EXIT_EDIT',
  EDIT_ACTION: 'EDIT_ACTION',
  COMPLETE: 'COMPLETE',
}

export const PICTURE_EDIT_MESSAGE_TYPE_MAP = {
  INFO: '发送通知',
  ERROR: '发送错误',
  ENTER_EDIT: '进入编辑状态',
  EXIT_EDIT: '退出编辑状态',
  EDIT_ACTION: '执行编辑操作',
  COMPLETE: '操作完成',
}

export const PICTURE_EDIT_ACTION_ENUM = {
  ZOOM_IN: 'ZOOM_IN',
  ZOOM_OUT: 'ZOOM_OUT',
  ROTATE_LEFT: 'ROTATE_LEFT',
  ROTATE_RIGHT: 'ROTATE_RIGHT',
}

export const PICTURE_EDIT_ACTION_MAP = {
  ZOOM_IN: '放大操作',
  ZOOM_OUT: '缩小操作',
  ROTATE_LEFT: '左旋操作',
  ROTATE_RIGHT: '右旋操作',
}
