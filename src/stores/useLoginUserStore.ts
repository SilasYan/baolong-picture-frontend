import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getLoginUserDetailUsingGet } from '@/api/userController'
import LoginUserVO = API.LoginUserVO
import router from '@/router'

export const useLoginUserStore = defineStore(
  'USER_LOGIN_STATE',
  () => {
    /**
     * 登录用户信息
     */
    const loginUser = ref<LoginUserVO>({
      token: null,
    })

    /**
     * 设置登录用户信息
     * @param newLoginUser 新登录用户信息
     */
    function setLoginUser(newLoginUser: LoginUserVO) {
      loginUser.value = newLoginUser
    }

    /**
     * 获取登录用户信息
     */
    async function fetchLoginUser(refresh?: boolean) {
      if (refresh) {
        const res = await getLoginUserDetailUsingGet()
        if (res.code === 0 && res.data) {
          loginUser.value = res.data
        }
      } else {
      }
    }

    /**
     * 清空登录用户信息
     */
    function clearLoginUser() {
      loginUser.value = {}
    }

    function checkLogin() {
      if (!useLoginUserStore().loginUser.token) {
        router.push({
          path: '/user/login',
        })
        return
      }
    }

    return { loginUser, setLoginUser, fetchLoginUser, clearLoginUser, checkLogin }
  },
  {
    persist: {
      enabled: true, // 启用持久化
      strategies: [
        {
          key: 'USER_LOGIN_STATE', // 存储的 key，默认是 store 的 id
          storage: localStorage, // 存储方式，可以是 localStorage 或 sessionStorage
        },
      ],
    },
  },
)
