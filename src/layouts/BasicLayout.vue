<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <!-- 下拉触发区域 -->
      <div class="dropdown-trigger" @mouseenter="showHeader" @mouseleave="startHideTimer">
        <div class="dropdown-indicator">
          <DownOutlined class="indicator-icon" :class="{ 'icon-flipped': isHeaderVisible }" />
          <!--<span class="indicator-text">{{ isHeaderVisible ? '收起菜单' : '展开菜单' }}</span>-->
        </div>
      </div>

      <!-- 顶部 -->
      <a-layout-header
        class="header"
        :style="{ transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)' }"
        @mouseenter="cancelHideTimer"
        @mouseleave="startHideTimer"
      >
        <!--<GlobalHeader @dropdown-open="handleDropdownOpen" @dropdown-close="handleDropdownClose" />-->
        <GlobalHeader />
      </a-layout-header>

      <!-- 中间区域 -->
      <a-layout
        :style="{
          marginTop: isHeaderVisible ? '64px' : '0',
          transition: 'margin-top 0.3s ease-in-out',
        }"
      >
        <!-- 左侧菜单 -->
        <GlobalSider
          v-if="loginUserStore.loginUser.userRole === 'ADMIN'"
          ref="siderRef"
          class="sider"
          @collapse="handleCollapse"
          :key="loginUserStore.loginUser.token"
          :style="{ top: isHeaderVisible ? '64px' : '0', transition: 'top 0.3s ease-in-out' }"
        />
        <!-- :key="loginUserStore.loginUser.token" 作用：强制 token 变化时重新渲染 -->

        <!-- 右边内容 -->
        <a-layout-content
          class="content"
          :style="{
            marginLeft: contentMarginLeft + 'px',
            transition: 'margin-left 0.3s ease-in-out',
          }"
        >
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
        <div class="footer-content">
          <div class="footer-links">
            <a href="https://beian.miit.gov.cn/" target="_blank" class="footer-link">
              <span class="icon"><CopyrightOutlined /></span>
              浙ICP备2024136487号-1
            </a>
            <span class="footer-divider">•</span>
            <span class="footer-text">
        <span class="icon"><CalendarOutlined /></span>
        2025
      </span>
            <span class="footer-divider">•</span>
            <a href="https://www.baolong.icu" target="_blank" class="footer-link">
              <span class="icon"><UserOutlined /></span>
              Silas Yan
            </a>
          </div>
          <div class="footer-social">
            <a-tooltip placement="top">
              <template #title>GitHub</template>
              <a href="https://github.com/SilasYan" class="social-icon" target="_blank">
                <GithubOutlined />
              </a>
            </a-tooltip>
            <a-tooltip placement="top">
              <template #title>个人主页</template>
              <a href="https://www.baolong.icu" class="social-icon" target="_blank">
                <HomeOutlined />
              </a>
            </a-tooltip>
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '@/layouts/GlobalHeader.vue'
import GlobalSider from '@/layouts/GlobalSider.vue'
import { h, onMounted, onUnmounted, ref, watch } from 'vue'
import Icon, {
  RocketOutlined,
  DownOutlined,
  GithubOutlined,
  CopyrightOutlined,
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'
import { useRouter } from 'vue-router'

// 登录用户信息
const loginUserStore = useLoginUserStore()

// 控制顶部菜单显示状态
const isHeaderVisible = ref(false)
let hideTimer: number | null = null

// 显示顶部菜单
const showHeader = () => {
  cancelHideTimer()
  isHeaderVisible.value = true
}

// 开始隐藏计时器
const startHideTimer = () => {
  // 先取消可能存在的计时器
  cancelHideTimer()
  // 设置新计时器
  hideTimer = setTimeout(() => {
    // 检查鼠标是否在下拉菜单中
    const dropdown = document.querySelector('.ant-dropdown:not(.ant-dropdown-hidden)')
    const isInDropdown = dropdown?.contains(document.activeElement) || dropdown?.matches(':hover')

    // 不在下拉菜单中才隐藏
    if (!isInDropdown) {
      isHeaderVisible.value = false
    }
  }, 300) // 300ms延迟
}

// 取消隐藏计时器
const cancelHideTimer = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

// 点击页面任何地方时检查
const handleClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const isHeaderClick = target.closest('.header') || target.closest('.dropdown-trigger')
  const isDropdownItem = target.closest('.ant-dropdown-menu-item')

  // 如果点击的是下拉菜单项，立即隐藏
  if (isDropdownItem) {
    isHeaderVisible.value = false
  }
  // 如果点击的是菜单区域，取消自动隐藏
  else if (isHeaderClick) {
    cancelHideTimer()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClick)
  cancelHideTimer()
})

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
/* 下拉触发区域 */
.dropdown-trigger {
  position: fixed;
  top: 0;
  right: 300px; /* 位于右侧 */
  z-index: 1001;
  cursor: pointer;
}

