// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** activateSpace POST /api/space/activate */
export async function activateSpaceUsingPost(
  body: API.SpaceActivateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** deleteSpace POST /api/space/delete */
export async function deleteSpaceUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceDetailBySpaceId GET /api/space/detail */
export async function getSpaceDetailBySpaceIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceDetailBySpaceIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseSpaceDetailVO_>('/api/space/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** editSpace POST /api/space/edit */
export async function editSpaceUsingPost(
  body: API.SpaceEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getSpaceDetailByLoginUser GET /api/space/loginUser/detail */
export async function getSpaceDetailByLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseSpaceDetailVO_>('/api/space/loginUser/detail', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getTeamSpaceByUserId GET /api/space/loginUser/teamSpace */
export async function getTeamSpaceByUserIdUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseSpaceDetailVO_>('/api/space/loginUser/teamSpace', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getTeamSpacesByLoginUser GET /api/space/loginUser/teamSpaces */
export async function getTeamSpacesByLoginUserUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceDetailVO_>('/api/space/loginUser/teamSpaces', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getSpacePageListAsManage POST /api/space/manage/page */
export async function getSpacePageListAsManageUsingPost(
  body: API.SpaceQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOSpaceVO_>('/api/space/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateSpace POST /api/space/update */
export async function updateSpaceUsingPost(
  body: API.SpaceUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/space/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
