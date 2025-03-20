// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addSpaceUserToSpace POST /api/spaceUser/add */
export async function addSpaceUserToSpaceUsingPost(
  body: API.SpaceUserAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/spaceUser/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpaceUser POST /api/spaceUser/delete */
export async function deleteSpaceUserUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/spaceUser/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editSpaceUserAuth POST /api/spaceUser/edit */
export async function editSpaceUserAuthUsingPost(
  body: API.SpaceUserEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/spaceUser/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceUserPageListBySpaceId GET /api/spaceUser/list */
export async function getSpaceUserPageListBySpaceIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceUserPageListBySpaceIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOSpaceUserVO_>('/api/spaceUser/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
