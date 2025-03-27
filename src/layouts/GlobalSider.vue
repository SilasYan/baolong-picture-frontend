<template>
  <div id="globalSider">
    <a-layout-sider
      v-if="loginUserStore.loginUser.token"
      width="150"
      breakpoint="xxl"
      v-model:collapsed="collapsed"
      collapsible
      class="sider"
      @collapse="handleCollapse"
    >
      <a-menu
        mode="inline"
        v-model:selectedKeys="currentMenu"
        :items="showItems"
        @click="doMenuClick"
      />

      <!-- 自定义收缩/展开图标 -->
      <template #trigger>
        <div class="custom-trigger">
          <MenuUnfoldOutlined  v-if="collapsed"/>
          <MenuFoldOutlined v-else/>
        </div>
      </template>
    </a-layout-sider>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, reactive, ref, type VueElement, watch, watchEffect } from 'vue'
import {
  BlockOutlined,
  BugOutlined, ClockCircleOutlined,
  ContactsOutlined, InsertRowAboveOutlined,
  MenuOutlined, PicCenterOutlined,
  PictureOutlined,
  SettingOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined, FullscreenOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { type ItemType, message } from 'ant-design-vue'

/**
 * 路由组件中的路由对象
 */
const router = useRouter()

/**
 * 登录用户信息
 */
const loginUserStore = useLoginUserStore()

// region 左侧菜单和右侧内容部分的动态变化

// 左侧菜单折叠展开变量
const collapsed = ref<boolean>(localStorage.getItem('siderCollapsed') === 'true')
const emit = defineEmits(['collapse'])
const handleCollapse = (collapsed: boolean) => {
  emit('collapse', collapsed)
}

// 监听折叠状态变化并持久化存储
watch(collapsed, (newVal) => {
  localStorage.setItem('siderCollapsed', String(newVal))
  emit('collapse', newVal) // 确保状态变化时触发父组件更新
})
watchEffect(() => {
  if (loginUserStore.loginUser.token) {
    // 登录后触发动态更新左侧菜单和右侧内容的宽度
    emit('collapse', collapsed.value)
  }
})

// endregion 左侧菜单和右侧内容部分的动态变化

/**
 * 菜单项 类型
 * @param label
 * @param key
 * @param icon
 * @param children
 * @param type
 */
function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}

/**
 * 左侧原始菜单项
 */
const siderOriginMenus: ItemType[] = reactive([
  // getItem('发布列表', '/picture/list', () => h(PicCenterOutlined)),
  // getItem('个人空间', '/space', () => h(BlockOutlined)),
  // getItem('爬取图片', '/picture/grab', () => h(BugOutlined)),
  // getItem('AI 扩图', '/picture/eExpand', () => h(FullscreenOutlined)),
  // getItem('团队空间', '/groupSpace', () => h(TeamOutlined)),

  { type: 'divider' },

  getItem(
    '管理员',
    'grp',
    null,
    [
      getItem('用户管理', '/admin/userManage', () => h(ContactsOutlined)),
      getItem('图库管理', '/admin/pictureManage', () => h(PictureOutlined)),
      getItem('空间管理', '/admin/spaceManage', () => h(BlockOutlined)),
      getItem('分类管理', '/admin/categoryManage', () => h(InsertRowAboveOutlined)),
      getItem('菜单管理', '/admin/menuManage', () => h(UnorderedListOutlined)),
      getItem('定时任务', '/admin/scheduledTask', () => h(ClockCircleOutlined)),
    ],
    'group',
  ),

  getItem('系统配置', 'sub4', () => h(SettingOutlined), [
    getItem('菜单配置', '9', () => h(MenuOutlined)),
    getItem('参数配置', '10', () => h(MenuOutlined)),
  ]),
])
/**
 * 获取所有具有的顶部菜单, 将 menus 声明为计算属性
 */
const leftMenus = computed<string[]>(() => loginUserStore.loginUser?.leftMenus || [])
/**
 * 过滤后的菜单项
 */
const showItems = computed(() => {
  const allowedKeys = leftMenus.value

  const filterMenu = (items: ItemType[]): ItemType[] => {
    return items.filter((item) => {
      // 保留非菜单项（如分隔符）
      if (!('key' in item)) return true

      // 检查权限
      const hasPermission = allowedKeys.includes(item.key)

      // 递归过滤子菜单
      if (item.children) {
        item.children = filterMenu(item.children)
        // 如果子项过滤后为空，且没有其他内容，则不保留该项
        if (item.children.length === 0 && !item.label && !item.icon) return false
      }

      return hasPermission
    })
  }

  return filterMenu([...siderOriginMenus]) // 创建副本避免修改原始数据
})

/**
 * 当前选中菜单
 */
const currentMenu = ref<string[]>([])
/**
 * 菜单点击事件
 * @param key
 */
const doMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
/**
 * 监听路由变化，更新当前选中菜单
 */
router.afterEach((to, from, failure) => {
  currentMenu.value = [to.path]
})
</script>

<style scoped>
:deep(.ant-layout-sider),
:deep(.sider),
:deep(.ant-menu-light) {
  background: linear-gradient(to right, #ece9e6, #ffffff) !important;
}

.custom-trigger {
  /* background-color: #F7FFF7; !* 修改背景颜色 *! */
  text-align: center;
  cursor: pointer;
  border-top: 0.5px solid #eee;
  /* 渐变 */
  background: linear-gradient(to right, #ece9e6, #ffffff);
  color: #4797f4;
  font-size: 20px;
}
</style>
