// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** deletePicture POST /api/picture/delete */
export async function deletePictureUsingPost(
  body: API.DeleteRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPictureDetailById GET /api/picture/detail */
export async function getPictureDetailByIdUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPictureDetailByIdUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureDetailVO_>('/api/picture/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** pictureDownload POST /api/picture/download */
export async function pictureDownloadUsingPost(
  body: API.PictureInteractionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseString_>('/api/picture/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** editPicture POST /api/picture/edit */
export async function editPictureUsingPost(
  body: API.PictureEditRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/edit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** grabPicture POST /api/picture/grab */
export async function grabPictureUsingPost(
  body: API.PictureGrabRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseListGrabPictureResult_>('/api/picture/grab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsHome GET /api/picture/home/list */
export async function getPicturePageListAsHomeUsingGet(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getPicturePageListAsHomeUsingGETParams,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOPictureHomeVO_>('/api/picture/home/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** pictureLikeOrCollect POST /api/picture/interaction */
export async function pictureLikeOrCollectUsingPost(
  body: API.PictureInteractionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/interaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsManage POST /api/picture/manage/page */
export async function getPicturePageListAsManageUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOPictureVO_>('/api/picture/manage/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsPersonRelease POST /api/picture/personRelease/page */
export async function getPicturePageListAsPersonReleaseUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOPictureVO_>('/api/picture/personRelease/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getPicturePageListAsPersonSpace POST /api/picture/personSpace/page */
export async function getPicturePageListAsPersonSpaceUsingPost(
  body: API.PictureQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOPictureVO_>('/api/picture/personSpace/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** reviewPicture POST /api/picture/review */
export async function reviewPictureUsingPost(
  body: API.PictureReviewRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/review', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** pictureShare POST /api/picture/share */
export async function pictureShareUsingPost(
  body: API.PictureInteractionRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadPictureByFile POST /api/picture/upload/file */
export async function uploadPictureByFileUsingPost(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.uploadPictureByFileUsingPOSTParams,
  body: {},
  file?: File,
  options?: { [key: string]: any }
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponsePictureDetailVO_>('/api/picture/upload/file', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}

/** uploadPictureByGrab POST /api/picture/upload/grab */
export async function uploadPictureByGrabUsingPost(
  body: API.PictureUploadRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/picture/upload/grab', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** uploadPictureByUrl POST /api/picture/upload/url */
export async function uploadPictureByUrlUsingPost(
  body: API.PictureUploadRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePictureDetailVO_>('/api/picture/upload/url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
