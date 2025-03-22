// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addScheduledTask POST /api/task/add */
export async function addScheduledTaskUsingPost(
  body: API.ScheduledTaskAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/task/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteScheduledTask POST /api/task/delete */
export async function deleteScheduledTaskUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/task/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editTaskStatus POST /api/task/editTaskStatus */
export async function editTaskStatusUsingPost(
  body: API.ScheduledTaskUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/task/editTaskStatus', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getScheduledTaskPage POST /api/task/page */
export async function getScheduledTaskPageUsingPost(
  body: API.ScheduledTaskQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOScheduledTaskVO_>('/api/task/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** refreshScheduledTask POST /api/task/refresh */
export async function refreshScheduledTaskUsingPost(options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/task/refresh', {
    method: 'POST',
    ...(options || {}),
  })
}

/** updateScheduledTask POST /api/task/update */
export async function updateScheduledTaskUsingPost(
  body: API.ScheduledTaskUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/task/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
