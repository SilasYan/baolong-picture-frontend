<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <!-- 顶部 -->
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <!-- 中间区域 -->
      <a-layout>
        <!-- 左侧菜单 -->
        <GlobalSider
          v-if="loginUserStore.loginUser.userRole === 'ADMIN'"
          ref="siderRef"
          class="sider"
          @collapse="handleCollapse"
          :key="loginUserStore.loginUser.token"
        />
        <!-- :key="loginUserStore.loginUser.token" 作用：强制 token 变化时重新渲染 -->

        <!-- 右边内容 -->
        <a-layout-content class="content" :style="{ marginLeft: contentMarginLeft + 'px' }">
          <router-view />

          <!-- 回到顶部 -->
          <a-back-top
            :style="{ marginBottom: '25px', marginRight: '20px', width: '50px', height: '50px' }"
          >
            <template #icon>
              <RocketOutlined />
            </template>
          </a-back-top>
        </a-layout-content>
      </a-layout>

      <!-- 底部 -->
      <a-layout-footer class="footer" :style="{ left: contentMarginLeft + 'px' }">
        <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2024136487号-1</a>
        <a>| 版权所有 © 2025</a>
        <a href="https://www.baolong.icu" target="_blank"> Silas Yan,</a>
        <a>All rights reserved.</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/layouts/GlobalHeader.vue'
import GlobalSider from '@/layouts/GlobalSider.vue'
import { h, onMounted, onUnmounted, ref, watch } from 'vue'
import Icon, { RocketOutlined } from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

// 登录用户信息
const loginUserStore = useLoginUserStore()

// region 左侧菜单和右侧内容部分的动态变化

// 获取左侧菜单的宽度
const siderRef = ref<HTMLElement | null>(null)
// 默认左侧菜单宽度
const contentMarginLeft = ref(0)

// 处理左侧菜单折叠/展开事件
const handleCollapse = (collapsed: boolean) => {
  if (collapsed) {
    contentMarginLeft.value = 80 // 折叠时的宽度（根据实际情况调整）
  } else {
    contentMarginLeft.value = 150 // 展开时的宽度
  }
}

// 监听窗口大小变化
onMounted(() => {
  if (siderRef.value) {
    contentMarginLeft.value = siderRef.value.$el.offsetWidth // 初始化宽度
  }
  window.addEventListener('resize', () => {
    if (siderRef.value) {
      contentMarginLeft.value = siderRef.value.$el.offsetWidth
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
})

// 监听登录状态, 实现左侧菜单的动态变化
watch(
  () => loginUserStore.loginUser.token,
  (newVal) => {
    if (!newVal) {
      contentMarginLeft.value = 0 // 退出登录后边距归零
    } else {
      // 登录后重新获取侧边栏宽度
      if (siderRef.value) {
        contentMarginLeft.value = siderRef.value.$el.offsetWidth
      }
    }
  },
)

// endregion 左侧菜单和右侧内容部分的动态变化
</script>

<style scoped>
#basicLayout .header {
  padding-inline: 0;
  margin-bottom: 1px;
  color: unset;
  background: white;
  border-bottom: 0.5px solid #eee;
  position: fixed; /* 顶部固定 */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* 确保顶部在最上层 */
}

#basicLayout .sider {
  background: linear-gradient(to right, #ece9e6, #ffffff) !important;
  padding-top: 20px;
  border-right: 0.5px solid #eee;
  position: fixed; /* 左侧固定 */
  top: 64px; /* 根据顶部高度调整 */
  left: 0;
  bottom: 0;
  z-index: 888; /* 确保左侧在顶部之下 */
  transition: width 0.2s; /* 添加过渡效果 */
}

#basicLayout .content {
  background: #ffffff;
  padding: 28px 30px;
  margin-top: 64px; /* 根据顶部高度调整 */
  transition: margin-left 0.2s; /* 添加过渡效果 */
  margin-bottom: 20px;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

#basicLayout .footer {
  background: #ffffff;
  color: #666666 !important;
  border-top: 0.5px solid #eee;
  font-size: 14px;
  padding: 16px;
  position: fixed;
  bottom: 0;
  right: 0;
  text-align: center;
  z-index: 999; /* 确保左侧在顶部之下 */
  transition: left 0.2s; /* 添加过渡效果 */
}

#basicLayout .footer a {
  color: #666666 !important;
  font-size: 14px;
  margin-right: 8px;
}
</style>
