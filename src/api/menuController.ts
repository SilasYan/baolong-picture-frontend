// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addMenu POST /api/menu/add */
export async function addMenuUsingPost(body: API.MenuAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean_>('/api/menu/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteMenu POST /api/menu/delete */
export async function deleteMenuUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/menu/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getMenuPageList POST /api/menu/page */
export async function getMenuPageListUsingPost(
  body: API.MenuQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOMenuVO_>('/api/menu/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateMenu POST /api/menu/update */
export async function updateMenuUsingPost(
  body: API.MenuUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/menu/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
