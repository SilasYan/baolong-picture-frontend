import request from '@/request'

export async function originPictureDownload(
  body: API.PictureDownloadRequest,
  options?: { [key: string]: any }
) {
  return request<Blob>('/api/picture/download', {  // 修改泛型类型为 Blob
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',  // 关键：指定响应类型为二进制流
    data: body,
    ...(options || {}),
  });
}
