// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** captcha GET /api/captcha */
export async function captchaUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseCaptchaVO_>('/api/captcha', {
    method: 'GET',
    ...(options || {}),
  })
}

/** health GET /api/health */
export async function healthUsingGet(options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/health', {
    method: 'GET',
    ...(options || {}),
  })
}