.dropdown-indicator {
  background-color: #1890ff; /* 使用主题色 */
  color: white;
  border-radius: 0 0 8px 8px;
  padding: 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease-in-out;
}

.dropdown-indicator:hover {
  background-color: #40a9ff; /* 悬停时变亮 */
}

.indicator-icon {
  font-size: 14px;
  transition: transform 0.3s ease-in-out;
}

.icon-flipped {
  transform: rotate(180deg);
}

.indicator-text {
  font-size: 14px;
  font-weight: 500;
}

/* 顶部菜单样式调整 */
.header {
  padding-inline: 0;
  margin-bottom: 1px;
  color: unset;
  background: white;
  border-bottom: 0.5px solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px; /* 明确设置高度 */
  z-index: 10000;
  transition: transform 0.3s ease-in-out;
}

/* 用户下拉菜单需要更高的z-index */
:deep(.ant-dropdown) {
  z-index: 1001;
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
}

/* 内容区域样式 */
.content {
  background: #ffffff;
  padding: 28px 30px;
  margin-bottom: 20px;
}

#basicLayout :deep(.ant-menu-root) {
  border-bottom: none !important;
  border-inline-end: none !important;
}

/* 底部样式 - 精致现代风格 */
.footer {
  background: rgba(255, 255, 255, 0.9); /* 半透明背景 */
  backdrop-filter: blur(5px); /* 毛玻璃效果 */
  color: #666;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 24px;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  transition: all 0.3s ease;
  box-shadow: 0 -1px 6px rgba(0, 0, 0, 0.03);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.footer-link, .footer-text {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  transition: all 0.3s;
}

.footer-link:hover {
  color: #1890ff;
  transform: translateY(-1px);
}

.icon {
  margin-right: 4px;
  font-size: 11px;
  opacity: 0.7;
}

.footer-divider {
  color: #d9d9d9;
  font-size: 10px;
  opacity: 0.5;
}

.footer-social {
  display: flex;
  gap: 12px;
}

.social-icon {
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
  padding: 4px;
  border-radius: 4px;
}

.social-icon:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
  transform: translateY(-2px);
}

/* 登录/注册页特定样式 */
.login-page .footer,
.register-page .footer {
  background: transparent;
  border-top: none;
  box-shadow: none;
}

.login-page .footer-link,
.login-page .footer-text,
.register-page .footer-link,
.register-page .footer-text {
  color: rgba(255, 255, 255, 0.8);
}

.login-page .footer-link:hover,
.register-page .footer-link:hover {
  color: #fff;
}

.login-page .social-icon,
.register-page .social-icon {
  color: rgba(255, 255, 255, 0.8);
}

.login-page .social-icon:hover,
.register-page .social-icon:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 8px;
  }

  .footer-links {
    justify-content: center;
  }

  .footer-social {
    margin-top: 8px;
  }
}
</style>
