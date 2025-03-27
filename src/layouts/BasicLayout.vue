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
              <icon>
                <svg
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path
                    d="M896.816 426.264L725.48 305.344C701.432 194.784 637.992 96.504 533.376 7.4A30.92 30.92 0 0 0 513.296 0h-6.232a30.96 30.96 0 0 0-20.088 7.4C384.128 94.944 321.384 191.456 296.432 299.688L127.168 419.184a30.96 30.96 0 0 0-13.112 25.472l0.728 137.392a30.88 30.88 0 0 0 12.888 24.984 30.76 30.76 0 0 0 27.792 4.296L300.8 563.36c10.92 45.008 27.272 85.904 50.28 126.2a30.992 30.992 0 0 0 26.904 15.664h6.712c61.488 0 240.232 1.032 256.504 1.208h0.272a31.008 31.008 0 0 0 26.856-15.544c22.504-39.144 38.84-78.712 49.944-122.088l150.216 49.608a31.128 31.128 0 0 0 27.8-4.24 31.008 31.008 0 0 0 12.888-24.984l0.752-137.456a30.88 30.88 0 0 0-13.112-25.464zM510.176 69.424c43.456 39.232 77.912 79.672 103.864 122.12H406.256c25.968-42.44 60.448-82.88 103.92-122.12zM288.448 502.24l-111.944 36.904-0.408-78.664 109.016-76.976c-0.696 13.416-1.576 26.776-1.224 40.536 0.696 27.784 2.584 53.6 5.688 78.04-0.376 0.128-0.752 0.04-1.128 0.16z m334.784 142.128c-47.496-0.304-168.536-1.032-226.856-1.088-33.032-63.584-48.296-130.792-50.56-220.816-1.528-60.592 8.68-116.352 29.904-168.976h268.904c21.208 52.616 31.432 108.384 29.952 168.96-2.312 90.384-17.824 157.912-51.344 221.92z m224.248-98.136l-111.92-36.952c-1.936-0.664-3.84-0.48-5.784-0.72 3.664-26.376 5.96-54.272 6.744-84.552 0.304-12.176-0.6-23.96-1.12-35.856l112.504 79.424-0.424 78.656zM661.712 769.056c-4.536-12.216-16.176-21.352-29.28-20.144l-237.16 1.992a31.064 31.064 0 0 0-28.576 19.664l-54.936 139.872a30.904 30.904 0 0 0 3.688 29.4c6.168 8.528 16.152 13.616 26.76 12.832l88.704-4.656 59.168 65.704A31.008 31.008 0 0 0 513.096 1024a30.976 30.976 0 0 0 23.024-10.28l59.088-65.704 88.824 4.656c9.976 0.792 20.384-4.232 26.584-12.584a30.992 30.992 0 0 0 4.024-29.16l-52.928-141.872z m-77.984 116.344a31.224 31.224 0 0 0-24.656 10.224l-45.976 51.064-46.024-51.064a31.04 31.04 0 0 0-23.016-10.288c-0.528 0-1.072 0-1.624 0.064l-55.416 2.904 29.688-75.624 194.552-1.632 28.848 77.312-56.376-2.96z"
                    fill="#838384"
                  ></path>
                </svg>
              </icon>
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
import Icon from '@ant-design/icons-vue'
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
