import axios from 'axios'
import axiosRetry from 'axios-retry'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { message } from 'ant-design-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 定义标准响应结构
interface BaseResponse<T = any> {
  code: number
  data?: T
  msg?: string
}

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: '/api',
  timeout: 10000,
  // withCredentials: true, // 携带跨域 Cookie
})

// 请求重试
// axiosRetry(myAxios, {
//   retries: 2, // 重试次数
//   retryCondition: (error) => {
//     // 仅在网络超时或5xx错误时重试
//     return (
//       axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response?.status || 0) >= 500
//     )
//   },
//   retryDelay: (retryCount) => {
//     // 指数退避策略
//     return retryCount * 1000
//   },
// })

// 全局请求拦截器
myAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 如果有 token 则带上 token
    const userStore = useLoginUserStore()
    if (
      userStore.loginUser &&
      userStore.loginUser.token &&
      userStore.loginUser.token !== '未登录'
    ) {
      config.headers['token'] = `Bearer ${userStore.loginUser.token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  async (response: AxiosResponse<BaseResponse>) => {
    const { data } = response
    console.log('响应数据: ', data)

    // 如果有 token 则带上 token
    const userStore = useLoginUserStore()
    if (data.code === 401) {
      userStore.clearLoginUser()
      message.warning('请先登录').then((r) => {
        window.location.href = `/user/login?redirect=${window.location.href}`
      })
      return
    } else {
      // 其他问题
      // const errorMessage = data.message || `请求错误 (${data.code})`
      // message.error(errorMessage).then((r) => {})
    }
    // 处理 HTTP 状态码 2xx 但业务逻辑错误
    if (data.code === 0) {
      return data // 返回后端返回的 data；格式：{"code":0,"data":"ok","message":"ok"}
    }
    return data
  },
  (error: AxiosError) => {
    let errorMessage = '请求失败'
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = '资源不存在'
      }
      if (error.response.status === 500) {
        errorMessage = '网络连接异常'
      }
    }
    console.log('错误信息: ', error)
    message.error(errorMessage).then((r) => {})
    return Promise.reject(error)
  },
)

export default myAxios
