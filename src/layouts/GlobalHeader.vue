<template>
  <div id="globalHeader">
    <a-row :wrap="false" :style="{ backgroundColor: 'transparent' }">
      <!-- 左侧 LOGO -->
      <a-col flex="200px">
        <RouterLink to="/">
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
          </div>
        </RouterLink>
      </a-col>

      <!-- 中间菜单 -->
      <a-col flex="auto">
        <a-menu
          v-model:selectedKeys="currentMenu"
          mode="horizontal"
          :items="showItems"
          @click="doMenuClick"
        />
      </a-col>

      <!-- 右侧头像 -->
      <a-col flex="150px">
        <div class="user-login-status">
          <div v-if="loginUserStore.loginUser.userId">
            <a-dropdown
              @visible-change="
                (visible) => {
                  if (visible) {
                    emit('dropdown-open')
                  } else {
                    emit('dropdown-close')
                  }
                }
              "
            >
              <ASpace>
                <a-avatar :src="loginUserStore.loginUser.userAvatar" />
                {{ loginUserStore.loginUser.userName }}
              </ASpace>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <router-link to="/picture/addEdit">
                      <SendOutlined />
                      发布图片
                    </router-link>
                  </a-menu-item>
                  <a-menu-item>
                    <router-link to="/user/profile">
                      <UserOutlined />
                      个人信息
                    </router-link>
                  </a-menu-item>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else>
            <a-button type="primary" href="/user/login">登录</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import {
  BoldOutlined,
  SendOutlined,
  LogoutOutlined,
  PictureOutlined,
  HistoryOutlined,
  UserOutlined,
  PicCenterOutlined,
  BlockOutlined,
  BugOutlined,
  FullscreenOutlined,
  TeamOutlined,
  BulbOutlined,
} from '@ant-design/icons-vue'
import { MenuProps, message } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { userLogoutUsingPost } from '@/api2/userController'

/**
 * 路由组件中的路由对象
 */
const router = useRouter()
/**
 * 路由组件中的路径对象
 */
const route = useRoute()

/**
 * 登录用户信息
 */
const loginUserStore = useLoginUserStore()

/**
 * 头部原始菜单项
 */
const headerOriginMenus = [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共图库',
    title: '公共图库',
    type: 'page',
  },
  {
    key: '/picture/list',
    icon: () => h(PicCenterOutlined),
    label: '发布列表',
    title: '发布列表',
    type: 'page',
  },
  {
    key: '/space',
    icon: () => h(BlockOutlined),
    label: '个人空间',
    title: '个人空间',
    type: 'page',
  },
  {
    key: '/picture/grab',
    icon: () => h(BugOutlined),
    label: '爬取图片',
    title: '爬取图片',
    type: 'page',
  },
  {
    key: '/picture/expand',
    icon: () => h(FullscreenOutlined),
    label: 'AI 扩图',
    title: 'AI 扩图',
    type: 'page',
  },
  {
    key: '/groupSpace',
    icon: () => h(TeamOutlined),
    label: '团队空间',
    title: '团队空间',
    type: 'page',
  },
  {
    key: '/timeline',
    icon: () => h(HistoryOutlined),
    label: '项目时序',
    title: '项目时序',
    type: 'page',
  },
  {
    key: '/feedback',
    icon: () => h(BulbOutlined),
    label: '建议反馈',
    title: '建议反馈',
    type: 'page',
  },
  {
    key: '/about',
    icon: () => h(BoldOutlined),
    label: h('a', { href: 'https://www.baolong.icu', target: '_blank' }, '关于我'),
    title: '关于我',
    type: 'blank',
  },
]
/**
 * 获取所有具有的顶部菜单, 将 menus 声明为计算属性
 */
const topMenus = computed<string[]>(() => loginUserStore.loginUser?.topMenus || [])
/**
 * 展示的菜单
 */
const showItems = computed<MenuProps['items']>(() => filterMenus(headerOriginMenus))
/**
 * 过滤菜单项
 * @param originMenus
 */
const filterMenus = (originMenus = [] as MenuProps['items']) => {
  return originMenus?.filter((menu) => {
    if (
      topMenus.value.includes(menu.key) ||
      menu.key === '/' ||
      menu.key === '/timeline' ||
      menu.key === '/feedback' ||
      menu.key === '/about'
    ) {
      return true
    }
    return false
  })
}

/**
 * 当前选中菜单
 */
const currentMenu = ref<string[]>([])
/**
 * 菜单点击事件
 * @param key
 */
const doMenuClick = ({ key }: { key: string }) => {
  // 获取原始菜单项
  const originItem = headerOriginMenus.find((item) => item.key === key)
  // 如果是外链类型，阻止路由跳转
  if (originItem?.type === 'blank') {
    router.push({ path: route.path })
    return
  }
  // 正常路由跳转
  router.push({ path: key })
}
/**
 * 监听路由变化，更新当前选中菜单
 */
router.afterEach((to, from, next) => {
  currentMenu.value = [to.path]
})

/**
 * 退出登录
 */
const doLogout = async () => {
  const res = await userLogoutUsingPost()
  if (res.code === 0) {
    loginUserStore.clearLoginUser()
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败')
  }
}

const emit = defineEmits(['dropdown-open', 'dropdown-close'])
</script>

<style scoped>
#globalHeader {
  /* 渐变 */
  /* background: linear-gradient(to right, #ffffff, #ece9e6); */
}

.title-bar {
  height: 100%; /* 确保高度占满父容器 */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  border-bottom: 0.5px solid #eee;

  /* 渐变 */
  background: linear-gradient(to right, #ece9e6, #ffffff);
}

.logo {
  height: 60px;
  max-width: 100%; /* 确保图片不超过容器宽度 */
}

.user-login-status {
  margin-right: 20px;
}
</style>
