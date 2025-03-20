// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addCategoryTag POST /api2/categoryTag/add */
export async function addCategoryTagUsingPost(
  body: API.CategoryAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/categoryTag/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** pictureCategoryTagData GET /api2/categoryTag/data/vo */
export async function pictureCategoryTagDataUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponsePictureTagCategory_>('/api/categoryTag/data/vo', {
    method: 'GET',
    ...(options || {}),
  })
}

/** deleteCategoryTag POST /api2/categoryTag/delete */
export async function deleteCategoryTagUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/categoryTag/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** listCategoryTagByPage POST /api2/categoryTag/list/page */
export async function listCategoryTagByPageUsingPost(
  body: API.CategoryQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageCategoryTag_>('/api/categoryTag/list/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** updateCategoryTag POST /api2/categoryTag/update */
export async function updateCategoryTagUsingPost(
  body: API.CategoryUpdateRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/categoryTag/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
