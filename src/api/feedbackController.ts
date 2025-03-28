// @ts-ignore
/* eslint-disable */
import request from '@/request'

/** addFeedback POST /api/feedback/add */
export async function addFeedbackUsingPost(
  body: API.FeedbackAddRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponseBoolean_>('/api/feedback/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** getFeedbackPageList POST /api/feedback/page */
export async function getFeedbackPageListUsingPost(
  body: API.FeedbackQueryRequest,
  options?: { [key: string]: any }
) {
  return request<API.BaseResponsePageVOFeedbackVO_>('/api/feedback/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
