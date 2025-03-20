// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** get GET /api/vip/get */
export async function getUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/vip/get', {
    method: 'GET',
    ...(options || {}),
  })
}

/** test GET /api/vip/list */
export async function testUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/vip/list', {
    method: 'GET',
    ...(options || {}),
  })
}
