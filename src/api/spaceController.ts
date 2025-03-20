// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** activateSpace POST /api/space/activate */
export async function activateSpaceUsingPost(
  body: API.SpaceActivateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/space/activate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** addSpace POST /api/space/add */
export async function addSpaceUsingPost(
  body: API.SpaceAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseLong_>('/api/space/add', {
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

/** getSpaceDetailById GET /api/space/detail */
export async function getSpaceDetailByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceDetailByIdUsingGETParams,
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

/** getSpaceLevelList GET /api/space/level */
export async function getSpaceLevelListUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseListSpaceLevelVO_>('/api/space/level', {
    method: 'GET',
    ...(options || {}),
  })
}

/** getSpaceListAsUser GET /api/space/list */
export async function getSpaceListAsUserUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getSpaceListAsUserUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListSpaceDetailVO_>('/api/space/list', {
    method: 'GET',
    params: {
      ...params,
    },
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
