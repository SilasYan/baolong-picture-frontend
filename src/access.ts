import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { message } from 'ant-design-vue'
import router from '@/router'

// 无需登录即可访问的地址
const whiteList = ['/', '/user/login', '/user/register', '/picture/detail/*']

/**
 * 全局权限校验
 */
router.beforeEach(async (to, from, next) => {
  // console.log('全局权限校验')
  // console.log('当前路由元信息：' + JSON.stringify(to.meta))
  // console.log('当前路由参数：' + JSON.stringify(to.query))
  // console.log('当前路由参数：' + JSON.stringify(to.params))
  // console.log('当前路由参数：' + JSON.stringify())
  // console.log('路由数：' + JSON.stringify(from.fullPath))

  const loginUser = useLoginUserStore().loginUser

  // 检查路径是否匹配白名单（支持通配符）
  const isAllowed = whiteList.some(pattern => {
    if (pattern.endsWith('/*')) {
      const base = pattern.slice(0, -1) // 移除末尾的 '*'，例如 '/picture/'
      return to.path.startsWith(base)    // 匹配所有以 '/picture/detail' 开头的路径
    } else {
      return to.path === pattern // 精确匹配其他路径
    }
  })

  // 未登录且路径不在白名单
  if (!isAllowed) {
    // 没有登录，则跳转登录
    if (!loginUser.token) {
      message.warning('请先登录')
      next(`/user/login?redirect=${to.fullPath}`)
      return
    }
    // 判断当前访问的路径是否在登录用户的菜单中
    const menus = [...loginUser.topMenus, ...loginUser.leftMenus, ...loginUser.otherMenus] ?? []
    if (!isAllowed && !menus.includes(to.path)) {
      message.error('没有权限')
      next("/")
      return
    }
  }
  next()
})
